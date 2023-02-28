import { DatePipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  SimpleChanges,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { EditService, GridComponent } from "@syncfusion/ej2-angular-grids";
import { NgxSpinnerService } from "ngx-spinner";
import { Breeding2SowIn } from "../../../config";
import { Subscription } from "rxjs";
import { takeWhile } from "rxjs/operators";
@Component({
  selector: 'app-breeding2-sowin-heating',
  templateUrl: './breeding2-sowin-heating.component.html',
  styleUrls: ['./breeding2-sowin-heating.component.css'],
  providers: [EditService, DatePipe],
})
export class Breeding2SowinHeatingComponent 
implements OnInit, AfterViewInit, OnDestroy
{
@Input() dataSource: any = [];
@Output() dataSourceChange = new EventEmitter();
@Input() penGuid: any;
@Input() selectedPigs: any= [];
@Input() allowEditHetingResult = true;
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
ngOnChanges(changes: SimpleChanges): void {
  if (changes["selectedPigs"] && changes.selectedPigs.currentValue) {
    this.mapingSelectedPigToBreeding2GiltIn();
  }
}
created() {}
ngOnInit() {}
dataBound() {}
mapingSelectedPigToBreeding2GiltIn() {
  if (this.selectedPigs?.length > 0) {
    this.dataSource = this.selectedPigs.map(x=> {
      return {
        sowGuid: x.guid,
        sowGuidName: x.name,
        type: "Sow_Heating"
      } as Breeding2SowIn
    })
    this.dataSourceChange.emit(this.dataSource);

  } 
}
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
onChangeBreedingStatus2(e, data) {
  if (e.isInteracted) {
    data.breedingStatus2 = e.itemData?.guid;
    data.breedingStatus2Name = e.itemData?.name;
    this.model['breedingStatus2'] = e.itemData?.guid;
    this.model['breedingStatus2Name'] = e.itemData?.name;
    let breedingStatus2Index = this.findIndexByData(data);
    if (breedingStatus2Index !== -1) {
      this.dataSource[breedingStatus2Index].breedingStatus2 =
        e.itemData?.guid;
      this.dataSource[breedingStatus2Index].breedingStatus2Name =
        e.itemData?.name;
      
    }
  }
}

onChangeBreedingStatus1(e, data) {
  if (e.isInteracted) {
    data.breedingStatus1 = e.itemData?.guid;
    data.breedingStatus1Name = e.itemData?.name;
    this.model['breedingStatus1'] = e.itemData?.guid;
    this.model['breedingStatus1Name'] = e.itemData?.name;
    let breedingStatus1Index = this.findIndexByData(data);
    if (breedingStatus1Index !== -1) {
      this.dataSource[breedingStatus1Index].breedingStatus1 =
        e.itemData?.guid;
      this.dataSource[breedingStatus1Index].breedingStatus1Name =
        e.itemData?.name;
      
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

onChangeBreedingGuid(e, data) {
  if (e.isInteracted) {
    data.breedingGuid = e.itemData?.guid;
    data.breedingGuidName = e.itemData?.name;
    this.model['breedingGuid'] = e.itemData?.guid;
    this.model['breedingGuidName'] = e.itemData?.name;
    let breedingGuidIndex = this.findIndexByData(data);
    if (breedingGuidIndex !== -1) {
      this.dataSource[breedingGuidIndex].breedingGuid = e.itemData?.guid;
      this.dataSource[breedingGuidIndex].breedingGuidName =
        e.itemData?.name;
      
    }
  }
}
onChangeHeatingResult(e, data) {
  if (e.isInteracted) {
    data.heatingResult = e.itemData?.guid;
    data.heatingResultName = e.itemData?.name;
    this.model['heatingResult'] = e.itemData?.guid;
    this.model['heatingResultName'] = e.itemData?.name;
    let heatingResultIndex = this.findIndexByData(data);
    if (heatingResultIndex !== -1) {
      this.dataSource[heatingResultIndex].heatingResult =
        e.itemData?.guid;
      this.dataSource[heatingResultIndex].heatingResultName =
        e.itemData?.name;
      
    }
  }
}
onChangeLastStatus(e, data) {
  if (e.isInteracted) {
    data.lastStatus = e.itemData?.guid;
    data.lastStatusName = e.itemData?.name;
    this.model['lastStatus'] = e.itemData?.guid;
    this.model['lastStatusName'] = e.itemData?.name;
    let lastStatusIndex = this.findIndexByData(data);
    if (lastStatusIndex !== -1) {
      this.dataSource[lastStatusIndex].lastStatus = e.itemData?.guid;
      this.dataSource[lastStatusIndex].lastStatusName = e.itemData?.name;
      
    }
  }
}
onChangeLastResult(e, data) {
  if (e.isInteracted) {
    data.lastResult = e.itemData?.guid;
    data.lastResultName = e.itemData?.name;
    this.model['lastResult'] = e.itemData?.guid;
    this.model['lastResultName'] = e.itemData?.name;
    let lastResultIndex = this.findIndexByData(data);
    if (lastResultIndex !== -1) {
      this.dataSource[lastResultIndex].lastResult = e.itemData?.guid;
      this.dataSource[lastResultIndex].lastResultName = e.itemData?.name;
      
    }
  }
}
onChangeMatingAccount(e, data) {
  if (e.isInteracted) {
    data.matingAccount = e.itemData?.guid;
    data.matingAccountName = e.itemData?.name;
    this.model['matingAccount'] = e.itemData?.guid;
    this.model['matingAccountName'] = e.itemData?.name;
    let matingAccountIndex = this.findIndexByData(data);
    if (matingAccountIndex !== -1) {
      this.dataSource[matingAccountIndex].matingAccount =
        e.itemData?.guid;
      this.dataSource[matingAccountIndex].matingAccountName =
        e.itemData?.name;
      
    }
  }
}

onChangeSemenGuid(e, data) {
  if (e.isInteracted) {
    data.semenGuid = e.itemData?.guid;
    data.semenGuidName = e.itemData?.name;
    this.model['semenGuid'] = e.itemData?.guid;
    this.model['semenGuidName'] = e.itemData?.name;
    let semenGuidIndex = this.findIndexByData(data);
    if (semenGuidIndex !== -1) {
      this.dataSource[semenGuidIndex].semenGuid = e.itemData?.guid;
      this.dataSource[semenGuidIndex].semenGuidName = e.itemData?.name;
      
    }
  }
}

onChangeBreedingType(e, data) {
  if (e.isInteracted) {
    data.breedingType = e.itemData?.guid;
    data.breedingTypeName = e.itemData?.name;
    this.model['breedingType'] = e.itemData?.guid;
    this.model['breedingTypeName'] = e.itemData?.name;
    let breedingTypeIndex = this.findIndexByData(data);
    if (breedingTypeIndex !== -1) {
      this.dataSource[breedingTypeIndex].breedingType = e.itemData?.guid;
      this.dataSource[breedingTypeIndex].breedingTypeName =
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
    this.dataSourceChange.emit(this.dataSource);

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

