import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BaseComponent } from "herr-core";
import { Record2Market } from "src/app/_core/_model/apply-orders";
import { L10n, setCulture } from "@syncfusion/ej2-base";
import { DatePipe } from "@angular/common";
import {
  RecordMarketService,
} from "src/app/_core/_service/apply-orders";

import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { AlertifyService } from "src/app/_core/_service/alertify.service";
import { environment } from 'src/environments/environment';

@Component({
  selector: "app-record2-market",
  templateUrl: "./record2-market.component.html",
  styleUrls: ["./record2-market.component.scss"],
})
export class Record2MarketComponent
  extends BaseComponent
  implements OnInit, OnChanges
{
  @Input() recordGuid: any;
  @Input() pigs: any = [];
  @Input() dataSource: Record2Market[] = [] as Record2Market[];
  @Input() dataSourceChange = new EventEmitter();
  @ViewChild("file")
  fileInputVariable: ElementRef;
  @ViewChild(GridComponent) public grid: GridComponent;
  record2MarketItem: Record2Market = {} as Record2Market;
  enabledLoad = false;
  editSettings = {
    showDeleteConfirmDialog: false,
    allowEditing: false,
    allowAdding: false,
    allowDeleting: true,
    mode: "Normal",
  };
  numbericEdit = { params: { decimals: 0, min: 0 } };
  numbericPriceEdit = { params: { decimals: 0, min: 0 } };
  avgWeight: any;
  totalPig: any;
  totalWeight: any;
  commands = [
    {
      type: "Delete",
      buttonOption: {
        iconCss: "e-icons e-delete",
        cssClass: "e-flat delete-grid",
      },
    },
  ];
  locale = localStorage.getItem("lang");
  file: any;

  constructor(
    public translate: TranslateService,
    public service: RecordMarketService,
    public alertify: AlertifyService,
    public datePipe: DatePipe
  ) {
    super(translate,environment.apiUrl);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["recordGuid"] && changes.recordGuid.currentValue) {
      this.loadData();
    }
  }
  excelExportRecordSale() {
    const fileName = `record2market_${this.datePipe.transform(
      new Date(),
      "yyyyMMdd_HHmmss"
    )}.xlsx`;

    this.service.excelExportRecordSale({pigs:this.pigs}).subscribe((res: any) => {
      this.service.downloadBlob(
        res.body,
        fileName,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    });
  }
  downloadfile() {
    const fileName = `record2market_${this.datePipe.transform(
      new Date(),
      "yyyyMMdd_HHmmss"
    )}.xlsx`;

    this.service.downloadExcelFile(this.recordGuid).subscribe((res: any) => {
      this.service.downloadBlob(
        res.body,
        fileName,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    });
  }
  ngOnInit(): void {
    let lang = localStorage.getItem("lang");
    let languages = JSON.parse(localStorage.getItem("languages"));
    // setCulture(lang);
    let load = {
      [lang]: {
        grid: languages["grid"],
        pager: languages["pager"],
        "multi-select": languages["multiselect"],
      },
    };
    L10n.load(load);
    if (this.recordGuid) {
      this.loadData();
    }
  }
  selectedValueName(e) {
    this.record2MarketItem["penName"] = e;
  }
  actionBegin(e) {
    if (e.requestType === "delete") {
    }

    if (e.requestType === "beginEdit" || e.requestType === "add") {
      // this.record2MarketItem = Object.assign({}, e.rowData);
      // if (e.requestType === "add") {
      //   e.rowData.birthDay = this.convertDateToString(new Date());
      //   e.data.birthDay = this.convertDateToString(new Date());
      // }
    }

    if (e.requestType === "save") {
      // e.data["sexName"] = this.record2MarketItem["sexName"];
      // e.data["sex"] = this.record2MarketItem["sex"];
      // e.data["penName"] = this.record2MarketItem["penName"];
      // e.data["penGuid"] = this.record2MarketItem["penGuid"];
      // e.data["recordNextName"] = this.record2MarketItem["recordNextName"];
      // e.data["recordNext"] = this.record2MarketItem["recordNext"];
      // e.data["birthDay"] = this.convertDateToString(
      //   this.record2MarketItem["birthDay"]
      // );
      // e.data["type"] = "Record2Market";
      // e.data["id"] = e.data["id"] || Math.random() * -1;
      // e.data["recordGuid"] = this.recordGuid || null;
      // this.update(e);
    }
  }
  actionComplete(e) {
    this.service.changeRecordMarket(this.dataSource);
    this.dataSource = this.dataSource || []
    if (this.dataSource.length > 0) {
      let length = this.dataSource.length;
      const average = this.dataSource.map(x=> x.weight).reduce((a, b) => a +  b, 0) / length;
      const totalWeight = this.dataSource.map(x=> x.weight).reduce((a, b) => a +  b, 0);
      this.avgWeight = average || 0;
      this.totalWeight = totalWeight || 0;
      this.totalPig = this.dataSource.filter(x=> x.pigNo !== null || x.pigNo !== "" || x.pigNo !== undefined).length;
    } else {
      this.avgWeight = null
      this.totalWeight = null
      this.totalPig = null
    }
  }
  update(e) {
    if (this.dataSource) {
      const index = this.dataSource.findIndex((x) => x.id === e.data["id"]);
      if (index !== -1) {
        this.dataSource[index] = { ...e.data };
      }
      this.grid.refresh();
    }
  }
  delete(data) {}
  convertDateToString(date) {
    if (date === undefined || date === null || date === "") return null;
    if (date instanceof Date) {
      return this.datePipe.transform(date, "yyyy/MM/dd");
    }
    return date;
  }
  selectedRecordNextValueName(e) {
    this.record2MarketItem["recordNextName"] = e;
  }
  selectedSexValueName(e) {
    this.record2MarketItem["sexName"] = e;
  }
  import() {
    if (this.file == null) {
      this.alertify.error(this.translate.instant("Please choose a file!"));
      return;
    }
    this.service.import(this.file, this.recordGuid).subscribe(
      (res: any) => {
        this.dataSource = res;
        this.service.changeRecordMarket(res);
        this.alertify.success(
          this.translate.instant("The excel has been imported into system!")
        );
        this.reset();
      },
      () => {
        this.reset();
      }
    );
  }
  loadData() {
    this.service.getDataImportExcel(this.recordGuid).subscribe(
      (res: any) => {
        this.dataSource = res;
        this.dataSourceChange.emit(res);
        this.service.changeRecordMarket(res);
      },
      () => {}
    );
  }
  deleteImportExcel() {
    this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.deleteTitle,
      this.alert.deleteMessage,
      () => {
        if (
          this.recordGuid == null ||
          this.recordGuid == undefined ||
          this.recordGuid == ""
        ) {
          this.recordGuid = null;
          this.dataSource = [];
          this.grid.refresh();
        } else {
          this.service.deleteImportExcel(this.recordGuid).subscribe(
            (res: any) => {
             this.loadData();
             this.grid.refresh();
            },
            () => {
              this.dataSource = [] as Record2Market[]
              this.service.changeRecordMarket(true);
              this.dataSourceChange.emit([] as Record2Market[]);
              this.grid.refresh();
            }
          );
        }
      },
      () => {
        this.alertify.error(this.alert.cancelMessage);
      }
    );
  }
  onChangeFile(e) {
    this.file = e.target.files[0];
  }
  reset() {
    this.file = null;
    this.fileInputVariable.nativeElement.value = "";
  }
  dataBound() {
    this.grid.autoFitColumns()
  }
  round(value) {
   return Math.round(value)
  }
}
