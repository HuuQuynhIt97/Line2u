import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BaseComponent } from "herr-core";
import { Record2PigIn } from "src/app/_core/_model/apply-orders";
import { L10n, setCulture } from "@syncfusion/ej2-base";
import { DatePipe } from "@angular/common";
import { Record2PigInService } from "src/app/_core/_service/apply-orders";
import { environment } from 'src/environments/environment';
import {
  DataManager,
  Query,
  UrlAdaptor,
  Predicate,
} from "@syncfusion/ej2-data";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { Subscription } from "rxjs";

@Component({
  selector: "app-record-2pigin",
  templateUrl: "./record-2pigin.component.html",
  styleUrls: ["./record-2pigin.component.scss"],
})
export class Record2PiginComponent
  extends BaseComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() recordGuid: any;
  @Input() roomGuid: any;
  @Input() realQty: any;
  @Input() realTotalWeight: any;
  @Input() dataSource: Record2PigIn[] = [] as Record2PigIn[];
  @Input() dataSourceChange = new EventEmitter();
  @Input() realQtyChange = new EventEmitter();
  @Input() realTotalWeightChange = new EventEmitter();
  @ViewChild(GridComponent) public grid: GridComponent;
  record2pigInItem: Record2PigIn = {} as Record2PigIn;
  enabledLoad = false;
  editSettings = {
    showDeleteConfirmDialog: false,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: "Normal",
  };
  numbericEdit = { params: { decimals: 3, min: 0 } };
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
  subscriptions = new Array<Subscription>();
  constructor(
    public translate: TranslateService,
    public service: Record2PigInService,
    public datePipe: DatePipe
  ) {
    super(translate,environment.apiUrl);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribeAll();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["roomGuid"] && changes.roomGuid.currentValue) {
      this.enabledLoad = true;
    }
  }
  ngOnInit(): void {
    if (this.recordGuid) {
      new DataManager({
        url: `${this.baseUrl}Record2PigIn/LoadData`,
        adaptor: new UrlAdaptor(),
        crossDomain: true,
      })
        .executeQuery(
          new Query().where("recordGuid", "equal", this.recordGuid || "")
        )
        .then((data: any) => {
          this.dataSource = data.result || ([] as Record2PigIn[]);
          this.dataSourceChange.emit(this.dataSource);
          this.service.changeRecord2PigIn(this.dataSource);
          this.sum();
        });
    }
    this.subscriptions.push(
      this.service.endEditCurrent.subscribe((x) => {
        if (x == true) {
          this.grid.endEdit();
        }
      })
    );
  }
  selectedValueName(e) {
    this.record2pigInItem["penName"] = e;
  }
  actionBegin(e) {
    if (e.requestType === "beginEdit" || e.requestType === "add") {
      this.record2pigInItem = Object.assign({}, e.rowData);
      if (e.requestType === "add") {
        e.rowData.birthDay = this.convertDateToString(new Date());
        e.data.birthDay = this.convertDateToString(new Date());
        this.record2pigInItem.birthDay = this.convertDateToString(new Date());
      }
    }

    if (e.requestType === "save") {
      e.data["sexName"] = this.record2pigInItem["sexName"];
      e.data["sex"] = this.record2pigInItem["sex"];
      e.data["penName"] = this.record2pigInItem["penName"];
      e.data["penGuid"] = this.record2pigInItem["penGuid"];
      e.data["recordNextName"] = this.record2pigInItem["recordNextName"];
      e.data["recordNext"] = this.record2pigInItem["recordNext"];
      e.data["birthDay"] = this.convertDateToString(
        this.record2pigInItem["birthDay"]
      );
      e.data["type"] = "Record2PigIn";
      e.data["id"] = e.data["id"] || Math.random() * -1;
      e.data["recordGuid"] = this.recordGuid || null;
      this.update(e);
    }
  }
  actionComplete(e) {
    if (e.rows) {
      this.service.changeRecord2PigIn(this.dataSource);
      this.sum();
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
    this.record2pigInItem["recordNextName"] = e;
  }
  selectedSexValueName(e) {
    this.record2pigInItem["sexName"] = e;
  }
  sum() {
    const sum1 = this.total(this.dataSource.map((x) => x.recordQty));
    const sum2 = this.total(this.dataSource.map((x) => x.recordWeight));
    this.realQty = sum1;
    this.realTotalWeight = sum2;
    this.realQtyChange.emit(sum1);
    this.realTotalWeightChange.emit(sum2);
    this.service.realQtyChange(sum1);
    this.service.realTotalWeightChange(sum2);
  }

  total = (nums) => {
    if ((nums as []).length > 0) {
      return nums.reduce((a, b) => a + b);
    }
    return 0;
  };
}
