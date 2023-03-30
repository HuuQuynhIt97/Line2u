import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService } from 'herr-core';
import { filter, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AutoLogoutService } from './_core/_service/apply-orders/auto-log-off.service';
import { VersionCheckService } from './_core/_service/version-check.service';
import { XAccountService } from './_core/_service/xaccount.service';
declare let $: any;
import {
  DataManager,
  Query,
  UrlAdaptor,
  Predicate,
} from "@syncfusion/ej2-data";
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NavigationCancel, NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    Location, {
        provide: LocationStrategy,
        useClass: PathLocationStrategy
    }
]
})
export class AppComponent implements OnInit {
  titleKey = 'LINE2U_TITLE';
  titleName: any;
  location: any;
  routerSubscription: any;
  constructor(
    private versionCheckService: VersionCheckService,
    private title:Title,
    private router: Router,
    private translate:TranslateService,
    private accountService: XAccountService,
    private alertify: AlertifyService
    ) {
  }
  ngOnInit(): void {
    this.recallJsFuntions();
    this.translate.get(this.titleKey).subscribe(name=>{
      this.title.setTitle(name);
    });
   this.loadTitleData();
    this.versionCheckService.initVersionCheck(environment.versionCheckURL);

  }
  recallJsFuntions() {
    this.router.events
    .subscribe((event) => {
        if ( event instanceof NavigationStart ) {
            $('#preloaders').fadeIn('slow');
        }
    });
    this.routerSubscription = this.router.events
    .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel))
    .subscribe(event => {
        $.getScript('assets/js/quickmunch.js');
        $('#preloader').fadeOut('slow');
        this.location = this.router.url;
        if (!(event instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0);
    });
}
  loadTitleData() {
    let query = new Query();
    query.where("type", "equal", "EVSE_Title");
    query.where("no", "equal", "title");

    const accessToken = localStorage.getItem("token");
    new DataManager({
      url: `${environment.apiUrl}SystemConfig/GetDataDropdownlist`,
      adaptor: new UrlAdaptor(),
      headers: [{ authorization: `Bearer ${accessToken}` }],
    })
      .executeQuery(query)
      .then((x: any) => {
        const configData = x.result;
        const item = configData[0];
        this.titleName = configData.length > 0 ? item.value : this.translate.instant(this.titleKey);
        this.title.setTitle(this.titleName);
       
      });
  }
  

}

