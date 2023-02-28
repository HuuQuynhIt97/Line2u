import { User2MessageService } from 'src/app/_core/_service/evse/user2-message.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DataManager, UrlAdaptor ,Query } from '@syncfusion/ej2-data';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { AlertifyService } from 'herr-core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alert-screen',
  templateUrl: './alert-screen.component.html',
  styleUrls: ['./alert-screen.component.scss']
})
export class AlertScreenComponent implements OnInit {
  dataSource: any;
  user = JSON.parse(localStorage.getItem('user_landlord'))

  constructor(
    private user2MessageService: User2MessageService,
    private datePipe: DatePipe,
    private alertify: AlertifyService,
    private translateService: TranslateService,

  ) { }

  ngOnInit() {
    this.loadData()
  }
  formatDate(date) {
    return this.datePipe.transform(date, "yyyy-MM-dd")
  }
  loadData() {
    const accessToken = localStorage.getItem('token');
    const lang = localStorage.getItem('lang');
    new DataManager({
      url: `${environment.apiUrl}User2Message/LoadData?lang=${lang}`,
      adaptor: new UrlAdaptor,
      headers: [{ authorization: `Bearer ${accessToken}` }]
    }).executeQuery(new Query().where('userGuid', 'equal', this.user?.guid)).then(x=> {
    this.dataSource = x['result'].result
    });
}
seen(guid) {
  this.user2MessageService.seen(guid).subscribe(
    (res) => {
      if (res.success === true) {
        this.user2MessageService.changeUser2Message(true)
        this.loadData();
      } else {
        this.alertify.warning(this.translateService.instant("Can not seen alert! Server error"));
      }
    },
    (error) => {
      this.alertify.warning(this.translateService.instant("Can not seen alert! Server error"));
    }
  );
}
}
