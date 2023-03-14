import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService } from 'herr-core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { DashboardService } from 'src/app/_core/_service/dashboard.service';
import { SysMenuService } from 'src/app/_core/_service/sys-menu.service';
import { environment } from 'src/environments/environment';
declare let $: any;
declare let window: any;
import { DataManager, Query, UrlAdaptor, Predicate } from '@syncfusion/ej2-data';
import { WebNewsService } from 'src/app/_core/_service/evse/web-news.service';
import { DomSanitizer } from '@angular/platform-browser';
import { StoreProfileService } from 'src/app/_core/_service/evse/store-profile.service';
import { MainCategoryService } from 'src/app/_core/_service/evse/main-category.service';
import { StoreProfile } from 'src/app/_core/_model/xaccount';
import { MainCategory } from 'src/app/_core/_model/evse/mainCategory';
import { Products } from 'src/app/_core/_model/evse/products';
import { ProductsService } from 'src/app/_core/_service/evse/products.service';
import { DataService } from 'src/app/_core/_service/data.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home-store',
  templateUrl: './home-store.component.html',
  styleUrls: [
    './home-store.component.scss',
    '../../../../assets/css/store.css'
  ],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class HomeStoreComponent implements OnInit {

  fieldsLang: object = { text: "name", value: "id" };
  menus: any;
  lang: string;
  userid: number;
  title: any = 'LIST_ORDER';
  btnText: any;
  parentActive = false;
  childActive = false;
  subActive = false;
  subscription: Subscription = new Subscription();
  languageData = [
    { id: "Tw", name: "Tw" },
    { id: "En", name: "En" },
    // { id: "Cn", name: "Cn" },
    // { id: "Vi", name: "Vi" },
  ];
  baseUrl = environment.apiUrlImage;
  banners= [];
  news: any;
  logo: any;
  storeInfo: StoreProfile = {} as StoreProfile;
  mainCategory: any 
  products: any 
  count: any = 0;
  modalReference: NgbModalRef;
  cartDetail: Products[] = [];
  totalPrice: number;
  constructor(
    private spinner: NgxSpinnerService,
    private sysMenuService: SysMenuService,
    private webNewsService: WebNewsService,
    private service: StoreProfileService,
    private serviceMainCategory: MainCategoryService,
    private serviceProducts: ProductsService,
    private translate: TranslateService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    public sanitizer: DomSanitizer,
    private router: Router,
    public modalService: NgbModal

  ) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  ngOnInit() {
    this.lang = this.capitalize(localStorage.getItem("lang"));
    this.getMenu();
    this.loadLogoData();
    var storeName = this.route.snapshot.paramMap.get('storeName') 
    var storeId = this.route.snapshot.paramMap.get('id')
    this.getStoreInfor(storeId) 
    // this.dataService.pushCart('load cart')
    const cartDetail = this.getLocalStore("cart_detail");
    this.count = cartDetail.map((selection) => selection.quantity).reduce((sum, quantity) => sum += quantity, 0);
  }
  addToCart(item: Products) {
    let cart: Products[] = [];
    cart = this.getLocalStore("cart_detail");
    if(cart.length === 0) {
      item.quantity = 1
      item.price = parseFloat(item.productPrice)
      cart.push(item)
    }else {
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == item.id ) {
          cart[i].quantity = cart[i].quantity + 1;
          cart[i].price = cart[i].price  + parseFloat(item.productPrice);
          break;
        }else {
          const exsit = cart.filter(x => x.id === item.id );
          console.log(exsit)
          if(exsit.length === 0) {
            item.quantity = 1
            item.price = parseFloat(item.productPrice)
            cart.push(item)
          }else {
            for (let z = 0; z < cart.length; z++) {
              if (cart[z].id == item.id ) {
                cart[z].quantity = cart[z].quantity + 1;
                cart[z].price = cart[z].price  + parseFloat(item.productPrice);
                break;
              }
            }
          }
          break;
        }
      }
    }
    this.setLocalStore("cart_detail", cart);
    const cartDetail = this.getLocalStore("cart_detail");
    this.count = cartDetail.map((selection) => selection.quantity).reduce((sum, quantity) => sum += quantity, 0);
    this.alertify.success(this.translate.instant('Add_To_Cart_Success'))
  }
  minusItem(item) {
    let cart: Products[] = [];
    cart = this.getLocalStore("cart_detail");
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id == item.id && cart[i].quantity > 1 ) {
        cart[i].quantity = cart[i].quantity - 1;
        cart[i].price = cart[i].price  - parseFloat(item.productPrice);
        break;
      }else {
        const exsit = cart.filter(x => x.id === item.id );
          console.log(exsit)
          if(exsit.length === 0) {
            item.quantity = 1
            item.price = parseFloat(item.productPrice)
            cart.push(item)
          }else {
            for (let z = 0; z < cart.length; z++) {
              if (cart[z].id == item.id ) {
                if(cart[z].quantity === 1) {
                  cart.splice(z, 1);
                  break;
                }
                cart[z].quantity = cart[z].quantity - 1;
                cart[z].price = cart[z].price  - parseFloat(item.productPrice);
                break;
              }
              // else {
              //   cart.splice(z, 1);
              //   break;
              // }
            }
          }
          break;
        // if (cart[i].id == item.id && cart[i].quantity === 1 ) {
        //   cart.splice(i, 1);
        //   break;
        // }
      }
    }
    this.setLocalStore("cart_detail", cart);
    this.cartDetail = this.getLocalStore("cart_detail");
    this.count = this.cartDetail.map((selection) => selection.quantity).reduce((sum, quantity) => sum += quantity, 0);
    this.totalPrice = this.cartDetail.map((selection) => selection.price).reduce((sum, price) => sum += price, 0);
  }
  plusItem(item) {
    let cart: Products[] = [];
    cart = this.getLocalStore("cart_detail");
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].id == item.id ) {
        cart[i].quantity = cart[i].quantity + 1;
        cart[i].price = cart[i].price  + parseFloat(item.productPrice);
        break;
      }
    }
    this.setLocalStore("cart_detail", cart);
    this.cartDetail = this.getLocalStore("cart_detail");
    this.count = this.cartDetail.map((selection) => selection.quantity).reduce((sum, quantity) => sum += quantity, 0);
    this.totalPrice = this.cartDetail.map((selection) => selection.price).reduce((sum, price) => sum += price, 0);
  }
  openCart(template){
    this.modalReference = this.modalService.open(template, {size: 'xl',backdrop: 'static'});
    this.cartDetail = this.getLocalStore("cart_detail");
    this.totalPrice = this.cartDetail.map((selection) => selection.price).reduce((sum, price) => sum += price, 0);
  }
  saveOrder(){
    const cart_detail = this.getLocalStore("cart_detail");
    console.log(cart_detail)
    if(cart_detail.length === 0) {
      return this.alertify.error(this.translate.instant('CART_EMPTY'))
    }else {
      this.removeLocalStore('cart')
      this.removeLocalStore('cart_detail')
      this.alertify.success(this.translate.instant('Order_Success'))
      this.modalReference.close();
    }
  }
  removeLocalStore(key: string) {
    localStorage.removeItem(key);
  }
  
 
  setLocalStore(key: string, value: any) {
    localStorage.removeItem(key);
    let details = value || [];
    for (let key in details) {
      details[key].status = true;
    }
    const result = JSON.stringify(details);
    localStorage.setItem(key, result);
  }

  getLocalStore(key: string) {
    const data = JSON.parse(localStorage.getItem(key)) || [];
    return data;
  }
  loadProduct(_category) {
    this.spinner.show()
    this.serviceProducts.getProducts(_category.guid).subscribe(res => {
      this.products = res
      this.spinner.hide()
    })
  }
  getStoreInfor(storeId) {
    this.service.getById(storeId).subscribe(res => {
      console.log('Store Infor', res)
      this.storeInfo = res;
      this.getCategoryOfStore(this.storeInfo.accountGuid)
      this.getProducts(this.storeInfo.accountGuid)
    })
  }
  getCategoryOfStore(guid){
    this.serviceMainCategory.getCategoryByUserID(guid).subscribe(res => {
      this.mainCategory = res
    })
  }
  getProducts(guid){
    this.serviceMainCategory.getProducts(guid).subscribe(res => {
      this.products = res
      console.log(res)
    })
  }
  safeHtml(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  getDetailNew(newId) {
    this.webNewsService.getById(newId).subscribe(res => {
      console.log(res)
      this.news = res
    })
  }
  login() {
    
    return this.router.navigate[('/login')]

  }
  ngAfterViewInit(): void {
    
    $(function () {
     
      $('.nav > .sidebar-toggle').on('click', function (e) {
          e.preventDefault();
          $('.sidebar-toggle').toggleClass('active');
          $('.menu-collapse').toggleClass('active');
          $('.sidebar.slimScroll').toggleClass('active');
      });

      $('.nav > .dropdown .sidebar-toggle').on('click', function (e) {
          e.preventDefault();
          $('.dropdown-menu.dropdown-menu-right.navbar-dropdown').toggleClass('show');
      });
      $('.dropdown-menu-right').on('mouseleave', function (e) {
        e.preventDefault();
        $('.dropdown-menu.dropdown-menu-right.navbar-dropdown').removeClass('show');
    });


  });
  }
  navigate(data) {
    if(data.url === null || data.url === '/')
      return this.router.navigate(['404'])
    return this.router.navigate([data.url])
  }
  getMenu() {
    this.spinner.show();
    this.sysMenuService.getMenusByMenuType(this.lang.toLowerCase(), "FE").subscribe((menus: []) => {
      this.menus = menus;
      localStorage.setItem('menus2', JSON.stringify(menus));
      $(function () {
        $('a.toggle').on('click', function (e) {
          e.preventDefault();
          $(this).closest('ul').find('a.toggle.active').not(this).removeClass('active');
          $(this).toggleClass('active');

        });
      });
      setTimeout(() => {
        this.spinner.hide();
      }, 500)
    }, (err) => {
      this.spinner.hide();
    });
  }
  loadLogoData() {
    let query = new Query();
    query.where("type", "equal", "Logo");
    new DataManager({
      url: `${environment.apiUrl}WebNews/LoadData?lang=${localStorage.getItem(
        "lang"
      )}`,
      adaptor: new UrlAdaptor(),
    })
      .executeQuery(query.sortBy("sortId"))
      .then((res: any) => {
        var data = res.result.result;
        this.logo = data.length > 0 ? data[0].photoPath : "../../../assets/images/logo.png";
      })
      .catch((err) => {});
  }


  langValueChange(args) {
    const lang = args.itemData.id.toLowerCase();
    localStorage.removeItem("lang");
    localStorage.setItem("lang", lang);
    this.lang = this.capitalize(localStorage.getItem("lang"));
    location.reload();
  }
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

}
