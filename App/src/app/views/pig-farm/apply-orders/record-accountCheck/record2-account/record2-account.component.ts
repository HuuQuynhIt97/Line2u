import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent, AlertifyService } from 'herr-core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { Record2Account } from 'src/app/_core/_model/apply-orders';
import { RecordMarketService } from 'src/app/_core/_service/apply-orders';
import { environment } from 'src/environments/environment';
import { L10n, setCulture } from "@syncfusion/ej2-base";
import { Record2AccountService } from 'src/app/_core/_service/apply-orders/record2-account.service';
import { DataManager, Query, UrlAdaptor, Predicate } from "@syncfusion/ej2-data";

@Component({
  selector: 'app-record2-account',
  templateUrl: './record2-account.component.html',
  styleUrls: ['./record2-account.component.css']
})
export class Record2AccountComponent 
extends BaseComponent
implements OnInit, OnChanges
{
@Input() recordGuid: any;
@Input() pigs: any = [];
@Input() dataSource: Record2Account[] = [] as Record2Account[];
model: Record2Account
@Output() dataSourceChange = new EventEmitter();
@Output() actionCompleteChange = new EventEmitter();
@ViewChild("file")
fileInputVariable: ElementRef;
@ViewChild(GridComponent) public grid: GridComponent;
record2MarketItem: Record2Account = {} as Record2Account;
enabledLoad = false;
editSettings = {
  showDeleteConfirmDialog: false,
  allowEditing: true,
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
  public service: Record2AccountService,
  public alertify: AlertifyService,
  public datePipe: DatePipe,
  public record2AccountService: Record2AccountService,
  
) {
  super(translate,environment.apiUrl);
}
commandClick(e) {
  if (e.commandColumn.type === 'Delete') {
    const data = e.rowData
    const id = data.id;
    if (id > 0) {
      this.record2AccountService.delete(id).subscribe();
    } 
  }
}
convertDateTime(data) {
  if (data instanceof Date) {
    return this.datePipe.transform(data as Date, "yyyy-MM-dd");
  } else if (data !== null && data !== undefined && data !== "") {
    return this.datePipe.transform(new Date(data) as Date, "yyyy-MM-dd");
  }
  return data;
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
checkedChange(e, data) {
  console.log(e, data);
  this.dataSource[data.index].checked = e
  this.grid.refresh();
}
changeDate(e, data) {
  console.log(e, data);
  this.dataSource[data.index].checkedDate = this.convertDateTime(e.value)
  this.grid.refresh();
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
 
  }

  if (e.requestType === "save") {

  }
}
actionComplete(e) {
  this.service.changeRecord2Account(this.dataSource);
  this.dataSource = this.dataSource || []
  this.actionCompleteChange.emit();
 
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
loadData() {
  let query = new Query();
  const accessToken = localStorage.getItem("token");
  let predicate: Predicate = new Predicate("recordGuid", "equal", this.recordGuid);
  query.where(predicate);

  new DataManager({
    url: `${this.baseUrl}Record2Account/LoadData`,
    adaptor: new UrlAdaptor(),
    headers: [{ authorization: `Bearer ${accessToken}` }],
  })
    .executeQuery(query)
    .then((x: any) => {
      this.dataSource = x.result;
      console.log(x.result);
    });
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
