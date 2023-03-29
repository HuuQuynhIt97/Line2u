import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AlertifyService, BaseComponent } from 'herr-core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { L10n,setCulture } from '@syncfusion/ej2-base';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Device, ParkingLot, Site } from 'src/app/_core/_model/evse/model';
import { DeviceActionComponent } from './device-action/device-action.component';
import { DataManager, Query, UrlAdaptor } from '@syncfusion/ej2-data';
import { DeviceService } from 'src/app/_core/_service/evse/device.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent  extends BaseComponent implements OnInit, OnChanges {
 @Input() site: Site
 @Input() parkingLot: ParkingLot
 locale = localStorage.getItem('lang');
 @ViewChild('grid') public grid: GridComponent;
 @ViewChild(DeviceActionComponent) public action: DeviceActionComponent;
 toolbarOptions = ['Add', 'Search'];
  editSettings = { showDeleteConfirmDialog: false, allowEditing: false, allowAdding: true, allowDeleting: false, mode: 'Normal' };
  dataSource: any;
  baseUrl = environment.apiUrl;
  public query: Query ;
  
  constructor(
    private alertify: AlertifyService,
    private service: DeviceService,
    public translate: TranslateService,
    ) { 
      super(translate,environment.apiUrl); 
    }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty("parkingLot")) {
      if (changes?.parkingLot.currentValue != changes?.parkingLot.previousValue) {
       this.loadData();
      }
     }
  }
  loadData() {
    const accessToken = localStorage.getItem('token');
    const lang = localStorage.getItem('lang');
    this.query = new Query()
    .where('parkingLotGuid', 'equal', this.parkingLot?.guid);
    this.dataSource = new DataManager({
      url: `${this.baseUrl}Device/LoadData?lang=${lang}`,
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
