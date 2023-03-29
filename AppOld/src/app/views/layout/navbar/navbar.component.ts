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
import { AlertifyService } from "herr-core";
import { Subscription } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { SysMenuService } from "src/app/_core/_service/sys-menu.service";
declare let $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
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
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private alertify: AlertifyService,
    private router: Router,
    private service: FarmService,
    private serviceDash: DashboardService,
    private trans: TranslateService,
    private serviceHeader: HeaderService,
    private autoLogoutService: AutoLogoutService,
    private translate:TranslateService,
    private accountService: XAccountService,
    private spinner: NgxSpinnerService,
    private sysMenuService: SysMenuService,
  ) { }
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
    this.currentTime = moment().format('HH:mm:ss, D/MMM');
    this.lang = this.capitalize(localStorage.getItem("lang"));
    this.usernameLine =  JSON.parse(localStorage.getItem('user'))?.accountName || "Guest";
    this.nickName =
    JSON.parse(localStorage.getItem("user"))?.nickName || "No Name";
  this.username =
    JSON.parse(localStorage.getItem("user"))?.username || "Guest";
    setInterval(() => this.updateCurrentTime(), 1 * 1000);
    this.getMenu();

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
      this.alertify.message(this.trans.instant("Logged out"));
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
      this.alertify.errorBackToLogin(this.translate.instant("Access-denied"), this.translate.instant("Back to login"), () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh-token');
        localStorage.removeItem('login-event');
        localStorage.removeItem('functions');
        localStorage.removeItem('menuItem');
        localStorage.removeItem('farmGuid');
        localStorage.removeItem('menus');
        this.router.navigate(['/login']);
      }, true, () => {
        return;
      });
      return;
    }
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
