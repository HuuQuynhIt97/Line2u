
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
import { environment } from 'src/environments/environment';
import { EditService, CommandColumnService } from '@syncfusion/ej2-angular-grids';
@Component({
  selector: 'app-breeding2-gilt-in',
  templateUrl: './breeding2-gilt-in.component.html',
  styleUrls: ['./breeding2-gilt-in.component.css'],
  providers: [EditService, CommandColumnService ]
})
export class Breeding2GiltInComponent
  extends BaseComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() recordGuid: any;
  @Input() roomGuid: any;
  @Input() realQty: any;
  @Input() realTotalWeight: any;
  @Input() penGuid: any;
  @Input() penGuidName: any;

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
    this.commands = [ {
      type: "Delete",
      buttonOption: {
        iconCss: "e-icons e-delete",
        cssClass: "e-flat delete-grid",
      },
    },]
    if (this.recordGuid) {
      new DataManager({
        url: `${this.baseUrl}GiltIn/GetSelectedBreeding2GiltIn`,
        adaptor: new UrlAdaptor(),
        crossDomain: true,
      })
        .executeQuery(
          new Query().where("recordGuid", "equal", this.recordGuid || "")
          .where("type", "equal", "Gilt_IN")
        )
        .then((data: any) => {
          this.dataSource = data.result || ([] as Breeding2GiltIn[]);
          this.dataSourceChange.emit(this.dataSource);
          this.service.changeBreeding2GiltIn(this.dataSource);
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

  actionBegin(e) {
    if (e.requestType === "beginEdit" || e.requestType === "add") {
      this.breeding2GiltInItem = Object.assign({}, e.rowData);
      this.breeding2GiltInItem["penGuid"] = this.penGuid
      this.breeding2GiltInItem["penGuidName"] = this.penGuidName;
      if (e.requestType === "add") {
        // this.breeding2GiltInItem.penGuid = this.pen?.guid
        // this.breeding2GiltInItem['penGuidName'] = this.pen?.name
      }
    }

    if (e.requestType === "save") {
   
      e.data["giltGuidName"] = this.breeding2GiltInItem["giltGuidName"];
      e.data["giltGuid"] = this.breeding2GiltInItem["giltGuid"];

      e.data["penGuidName"] = this.breeding2GiltInItem["penGuidName"];
      e.data["penGuid"] = this.breeding2GiltInItem["penGuid"];

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
      if (this.dataSource.contains('giltNo', e.data['giltNo']) && e.previousData['giltNo'] !== e.data['giltNo']) {
        this.alertify.warning(this.translate.instant(`The '${e.data['giltNo']}' giltNo already exists`), true)
        e.cancel = true
        return
      }
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
 
  selectedGiltGuidValueName(e, data) {
    if (e.isInteracted) {
      this.breeding2GiltInItem["giltGuidName"] = e.itemData?.name;
      this.breeding2GiltInItem["giltGuid"] = e.itemData?.guid;

      this.index = this.findIndexByData(data);
      if (this.index !== -1) {
        this.dataSource[this.index]['giltGuid'] =
          e.itemData?.guid;
        this.dataSource[this.index]['giltGuidName'] =
          e.itemData?.name;
      }
      console.log(this.dataSource)
    }
  }
  private findIndexByData(data) {
    const index = this.dataSource.findIndex(
      (obj) => obj.giltGuid === data.giltGuid
    );
    return index;
  }

  total = (nums) => {
    if ((nums as []).length > 0) {
      return nums.reduce((a, b) => a + b);
    }
    return 0;
  };
  onChangePenGuid(e, data) {
    if (e.isInteracted) {
      data.penGuid = e.itemData?.guid;
      data.penGuidName = e.itemData?.name;
      this.breeding2GiltInItem['penGuid'] = e.itemData?.guid;
      this.breeding2GiltInItem['penGuidName'] = e.itemData?.name;
      let penGuidIndex = this.findIndexByData(data);
      if (penGuidIndex !== -1) {
        this.dataSource[penGuidIndex].penGuid = e.itemData?.guid;
        this.dataSource[penGuidIndex]['penGuidName'] = e.itemData?.name;
        
      }
    }
  }
}
