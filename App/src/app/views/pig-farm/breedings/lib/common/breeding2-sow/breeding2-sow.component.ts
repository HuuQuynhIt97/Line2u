import {
  Component,
  Input,
  OnInit,
  ViewChild,
  SimpleChanges,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  EditService,
  GridComponent
} from "@syncfusion/ej2-angular-grids";
import { Subscription } from "rxjs";
import { DatePipe } from "@angular/common";
import { Breeding2Sow } from "../../../config";

@Component({
  selector: "pigfarm-breeding2-sow",
  templateUrl: "./breeding2-sow.component.html",
  styleUrls: ["./breeding2-sow.component.scss"],
  providers: [EditService, DatePipe],
})
export class Breeding2SowComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() tableName: any;
  @Input() breedingGuid: any;
  @Input() visibleLevel = false;
  @Input() visibleHeatingResult = false;
  @Input() visibleHeatingPush = false;
  @Input() visibleHeatingWay = false;
  @Input() visibleMatingDate = false;
  @Input() visibleMatingAccount = false;
  @Input() visibleSemenGuid = false;
  @Input() visibleTestResult = false;
  @Input() visibleBeforePenGuid = false;
  @Input() visibleAfterPenGuid = false;
  @Input() visibleSucklingGuid = false;
  @Input() visibleSucklingStatus = false;
  @Input() visibleSowFosterGuid = false;
  @Input() visibleFosterPenGuid = false;
  @Input() visibleQtyCulling = false;
  @Input() visibleCullingReason = false;
  @Input() visibleSowGuid = true;
  @Input() allowEditingSowGuid = false;
  
  @Input() visibleAbortionReason = false;
  @Input() visibleAbortionParity = false;
  @Input() visibleAbortionLastStatus = false;
  @Input() visibleNextRoom = false;
  @Input() visibleNextPen = false;
  @Input() visibleAbortiionDate = false;
  
  @Input() roomGuid = "";

  @Input() dataSource: any = [];
  searchOptions = { fields: ["name"], operator: "contains", ignoreCase: true };
  @ViewChild("grid") public grid: GridComponent;
  locale = localStorage.getItem("lang");
  model: Breeding2Sow = {} as Breeding2Sow;

  pageSettings: any;
  selectedIndexes: number[] = [];
  justNowUpdatedId = 0;
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

  constructor(
    private trans: TranslateService,
    private cd: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {
    let user = JSON.parse(localStorage.getItem("user"));
    let pageSize = Number(user?.pageSizeSettingValue) || 10;
    let pageSizesTemp = user?.pageSizeSettingList || ["5", "10", "12", "20"];
    let pageSizes = pageSizesTemp.map((x) => +x);
    this.pageSettings = {
      pageSizes: pageSizes,
      enableQueryString: false,
      pageSize: pageSize,
      currentPage: 1,
      enableScroll: false,
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
    console.log(this.dataSource)
  }
  created() {}
  ngOnInit() {}
  private findIndexByData(data) {
    const index = this.dataSource.findIndex(
      (obj) => obj.sowGuid === data.sowGuid
    );
    return index;
  }

  onChangeLevel(e, data) {
    if (e.isInteracted) {
      data.level = e.itemData?.guid;
      data.levelName = e.itemData?.name;
      this.model["level"] = e.itemData?.guid;
      this.model["levelName"] = e.itemData?.name;

      let levelIndex = this.findIndexByData(data);
      if (levelIndex !== -1) {
        this.dataSource[levelIndex].level = e.itemData?.guid;
        this.dataSource[levelIndex].levelName = e.itemData?.name;
      }
    }
  }
  onChangeHeatingResult(e, data) {
    if (e.isInteracted) {
      data.heatingResult = e.itemData?.guid;
      data.heatingResultName = e.itemData?.name;

      this.model["heatingResult"] = e.itemData?.guid;
      this.model["heatingResultName"] = e.itemData?.name;
      let heatingResultIndex = this.findIndexByData(data);
      if (heatingResultIndex !== -1) {
        this.dataSource[heatingResultIndex].heatingResult = e.itemData?.guid;
        this.dataSource[heatingResultIndex].heatingResultName =
          e.itemData?.name;
        if (this.tableName === "Sow_Heating") {
          this.dataSource[heatingResultIndex]["enabledRoomPen"] =
            e.value === "1" ? true : false;
        }
      }
    }
  }

  onChangeMatingAccount(e, data) {
    if (e.isInteracted) {
      data.matingAccount = e.itemData?.guid;
      data.matingAccountName = e.itemData?.name;
      this.model["matingAccount"] = e.itemData?.guid;
      this.model["matingAccountName"] = e.itemData?.name;
      let matingAccountIndex = this.findIndexByData(data);
      if (matingAccountIndex !== -1) {
        this.dataSource[matingAccountIndex].matingAccount = e.itemData?.guid;
        this.dataSource[matingAccountIndex].matingAccountName =
          e.itemData?.name;
      }
    }
  }

  onChangeSemenGuid(e, data) {
    if (e.isInteracted) {
      data.semenGuid = e.itemData?.guid;
      data.semenGuidName = e.itemData?.name;
      this.model["semenGuid"] = e.itemData?.guid;
      this.model["semenGuidName"] = e.itemData?.name;
      let semenGuidIndex = this.findIndexByData(data);
      if (semenGuidIndex !== -1) {
        this.dataSource[semenGuidIndex].semenGuid = e.itemData?.guid;
        this.dataSource[semenGuidIndex].semenGuidName = e.itemData?.name;
      }
    }
  }

  onChangeTestResult(e, data) {
    if (e.isInteracted) {
      data.testResult = e.itemData?.guid;
      data.testResultName = e.itemData?.name;

      this.model["testResult"] = e.itemData?.guid;
      this.model["testResultName"] = e.itemData?.name;
      let testResultIndex = this.findIndexByData(data);
      if (testResultIndex !== -1) {
        this.dataSource[testResultIndex].testResult = e.itemData?.guid;
        this.dataSource[testResultIndex].testResultName = e.itemData?.name;
        if (this.tableName === "Sow_PregnancyTest") {
          this.dataSource[testResultIndex]["enabledRoomPen"] =
            e.value === "1" ? true : false;
        }
      }
    }
  }

  onChangeAfterPen(e, data) {
    if (e.isInteracted) {
      data.afterPenGuid = e.itemData?.guid;
      data.afterPenGuidName = e.itemData?.name;
      this.model["afterPenGuid"] = e.itemData?.guid;
      this.model["afterPenGuidName"] = e.itemData?.name;
      let afterPenIndex = this.findIndexByData(data);
      if (afterPenIndex !== -1) {
        this.dataSource[afterPenIndex].afterPenGuid = e.itemData?.guid;
        this.dataSource[afterPenIndex].afterPenGuidName = e.itemData?.name;
      }
    }
  }

  onChangeBeforePen(e, data) {
    if (e.isInteracted) {
      data.BeforePenGuid = e.itemData?.guid;
      data.BeforePenGuidName = e.itemData?.name;
      this.model["beforePenGuid"] = e.itemData?.guid;
      this.model["BeforePenGuidName"] = e.itemData?.name;
      let beforePenIndex = this.findIndexByData(data);
      if (beforePenIndex !== -1) {
        this.dataSource[beforePenIndex].beforePenGuidGuid = e.itemData?.guid;
        this.dataSource[beforePenIndex].beforePenGuidName = e.itemData?.name;
      }
    }
  }

  onChangeSuckling(e, data) {
    if (e.isInteracted) {
      data.sucklingGuid = e.itemData?.guid;
      data.sucklingGuidName = e.itemData?.name;
      this.model["sucklingGuid"] = e.itemData?.guid;
      this.model["sucklingGuidName"] = e.itemData?.name;
      let sucklingGuidIndex = this.findIndexByData(data);
      if (sucklingGuidIndex !== -1) {
        this.dataSource[sucklingGuidIndex].sucklingGuid = e.itemData?.guid;
        this.dataSource[sucklingGuidIndex].sucklingGuidName = e.itemData?.name;
      }
    }
  }

  onChangeSucklingStatus(e, data) {
    if (e.isInteracted) {
      data.sucklingStatus = e.itemData?.guid;
      data.sucklingStatusName = e.itemData?.name;
      this.model["sucklingStatus"] = e.itemData?.guid;
      this.model["sucklingStatusName"] = e.itemData?.name;
      let sucklingStatusIndex = this.findIndexByData(data);
      if (sucklingStatusIndex !== -1) {
        this.dataSource[sucklingStatusIndex].sucklingStatus = e.itemData?.guid;
        this.dataSource[sucklingStatusIndex].sucklingStatusName =
          e.itemData?.name;
      }
    }
  }
  onChangeSowFosterGuid(e, data) {
    if (e.isInteracted) {
      data.sowFosterGuid = e.itemData?.guid;
      data.sowFosterGuidName = e.itemData?.name;
      this.model["sowFosterGuid"] = e.itemData?.guid;
      this.model["sowFosterGuidName"] = e.itemData?.name;
      let sowFosterGuidIndex = this.findIndexByData(data);
      if (sowFosterGuidIndex !== -1) {
        this.dataSource[sowFosterGuidIndex].sowFosterGuid = e.itemData?.guid;
        this.dataSource[sowFosterGuidIndex].sowFosterGuidName =
          e.itemData?.name;
      }
    }
  }

  onChangeFosterPenGuid(e, data) {
    if (e.isInteracted) {
      data.fosterPenGuid = e.itemData?.guid;
      data.fosterPenGuidName = e.itemData?.name;
      this.model["fosterPenGuid"] = e.itemData?.guid;
      this.model["fosterPenGuidName"] = e.itemData?.name;
      let fosterPenGuidIndex = this.findIndexByData(data);
      if (fosterPenGuidIndex !== -1) {
        this.dataSource[fosterPenGuidIndex].fosterPenGuid = e.itemData?.guid;
        this.dataSource[fosterPenGuidIndex].fosterPenGuidName =
          e.itemData?.name;
      }
    }
  }

  onChangeAbortionReason(e, data) {
    if (e.isInteracted) {
      data.abortionReason = e.itemData?.guid;
      data.abortionReasonName = e.itemData?.name;
      this.model["abortionReason"] = e.itemData?.guid;
      this.model["abortionReasonName"] = e.itemData?.name;
      let abortionReasonIndex = this.findIndexByData(data);
      if (abortionReasonIndex !== -1) {
        this.dataSource[abortionReasonIndex].abortionReason = e.itemData?.guid;
        this.dataSource[abortionReasonIndex].abortionReasonName =
          e.itemData?.name;
      }
    }
  }
  onChangeHeatingWay(e, data) {
    if (e.isInteracted) {
      data.heatingWay = e.itemData?.guid;
      data.heatingWayName = e.itemData?.name;
      this.model["heatingWay"] = e.itemData?.guid;
      this.model["heatingWayName"] = e.itemData?.name;
      let heatingWayIndex = this.findIndexByData(data);
      if (heatingWayIndex !== -1) {
        this.dataSource[heatingWayIndex].heatingWay = e.itemData?.guid;
        this.dataSource[heatingWayIndex].heatingWayName = e.itemData?.name;
      }
    }
  }

  onChangeAbortionLastStatus(e, data) {
    if (e.isInteracted) {
      data.abortionLastStatus = e.itemData?.guid;
      data.abortionLastStatusName = e.itemData?.name;

      this.model["abortionLastStatus"] = e.itemData?.guid;
      this.model["abortionLastStatusName"] = e.itemData?.name;

      let abortionLastStatusIndex = this.findIndexByData(data);
      if (abortionLastStatusIndex !== -1) {
        this.dataSource[abortionLastStatusIndex].abortionLastStatus =
          e.itemData?.guid;
        this.dataSource[abortionLastStatusIndex].abortionLastStatusName =
          e.itemData?.name;
      }
    }
  }

  onChangeNextPen(e, data) {
    if (e.isInteracted) {
      data.nextPen = e.itemData?.guid;
      data.nextPenName = e.itemData?.name;
      this.model["nextPen"] = e.itemData?.guid;
      this.model["nextPenName"] = e.itemData?.name;
      let nextPenIndex = this.findIndexByData(data);
      if (nextPenIndex !== -1) {
        this.dataSource[nextPenIndex].nextPen = e.itemData?.guid;
        this.dataSource[nextPenIndex].nextPenName = e.itemData?.name;
      }
    }
  }
  onChangeNextRoom(e, data) {
    if (e.isInteracted) {
      data.nextRoom = e.itemData?.guid;
      data.nextRoomName = e.itemData?.name;
      this.model["nextRoom"] = e.itemData?.guid;
      this.model["nextRoomName"] = e.itemData?.name;
      let nextRoomIndex = this.findIndexByData(data);
      if (nextRoomIndex !== -1) {
        this.dataSource[nextRoomIndex].nextRoom = e.itemData?.guid;
        this.dataSource[nextRoomIndex].nextRoomName = e.itemData?.name;
      }
    }
  }
  actionBeginPig(e) {
    if (e.requestType === "beginEdit" || e.requestType === "add") {
      this.model = Object.assign({}, e.rowData);
    }
    if (e.action === "edit" && e.requestType === "save") {
      this.justNowUpdatedId = e.data.id;
      this.updateData(e);
      for (const item of this.dataSource) {
        if (this.tableName === "Sow_PregnancyTest") {
          item["enabledRoomPen"] = item.testResult === "1" ? true : false;
        }
        if (this.tableName === "Sow_Heating") {
          item["enabledRoomPen"] = item.heatingResult === "1" ? true : false;
        }
      }
      this.grid.refresh();
    }
  }
  private updateData(e) {
    this.model.qtyCulling = e.data.qtyCulling;
    this.model.cullingReason = e.data.cullingReason;
    this.model.abortionParity = e.data.abortionParity;
    this.model["enabledRoomPen"] = e.data.heatingResult == "1" ? true : false;
    e.data = { ...this.model };
    this.convertDateToString(e.data);
    const index = e.rowIndex;
    if (index !== -1) {
      this.dataSource[index] = { ...e.data };
      this.convertDateToString(this.dataSource[index]);
    }
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
  convertDateTime(data) {
    if (data instanceof Date) {
      return this.datePipe.transform(data as Date, "yyyy-MM-dd");
    } else if (data !== null && data !== undefined && data !== "") {
      return this.datePipe.transform(new Date(data) as Date, "yyyy-MM-dd");
    }
    return data;
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
  public rowDataBound(args): void {
    if (args.data["id"] == this.justNowUpdatedId) {
      this.selectedIndexes.push(
        parseInt(args.row.getAttribute("aria-rowindex"))
      );
    }
  }

  public dataBound(args): void {
    if (this.selectedIndexes.length) {
      this.grid.selectRows(this.selectedIndexes);
      this.selectedIndexes = [];
    }
  }
}
