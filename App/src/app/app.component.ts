import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService } from 'herr-core';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AutoLogoutService } from './_core/_service/apply-orders/auto-log-off.service';
import { VersionCheckService } from './_core/_service/version-check.service';
import { XAccountService } from './_core/_service/xaccount.service';

import {
  DataManager,
  Query,
  UrlAdaptor,
  Predicate,
} from "@syncfusion/ej2-data";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  titleKey = 'EVSE 後台管理系統';
  titleName: any;
  constructor(
    private versionCheckService: VersionCheckService,
    private title:Title,
    private translate:TranslateService,
    private accountService: XAccountService,
    private alertify: AlertifyService
    ) {
  }
  ngOnInit(): void {
  
    // this.translate.get(this.titleKey).subscribe(name=>{
    //   this.title.setTitle(name);
    // });
   this.loadTitleData();
    this.versionCheckService.initVersionCheck(environment.versionCheckURL);

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

