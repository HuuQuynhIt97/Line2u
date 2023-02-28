import { NgxSpinnerService } from 'ngx-spinner';

import { DataManager, Query, UrlAdaptor, Predicate } from "@syncfusion/ej2-data";

import { L10n, setCulture } from "@syncfusion/ej2-base";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NgbModalRef,
  NgbModal,
  NgbTooltipConfig,
} from "@ng-bootstrap/ng-bootstrap";
import {
  ExcelExportCompleteArgs,
  ExcelExportProperties,
  GridComponent,
} from "@syncfusion/ej2-angular-grids";
import { AlertifyService } from "src/app/_core/_service/alertify.service";
import { BaseComponent } from "herr-core";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "src/environments/environment";
import { PigService } from "src/app/_core/_service/pigs/pig.service";
import { Subscription } from "rxjs";
import { DatePipe } from "@angular/common";
import {
  RecordMarketService ,Record2PigService,
} from "src/app/_core/_service/apply-orders";
import { RecordMarket } from "src/app/_core/_model/apply-orders";
import { PenService, RoomService } from "src/app/_core/_service/farms";
declare let window: any;
@Component({
  selector: 'app-record-culling-sale-market-modal',
  templateUrl: './record-culling-sale-market-modal.component.html',
  styleUrls: ['./record-culling-sale-market-modal.component.css']
})
export class RecordCullingSaleMarketModalComponent   
extends BaseComponent
implements OnInit, OnDestroy
{
public query: Query;
localLang = window.navigator.userLanguage || window.navigator.language;
@Output() selectRecordMarket = new EventEmitter();
data: DataManager;
baseUrl = environment.apiUrl;
password = "";
modalReference: NgbModalRef;
dataSource:any;
@ViewChild("grid") public grid: GridComponent;
model: RecordMarket;
setFocus: any;
locale = localStorage.getItem("lang");
editSettings = {
  showDeleteConfirmDialog: false,
  allowEditing: false,
  allowAdding: true,
  allowDeleting: false,
  mode: "Normal",
};
@Input() pigs: any = [];

title: any;
@ViewChild("odsTemplate", { static: true }) public odsTemplate: any;
@ViewChild("makeOrderGuidSearchTemplate", { static: true }) public makeOrderGuidSearchTemplate: any;
  @ViewChild("marketModal") templateRef: TemplateRef<any>;
  makeOrderGuidSearch:any;
toolbarOptions: any;
selectionOptions = { checkboxMode: "ResetOnRowClick" };
fields: object = { text: "name", value: "guid" };
pigData: any;
recordValue: any;
disable: boolean;
makeOrderGuid: any;
subscription: Subscription = new Subscription();
makeOrderValue: any;
statusDefault = 1;
statusAgree = 2;
statusClose = 4;
statusReject = 5;
roomGuid: string;
penGuid: string;
dataPen: DataManager;
queryPen: Query;
checkedData: any[] = [];
orderStatusCheckedData: number[] = [];
  orderStatus: any;
configButtonData: any;
  saleGuid: any;
  record2MarketDatasouce = [];
public actionComplete(e: any): void {}
enabledInput(date : any) {
  if (date === "" || date === null || date === undefined) { return true; }
  let date1 = "";
  if (date && date instanceof Date) {
    date1 = this.datePipe.transform(date, "yyyy/MM/dd");
  } else {
    date1 = this.datePipe.transform(new Date(date), "yyyy/MM/dd")
  }
  const date2 = this.datePipe.transform(new Date(), "yyyy/MM/dd");
  const d1 =  new Date(date1);
  const d2 = new Date(date2);
  if(d1 > d2){
    return false;
  } else if(date1 < date2){
      return false;
  } else{
      return true;
  }
}
disabledInput(date : any) {
  if (date === "" || date === null || date === undefined) { return false; }
  let date1 = "";
  if (date && date instanceof Date) {
    date1 = this.datePipe.transform(date, "yyyy/MM/dd");
  } else {
    date1 = this.datePipe.transform(new Date(date), "yyyy/MM/dd")
  }
  const date2 = this.datePipe.transform(new Date(), "yyyy/MM/dd");
  const d1 =  new Date(date1);
  const d2 = new Date(date2);
  if(d1 > d2){
    return true;
  } else if(date1 < date2){
      return true;
  } else{
      return false;
  }
}
  constructor(
  private service: RecordMarketService,
  private servicePen: PenService,
  private serviceRoom: RoomService,
  public modalService: NgbModal,
  private alertify: AlertifyService,
  private servicePig: PigService,
  private route: ActivatedRoute,
private router: Router,
    public record2PigService: Record2PigService,
  private datePipe: DatePipe,
  private spinner: NgxSpinnerService,
  public translate: TranslateService
) {
  super(translate,environment.apiUrl);
}
pens: any;
pigGuid: string;
estDate: any;
status: string;
searchOptions = { fields: ["name"], operator: "contains", ignoreCase: true };
recordguid: string;
@ViewChild("statusTemplate", { static: true }) public statusTemplate: any;
@ViewChild("estTemplate", { static: true }) public estTemplate: any;
onSelectedEstDateValue(args: any) {
  this.estDate = args;
  this.loadData();
}
onSelectedPenValue(args: any) {
  this.penGuid = args;
  this.loadData();
}
onSelectedPigValue(args: any) {
  this.pigGuid = args;
  this.loadData();
}
ngOnDestroy(): void {
  this.subscription?.unsubscribe();
}
 ngOnInit() {
  this.subscription.add(this.service.currentRecordMarket.subscribe(x=> {
    if (JSON.stringify(x) !== JSON.stringify(this.record2MarketDatasouce )) {
      this.record2MarketDatasouce = x as any;
    }
  }));
    this.toolbarOptions = [
      { text: this.translate.instant('Excelexport'), align: 'Right', id:'grid_excelexport', prefixIcon: 'e-excelexport e-icons'},
      { template: this.odsTemplate, align: 'Right' },
      "Add",
      { text: 'Search', align: 'Left'},
    ];
  // this.Permission(this.route);
  let lang = localStorage.getItem("lang");
  let languages = JSON.parse(localStorage.getItem("languages"));
  // setCulture(lang);
  let load = {
    [lang]: {
      grid: languages["grid"],
      pager: languages["pager"],
        "multi-select": languages["multiselect"]
    },
  };
  this.onParamChange();
  L10n.load(load);
    this.loadConfig();
  this.loadOrderStatus();
  this.loadButtonConfig();
}
onParamChange() {
  this.route.paramMap.subscribe((params: any) => {
    this.saleGuid = params.get('recordguid');
    if (this.saleGuid) {
      this.loadData();
    } else {
      this.loadData();
    }
  })
}
loadPenGuid(recordMarketGuid) {
  this.servicePen
    .getPenByRecord(recordMarketGuid || "", "Record_Market")
    .subscribe((res: any) => {
      this.penGuid = res.penGuid;
      this.loadPig();
      this.getCheckedData();

    });
}
loadRoomGuid() {
  return this.serviceRoom
    .getRoomByRecord(this.model?.guid || "", "Record_Market")
    .toPromise();
}
loadPen() {
  this.servicePen.getPensByFarmGuidAndRoomGuid(localStorage.getItem("farmGuid"), this.roomGuid).subscribe(x=> {
      this.dataPen = x;
    });
}
loadPig() {
  const accessToken = localStorage.getItem("token");
  this.pigData = new DataManager({
    url: `${this.baseUrl}Pig/GetPigsByPen?penGuid=${
      this.penGuid || ""
    }&recordGuid=${this.model?.guid || ""}&type=Record_Market`,
    adaptor: new UrlAdaptor(),
    headers: [{ authorization: `Bearer ${accessToken}` }],
  });
}
onChangeRecordSale(e) {
  if (e.isInteracted) {
    this.saleGuid = e.itemData?.saleGuid;
  }
}
  onChangeMakeOrder(e) {
  if (e.isInteracted) {
    this.roomGuid = e.itemData?.roomGuid;
  }
}
onChangeRoom(e) {
  // this.roomGuid = e.value;
  this.loadPen();
}
onChangePen(e) {
  // this.penGuid = e.itemData?.guid;
  this.loadPig();
}
loadButtonConfig() {
  let query = new Query();
  const accessToken = localStorage.getItem("token");
  let predicate: Predicate = new Predicate("type", "equal", "Record_Market");
      predicate = predicate.and("link", "notequal", null);
  predicate = predicate.and("link", "notequal", "");

  query.where(predicate).sortBy("sort");

  new DataManager({
    url: `${this.baseUrl}SystemConfig/GetDataDropdownlist`,
    adaptor: new UrlAdaptor(),
    headers: [{ authorization: `Bearer ${accessToken}` }],
  })
    .executeQuery(query)
    .then((x: any) => {
      this.configButtonData = x.result;
      console.log(x.result);
    });
}
goToLink(item) {
  try {
    const uri = item.link?.trim() + this.model.guid;
    this.router.navigate([uri]);
    this.modalReference.dismiss();
  } catch (error) {}
}
// life cycle ejs-grid
rowSelected(args) {
  //console.log(args.data);
}
recordClick(args: any) {
  //console.log(args.rowData);
  this.service.changeRecordMarket(args.rowData);
}

onDoubleClick(args: any): void {
  this.setFocus = args.column; // Get the column from Double click event
}
onChangemakeOrderGuidSearch(e) {
    if (e.isInteracted) {
      this.makeOrderGuidSearch = e.value;
        this.loadData();
      }
  }
  onChangeEst(e) {
  if (e.isInteracted) {
    this.loadData();
  }
}
onChangeStatus(e) {
  if (e.isInteracted) {
    this.status = e.value;
    this.loadData();
  }
}
onChange(args, data) {
  data.isDefault = args.checked;
}

actionBegin(args) {}
odsExport() {
  const functionName = this.functionName;
  const printBy = this.printBy;
  const accountName =
    JSON.parse(localStorage.getItem("user"))?.accountName || "N/A";
  const header = {
    headerRows: 3,
    rows: [
      {
        cells: [
          {
            colSpan: 5,
            value: `* ${functionName}`,
            style: {
              fontColor: "#fd7e14",
              fontSize: 18,
              hAlign: "Left",
              bold: true,
            },
          },
        ],
      },
      {
        cells: [
          {
            colSpan: 5,
            value: `* ${this.datePipe.transform(
              new Date(),
              "yyyyMMdd_HHmmss"
            )}`,
            style: {
              fontColor: "#fd7e14",
              fontSize: 18,
              hAlign: "Left",
              bold: true,
            },
          },
        ],
      },
      {
        cells: [
          {
            colSpan: 5,
            value: `* ${printBy} ${accountName}`,
            style: {
              fontColor: "#fd7e14",
              fontSize: 18,
              hAlign: "Left",
              bold: true,
            },
          },
        ],
      },
    ],
  } as any;

  const fileName = `${functionName}_${this.datePipe.transform(
    new Date(),
    "yyyyMMdd_HHmmss"
  )}.ods`;
  const excelExportProperties: ExcelExportProperties = {
    hierarchyExportMode: "All",
    fileName: fileName,
    header: header,
  };

  this.isodsExport = true;

  this.grid.excelExport(excelExportProperties, null, null, true);
}

excelExpComplete(args: ExcelExportCompleteArgs) {
  if (this.isodsExport) {
    const fileName = `${this.functionName}_${this.datePipe.transform(
      new Date(),
      "yyyyMMdd_HHmmss"
    )}.ods`;

    args.promise.then((e: { blobData: Blob }) => {
      const model = {
        functionName: fileName,
        file: e.blobData,
      };
      this.service.downloadODSFile(model).subscribe((res: any) => {
        this.service.downloadBlob(
          res.body,
          fileName,
          "application/vnd.oasis.opendocument.spreadsheet"
        );
      });
    });
  }
}
toolbarClick(args) {
  const functionName = this.functionName;
  const printBy = this.printBy;
  switch (args.item.id) {
    case "grid_excelexport":
      const accountName =
        JSON.parse(localStorage.getItem("user"))?.accountName || "N/A";
      const header = {
        headerRows: 3,
        rows: [
          {
            cells: [
              {
                colSpan: 5,
                value: `* ${functionName}`,
                style: {
                  fontColor: "#fd7e14",
                  fontSize: 18,
                  hAlign: "Left",
                  bold: true,
                },
              },
            ],
          },
          {
            cells: [
              {
                colSpan: 5,
                value: `* ${this.datePipe.transform(
                  new Date(),
                  "yyyyMMdd_HHmmss"
                )}`,
                style: {
                  fontColor: "#fd7e14",
                  fontSize: 18,
                  hAlign: "Left",
                  bold: true,
                },
              },
            ],
          },
          {
            cells: [
              {
                colSpan: 5,
                value: `* ${printBy} ${accountName}`,
                style: {
                  fontColor: "#fd7e14",
                  fontSize: 18,
                  hAlign: "Left",
                  bold: true,
                },
              },
            ],
          },
        ],
      } as any;

      const fileName = `${functionName}_${this.datePipe.transform(
        new Date(),
        "yyyyMMdd_HHmmss"
      )}.xlsx`;
      const excelExportProperties: ExcelExportProperties = {
        hierarchyExportMode: "All",
        fileName: fileName,
        header: header,
      };
      this.grid.excelExport(excelExportProperties);
      break;
    case "grid_add":
      args.cancel = true;
      this.model = {} as any;
      this.openModal(this.templateRef);
      break;
    default:
      break;
  }
}

// end life cycle ejs-grid

// api
getAudit(id) {
  this.service.getAudit(id).subscribe((data) => {
    this.audit = data;
  });
}
loadConfig() {
  let query = new Query();
  query.where("type", "equal", "Record_Market");
  query.where("no", "equal", "insert");

  const accessToken = localStorage.getItem("token");
  new DataManager(
    {
      url: `${this.baseUrl}SystemConfig/GetDataDropdownlist`,
      adaptor: new UrlAdaptor(),
      headers: [{ authorization: `Bearer ${accessToken}` }],
    }).executeQuery(query).then((x: any)=> {
      const configData = x.result;
      const item = configData[0];
      if (item && item.value === '0') {
        this.toolbarOptions = [
          { text: this.translate.instant('Excelexport'), align: 'Right', id:'grid_excelexport', prefixIcon: 'e-excelexport e-icons'},
          { template: this.odsTemplate, align: 'Right' },
          { text: 'Search', align: 'Left'},
          { template: this.makeOrderGuidSearchTemplate, align: 'Left' },
        ];
      } else {
        this.toolbarOptions = [
          { text: this.translate.instant('Excelexport'), align: 'Right', id:'grid_excelexport', prefixIcon: 'e-excelexport e-icons'},
          { template: this.odsTemplate, align: 'Right' },
          "Add",
          { text: 'Search', align: 'Left'},
          { template: this.makeOrderGuidSearchTemplate, align: 'Left' },
        ];
      }
    });
}
loadDataBySaleGuid() {
  this.query = new Query().where("status", "equal", 1);
  if (this.makeOrderGuidSearch) {
    this.query.where("makeOrderGuid", "equal", this.makeOrderGuidSearch);
  }
  if (this.saleGuid) {
    this.query.where("saleGuid", "equal", this.saleGuid);
  }
  const accessToken = localStorage.getItem("token");
  const farmGuid = localStorage.getItem("farmGuid");
  this.data = new DataManager(
    {
      url: `${this.baseUrl}RecordMarket/LoadData?farmGuid=${farmGuid}&lang=${this.globalLang}`,
      adaptor: new UrlAdaptor(),
      headers: [{ authorization: `Bearer ${accessToken}` }],
    },
    this.query.sortByDesc("id")
  );
}
loadData() {
  this.query = new Query().where("status", "equal", 1);
  if (this.makeOrderGuidSearch) {
    this.query.where("makeOrderGuid", "equal", this.makeOrderGuidSearch);
  }
  if (this.saleGuid) {
    this.query.where("saleGuid", "equal", this.saleGuid);
  }
  const accessToken = localStorage.getItem("token");
  const farmGuid = localStorage.getItem("farmGuid");
  this.data = new DataManager(
    {
      url: `${this.baseUrl}RecordMarket/LoadData?farmGuid=${farmGuid}&lang=${this.globalLang}`,
      adaptor: new UrlAdaptor(),
      headers: [{ authorization: `Bearer ${accessToken}` }],
    },
    this.query.sortByDesc("id")
  );
}
getCheckedData() {
  this.servicePig
    .getPigsByPenAndRecord(
      this.penGuid || "",
      this.model?.guid,
      "Record_Market"
    )
    .subscribe((data) => {
      this.checkedData = data;
    });
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
    },
    () => {
      this.alertify.error(this.alert.cancelMessage);
    }
  );
}
ToFormatModel(model: any) {
    for (let key in model) {
      let value = model[key];
      if (value && value instanceof Date) {
        if (key === 'createDate') {
          model[key] = this.datePipe.transform(value, "yyyy/MM/dd HH:mm:ss");
        } else {
          model[key] = this.datePipe.transform(value, "yyyy/MM/dd");
        }
      } else {
        model[key] = value;
      }
    }
    return model;
  }
create() {
  this.alertify.confirm4(
    this.alert.yes_message,
    this.alert.no_message,
    this.alert.createTitle,
    this.alert.createMessage,
    () => {
      const farmGuid = localStorage.getItem("farmGuid");
      if (!farmGuid) {
        this.alertify.warning(this.alert.choose_farm_message, true);
        return;
      }
      this.model.saleGuid = this.saleGuid;
      this.model.makeOrderGuid = this.makeOrderGuid;
      this.model.farmGuid = farmGuid;
      this.model['importData'] = this.record2MarketDatasouce;
      this.service.add(this.ToFormatModel(this.model)).subscribe(
        (res) => {
          if (res.success === true) {
            this.alertify.success(this.alert.created_ok_msg);
            this.loadData();
            this.modalReference.dismiss();
          } else {
            this.alertify.warning(this.alert.system_error_msg);
          }
        },
        (error) => {
          this.alertify.warning(this.alert.system_error_msg);
        }
      );
    },
    () => {
      this.alertify.error(this.alert.cancelMessage);
    }
  );
}

convertDateTime(data) {
  if (data instanceof Date) {
    return this.datePipe.transform(data as Date, "yyyy-MM-dd");
  }
  return data;
}
update(callBack) {
  this.alertify.confirm4(
    this.alert.yes_message,
    this.alert.no_message,
    this.alert.updateTitle,
    this.alert.updateMessage,
    () => {
      callBack()
      this.model['importData'] = this.record2MarketDatasouce;
      this.service.update(this.ToFormatModel(this.model)).subscribe(
        (res) => {
          if (res.success === true) {
            this.alertify.success(this.alert.updated_ok_msg);
            this.loadData();
            this.modalReference.dismiss();
          } else {
            this.alertify.warning(this.alert.system_error_msg);
          }
        },
        (error) => {
          this.alertify.warning(this.alert.system_error_msg);
        }
      );
    },
    () => {
      this.alertify.error(this.alert.cancelMessage);
    }
  );
}
done() {
    const params = {
      type: 'Record_Market',
      recordGuid: this.model.guid,
      recordValue: this.recordValue
    }
    this.record2PigService.updateWeight(params).subscribe(
      (res) => {
        if (res.success === true) {
          this.alertify.success(this.alert.updated_ok_msg);
        } else {
          this.alertify.warning(this.alert.system_error_msg);
        }
      },
      (error) => {
        this.alertify.warning(this.alert.system_error_msg);
      }
    );
  }
  // end api
NO(index) {
  return (
    (this.grid.pageSettings.currentPage - 1) *
      this.grid.pageSettings.pageSize +
    Number(index) +
    1
  );
}
onChangeChecked(e, data) {
  let checked = e.checked;
  if (checked) {
    this.checkedData.push(data.guid);
  } else {
    this.checkedData = this.checkedData.filter((pig) => pig !== data.guid);
  }
  console.log(this.checkedData);
}
save() {
  if (this.model.id > 0) {
    this.update(()=>{});
  } else {
    this.create();
  }
}


  async openModal(template, data = {} as any) {
  this.roomGuid = "";
  this.penGuid = "";
  this.checkedData = [];
  this.pigData = [];
  if (data?.id > 0) {
    this.model = { ...data };
this.getAudit(this.model.id);
    this.title = "RECORD_MARKET_EDIT_MODAL";
  } else {
    this.model.id = 0;
    this.model.makeOrderGuid = '';
    this.model.status = this.statusConts.Default;
    this.model.saleGuid = this.saleGuid;
    this.service.changeRecordMarket([]);
    this.title = "RECORD_MARKET_ADD_MODAL";
  }
  this.modalReference = this.modalService.open(template, {
    size: "xxl",
    backdrop: "static",
  });
}


rowDataBoundApplyOrder(args){
  if(args.data.status === 2){
    args.row.classList.add('status-2');
  }
  if(args.data.status === 4){
    args.row.classList.add('status-4');
  }
  if(args.data.status === 5){
    args.row.classList.add('status-5');
  }
}
loadOrderStatus() {
  new DataManager({
    url: `${this.baseUrl}CodeType/GetDataDropdownlist?lang=${localStorage.getItem('lang')}&codeType=Order_Status`,
    adaptor: new UrlAdaptor,
    crossDomain: true,
  })
  .executeQuery(new Query()
  .skip(this.skip)
  .take(this.take)
  .addParams("lang", localStorage.getItem('lang')))
  .then((data: any)=> {
    this.orderStatus = data.result.filter(x=> x.guid != "");;
  });
}
onCheckedChangeOrderStatus(e, data) {
  if (e.checked) {
    if (data.guid) {
      this.orderStatusCheckedData.push(+data.guid);
    }
  } else {
    if (data.guid) {
      this.orderStatusCheckedData = [...this.orderStatusCheckedData.filter(x=> x !== +data.guid)];
     }
  }
  this.loadData();
}

open() { 
    this.query = new Query().where("status", "equal", 1);
    if (this.makeOrderGuid) {
      this.query.where("makeOrderGuid", "equal", this.makeOrderGuid);
    }
    if (this.saleGuid) {
      this.query.where("saleGuid", "equal", this.saleGuid);
    }
    const accessToken = localStorage.getItem("token");
    const farmGuid = localStorage.getItem("farmGuid");
    new DataManager(
      {
        url: `${this.baseUrl}RecordMarket/LoadData?farmGuid=${farmGuid}&lang=${this.globalLang}`,
        adaptor: new UrlAdaptor(),
        headers: [{ authorization: `Bearer ${accessToken}` }],
      }
    ).executeQuery(this.query).then( (res: any)=> {
      const result = res.result.result || [];
      const data = result[0];
        this.roomGuid = "";
        this.penGuid = "";
        this.checkedData = [];
        this.pigData = [];
        if (data?.id > 0) {
          this.model = { ...data };
      this.getAudit(this.model.id);
          this.title = "RECORD_MARKET_EDIT_MODAL";
        } else {
          this.model = {} as RecordMarket;
          this.model.id = 0;
          this.model.makeOrderGuid = '';
          this.model.status = this.statusConts.Default;
          this.model.saleGuid = this.saleGuid;
          this.service.changeRecordMarket([]);
          this.title = "RECORD_MARKET_ADD_MODAL";
        }
        this.modalReference =  this.modalService.open(this.templateRef, {
          size: "xl",
          backdrop: "static",
        }); 
      

    });
  }

}
  
