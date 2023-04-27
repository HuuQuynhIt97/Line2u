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
import { StoreProfile } from 'src/app/_core/_model/xaccount';
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
import { CartService } from 'src/app/_core/_service/evse/cart.service';
import { Cart } from 'src/app/_core/_model/evse/cart';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { ClickEventArgs } from '@syncfusion/ej2-angular-buttons';
import { SelectionSettingsModel } from '@syncfusion/ej2-angular-dropdowns';
@Component({
  selector: 'app-home-store',
  templateUrl: './home-store.component.html',
  styleUrls: [
    './home-store.component.scss',
  ],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
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
    { id: "En", name: "En" }
  ];
  baseUrl = environment.apiUrlImage;
  banners= [];
  news: any;
  logo: any;
  storeInfo: StoreProfile = {} as StoreProfile;
  cartModel: Cart = {} as Cart;
  mainCategory: any
  products: any
  count: any = 0;
  modalReference: NgbModalRef;
  cartDetail: Products[] = [];
  totalPrice: number;
  isLineAccount: string = JSON.parse(localStorage.getItem('user'))?.isLineAccount
  isCustomer: boolean = JSON.parse(localStorage.getItem('user'))?.isCustomer
  noImage = ImagePathConstants.NO_IMAGE_QR;
  noImage_Comment = ImagePathConstants.NO_IMAGE_HEADER_IMAGE;
  apiHost = environment.apiUrl.replace('/api/', '');
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  // public buttonsVisibility: CarouselButtonVisibility = "Visible";
  username: ''
  user = JSON.parse(localStorage.getItem('user'))
  responsiveOptions;
  selectedIndex = -1;
  isLogin: boolean = false
  isOpenDropdown: boolean = false
  userImage = JSON.parse(localStorage.getItem('user'))?.image
  ratingCommentData: any;
  isRatingComment: boolean = false;
  totalPriceModal: any;
  totalMore: number;
  totalPriceModal_tamp: any;
  totalPriceModal_tam_tam: any;
  totalMoreSize: number = 0;
  totalMoreOption: number = 0;
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
  selected = 1;
	hovered = 0;
	readonly = false;
  comment: string
  choiceSelected = [];
  choiceOptionPriceSelected = [];
  public data: { [key: string]: Object }[] = [
        { text: 'Hennessey Venom', id: 'list-01' },
        { text: 'Bugatti Chiron', id: 'list-02' },
        { text: 'Bugatti Veyron Super Sport', id: 'list-03' },
        { text: 'SSC Ultimate Aero', id: 'list-04' },
        { text: 'Koenigsegg CCR', id: 'list-05' },
        { text: 'McLaren F1', id: 'list-06' },
        { text: 'Aston Martin One- 77', id: 'list-07' },
        { text: 'Jaguar XJ220', id: 'list-08' },
        { text: 'McLaren P1', id: 'list-09' },
        { text: 'Ferrari LaFerrari', id: 'list-10' }
    ];
  public selectionSettings: SelectionSettingsModel = { showCheckbox: true };
  constructor(
    private spinner: NgxSpinnerService,
    private renderer: Renderer2,
    private eRef: ElementRef,
    private sysMenuService: SysMenuService,
    private webNewsService: WebNewsUserService,
    private service: StoreProfileService,
    private serviceCart: CartService,
    private serviceMainCategory: MainCategoryService,
    private serviceProducts: ProductsService,
    private translate: TranslateService,
    private dataService: DataService,
    private webBannerService: WebBannerUserService,
    private utilityService: UtilitiesService,
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private toast: ToastrService,
    public sanitizer: DomSanitizer,
    private router: Router,
    private authService: AuthService,
    public modalService: NgbModal

  ) {
    this.responsiveOptions = [{
      breakpoint: '1024px',
      numVisible: 1,
      numScroll: 3
  }];
    this.dataService.currentMessage.subscribe((res: any) => {
      if(res === 'load cart') {
        this.cartCountTotal()
        this.cartAmountTotal()
        this.getProducts(this.storeInfo.accountGuid,this.user?.uid)
      }
    })
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
    var tableId = this.route.snapshot.paramMap.get('tableId')
    if(tableId !== null) {
      localStorage.setItem('table',tableId)
    }
    this.getStoreInfor(storeId)
    this.lang = this.capitalize(localStorage.getItem("lang"));
    this.getMenu();
    this.loadLogoData();
    // this.dataService.pushCart('load cart')
    // const cartDetail = this.getLocalStore("cart_detail");
    // this.count = cartDetail.map((selection) => selection.quantity).reduce((sum, quantity) => sum += quantity, 0);
    // this.totalPrice = cartDetail.map((selection) => selection.price).reduce((sum, price) => sum += price, 0);
    this.cartAmountTotal()
    this.cartCountTotal();

  }
  minusPrdetail() {

    if(this.cartModel.quantity - 1  === 0)
    {
      // this.cartModel.quantity = 1
      return;
    }else {
      var sum = this.choiceOptionPriceSelected.reduce((acc, cur) => acc + cur, 0);
      this.cartModel.quantity = this.cartModel.quantity - 1
      this.totalPriceModal = this.toFixedIfNecessary(this.totalPriceModal_tamp * this.cartModel.quantity, 2)
      + this.toFixedIfNecessary(this.totalMoreSize * this.cartModel.quantity, 2) + this.toFixedIfNecessary(sum * this.cartModel .quantity, 2)
    }
  }
  plusPrdetail() {
    var sum = this.choiceOptionPriceSelected.reduce((acc, cur) => acc + cur, 0);
    if(this.cartModel.productSizeAdd === null && this.cartModel.productSize.length > 0) {
      this.toast.warning(this.translate.instant('PLEASE_CHOOSE_SIZE'))
      return;
    }
    this.cartModel.quantity = this.cartModel.quantity + 1
    this.totalPriceModal = this.toFixedIfNecessary(this.totalPriceModal_tamp * this.cartModel.quantity, 2)
    + this.toFixedIfNecessary(this.totalMoreSize * this.cartModel.quantity, 2) + this.toFixedIfNecessary(sum * this.cartModel .quantity, 2)
  }
  chipSizeclick(e, item) {
    this.cartModel.productSizeAdd = e.value
    // if(e.checked) {
    // }else {
    //   this.cartModel.productSizeAdd = null
    // }
    let totalMore = parseFloat(item.price);
    this.totalMoreSize = totalMore
    this.totalPriceModal = this.toFixedIfNecessary(this.totalPriceModal_tamp * this.cartModel.quantity, 2)
    + this.toFixedIfNecessary(this.totalMoreSize * this.cartModel.quantity, 2)
    + this.toFixedIfNecessary(this.totalMoreOption, 2)
    this.totalPriceModal_tam_tam = this.totalPriceModal
  }
  private toFixedIfNecessary(value, dp) {
    return +parseFloat(value).toFixed(dp);
  }
  chipOptionclick(e, item) {
      let totalMore = parseFloat(item.price);
      if(e.checked) {
        this.choiceSelected.push(item.id)
        this.choiceOptionPriceSelected.push(parseFloat(item.price))
        console.log(this.choiceOptionPriceSelected);
        var sum = this.choiceOptionPriceSelected.reduce((acc, cur) => acc + cur, 0);
        console.log(sum * this.cartModel.quantity)
        this.totalMoreOption = this.toFixedIfNecessary(sum * this.cartModel.quantity, 2)
        this.totalPriceModal_tam_tam = this.toFixedIfNecessary(this.totalPriceModal * this.cartModel.quantity, 2)
        // this.totalMoreOption = this.toFixedIfNecessary((this.totalMoreOption + (totalMore  * this.cartModel.quantity)), 2)
        this.totalPriceModal = this.toFixedIfNecessary(this.totalPriceModal_tamp * this.cartModel.quantity, 2)
        + this.toFixedIfNecessary(this.totalMoreOption,2)
        + this.toFixedIfNecessary(this.totalMoreSize * this.cartModel.quantity,2)
      }else {
        for(let i = 0; i < this.choiceSelected.length; i++) {
          if (this.choiceSelected[i] === item.id)
          {
            this.choiceSelected.splice(i, 1)
            this.choiceOptionPriceSelected.splice(i, 1)
          }
        }
        this.choiceSelected.slice(item.id)
        this.choiceOptionPriceSelected.slice(item.price)
        console.log(this.choiceOptionPriceSelected);
        var sum = this.choiceOptionPriceSelected.reduce((acc, cur) => acc + cur, 0);
        console.log(sum * this.cartModel.quantity)
        this.totalMoreOption = this.toFixedIfNecessary(sum * this.cartModel.quantity, 2)
        // this.totalMoreOption = this.toFixedIfNecessary((this.totalMoreOption - (totalMore *  this.cartModel.quantity)), 2)
        this.totalPriceModal_tam_tam = this.toFixedIfNecessary(this.totalPriceModal * this.cartModel.quantity, 2)
        this.totalPriceModal = this.toFixedIfNecessary(this.totalPriceModal_tamp * this.cartModel.quantity, 2)
        + this.toFixedIfNecessary(this.totalMoreOption,2)
        + this.toFixedIfNecessary(this.totalMoreSize * this.cartModel.quantity,2)
      }

  }
  chipOptionDelete(e) {
    if(e.text){

    }
  }
  cancelComment() {
    this.comment = ''
    this.selected = 1
  }
  postComment() {
    const model = {
      comment: this.comment,
      rating: this.selected,
      createBy: this.user.id,
      storeGuid: this.storeInfo.guid
    }
    this.service.postRatingComment(model).subscribe(res => {
      if(res.success) {
        this.toast.success(this.translate.instant('Comment success'))
        this.comment = ''
        this.getStoreInfor(this.storeInfo.id)
      }
    })
  }
  checkRatingComment() {
    this.service.checkRatingAndComment(this.storeInfo?.guid,this.user?.id).subscribe(res => {
      this.isRatingComment = res
    })
  }
  getRatingComment() {
    this.service.getRatingAndComment(this.storeInfo?.guid).subscribe(res => {
      this.ratingCommentData = res
    })
  }
  imagePathCustome(path) {
    if (path !== null) {
      return  path;
    }
    return this.noImage_Comment;
  }
  navigateMenu() {
    this.router.navigate([`home/store/${this.storeInfo.storeName}/${this.storeInfo.id}/order-tracking`])
  }
  OpenDropdown() {
    this.isOpenDropdown = !this.isOpenDropdown
  }
  loadBannerData() {
    let id = this.storeInfo.id !== null ? this.storeInfo.id : 0
    this.webBannerService.getByUserID(id).subscribe((x: any)=> {
      console.log(x);
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
    this.toast.success(this.translate.instant('Logged out'));
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
  detailNewBanner(item) {
    this.dataService.changeLang('Store_Click')
    this.router.navigate([`home/news-detail/${item.id}`])
  }
  cartCountTotal() {
    this.serviceCart.cartCountTotal(this.user?.uid || '').subscribe(res => {
      this.count = res
    })
  }
  cartAmountTotal() {
    this.serviceCart.cartAmountTotal(this.user?.uid || '').subscribe(res => {
      this.totalPrice = res
    })
  }
  removeCart(item: Products) {
    this.spinner.show()
    this.isOpenDropdown = false
    let isLogin_Cus = localStorage.getItem("isLogin_Cus")
    if((isLogin_Cus?.length === 0 || isLogin_Cus === null) || this.isLineAccount !== '1') {
      const uri = this.router.url;
      localStorage.setItem('isLogin_Cus',uri)
      this.router.navigate(["user-login"], {
        queryParams: { uri },
        replaceUrl: true,
      });
    }else {
      this.cartModel.id = item.cartId
      this.cartModel.updateBy = this.user.id
      this.cartModel.quantity = item.totalOrder - 1
      if(item.cartId > 0) {
        if(this.cartModel.quantity === 0) {
          this.serviceCart.delete(this.cartModel.id).subscribe(res => {
            this.cartCountTotal()
            this.getProducts(this.storeInfo.accountGuid,this.user?.uid)
            this.dataService.changeMessage('load cart')
            this.cartAmountTotal();
            this.spinner.hide()
          })
        }
        else {
          this.serviceCart.update(this.cartModel).subscribe(res => {
            // this.toast.success(this.translate.instant('Add_To_Cart_Success'))
            this.cartCountTotal()
            this.getProducts(this.storeInfo.accountGuid,this.user?.uid)
            this.dataService.changeMessage('load cart')
            this.cartAmountTotal();
            this.spinner.hide()
          })
        }
      }else {
        this.spinner.hide()
      }
    }
  }
  ngModelChange(args) {
    if(this.cartModel.productSizeAdd === null && this.cartModel.productSize.length > 0) {
      this.toast.warning(this.translate.instant('PLEASE_CHOOSE_SIZE'))
      return;
    }

  }

  addCartPrdetail() {
    this.cartModel.productOptionAdd = this.choiceSelected.sort((a,b) => a-b).join()
    if(this.cartModel.productSizeAdd === null && this.cartModel.productSize.length > 0) {
      this.toast.warning(this.translate.instant('PLEASE_CHOOSE_SIZE'))
      return;
    }
    if(this.cartModel.productOptionAdd === null || this.cartModel.productOptionAdd === '' || this.cartModel.productOptionAdd.length === 0) {
      this.cartModel.productOptionAdd = null
    }
    this.serviceCart.add(this.cartModel).subscribe(res => {
      this.toast.success(this.translate.instant('Add_To_Cart_Success'))
      this.choiceSelected = []
      this.cartCountTotal()
      this.getProducts(this.storeInfo.accountGuid,this.user?.uid)
      this.dataService.changeMessage('load cart')
      this.cartAmountTotal();
      this.modalReference.dismiss();
      this.spinner.hide()
    })
  }
  addToCart(item, modal) {

    this.spinner.show()
    this.isOpenDropdown = false
    let isLogin_Cus = localStorage.getItem("isLogin_Cus")
    if((isLogin_Cus?.length === 0 || isLogin_Cus === null) || this.isLineAccount !== '1') {
      const uri = this.router.url;
      localStorage.setItem('isLogin_Cus',uri)
      this.router.navigate(["user-login"], {
        queryParams: { uri },
        replaceUrl: true,
      });
      // this.alertify.warning(this.translate.instant('YOU_MUST_LOGIN_FIRST'),true)
    }else {
      this.title = this.translate.instant('Product_Details')
      this.cartModel = {...item}
      this.modalReference = this.modalService.open(modal, {size: 'xl',backdrop: 'static'});
      this.cartModel.accountUid = this.user.uid
      this.cartModel.createBy = this.user.id
      this.cartModel.quantity = 1
      this.cartModel.productGuid = item.guid
      this.cartModel.storeGuid = item.storeGuid
      this.cartModel.productId = item.id
      this.cartModel.productPrice = item.productPrice
      this.totalPriceModal = item.productPrice
      this.totalPriceModal_tamp = item.productPrice
      this.totalPriceModal_tam_tam = item.productPrice
      // this.cartModel.productOption = item.productOption.map(item => {
      //   return {
      //     text: item.topping,
      //     id: item.id,
      //     price: item.price
      //   }
      // })
      if(item.cartId > 0) {
        this.cartModel.productSizeAdd = null
        this.cartModel.productOptionAdd = null
      }
      console.log(this.cartModel);
      this.modalReference.result.then((result) => {
        this.totalMoreSize = 0
        this.totalMoreOption = 0
        }, (reason) => {
          this.totalMoreSize = 0
        this.totalMoreOption = 0
      });
      this.spinner.hide()
      // this.serviceCart.add(this.cartModel).subscribe(res => {
      //   this.toast.success(this.translate.instant('Add_To_Cart_Success'))
      //   this.cartCountTotal()
      //   this.getProducts(this.storeInfo.accountGuid,this.user?.uid)
      //   this.dataService.changeMessage('load cart')
      //   this.cartAmountTotal();
      //   this.spinner.hide()
      // })


      // let cart: Products[] = [];
      // cart = this.getLocalStore("cart_detail");
      // if(cart.length === 0) {
      //   item.quantity = 1
      //   item.price = parseFloat(item.productPrice)
      //   cart.push(item)
      // }else {
      //   for (let i = 0; i < cart.length; i++) {
      //     if (cart[i].id == item.id ) {
      //       cart[i].quantity = cart[i].quantity + 1;
      //       cart[i].price = cart[i].price  + parseFloat(item.productPrice);
      //       break;
      //     }else {
      //       const exsit = cart.filter(x => x.id === item.id );
      //       if(exsit.length === 0) {
      //         item.quantity = 1
      //         item.price = parseFloat(item.productPrice)
      //         cart.push(item)
      //       }else {
      //         for (let z = 0; z < cart.length; z++) {
      //           if (cart[z].id == item.id ) {
      //             cart[z].quantity = cart[z].quantity + 1;
      //             cart[z].price = cart[z].price  + parseFloat(item.productPrice);
      //             break;
      //           }
      //         }
      //       }
      //       break;
      //     }
      //   }
      // }
      // this.setLocalStore("cart_detail", cart);
      // const cartDetail = this.getLocalStore("cart_detail");
      // this.toast.success(this.translate.instant('Add_To_Cart_Success'))
      // this.count = cartDetail.map((selection) => selection.quantity).reduce((sum, quantity) => sum += quantity, 0);
      // this.totalPrice = cartDetail.map((selection) => selection.price).reduce((sum, price) => sum += price, 0);
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
    if(this.count === 0) {
      return this.toast.warning(this.translate.instant('CART_EMPTY'))
    }else {
      const uri = this.router.url;
      localStorage.setItem('isLogin_Cus',uri)
      this.router.navigate([`home/store/shop-cart`])
    }
    // this.modalReference = this.modalService.open(template, {size: 'xl',backdrop: 'static'});
    // // this.router.navigate([`home/news-detail/${item.id}`])
    // this.cartDetail = this.getLocalStore("cart_detail");
    // this.totalPrice = this.cartDetail.map((selection) => selection.price).reduce((sum, price) => sum += price, 0);
  }
  saveOrder(){
    const cart_detail = this.getLocalStore("cart_detail");
    if(cart_detail.length === 0) {
      return this.toast.error(this.translate.instant('CART_EMPTY'))
    }else {
      this.removeLocalStore('cart')
      this.removeLocalStore('cart_detail')
      this.count = 0
      this.toast.success(this.translate.instant('Order_Success'))
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
    this.serviceProducts.getProducts(_category.guid,this.user?.uid,this.storeInfo.id).subscribe(res => {
      this.products = res
      this.spinner.hide()
    })
  }
  getStoreInfor(storeId) {
    this.service.getById(storeId).subscribe(res => {
      this.storeInfo = res;
      this.getCategoryOfStore(this.storeInfo.accountGuid)
      this.getProducts(this.storeInfo.accountGuid , this.user?.uid)
      this.loadBannerData()
      this.loadNewData()
      this.getRatingComment()
      this.checkRatingComment()
    })
  }
  getCategoryOfStore(guid){
    this.serviceMainCategory.getCategoryByUserID(guid).subscribe(res => {
      this.mainCategory = res
    })
  }
  getProducts(store_guid, cus_guid){
    this.serviceMainCategory.getProducts(store_guid,cus_guid,this.storeInfo.id).subscribe(res => {
      console.log(res)
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
