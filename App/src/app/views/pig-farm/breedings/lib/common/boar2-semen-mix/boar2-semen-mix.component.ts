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
import { EditService, GridComponent, InfiniteScrollService } from "@syncfusion/ej2-angular-grids";
import { Subscription } from "rxjs";
import { DatePipe } from "@angular/common";
import { Boar2SemenMix } from "../../../config";

@Component({
  selector: 'app-boar2-semen-mix',
  templateUrl: './boar2-semen-mix.component.html',
  styleUrls: ['./boar2-semen-mix.component.css'],
  providers: [EditService, DatePipe],
})
export class Boar2SemenMixComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() tableName: any;
  @Input() type: any;
  @Input() breedingGuid: any;
  
  @Input() visibleSourceGuid = true;
  @Input() dataSource: any = [];
  searchOptions = { fields: ["name"], operator: "contains", ignoreCase: true };
  @ViewChild("grid") public grid: GridComponent;
  locale = localStorage.getItem("lang");
  model: Boar2SemenMix = {} as Boar2SemenMix;
  numbericEdit = { params: { decimals: 0, min: 0 }};

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

  constructor(private trans: TranslateService, 
    private cd: ChangeDetectorRef,
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
  ngOnInit() {
   
  }
  private findIndexByData(data) {
    const index = this.dataSource.findIndex(
      (obj) => obj.sowGuid === data.sowGuid
    );
    return index;
  }

  onChangeBoarTestingGuid(e, data) {
    if (e.isInteracted) {
      data.sourceGuid = e.itemData?.guid;
      data.sourceGuidName = e.itemData?.name;
      this.model['sourceGuid'] = e.itemData?.guid;
      this.model['sourceGuidName'] = e.itemData?.guid;

      let sourceGuidIndex = this.findIndexByData(data);
      if (sourceGuidIndex !== -1) {
        this.dataSource[sourceGuidIndex].sourceGuid = e.itemData?.guid;
        this.dataSource[sourceGuidIndex].sourceGuidName = e.itemData?.guid;
        
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
      this.grid.refresh();
    }
  }
  private updateData(e) {
    this.model.recordGuid = e.data.recordGuid
    this.model.semenVolume = e.data.semenVolume
    this.model.semenConcentration = e.data.semenConcentration
    this.model.spermMotility = e.data.spermMotility
    this.model.spermColor = e.data.spermColor
    this.model.malformationRate = e.data.malformationRate
    this.model.malformationHead = e.data.malformationHead
    this.model.malformationMiddle = e.data.malformationMiddle
    this.model.malformationTail = e.data.malformationTail
    e.data = {...this.model}
    this.convertDateToString(e.data)
    const index = e.rowIndex;
    if (index !== -1) {
      this.dataSource[index] = {...e.data}
      this.convertDateToString(this.dataSource[index])
      
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
    if ( args.data['id'] == this.justNowUpdatedId) {
      this.selectedIndexes.push(parseInt(args.row.getAttribute('aria-rowindex')));
    }
  }

  public dataBound(args): void {
    if (this.selectedIndexes.length) {
      this.grid.selectRows(this.selectedIndexes);
      this.selectedIndexes = [];
    }
  }
}
