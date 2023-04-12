import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
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
import { Browser } from '@syncfusion/ej2-base';
import SwiperCore , {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
} from 'swiper';
import { WebBannerService } from 'src/app/_core/_service/evse/web-banner.service';
import { eventClick } from '@syncfusion/ej2-angular-schedule';
import { StoreProfile } from 'src/app/_core/_model/xaccount';
import { Products } from 'src/app/_core/_model/evse/products';
import { AuthService } from 'src/app/_core/_service/auth.service';
import { ImagePathConstants, MessageConstants } from 'src/app/_core/_constants';
import { StoreProfileService } from 'src/app/_core/_service/evse/store-profile.service';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
SwiperCore.use([
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller
]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.css',
  ],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, AfterViewInit {
  public closeBanner : boolean | undefined;
  fieldsLang: object = { text: "name", value: "id" };
  menus: any;
  lang: string;
  userid: number;
  title: any;
  btnText: any;
  parentActive = false;
  childActive = false;
  subActive = false;
  count: any = 0;
  subscription: Subscription = new Subscription();
  languageData = [
    { id: "Tw", name: "Tw" },
    { id: "En", name: "En" },
    // { id: "Cn", name: "Cn" },
    // { id: "Vi", name: "Vi" },
  ];
  baseUrl = environment.apiUrlImage;
  banners= [];
  news= [];
  store= [];
  logo: any;
  isMobileBrowser: boolean = false
  sysConf: any;
  isOpenDropdown: boolean = false
  username: ''
  storeInfo: StoreProfile = {} as StoreProfile;
  cartDetail: Products[] = [];
  totalPrice: number;
  isLogin: boolean = false
  user = JSON.parse(localStorage.getItem('user'))
  apiHost = environment.apiUrl.replace('/api/', '');
  noImage = ImagePathConstants.NO_IMAGE_QR;
  countyId: string = ''
  townShipId: string = ''
  countyData: any
  storeCountyFields: object = { text: 'countyName', value: 'countyId' };
  storeTownShipFields: object = { text: 'townshipName', value: 'townshipId' };
  townshipData: any
  @ViewChild('county_dropdown')
  public county_dropdown: DropDownListComponent;

  @ViewChild('townShip_dropdown')
  public townShip_dropdown: DropDownListComponent;
  constructor(
    private spinner: NgxSpinnerService,
    private webBannerService: WebBannerService,
    private authService: AuthService,
    private sysMenuService: SysMenuService,
    private alertify: AlertifyService,
    private translate: TranslateService,
    private utilityService: UtilitiesService,
    private serviceStore: StoreProfileService,
    private router: Router

  ) { 
    this.isMobileBrowser = Browser.isDevice
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    this.getCountyTownShip()
    this.loadStoreData()
    this.sysConf = JSON.parse(localStorage.getItem('sysConf'))
    if (this.authService.loggedIn()) {
      this.isLogin = true
      this.username = this.user.accountName
    }else {
      this.isLogin = false
    }
    this.lang = this.capitalize(localStorage.getItem("lang"));
    this.getMenu();
    this.loadLogoData();
    this.loadBannerData();
  }
  countyChange(args) {
    console.log('countyChange', args)
    if(args.isInteracted) {
      this.countyId = args.value
      this.townShipId = ''
      this.townShip_dropdown.value = null;
      this.getAllTownShipByCounty();
      this.getAllStoreByCountyAndTownShip()
    }
  }
  clearFillter() {
    this.county_dropdown.value = null;
    this.townShip_dropdown.value = null;
    this.countyId = ''
    this.townShipId = ''
    this.loadStoreData()
  }
  townShipChange(args) {
    console.log('townShipChange', args)
    if(args.isInteracted) {
      this.townShipId = args.value
      this.getAllStoreByCountyAndTownShip()
      this.getAllTownShipByCounty();
    }
  }
  async getCountyTownShip() {
    await this.getAllCounty()
    // await this.getAllTownShip()
  }
  getAllCounty() {
    return new Promise((result, rej) => {
      this.serviceStore.getAllCounty().subscribe(
        (res: any) => {
          this.countyData  = res
          console.log('countyData', 3)
          result(result);
        },
        (error) => {
          rej(error);
        }
      );
    });
    
  }
  getAllTownShip() {
    return new Promise((result, rej) => {
      this.serviceStore.getAllTowship().subscribe(
        (res: any) => {
          this.townshipData  = res
          console.log('townshipData', 1)
          result(result);
        },
        (error) => {
          rej(error);
        }
      );
    });
   
  }

  getAllTownShipByCounty() {
    return new Promise((result, rej) => {
      this.serviceStore.getTowshipByCounty(this.countyId).subscribe(
        (res: any) => {
          this.townshipData  = res
          console.log('getTowshipByCounty', this.townshipData)
          result(result);
        },
        (error) => {
          rej(error);
        }
      );
    });
 
  }
  getAllStoreByCountyAndTownShip() {
    this.serviceStore.getAllStoreByCountyAndTownShip(this.countyId, this.townShipId,0).subscribe(x=> {
      console.log('store', x)
      this.store = x;
    })
  }
  toggleBanner(){
    this.closeBanner = !this.closeBanner;
  }
  removeLocalStore(key: string) {
    localStorage.removeItem(key);
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
  openCart(){
    // this.modalReference = this.modalService.open(template, {size: 'xl',backdrop: 'static'});
    this.router.navigate([`home/store/${this.storeInfo.storeName}/${this.storeInfo.id}/shop-cart`])
    // this.router.navigate([`home/news-detail/${item.id}`])
    this.cartDetail = this.getLocalStore("cart_detail");
    this.totalPrice = this.cartDetail.map((selection) => selection.price).reduce((sum, price) => sum += price, 0);
  }
  getLocalStore(key: string) {
    const data = JSON.parse(localStorage.getItem(key)) || [];
    return data;
  }
  OpenDropdown() {
    this.isOpenDropdown = !this.isOpenDropdown
  }
  loadBannerData() {
    this.webBannerService.getWebBanners().subscribe(x=> {
      this.banners = x;
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
  //   this.ctx.onclick = function (evt) {
  //     console.log('aaaaa',evt)
  //     var popup = window.open('http://www.facebook.com/sharer/sharer.php?u=http://www.google.com', '', "width=400, height=400");
  
  //     var popupTick = setInterval(function() {
  //       if (popup.closed) {
  //         clearInterval(popupTick);
  //         console.log('window closed!');
  //       }
  //     }, 500);
  
  //     return false;
  // };
    if(data.url === null || data.url === '/')
      return this.router.navigate(['404'])
    return this.router.navigate([data.url])
    // const functionCode = data.functionCode;
    // if (functionCode === 'Report'&& data.level === 2) {
    //   return;
    // }
    // if (functionCode === 'Report'&& data.level === 3) {
    // }
    // const functions = JSON.parse(localStorage.getItem('functions')) || [];
    // const permissions = functions.includes(functionCode);
    // if(permissions) {
    //   if (data.url) {
    //     return  this.router.navigate([data.url])
    //   }
    // } else {
    //   this.alertify.errorBackToLogin(this.translate.instant(this.title), this.translate.instant(this.btnText), () => {
    //     localStorage.removeItem('user');
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('refresh-token');
    //     localStorage.removeItem('login-event');
    //     localStorage.removeItem('functions');
    //     localStorage.removeItem('menuItem');
    //     localStorage.removeItem('farmGuid');
    //     localStorage.removeItem('menus2');
    //     this.router.navigate(['/login']);
    //   }, true, () => {
    //     return;
    //   });
    //   return;
    // }
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
  loadStoreData() {
    this.serviceStore.getAll().subscribe(x=> {
      console.log('store', x)
      this.store = x;
    })
  }

  gotoShop(item) {
    localStorage.setItem('store', JSON.stringify(item));
    this.router.navigate([`home/store/${item.storeName}/${item.id}`])
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
