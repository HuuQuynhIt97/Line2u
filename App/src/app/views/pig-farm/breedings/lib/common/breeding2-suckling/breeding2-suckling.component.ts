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
import { Breeding2Suckling } from "../../../config";
import { Subscription } from "rxjs";
import { takeWhile } from "rxjs/operators";
import { Breeding2SucklingService } from "../../../services";
@Component({
  selector: "pigfarm-breeding2-suckling",
  templateUrl: "./breeding2-suckling.component.html",
  styleUrls: ["./breeding2-suckling.component.css"],
  providers: [EditService, DatePipe],
})
export class Breeding2SucklingComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() visibleSucklingCastration = false;
  @Input() visibleSucklingCutEar = false;
  @Input() visibleSucklingWeighing = false;
  @Input() visibleSucklingWeight = false;
  @Input() visibleSucklingCutTeethTail = false;
  @Input() visibleSucklingIronInjection = false;
  @Input() visibleSucklingTeachingSlot = false;
  @Input() visibleSucklingWeaning = false;
  @Input() visibleSucklingMove = false;
  @Input() visibleSucklingNextPen = false;
  @Input() visibleSowGuid = false;
  @Input() visibleSucklingFoster = false;
  @Input() visibleRoomGuid = false;
  @Input() visibleAfterRoomGuid = false;
  @Input() visiblePenGuid = false;
  @Input() visibleSucklingNextArea= false;
  @Input() visibleSucklingNextBarn= false;
  @Input() visibleSucklingNextRoom= false;
  @Input() visibleSucklingNextMakeOrder= false;
  
  @Input() dataSource: any = [];
  @Input() roomGuid: any
  @Input() penGuid: any
  
  @Output() dataSourceChange = new EventEmitter();
  searchOptions = { fields: ["name"], operator: "contains", ignoreCase: true };
  @ViewChild("grid") public grid: GridComponent;
  model: Breeding2Suckling = {} as Breeding2Suckling;

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
  subscriptions = new Array<Subscription>();
  sucklingNextArea: any;
  sucklingNextBarn: any;
  sucklingNextRoom: any;
  sucklingNextPen: any;
  areaGuid: any;
  barnGuid: any;
  nextRoomGuid: any;
  nextBarnGuid: any;
  nextAreaGuid: any;
  SucklingNextMakeOrder: any;
  
  constructor(
    private trans: TranslateService,
    private cd: ChangeDetectorRef,
    private service: Breeding2SucklingService,
    private datePipe: DatePipe
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
    this.subscriptions.unsubscribeAll();
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
  }
  created() {}
  ngOnInit() {
    this.subscriptions.push(
      this.service.endEditCurrent.subscribe((x) => {
        if (x == true) {
          this.grid?.endEdit();
        }
      })
    );
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
      this.model["sowGuid"] = e.itemData?.guid;
      this.model["sowGuidName"] = e.itemData?.name;
      let sowGuidIndex = this.findIndexByData(data);
      if (sowGuidIndex !== -1) {
        this.dataSource[sowGuidIndex].sowGuid = e.itemData?.guid;
        this.dataSource[sowGuidIndex].sowGuidName = e.itemData?.name;
        this.dataSourceChange.emit(this.dataSource)
        this.cd.detectChanges();
      }
    }
  }
  onChangeFarrowGuid(e, data) {
    if (e.isInteracted) {
      data.farrowGuid = e.itemData?.guid;
      data.farrowGuidName = e.itemData?.name;
      this.model["farrowGuid"] = e.itemData?.guid;
      this.model["farrowGuidName"] = e.itemData?.name;
      let farrowGuidIndex = this.findIndexByData(data);
      if (farrowGuidIndex !== -1) {
        this.dataSource[farrowGuidIndex].farrowGuid = e.itemData?.guid;
        this.dataSource[farrowGuidIndex].farrowGuidName = e.itemData?.name;
        this.dataSourceChange.emit(this.dataSource)
        this.cd.detectChanges();
      }
    }
  }

  onChangeSucklingGuid(e, data) {
    if (e.isInteracted) {
      data.sucklingGuid = e.itemData?.guid;
      data.sucklingGuidName = e.itemData?.name;
      this.model["sucklingGuid"] = e.itemData?.guid;
      this.model["sucklingGuidName"] = e.itemData?.name;
      let sucklingGuidIndex = this.findIndexByData(data);
      if (sucklingGuidIndex !== -1) {
        this.dataSource[sucklingGuidIndex].sucklingGuid = e.itemData?.guid;
        this.dataSource[sucklingGuidIndex].sucklingGuidName = e.itemData?.name;
        this.dataSourceChange.emit(this.dataSource)
        this.cd.detectChanges();
      }
    }
  }
  onChangeAfterRoomGuid(e, data) {
    if (e.isInteracted) {
      // this.roomGuid = e.itemData?.guid;
      data.afterRoomGuid = e.itemData?.guid;
      data.afterRoomGuidName = e.itemData?.name;
      this.model["afterRoomGuid"] = e.itemData?.guid;
      this.model["afterRoomGuidName"] = e.itemData?.name;
      let afterRoomGuidIndex = this.findIndexByData(data);
      if (afterRoomGuidIndex !== -1) {
        this.dataSource[afterRoomGuidIndex].afterRoomGuid = e.itemData?.guid;
        this.dataSource[afterRoomGuidIndex].afterRoomGuidName = e.itemData?.name;
        this.dataSourceChange.emit(this.dataSource)
        this.cd.detectChanges();
      }
    }
  }
  onChangeRoomGuid(e, data) {
    if (e.isInteracted) {
      this.roomGuid = e.itemData?.guid;
      data.roomGuid = e.itemData?.guid;
      data.roomGuidName = e.itemData?.name;
      this.model["roomGuid"] = e.itemData?.guid;
      this.model["roomGuidName"] = e.itemData?.name;
      let roomGuidIndex = this.findIndexByData(data);
      if (roomGuidIndex !== -1) {
        this.dataSource[roomGuidIndex].roomGuid = e.itemData?.guid;
        this.dataSource[roomGuidIndex].roomGuidName = e.itemData?.name;
        this.dataSourceChange.emit(this.dataSource)
        console.log(this.dataSource[roomGuidIndex])
        this.cd.detectChanges();
      }
    }
  }
  onChangePenGuid(e, data) {
    if (e.isInteracted) {
      data.penGuid = e.itemData?.guid;
      data.penGuidName = e.itemData?.name;
      this.model["penGuid"] = e.itemData?.guid;
      this.model["penGuidName"] = e.itemData?.name;
      let penGuidIndex = this.findIndexByData(data);
      if (penGuidIndex !== -1) {
        this.dataSource[penGuidIndex].penGuid = e.itemData?.guid;
        this.dataSource[penGuidIndex].penGuidName = e.itemData?.name;
        this.dataSourceChange.emit(this.dataSource)
        this.cd.detectChanges();
      }
    }
  }

  onChangeSucklingNextArea(e, data) {
    this.nextAreaGuid = e.itemData?.guid;
    if (e.isInteracted) {
      this.sucklingNextArea = e.itemData?.guid;
      data.sucklingNextArea = e.itemData?.guid;
      data.sucklingNextAreaName = e.itemData?.name;
      this.model["sucklingNextArea"] = e.itemData?.guid;
      this.model["sucklingNextAreaName"] = e.itemData?.name;
      let sucklingNextAreaIndex = this.findIndexByData(data);
      if (sucklingNextAreaIndex !== -1) {
        this.dataSource[sucklingNextAreaIndex].sucklingNextArea = e.itemData?.guid;
        this.dataSource[sucklingNextAreaIndex].sucklingNextAreaName = e.itemData?.name;
        this.dataSourceChange.emit(this.dataSource)
        this.cd.detectChanges();
      }
    }
  }

  onChangeSucklingNextBarn(e, data) {
    this.nextBarnGuid = e.itemData?.guid;
    if (e.isInteracted) {
      this.sucklingNextBarn = e.itemData?.guid;
      data.sucklingNextBarn = e.itemData?.guid;
      data.sucklingNextBarnName = e.itemData?.name;
      this.model["sucklingNextBarn"] = e.itemData?.guid;
      this.model["sucklingNextBarnName"] = e.itemData?.name;
      let sucklingNextBarnIndex = this.findIndexByData(data);
      if (sucklingNextBarnIndex !== -1) {
        this.dataSource[sucklingNextBarnIndex].sucklingNextBarn = e.itemData?.guid;
        this.dataSource[sucklingNextBarnIndex].sucklingNextBarnName = e.itemData?.name;
        this.dataSourceChange.emit(this.dataSource)
        this.cd.detectChanges();
      }
    }
  }


  onChangeSucklingNextRoom(e, data) {
    this.nextRoomGuid = e.itemData?.guid;
    if (e.isInteracted) {
      this.sucklingNextRoom = e.itemData?.guid;
      data.sucklingNextRoom = e.itemData?.guid;
      data.sucklingNextRoomName = e.itemData?.name;
      this.model["sucklingNextRoom"] = e.itemData?.guid;
      this.model["sucklingNextRoomName"] = e.itemData?.name;
      let sucklingNextRoomIndex = this.findIndexByData(data);
      if (sucklingNextRoomIndex !== -1) {
        this.dataSource[sucklingNextRoomIndex].sucklingNextRoom = e.itemData?.guid;
        this.dataSource[sucklingNextRoomIndex].sucklingNextRoomName = e.itemData?.name;
        this.dataSourceChange.emit(this.dataSource)
        this.cd.detectChanges();
      }
    }
  }
  
  onChangeSucklingNextPen(e, data) {
    if (e.isInteracted) {
      this.sucklingNextPen = e.itemData?.guid;
      data.sucklingNextPen = e.itemData?.guid;
      data.sucklingNextPenName = e.itemData?.name;
      this.model["sucklingNextPen"] = e.itemData?.guid;
      this.model["sucklingNextPenName"] = e.itemData?.name;
      let sucklingNextPenIndex = this.findIndexByData(data);
      if (sucklingNextPenIndex !== -1) {
        this.dataSource[sucklingNextPenIndex].sucklingNextPen = e.itemData?.guid;
        this.dataSource[sucklingNextPenIndex].sucklingNextPenName = e.itemData?.name;
        this.dataSourceChange.emit(this.dataSource)
        this.cd.detectChanges();
      }
    }
  }
  onChangeSucklingNextMakeOrder(e, data) {
    if (e.isInteracted) {
      this.SucklingNextMakeOrder = e.itemData?.guid;
      data.SucklingNextMakeOrder = e.itemData?.guid;
      data.SucklingNextMakeOrderName = e.itemData?.name;
      this.model["sucklingNextMakeOrder"] = e.itemData?.guid;
      this.model["SucklingNextMakeOrderName"] = e.itemData?.name;
      let sucklingNextMakeOrderIndex = this.findIndexByData(data);
      if (sucklingNextMakeOrderIndex !== -1) {
        this.dataSource[sucklingNextMakeOrderIndex].sucklingNextMakeOrder = e.itemData?.guid;
        this.dataSource[sucklingNextMakeOrderIndex].sucklingNextMakeOrderName = e.itemData?.name;
        this.dataSourceChange.emit(this.dataSource)
        this.cd.detectChanges();
      }
    }
  }
  
  actionBeginPig(e) {
    if (e.requestType === "beginEdit" || e.requestType === "add") {
      this.model = Object.assign({}, e.rowData);
      this.model.roomGuid = this.roomGuid
      this.model.penGuid = this.penGuid
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
  private updateData(e) {
    this.model.sucklingEarNo = e.data.sucklingEarNo;
    this.model.sucklingWeight = e.data.sucklingWeight;
    this.model.sucklingAmount = e.data.sucklingAmount;
    this.model.sucklingDisease = e.data.sucklingDisease;
    this.model.sucklingNext = e.data.sucklingNext;
    this.model.sucklingNextPen = e.data.sucklingNextPen;

    // this.model.roomGuid = e.data.roomGuid;
    // this.model.penGuid = e.data.penGuid;

    e.data = { ...this.model };
    this.convertDateToString(e.data);
    const index = e.rowIndex;
    if (index !== -1) {
      this.dataSource[index] = { ...e.data };
      this.convertDateToString(this.dataSource[index]);
      this.dataSourceChange.emit(this.dataSource)
    }
  }
}
