import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { AlertifyService, BaseComponent } from 'herr-core';
import { XuserLine } from 'src/app/_core/_model/evse/XuserLine';
import { LineLoginOrNotifyService } from 'src/app/_core/_service/evse/lineLoginOrNotify.service';
import { XAccountService } from 'src/app/_core/_service/xaccount.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends BaseComponent implements OnInit, OnDestroy{
  userLine: any[];
  model: XuserLine = {} as XuserLine;
  userLineData:any;
  userLineFields: object = { text: 'accountName', value: 'uid' };
  @ViewChild('userDropdown') public userDropdown: DropDownListComponent;
  constructor(
    private lineService: LineLoginOrNotifyService,
    public translate: TranslateService,
    private alertify: AlertifyService,
    public http: HttpClient,
    private serviceXaccount: XAccountService,
  ) {
    super(translate,environment.apiUrl);
  }
  ngOnDestroy(): void {
    // throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.loadFuneralDirector()
  }
  loadFuneralDirector() {
    // this.serviceXaccount.getXAccountsToSendMessage().subscribe(res => {
    //   this.userLineData = res
    //   this.userLineData.unshift({
    //     id: 0,
    //     guid: '',
    //     accountName: this.translate.instant('DESKTOP_NO_ITEM_DATA') });
    // })
  }
  validateAddOrEdit(model: XuserLine) {
    if (model.content === null || model.content === undefined || model.content === '') {
      this.alertify.warning(this.translate.instant('MESSAGE_DO_NOT_EMPTY'),true);
      return false;
    }
    if (model.listUserLine === null || model.listUserLine === undefined || model.listUserLine === '' || model.listUserLine?.user.length === 0) {
      this.alertify.warning(this.translate.instant('LIST_USER_NOT_EMPTY'),true);
      return false;
    }
    return true;
  }
  sendMessage() {
    console.log(this.model.content)
    console.log(this.model.listUserLine)
    if (this.validateAddOrEdit(this.model) == false) return;
    this.lineService.sendFormMessage(this.model).subscribe(
      (res) => {
        this.alertify.success(this.translate.instant('Send Success'));
        this.refreshValue()
        // if (res.success === true) {
        // } else {
        //   this.translate.get(res.message).subscribe((data: string) => {
        //     this.alertify.warning(data, true);
        //     this.refreshValue()
        //   });
        // }

      },
      (error) => {
        this.alertify.warning(this.alert.system_error_msg);
      }
    )
  }
  refreshValue(){
    this.userDropdown.value = ''
    this.model.content = null
  }
  onChangePermission() {
    this.model.listUserLine = {
      user: this.userLine
    }
  }

}
