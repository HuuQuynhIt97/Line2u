
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AlertifyService, BaseComponent } from 'herr-core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { L10n,setCulture } from '@syncfusion/ej2-base';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Device, ParkingLot, Site } from 'src/app/_core/_model/evse/model';
import { DataManager, Query, UrlAdaptor } from '@syncfusion/ej2-data';
import { DeviceService } from 'src/app/_core/_service/evse/device.service';
import { LandlordDeviceActionComponent } from './landlord-device-action/landlord-device-action.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-landlord-device',
  templateUrl: './landlord-device.component.html',
  styleUrls: ['./landlord-device.component.scss']
})
export class LandlordDeviceComponent  extends BaseComponent implements OnInit, OnChanges {
 locale = localStorage.getItem('lang');
 @ViewChild('grid') public grid: GridComponent;
 @ViewChild(LandlordDeviceActionComponent) public action: LandlordDeviceActionComponent;
 toolbarOptions = ['Add', 'Search'];
  editSettings = { showDeleteConfirmDialog: false, allowEditing: false, allowAdding: true, allowDeleting: false, mode: 'Normal' };
  dataSource: any;
  baseUrl = environment.apiUrl;
  public query: Query ;
  subscription: any = new Subscription();
  landlordGuid: any;
  
  constructor(
    private alertify: AlertifyService,
    private service: DeviceService,
    public translate: TranslateService,
    ) { 
      super(translate,environment.apiUrl); 
    }

  ngOnInit() {
    this.subscription.add(this.service.currentDevice.subscribe(x=> {
      this.landlordGuid = x;
      this.loadData();
    }))
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
   
    }
  loadData() {
    const accessToken = localStorage.getItem('token');
    const lang = localStorage.getItem('lang');
    this.query = new Query()
    this.dataSource = new DataManager({
      url: `${this.baseUrl}Device/GetLandlordDevice?lang=${lang}&landlordGuid=${this.landlordGuid}`,
      adaptor: new UrlAdaptor,
      headers: [{ authorization: `Bearer ${accessToken}` }]
    },this.query);
}

  toolbarClick(args) {
    switch (args.item.id) {
      case 'grid_excelexport':
        this.grid.excelExport({ hierarchyExportMode: 'All' });
        break;
      case 'grid_add':
        args.cancel = true;
        this.action.initModel();
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
