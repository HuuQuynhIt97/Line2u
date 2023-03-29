import { UrlAdaptor, DataManager } from "@syncfusion/ej2-data";
import { L10n, setCulture } from "@syncfusion/ej2-base";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  NgbModalRef,
  NgbModal,
  NgbTooltipConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { MessageConstants } from "src/app/_core/_constants";
import { AlertifyService } from "src/app/_core/_service/alertify.service";
import { BaseComponent } from "herr-core";
import { TranslateService } from "@ngx-translate/core";
import { MakeOrderService } from "src/app/_core/_service/records";
import { MakeOrder } from "src/app/_core/_model/records";
import { environment } from "src/environments/environment";
import { DatePipe } from "@angular/common";
import { Subscription } from "rxjs";
declare let window: any;
@Component({
  selector: 'app-gilt-screen',
  templateUrl: './gilt-screen.component.html',
  styleUrls: ['./gilt-screen.component.scss']
})
export class GiltScreenComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  toolbarOptions: any;
  isAdmin =
    JSON.parse(localStorage.getItem("user"))?.groupCode === "ADMIN_CANCEL";
  localLang = window.navigator.userLanguage || window.navigator.language;
  @Output() selectMakeOrder = new EventEmitter();
  @Input() pigType: string = "";
  data: DataManager;
  baseUrl = environment.apiUrl;
  password = "";
  modalReference: NgbModalRef;

  @ViewChild("grid") public grid: GridComponent;
  model: MakeOrder;
  setFocus: any;
  locale = localStorage.getItem("lang");
  editSettings = {
    showDeleteConfirmDialog: false,
    allowEditing: false,
    allowAdding: true,
    allowDeleting: false,
    mode: "Normal",
  };
  title: any;
  @ViewChild("optionModal") templateRef: TemplateRef<any>;

  selectionOptions = { checkboxMode: "Default" };
  rowIndex: number = 0;
  subscription = new Subscription();

  constructor(
    private service: MakeOrderService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private config: NgbTooltipConfig,
    public translate: TranslateService
  ) {
    super(translate,environment.apiUrl);
    if (this.isAdmin === false) {
      config.disableTooltip = true;
    }
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit() {
    const type = this.translate.instant('Gilt');
    this.toolbarOptions = [type,'Search'];

    // this.Permission(this.route);
    let lang = localStorage.getItem("lang");
    let languages = JSON.parse(localStorage.getItem("languages"));
    // setCulture(lang);
    let load = {
      [lang]: {
        grid: languages["grid"],
        pager: languages["pager"],
      },
    };
    L10n.load(load);
    this.loadData();

  }
  typeChange(value) {
    this.model.orderType = value;
  }
  breedChange(value) {
    this.model.orderBreed = value;
  }
  dayAge(data: any) {
    if (!data.realStartDate) return "";
    const day1 = new Date();
    let day2 =
      typeof data.realStartDate === "string"
        ? new Date(data.realStartDate)
        : (data.realStartDate as Date);
    const date1 = new Date(day1.getFullYear(), day1.getMonth(), day1.getDate());
    const date2 = new Date(day2.getFullYear(), day2.getMonth(), day2.getDate());
    let difference = Math.abs(date1.getTime() - date2.getTime());
    let days = difference / (1000 * 3600 * 24);
    return days;
  }
  // life cycle ejs-grid
  dataBound() {
    if (this.rowIndex !== null) {
      this.grid.selectRow(this.rowIndex);
    }
    this.grid.autoFitColumns();
  }
  rowSelected(args) {
    console.log(args);
    this.rowIndex = +args.rowIndex;
    this.service.changeMakeOrder(args.data);
    this.selectMakeOrder.emit(args.data);
  }
  recordClick(args: any) {
    //console.log(args.rowData);
    this.service.changeMakeOrder(args.rowData);
    this.selectMakeOrder.emit(args.rowData);
  }
  onDoubleClick(args: any): void {
    this.setFocus = args.column; // Get the column from Double click event
  }

  onChange(args, data) {
    data.isDefault = args.checked;
  }

  actionBegin(args) {}
  toolbarClick(args) {
    switch (args.item.id) {
      case "grid_excelexport":
        this.grid.excelExport({ hierarchyExportMode: "All" });
        break;
      case "grid_add":
        args.cancel = true;
        this.model = {} as any;
        this.openModal(this.templateRef);
        break;
      default:
        break;
    }
  }
  actionComplete(args) {
    // if (args.requestType === 'add') {
    //   args.form.elements.namedItem('name').focus(); // Set focus to the Target element
    // }
  }

  // end life cycle ejs-grid

  // api
  getAudit(id) {
    this.service.getAudit(id).subscribe((data) => {
      this.audit = data;
    });
  }
  loadData() {
    const accessToken = localStorage.getItem("token");
    const farmGuid = localStorage.getItem("farmGuid");
    this.data = new DataManager({
      url: `${this.baseUrl}MakeOrder/LoadMobileDataByType?farmGuid=${farmGuid}&pigType=Gilt`,
      adaptor: new UrlAdaptor(),
      headers: [{ authorization: `Bearer ${accessToken}` }],
    });
  }
  delete(id) {
    this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.deleteTitle,
      this.alert.deleteMessage,
      () => {
        this.service.delete(id).subscribe(
          (res) => {
            if (res.success === true) {
              this.alertify.success(this.alert.deleted_ok_msg);
              this.loadData();
            } else {
              this.alertify.warning(this.alert.system_error_msg);
            }
          },
          (err) => this.alertify.warning(this.alert.system_error_msg)
        );
      },
      () => {
        this.alertify.error(this.alert.cancelMessage);
      }
    );
  }
  create() {
    this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.createTitle,
      this.alert.createMessage,
      () => {
        const farmGuid = localStorage.getItem("farmGuid");
        if (!farmGuid) {
          this.alertify.warning(this.alert.choose_farm_message, true);
          return;
        }
        this.model.farmGuid = farmGuid;
        this.model.pigType = this.pigType;
        this.service.add(this.ToFormatModel(this.model)).subscribe(
          (res) => {
            if (res.success === true) {
              this.alertify.success(this.alert.created_ok_msg);
              this.loadData();
              this.modalReference.dismiss();
            } else {
              this.alertify.warning(this.alert.system_error_msg);
            }
          },
          (error) => {
            const message =
              this.translate.instant(error) || this.alert.system_error_msg;
            this.alertify.warning(message);
          }
        );
      },
      () => {
        this.alertify.error(this.alert.cancelMessage);
      }
    );
  }
  ToFormatModel(model: any) {
    for (let key in model) {
      let value = model[key];
      if (value && value instanceof Date) {
        model[key] = this.datePipe.transform(value, "yyyy/MM/dd");
      } else {
        model[key] = value;
      }
    }
    return model;
  }

  update() {
    this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.updateTitle,
      this.alert.updateMessage,
      () => {
        this.service.update(this.ToFormatModel(this.model)).subscribe(
          (res) => {
            if (res.success === true) {
              this.alertify.success(this.alert.updated_ok_msg);
              this.loadData();
              this.modalReference.dismiss();
            } else {
              this.alertify.warning(this.alert.system_error_msg);
            }
          },
          (error) => {
            const message =
              this.translate.instant(error) || this.alert.system_error_msg;
            this.alertify.warning(message);
          }
        );
      },
      () => {
        this.alertify.error(this.alert.cancelMessage);
      }
    );
  }
  // end api
  NO(index) {
    return (
      (this.grid.pageSettings.currentPage - 1) *
        this.grid.pageSettings.pageSize +
      Number(index) +
      1
    );
  }

  save() {
    if (this.model.id > 0) {
      this.update();
    } else {
      this.create();
    }
  }
  openModal(template, data = {} as any) {
    if (data?.id > 0) {
      this.model = { ...data };
      this.getAudit(this.model.id);
      this.title = "MAKE_ORDER_EDIT_MODAL";
    } else {
      this.model.id = 0;
      this.model.orderAmound = 0;
      this.model.pigType = this.pigType;
      this.model.customerGuid = this.model.customerGuid || "";
      this.model.bomGuid = this.model.bomGuid || "";
      this.model.orderDate = new Date();
      this.model.realStartDate = new Date();
      this.model.estimateStartDate = new Date();
      this.title = "MAKE_ORDER_ADD_MODAL";
    }
    this.modalReference = this.modalService.open(template, {
      size: "xl",
      backdrop: "static",
    });
  }
}
