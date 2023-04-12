import { Component, OnInit, AfterViewInit } from "@angular/core";
import { AuthService } from "../../../_core/_service/auth.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { FarmService } from "src/app/_core/_service/farms";
import { DashboardService } from "src/app/_core/_service/dashboard.service";
import { TranslateService } from "@ngx-translate/core";
import { HeaderService } from "src/app/_core/_service/header.service";
import { Query } from "@syncfusion/ej2-data";
import moment from "moment";
import { AutoLogoutService } from "src/app/_core/_service/apply-orders/auto-log-off.service";
import { XAccountService } from "src/app/_core/_service/xaccount.service";
import { AlertifyService, UtilitiesService } from "herr-core";
import { Subscription } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { SysMenuService } from "src/app/_core/_service/sys-menu.service";
import { environment } from "src/environments/environment";
declare let $: any;
import { DataManager, UrlAdaptor, Predicate } from '@syncfusion/ej2-data';
import { Browser } from '@syncfusion/ej2-base';
import { ToastrService } from "ngx-toastr";
import { ImagePathConstants, MessageConstants } from 'src/app/_core/_constants';
import { CartService } from "src/app/_core/_service/evse/cart.service";
import { StoreProfileService } from "src/app/_core/_service/evse/store-profile.service";
import { StoreProfile } from "src/app/_core/_model/xaccount";
import { DataService } from "src/app/_core/_service/data.service";
import { Cart } from "src/app/_core/_model/evse/cart";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-navbarAdmin',
  templateUrl: './navbarAdmin.component.html',
  styleUrls: ['./navbarAdmin.component.scss']
})
export class NavbarAdminComponent implements OnInit {

  fieldsLang: object = { text: "name", value: "id" };
  lang: string;
  languageData = [
    { id: "Tw", name: "Tw" },
    { id: "En", name: "En" },
    // { id: "Cn", name: "Cn" },
    // { id: "Vi", name: "Vi" },
  ];
  currentTime
  user = JSON.parse(localStorage.getItem('user'))
  userImage = JSON.parse(localStorage.getItem('user'))?.image
  nickName: any;
  username: any;
  menus: any;
  userid: number;
  title: any;
  btnText: any;
  parentActive = false;
  childActive = false;
  subActive = false;
  subscription: Subscription = new Subscription();
  isMobileMode: boolean = JSON.parse(localStorage.getItem('user'))?.mobileMode
  isLineAccount: string = JSON.parse(localStorage.getItem('user'))?.isLineAccount
  usernameLine: any;
  baseUrl = environment.apiUrlImage;
  storeInfo: StoreProfile = {} as StoreProfile;
  isLogin: boolean = false
  logo: any;
  isMobileBrowser: boolean = false
  apiHost = environment.apiUrl.replace('/api/', '');
  noImage = ImagePathConstants.NO_IMAGE_HEADER_IMAGE;
  noImage_Product = ImagePathConstants.NO_IMAGE_QR;
  count: any = 0;
  totalPrice: number;
  cartDetail: Cart[] = [];
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private alertify: AlertifyService,
    private router: Router,
    private utilityService: UtilitiesService,
    private trans: TranslateService,
    private translate:TranslateService,
    private spinner: NgxSpinnerService,
    private dataService: DataService,
    private serviceStore: StoreProfileService,
    private toast: ToastrService,
    public sanitizer: DomSanitizer,
    private sysMenuService: SysMenuService,
    private serviceCart: CartService,
  ) {
    this.isMobileBrowser = Browser.isDevice
    this.dataService.currentMessage.subscribe((res: any) => {
      if(res === 'load cart') {
        this.cartCountTotal()
        this.cartAmountTotal()
        this.getProductsInCart()
      }
    })
   }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
  ngOnInit(): void {
    this.getStoreInfor();
    this.cartCountTotal()
    this.cartAmountTotal()
    this.getProductsInCart()
    this.currentTime = moment().format('HH:mm:ss, D/MMM');
    this.lang = this.capitalize(localStorage.getItem("lang"));
    this.usernameLine =  JSON.parse(localStorage.getItem('user'))?.accountName || "Guest";
    this.nickName =
    JSON.parse(localStorage.getItem("user"))?.nickName || "No Name";
    this.username =
    JSON.parse(localStorage.getItem("user"))?.username || "Guest";
    setInterval(() => this.updateCurrentTime(), 1 * 1000);
    if (this.authService.loggedIn()) {
      this.isLogin = true
      this.username = this.user.accountName
    }else {
      this.isLogin = false
    }
    this.getMenu();
    this.loadLogoData();

  }
  checkOut() {
    const uri = this.router.url;
    localStorage.setItem('isLogin_Cus',uri)
    this.router.navigate([`home/store/shop-cart/check-out/payment`])
  }
  cartCountTotal() {
    this.serviceCart.cartCountTotal(this.user?.uid || '').subscribe(res => {
      this.count = res
    })
  }
  cartAmountTotal() {
    this.serviceCart.cartAmountTotal(this.user?.uid).subscribe(res => {
      this.totalPrice = res
    })
  }
  getProductsInCart() {
    this.serviceCart.getProductsInCart(this.user?.uid).subscribe(res => {
      this.cartDetail = res
    })
  }
  getStoreInfor() {
    let uid = this.user?.uid || ''
    this.serviceStore.GetWithGuid(uid).subscribe(res => {
      this.storeInfo = res;
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
  imagePathCustome(path) {
    if (path !== null) {
      return  path;
    }
    return this.noImage;
  }
  safeHtml(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  imagePath(path) {
    if (path !== null && this.utilityService.checkValidImage(path)) {
      if (this.utilityService.checkExistHost(path)) {
        return path;
      }
      return this.apiHost + path;
    }
    return this.noImage_Product;
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
  updateCurrentTime() {
    this.currentTime = moment().format('HH:mm:ss, D/MMM');
  }
  logout() {
    this.authService.logOut().subscribe(() => {
      const uri = this.router.url;
      this.cookieService.deleteAll("/");

      this.router.navigate(["login"], {
        queryParams: { uri },
        replaceUrl: true,
      });
      this.toast.success(this.trans.instant("Logged out"));
    });
  }
  navigate(data) {
    return  this.router.navigate([data.url])
    // const functionCode = data.functionCode;
    // if (functionCode === 'Report'&& data.level === 2) {
    //   return;
    // }
    // if (functionCode === 'Report'&& data.level === 3) {
    //   return this.router.navigate([data.url])
    // }
    // const functions = JSON.parse(localStorage.getItem('functions')) || [];
    // const permissions = functions.includes(functionCode);
    // if(permissions) {
    //   if (data.url) {
    //     return  this.router.navigate([data.url])
    //   }
    // } else {
    //   this.alertify.errorBackToLogin(this.translate.instant("Access-denied"), this.translate.instant("Back to login"), () => {
    //     localStorage.removeItem('user');
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('refresh-token');
    //     localStorage.removeItem('login-event');
    //     localStorage.removeItem('functions');
    //     localStorage.removeItem('menuItem');
    //     localStorage.removeItem('farmGuid');
    //     localStorage.removeItem('menus');
    //     this.router.navigate(['/login']);
    //   }, true, () => {
    //     return;
    //   });
    //   return;
    // }
  }
  getMenu() {
    this.spinner.show();
    this.sysMenuService.getMenusByMenuType(this.lang.toLowerCase(), "BE").subscribe((menus: []) => {
      this.menus = menus;
      localStorage.setItem('menus', JSON.stringify(menus));
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

}
