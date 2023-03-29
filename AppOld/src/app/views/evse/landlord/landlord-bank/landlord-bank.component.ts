
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AlertifyService, BaseComponent } from 'herr-core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { L10n,setCulture } from '@syncfusion/ej2-base';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { User2Bank, ParkingLot, Site } from 'src/app/_core/_model/evse/model';
import { DataManager, Query, UrlAdaptor } from '@syncfusion/ej2-data';
import { LandlordBankActionComponent } from './landlord-bank-action/landlord-bank-action.component';
import { User2BankService } from 'src/app/_core/_service/evse/user-2bank.service';
import { Subscription } from 'rxjs';
import { ImagePathConstants } from 'src/app/_core/_constants';

@Component({
  selector: 'app-landlord-bank',
  templateUrl: './landlord-bank.component.html',
  styleUrls: ['./landlord-bank.component.css']
})
export class LandlordBankComponent  extends BaseComponent implements OnInit, OnChanges, OnDestroy {
 @Input() site: Site
 @Input() parkingLot: ParkingLot
 locale = localStorage.getItem('lang');
 @ViewChild('grid') public grid: GridComponent;
 @ViewChild(LandlordBankActionComponent) public action: LandlordBankActionComponent;
 toolbarOptions = ['Add', 'Search'];
  editSettings = { showDeleteConfirmDialog: false, allowEditing: false, allowAdding: true, allowDeleting: false, mode: 'Normal' };
  dataSource: any;
  baseUrl = environment.apiUrl;
  public query: Query ;
  @Input() landLordGuid: any;
  subscription = new Subscription()
  apiHost = environment.apiUrl.replace('/api/', '');
  noImage = ImagePathConstants.NO_IMAGE_ACTION_COMPONENT;
  constructor(
    private alertify: AlertifyService,
    private service: User2BankService,
    public translate: TranslateService,
    ) { 
      super(translate,environment.apiUrl); 
    }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  isImgUrl(url) {
    return fetch(url, {method: 'HEAD'}).then(res => {
      return res.headers.get('Content-Type').startsWith('image')
    })
  }
 async image(img) {
  const check = await this.image(img);
    return check ? img : this.noImage ;
  }
  ngOnInit() {
    let lang = localStorage.getItem("lang");
    let languages = JSON.parse(localStorage.getItem("languages"));
    // setCulture(lang);
    let load = {
      [lang]: {
        grid: languages["grid"],
        pager: languages["pager"],
        "multi-select": languages["multiselect"],
        uploader: languages["uploader"],
      },
    };
    L10n.load(load);
    this.subscription.add(this.service.currentUser2Bank.subscribe(x=> {
      this.landLordGuid = x;
      this.loadData();
    }))
  }
  ngOnChanges(changes: SimpleChanges): void {

  }
  loadData() {
    this.query = new Query();
    this.query.where("userGuid", "equal", this.landLordGuid);
    
    const accessToken = localStorage.getItem('token');
    const lang = localStorage.getItem('lang');
    this.dataSource = new DataManager({
      url: `${this.baseUrl}User2Bank/LoadData?lang=${lang}`,
      adaptor: new UrlAdaptor,
      headers: [{ authorization: `Bearer ${accessToken}` }]
    }, this.query.sortByDesc("id"));
}


  toolbarClick(args) {
    switch (args.item.id) {
      case 'grid_excelexport':
        this.grid.excelExport({ hierarchyExportMode: 'All' });
        break;
      case 'grid_add':
        args.cancel = true;
        this.action.initModel();
        this.action.model.userGuid = this.landLordGuid;
        this.action.open();
        break;
      default:
        break;
    }
  }
  delete(id) {
    this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.deleteTitle,
      this.alert.deleteMessage,
      () => {
        this.service.delete(id).subscribe(
          (res) => {
            if (res.success === true) {
              this.alertify.success(this.alert.deleted_ok_msg);
              this.loadData();
            } else {
              this.alertify.warning(this.alert.system_error_msg);
            }
          },
          (err) => this.alertify.warning(this.alert.system_error_msg)
        );
      }, () => {
        this.alertify.error(this.alert.cancelMessage);
  
      }
    );
  
  }
  edit(data) {
    this.action.initModel();
    this.action.guid = data.guid;
    this.action.open();
  }
  saveChange() {
    this.loadData();
  }
}
