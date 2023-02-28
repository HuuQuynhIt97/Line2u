import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EditService, CommandColumnService, GridComponent } from '@syncfusion/ej2-angular-grids';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Breeding2SowIn } from '../../../config';

@Component({
  selector: 'app-sow-pregnancy-test-breeding2-sowin',
  templateUrl: './sow-pregnancy-test-breeding2-sowin.component.html',
  styleUrls: ['./sow-pregnancy-test-breeding2-sowin.component.scss'],
  providers: [EditService, CommandColumnService ]
})
export class SowPregnancyTestBreeding2SowinComponent 
implements OnInit, AfterViewInit, OnDestroy
{
@Input() dataSource: any = [];
@Input() penGuid: any;
@Input() roomGuid: any;

@Input() disabledBreedingStatus = false;
@Input() visibleCommands = false;
searchOptions = { fields: ["name"], operator: "contains", ignoreCase: true };
@ViewChild("grid") public grid: GridComponent;

pageSettings: any;

@Input() valueLabel = "";
editSettingsPig = {
  showDeleteConfirmDialog: false,
  allowEditing: true,
  allowAdding: true,
  allowDeleting: true,
  mode: "Normal",
};

index: any;
subscription: Subscription = new Subscription();
numbericEdit = { params: { decimals: 0, min: 0 } };
model: Breeding2SowIn = {} as Breeding2SowIn;

commands = [{ type: 'Delete', buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' } }];
constructor(
  private trans: TranslateService,
  private cd: ChangeDetectorRef,
  private datePipe: DatePipe,
  private spinner: NgxSpinnerService,
) {
  let user = JSON.parse(localStorage.getItem("user"));
  let pageSize = Number(user?.pageSizeSettingValue) || 10;
  let pageSizesTemp = user?.pageSizeSettingList || ["5", "10", "12", "20"];
  let pageSizes = pageSizesTemp.map((x) => +x);
  this.pageSettings = {
    pageSizes: pageSizes,
    enableQueryString: true,
    pageSize: pageSize,
    currentPage: 1,
    enableScroll: true,
  };
}
ngOnDestroy(): void {
  this.subscription.unsubscribe();
}
ngAfterViewInit(): void {
  let buttons = document.getElementsByClassName("btn");
  for (let button of Array.from(buttons)) {
    button.addEventListener("click", () => {
      this.grid?.endEdit();
    });
  }
}
ngOnChanges(changes: SimpleChanges): void {}
created() {}
ngOnInit() {}
dataBound() {}
private findIndexByData(data) {
  const index = this.dataSource.findIndex(
    (obj) => obj.sowGuid === data.sowGuid
  );
  return index;
}
onChangeSowGuid(e, data) {
  if (e.isInteracted) {
    data.sowGuid = e.itemData?.guid;
    data.sowGuidName = e.itemData?.name;
    this.model['sowGuid'] = e.itemData?.guid;
    this.model['sowGuidName'] = e.itemData?.name;
    let sowGuidIndex = this.findIndexByData(data);
    if (sowGuidIndex !== -1) {
      this.dataSource[sowGuidIndex].sowGuid = e.itemData?.guid;
      this.dataSource[sowGuidIndex].sowGuidName = e.itemData?.name;
      
    }
  }
}

onChangePenGuid(e, data) {
  if (e.isInteracted) {
    data.penGuid = e.itemData?.guid;
    data.penGuidName = e.itemData?.name;
    this.model['penGuid'] = e.itemData?.guid;
    this.model['penGuidName'] = e.itemData?.name;
    let penGuidIndex = this.findIndexByData(data);
    if (penGuidIndex !== -1) {
      this.dataSource[penGuidIndex].penGuid = e.itemData?.guid;
      this.dataSource[penGuidIndex].penGuidName = e.itemData?.name;
      
    }
  }
}

onChangeTestResult(e, data) {
  if (e.isInteracted) {
    data.testResult = e.itemData?.guid;
    data.testResultName = e.itemData?.name;
    this.model['testResult'] = e.itemData?.guid;
    this.model['testResultName'] = e.itemData?.name;
    let testResultIndex = this.findIndexByData(data);
    if (testResultIndex !== -1) {
      this.dataSource[testResultIndex].testResult =
        e.itemData?.guid;
      this.dataSource[testResultIndex].testResultName =
        e.itemData?.name;
      
    }
  }
}

actionComplete(e) {

}
actionBeginPig(e) {
  if (e.requestType === "beginEdit" || e.requestType === "add") {
    this.model = Object.assign({}, e.rowData);
   
  }
  if (e.action === "edit" && e.requestType === "save") {
    this.updateData(e);
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
private updateData(e) {
  this.model.parity = e.data.parity
  e.data = {...this.model}
  this.convertDateToString(e.data)
  const index = e.rowIndex;
  if (index !== -1) {
    this.dataSource[index] = {...e.data}
    this.convertDateToString(this.dataSource[index])
  }
}
convertDateToString(model: any) {
  for (let key in model) {
    let value = model[key];
    if (value && value instanceof Date) {
      model[key] = this.datePipe.transform(value, "yyyy-MM-dd");
    } else {
      model[key] = value;
    }
  }
  return model;
}
}
