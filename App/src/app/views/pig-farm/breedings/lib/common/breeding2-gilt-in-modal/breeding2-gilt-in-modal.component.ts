import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ɵɵtrustConstantResourceUrl,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BaseComponent } from "herr-core";
import { L10n, setCulture } from "@syncfusion/ej2-base";
import { DatePipe } from "@angular/common";
import {
  DataManager,
  Query,
  UrlAdaptor,
  Predicate,
} from "@syncfusion/ej2-data";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { Subscription } from "rxjs";
import { Breeding2GiltIn } from "../../../config";
import { AlertifyService } from "src/app/_core/_service/alertify.service";
import { Breeding2GiltInService } from "../../../services";
import { environment } from "src/environments/environment";
import { debounce } from "rxjs/operators";

@Component({
  selector: "app-breeding2-gilt-in-modal",
  templateUrl: "./breeding2-gilt-in-modal.component.html",
  styleUrls: ["./breeding2-gilt-in-modal.component.scss"],
})
export class Breeding2GiltInModalComponent
  extends BaseComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() visibledBodyConditionLevel = false;
  @Input() visibledGiltGuid = true;
  @Input() visibledSowBackFat = false;
  @Input() recordGuid: any;
  @Input() model: any;
  @Input() tableName: any;
  @Input() mode: any;
  @Input() realQty: any;
  @Input() realTotalWeight: any;
  @Input() dataSource: Breeding2GiltIn[] = [] as Breeding2GiltIn[];
  @Input() dataSourceChange = new EventEmitter();
  @Input() realQtyChange = new EventEmitter();
  @Input() realTotalWeightChange = new EventEmitter();
  @ViewChild(GridComponent) public grid: GridComponent;
  breeding2GiltInItem: Breeding2GiltIn = {} as Breeding2GiltIn;
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
  index: number;
  constructor(
    public translate: TranslateService,
    public service: Breeding2GiltInService,
    public alertify: AlertifyService,
    public datePipe: DatePipe
  ) {
    super(translate, environment.apiUrl);
  }
  ngAfterViewInit(): void {
    let buttons = document.getElementsByClassName("btn");
    for (let button of Array.from(buttons)) {
      button.addEventListener("click", () => {
        this.grid?.endEdit();
      });
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribeAll();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.tableName == 'Sow_BackFat' && changes["recordGuid"] && changes.recordGuid.currentValue && this.mode == 'Add') {
      this.loadData();
    } else if (this.tableName == 'Sow_BackFat' &&changes["recordGuid"] && changes.recordGuid.currentValue && this.mode == 'Edit') {
      this.loadBreeding2SowBackFatData();
    }

    if (this.tableName == 'Sow_BodyCondition' && changes["recordGuid"] && changes.recordGuid.currentValue && this.mode == 'Add') {
      this.loadData();
    } else if (this.tableName == 'Sow_BodyCondition' &&changes["recordGuid"] && changes.recordGuid.currentValue && this.mode == 'Edit') {
      this.loadBreeding2SowBodyConditionData();
    }
  }
  ngOnInit(): void {
    this.subscriptions.push(
      this.service.endEditCurrent.subscribe((x) => {
        if (x == true) {
          this.grid.endEdit();
        }
      })
    );
  }
  loadData() {
    if (this.recordGuid) {
      new DataManager({
        url: `${
          this.baseUrl
        }Breeding2GiltIn/GetDataDropdownlistByLang?lang=${localStorage.getItem(
          "lang"
        )}`,
        adaptor: new UrlAdaptor(),
        crossDomain: true,
      })
        .executeQuery(
          new Query().where("makeOrderGuid", "equal", this.recordGuid || "")
        )
        .then((data: any) => {
          this.dataSource = data.result || ([] as Breeding2GiltIn[]);
          this.dataSourceChange.emit(this.dataSource);
          this.service.changeBreeding2GiltIn(this.dataSource);
        });
    }
  }
  loadBreeding2SowBodyConditionData() {
    if (this.recordGuid) {
      new DataManager({
        url: `${
          this.baseUrl
        }Breeding2SowBodyCondition/LoadData?lang=${localStorage.getItem(
          "lang"
        )}`,
        adaptor: new UrlAdaptor(),
        crossDomain: true,
      })
        .executeQuery(
          new Query().where("recordGuid", "equal", this.model.guid || "")
        )
        .then((data: any) => {
          this.dataSource = data.result.result || ([] as Breeding2GiltIn[]);
          this.dataSourceChange.emit(this.dataSource);
          this.service.changeBreeding2GiltIn(this.dataSource);
        });
    }
  }
  loadBreeding2SowBackFatData() {
    if (this.recordGuid) {
      new DataManager({
        url: `${
          this.baseUrl
        }Breeding2SowBackFat/LoadData?lang=${localStorage.getItem(
          "lang"
        )}`,
        adaptor: new UrlAdaptor(),
        crossDomain: true,
      })
        .executeQuery(
          new Query().where("recordGuid", "equal", this.model.guid || "")
        )
        .then((data: any) => {
          this.dataSource = data.result.result || ([] as Breeding2GiltIn[]);
          this.dataSourceChange.emit(this.dataSource);
          this.service.changeBreeding2GiltIn(this.dataSource);
        });
    }
  }
  selectedBodyConditionLevel(e, data) {
    if (e.isInteracted) {
      this.breeding2GiltInItem["bodyConditionLevelName"] = e.itemData?.name;
      this.breeding2GiltInItem["bodyConditionLevel"] = e.itemData?.guid;
      const index = this.findIndexByData(data);
      if (index !== -1) {
        this.dataSource[index]["bodyConditionLevel"] = e.itemData?.guid;
        this.dataSource[index]["bodyConditionLevelName"] = e.itemData?.name;
        this.dataSourceChange.emit(this.dataSource);

      }
      console.log(this.dataSource);
    }
  }

  actionBegin(e) {
    if (e.requestType === "beginEdit" || e.requestType === "add") {
      this.breeding2GiltInItem = Object.assign({}, e.rowData);
      if (e.requestType === "add") {
      }
    }

    if (e.requestType === "save") {

      e.data["bodyConditionLevelName"] =
        this.breeding2GiltInItem["bodyConditionLevelName"];
      e.data["bodyConditionLevel"] =
        this.breeding2GiltInItem["bodyConditionLevel"];
      e.data["giltGuidName"] = this.breeding2GiltInItem["giltGuidName"];
      e.data["giltGuid"] = this.breeding2GiltInItem["giltGuid"];
      e.data["type"] = "Gilt_IN";
      e.data["id"] = e.data["id"] || Math.random() * -1;
      e.data["recordGuid"] = this.recordGuid || null;
      this.update(e);
    }
  }
  actionComplete(e) {
    if (e.rows) {
      this.service.changeBreeding2GiltIn(this.dataSource);
    }
  }
  update(e) {
    if (this.dataSource) {
      if (
        this.dataSource.contains("giltNo", e.data["giltNo"]) &&
        e.previousData["giltNo"] !== e.data["giltNo"]
      ) {
        this.alertify.warning(
          this.translate.instant(
            `The '${e.data["giltNo"]}' giltNo already exists`
          ),
          true
        );
        e.cancel = true;
        return;
      }
      const index = this.dataSource.findIndex((x) => x.id === e.data["id"]);
      if (index !== -1) {
        // debugger
        this.dataSource[index] = { ...e.data };
        this.dataSourceChange.emit(this.dataSource);

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
  selectedGiltGuidValueName(e, data) {
    if (e.isInteracted) {
      this.breeding2GiltInItem["giltGuidName"] = e.itemData?.name;
      this.breeding2GiltInItem["giltGuid"] = e.itemData?.guid;

      this.index = this.findIndexByData(data);
      if (this.index !== -1) {
        this.dataSource[this.index]["giltGuid"] = e.itemData?.guid;
        this.dataSource[this.index]["giltGuidName"] = e.itemData?.name;
      }
      console.log(this.dataSource);
    }
  }
  private findIndexByData(data) {
    const index = this.dataSource.findIndex(
      (obj) => obj.id === data.id
    );
    return index;
  }

  total = (nums) => {
    if ((nums as []).length > 0) {
      return nums.reduce((a, b) => a + b);
    }
    return 0;
  };
}
