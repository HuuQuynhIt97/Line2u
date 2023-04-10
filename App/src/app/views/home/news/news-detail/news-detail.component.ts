import { AfterViewInit, Component, OnInit } from '@angular/core';
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
import { DataService } from 'src/app/_core/_service/data.service';
import { WebNewsUserService } from 'src/app/_core/_service/evse/web-news-user.service';
import { ImagePathConstants } from 'src/app/_core/_constants';
import {Location} from '@angular/common';
@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {

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
    { id: "En", name: "En" },
    // { id: "Cn", name: "Cn" },
    // { id: "Vi", name: "Vi" },
  ];
  baseUrl = environment.apiUrlImage;
  banners= [];
  news: any;
  logo: any;
  noImage = ImagePathConstants.NO_IMAGE_QR;
  noImage_Comment = ImagePathConstants.NO_IMAGE_HEADER_IMAGE;
  apiHost = environment.apiUrl.replace('/api/', '');
  constructor(
    private spinner: NgxSpinnerService,
    private sysMenuService: SysMenuService,
    private webNewsService: WebNewsService,
    private webNewsUserService: WebNewsUserService,
    private translate: TranslateService,
    private utilityService: UtilitiesService,
    private dataService: DataService,
    private _location: Location,
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    public sanitizer: DomSanitizer,
    private router: Router,

  ) { 
    var newId = this.route.snapshot.paramMap.get('id') || 0
    this.subscription = this.dataService.SourceLang.subscribe(res => {
      console.log(res)
      if(res === 'Store_Click') {
        this.getDetailNewUser(newId)
      }else {
        this.getDetailNew(newId)
      }
    })
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    this.lang = this.capitalize(localStorage.getItem("lang"));
    this.getMenu();
    this.loadLogoData();
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
  BackToShoppping() {
    this._location.back()
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
  getDetailNewUser(newId) {
    this.webNewsUserService.getById(newId).subscribe(res => {
      console.log(res)
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
