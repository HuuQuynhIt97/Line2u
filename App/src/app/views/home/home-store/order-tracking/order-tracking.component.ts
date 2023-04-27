import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService, UtilitiesService } from 'herr-core';
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
import { StoreProfile, XAccount } from 'src/app/_core/_model/xaccount';
import { MainCategory } from 'src/app/_core/_model/evse/mainCategory';
import { Products } from 'src/app/_core/_model/evse/products';
import { ProductsService } from 'src/app/_core/_service/evse/products.service';
import { DataService } from 'src/app/_core/_service/data.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ImagePathConstants, MessageConstants } from 'src/app/_core/_constants';
import { WebBannerService } from 'src/app/_core/_service/evse/web-banner.service';
// import { CarouselButtonVisibility } from '@syncfusion/ej2-angular-navigations';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { WebBannerUserService } from 'src/app/_core/_service/evse/web-banner-user.service';
import { WebNewsUserService } from 'src/app/_core/_service/evse/web-news-user.service';
import { AuthService } from 'src/app/_core/_service/auth.service';
import { XAccountService } from 'src/app/_core/_service/xaccount.service';
import { Order } from 'src/app/_core/_model/evse/order';
import { OrderService } from 'src/app/_core/_service/evse/order.service';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.css'],
  // encapsulation: ViewEncapsulation.ShadowDom
})
export class OrderTrackingComponent implements OnInit {

  fieldsLang: object = { text: "name", value: "id" };
  menus: any;
  lang: string;
  userid: number;
  title: any = 'LIST_ORDER';
  btnText: any;
  parentActive = false;
  childActive = false;
  subActive = false;
  isDelevery: boolean = true
  subscription: Subscription = new Subscription();
  languageData = [
    { id: "Tw", name: "Tw" },
    { id: "En", name: "En" },
  ];
  paymentData = [
    { id: 1, name: "Payment on delivery" },
    { id: 2, name: "Visa" },
    { id: 3, name: "MasterCard" },
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
  isLineAccount: string = JSON.parse(localStorage.getItem('user'))?.isLineAccount
  isCustomer: boolean = JSON.parse(localStorage.getItem('user'))?.isCustomer
  noImage = ImagePathConstants.NO_IMAGE_QR;
  apiHost = environment.apiUrl.replace('/api/', '');
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  // public buttonsVisibility: CarouselButtonVisibility = "Visible";
  username: ''
  user = JSON.parse(localStorage.getItem('user'))
  responsiveOptions;
  selectedIndex = -1;
  isLogin: boolean = false
  modelAccount: XAccount = {} as XAccount;
  orderModel: Order = {} as Order;
  isOpenDropdown: boolean = false
  paymentType: any = '1';
  trackingData: any = [];
  @HostListener("window:scroll", [])onWindowScroll() {
    //.scrollTop
    if(window.pageYOffset > 500) {
      this.selectedIndex = 2
    }else {
      this.selectedIndex =  -1
    }
 }
 @ViewChild('toggleButton') toggleButton: ElementRef;
 @ViewChild('menu') menu: ElementRef;
  constructor(
    private spinner: NgxSpinnerService,
    private renderer: Renderer2,
    private eRef: ElementRef,
    private sysMenuService: SysMenuService,
    private webNewsService: WebNewsUserService,
    private service: StoreProfileService,
    private serviceMainCategory: MainCategoryService,
    private serviceProducts: ProductsService,
    private translate: TranslateService,
    private dataService: DataService,
    private webBannerService: WebBannerUserService,
    private utilityService: UtilitiesService,
    private route: ActivatedRoute,
    private serviceAccount: XAccountService,
    private alertify: AlertifyService,
    public sanitizer: DomSanitizer,
    private router: Router,
    private authService: AuthService,
    private orderService: OrderService,
    public modalService: NgbModal

  ) {
    this.responsiveOptions = [{
      breakpoint: '1024px',
      numVisible: 1,
      numScroll: 3
  }];
  this.renderer.listen('window', 'click',(e:Event)=>{
    // this.isOpenDropdown = !this.isOpenDropdown;
    } );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    // this.removeLocalStore('isLogin_Cus')
  }

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.isLogin = true
      this.username = this.user.accountName
    }else {
      this.isLogin = false
    }
    var storeId = this.route.snapshot.paramMap.get('id')
    this.getStoreInfor()
    this.lang = this.capitalize(localStorage.getItem("lang"));
    this.loadLogoData();
    this.getUserCheckoutInfo();
    this.getTrackingOrderUser()

  }
  getTrackingOrderUser() {
    this.orderService.getTrackingOrderUser(this.user.id).subscribe((res: any) => {
      this.trackingData = res
      console.log(this.trackingData)
    })
  }
  changeMethod(args) {
    if(args.target.value === '2' || args.target.value === '3') {
      this.isDelevery = false
    }else {
      this.isDelevery = true
    }
    this.paymentType = args.target.value
  }
  getUserCheckoutInfo(){
    this.serviceAccount.getById(this.user.id).subscribe(res => {
      this.modelAccount = res
    })
  }
  checkOut(){
    this.router.navigate([`home/store/${this.storeInfo.storeName}/${this.storeInfo.id}/shop-cart/check-out`])
  }
  backToShop() {
    this.router.navigate([`home/store/${this.storeInfo.storeName}/${this.storeInfo.id}`])
  }
  OpenDropdown() {
    this.isOpenDropdown = !this.isOpenDropdown
  }
  loadBannerData() {
    let id = this.storeInfo.createBy !== null ? this.storeInfo.createBy : 0
    this.webBannerService.getByUserID(id).subscribe((x: any)=> {
      this.banners = x;
    })
  }
  loadNewData() {
    let id = this.storeInfo.createBy !== null ? this.storeInfo.createBy : 0
    this.webNewsService.getByUserID(id).subscribe((x: any)=> {
      this.news = x;
    })
  }
  loginUser() {
    const uri = this.router.url;
    localStorage.setItem('isLogin_Cus',uri)
    this.router.navigate(["user-login"], {
      queryParams: { uri },
      replaceUrl: true,
    });
    // return this.router.navigate[('user-login')]
  }
  logOutUser() {
    const uri = this.router.url;
    localStorage.setItem('lang','tw')
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    // this.router.navigate(['/mobile/landlord-login']);
    this.alertify.message(this.translate.instant('Logged out'));
    location.reload();
  }
  imagePath(path) {
    if (path !== null && this.utilityService.checkValidImage(path)) {
      if (this.utilityService.checkExistHost(path)) {
        return path;
      }
      return this.apiHost + path;
    }
    return this.noImage;
  }
  detailNew(item) {
    this.dataService.changeLang('Store_Click')
    this.router.navigate([`home/news-detail/${item.id}`])
  }
  addToCart(item: Products) {
    this.isOpenDropdown = false
    let isLogin_Cus = localStorage.getItem("isLogin_Cus")
    if((isLogin_Cus?.length === 0 || isLogin_Cus === null) || this.isLineAccount !== '1') {
      this.alertify.warning(this.translate.instant('YOU_MUST_LOGIN_FIRST'),true)
    }else {
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
      this.alertify.success(this.translate.instant('Add_To_Cart_Success'))
      this.count = cartDetail.map((selection) => selection.quantity).reduce((sum, quantity) => sum += quantity, 0);
      this.totalPrice = cartDetail.map((selection) => selection.price).reduce((sum, price) => sum += price, 0);
    }
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
  openCart(){
    // this.modalReference = this.modalService.open(template, {size: 'xl',backdrop: 'static'});
    this.router.navigate([`home/store/${this.storeInfo.storeName}/${this.storeInfo.id}/shop-cart`])
    // this.router.navigate([`home/news-detail/${item.id}`])
    this.cartDetail = this.getLocalStore("cart_detail");
    this.totalPrice = this.cartDetail.map((selection) => selection.price).reduce((sum, price) => sum += price, 0);
  }
  saveOrder(){
    const cart_detail = this.getLocalStore("cart_detail");
    if(cart_detail.length === 0) {
      return this.alertify.error(this.translate.instant('CART_EMPTY'))
    }else {
      if (this.validate(this.modelAccount) == false) return;
      this.orderModel.totalPrice = this.totalPrice
      this.orderModel.createBy = this.user.id
      this.orderModel.customerName = this.modelAccount.accountName
      this.orderModel.customerAddress = this.modelAccount.accountAddress
      this.orderModel.customerEmail = this.modelAccount.accountEmail
      this.orderModel.customerPhone = this.modelAccount.accountTel
      this.orderModel.accountId = this.modelAccount.accountId
      this.orderModel.storeGuid = this.storeInfo.guid
      this.orderModel.products = cart_detail
      this.orderModel.paymentType = this.paymentType
      this.orderService.add(this.orderModel).subscribe(res => {
        this.alertify.success(this.translate.instant('Order_Success'))
        this.removeLocalStore('cart')
        this.removeLocalStore('cart_detail')
        this.count = 0
        this.router.navigate([`home/store/${this.storeInfo.storeName}/${this.storeInfo.id}`])
      })
      //
      // this.modalReference.close();
    }
  }
  validate(model: XAccount) {
    if (model.accountName === null || model.accountName === undefined || model.accountName === '') {
      this.alertify.warning(this.translate.instant('Name do not empty'),true);
      return false;
    }

    if (model.accountAddress === null || model.accountAddress === undefined || model.accountAddress === '') {
      this.alertify.warning(this.translate.instant('Address do not empty'),true);
      return false;
    }

    if (model.accountTel === null || model.accountTel === undefined || model.accountTel === '') {
      this.alertify.warning(this.translate.instant('Phone Number do not empty'),true);
      return false;
    }

    if (model.accountEmail === null || model.accountEmail === undefined || model.accountEmail === '') {
      this.alertify.warning(this.translate.instant('Email do not empty'),true);
      return false;
    }



    return true;
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
    this.serviceProducts.getProducts(_category.guid,this.user?.uid,this.storeInfo.id).subscribe(res => {
      this.products = res
      this.spinner.hide()
    })
  }
  getStoreInfor() {
    this.service.GetWithGuid(this.user.uid).subscribe(res => {
      this.storeInfo = res;
      this.getCategoryOfStore(this.storeInfo.accountGuid)
      this.getProducts(this.storeInfo.accountGuid)
      this.loadBannerData()
      this.loadNewData()
    })
  }
  getCategoryOfStore(guid){
    this.serviceMainCategory.getCategoryByUserID(guid).subscribe(res => {
      this.mainCategory = res
    })
  }
  getProducts(guid){
    this.serviceMainCategory.getProducts(guid,this.user?.uid,this.storeInfo.id).subscribe(res => {
      this.products = res
    })
  }
  safeHtml(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  getDetailNew(newId) {
    this.webNewsService.getById(newId).subscribe(res => {
      this.news = res
    })
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
