import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AlertifyService, BaseComponent } from 'herr-core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { L10n,setCulture } from '@syncfusion/ej2-base';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ParkingLot, Site } from 'src/app/_core/_model/evse/model';
import { ParkingLotActionComponent } from './parking-lot-action/parking-lot-action.component';
import { DataManager, Query, UrlAdaptor } from '@syncfusion/ej2-data';
import { ParkingLotService } from 'src/app/_core/_service/evse/parking-lot.service';

@Component({
  selector: 'app-parking-lot',
  templateUrl: './parking-lot.component.html',
  styleUrls: ['./parking-lot.component.scss']
})
export class ParkingLotComponent  extends BaseComponent implements OnInit, OnChanges {
 @Input() site: Site
 @Input() parkingLot: ParkingLot
 @Output() parkingLotChange = new EventEmitter<ParkingLot>();
 locale = localStorage.getItem('lang');
 @ViewChild('grid') public grid: GridComponent;
 @ViewChild(ParkingLotActionComponent) public action: ParkingLotActionComponent;
 toolbarOptions = ['Add', 'Search'];
  editSettings = { showDeleteConfirmDialog: false, allowEditing: false, allowAdding: true, allowDeleting: false, mode: 'Normal' };
  dataSource: any;
  baseUrl = environment.apiUrl;
  public query: Query ;
  
  constructor(
    private alertify: AlertifyService,
    private service: ParkingLotService,
    public translate: TranslateService,
  ) { 
    super(translate,environment.apiUrl); 
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty("site")) {
      if (changes?.site.currentValue != changes?.site.previousValue ) {
       this.loadData();
      }
     }
  }

  ngOnInit() {
  }
  loadData() {
    const accessToken = localStorage.getItem('token');
    const lang = localStorage.getItem('lang');
    this.query = new Query()
    .where('siteGuid', 'equal', this.site?.guid);
    this.dataSource = new DataManager({
      url: `${this.baseUrl}ParkingLot/LoadData?lang=${lang}`,
      adaptor: new UrlAdaptor,
      headers: [{ authorization: `Bearer ${accessToken}` }]
    },this.query);
}
recordClick(args: any) {
 this.parkingLot = args.rowData as ParkingLot;
 this.parkingLotChange.emit(args.rowData);
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
