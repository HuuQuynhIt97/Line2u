import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  
  fieldsLang: object = { text: "name", value: "id" };
  menus: any;
  lang: string;
  userid: number;
  title: any;
  btnText: any;
  parentActive = false;
  childActive = false;
  subActive = false;
  subscription: Subscription = new Subscription();
  languageData = [
    { id: "Tw", name: "Tw" },
    { id: "Cn", name: "Cn" },
    { id: "En", name: "En" },
    { id: "Vi", name: "Vi" },
  ];
  baseUrl = environment.apiUrlImage;
  banners= [];
  news= [];
  logo: any;
  constructor(
    private spinner: NgxSpinnerService,
    private webBannerService: WebBannerService,
    private sysMenuService: SysMenuService,
    private dashService: DashboardService,
    private translate: TranslateService,
    private alertify: AlertifyService,
    private router: Router,

  ) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
   
    this.lang = this.capitalize(localStorage.getItem("lang"));
    this.getMenu();
    this.loadBannerData();
    this.loadLogoData();
   
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
    const functionCode = data.functionCode;
    if (functionCode === 'Report'&& data.level === 2) {
      return;
    }
    if (functionCode === 'Report'&& data.level === 3) {
      return this.router.navigate([data.url])
    }
    const functions = JSON.parse(localStorage.getItem('functions')) || [];
    const permissions = functions.includes(functionCode);
    if(permissions) {
      if (data.url) {
        return  this.router.navigate([data.url])
      }
    } else {
      this.alertify.errorBackToLogin(this.translate.instant(this.title), this.translate.instant(this.btnText), () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh-token');
        localStorage.removeItem('login-event');
        localStorage.removeItem('functions');
        localStorage.removeItem('menuItem');
        localStorage.removeItem('farmGuid');
        localStorage.removeItem('menus2');
        this.router.navigate(['/login']);
      }, true, () => {
        return;
      });
      return;
    }
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
