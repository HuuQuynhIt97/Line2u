

import { DataManager, Query, UrlAdaptor, Predicate } from "@syncfusion/ej2-data";

import { L10n, setCulture } from "@syncfusion/ej2-base";
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  NgbModalRef,
  NgbModal,
  NgbTooltipConfig,
} from "@ng-bootstrap/ng-bootstrap";
import {
  ExcelExportCompleteArgs,
  ExcelExportProperties,
  GridComponent,
} from "@syncfusion/ej2-angular-grids";
import { AlertifyService } from "src/app/_core/_service/alertify.service";
import { BaseComponent } from "herr-core";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "src/environments/environment";
import { PigService } from "src/app/_core/_service/pigs/pig.service";
import { Subscription } from "rxjs";
import { DatePipe } from "@angular/common";

import { RecordDonate } from "src/app/_core/_model/apply-orders";
import { PenService, RoomService } from "src/app/_core/_service/farms";
import { RecordDonateService } from "src/app/_core/_service/apply-orders";
declare let window: any;
@Component({
  selector: 'app-exe-record-donate',
  templateUrl: './exe-record-donate.component.html',
  styleUrls: ['./exe-record-donate.component.css']
})
export class ExeRecordDonateComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public query: Query;
  localLang = window.navigator.userLanguage || window.navigator.language;
  @Output() selectRecordDonate = new EventEmitter();
  data: DataManager;
  baseUrl = environment.apiUrl;
  password = "";
  modalReference: NgbModalRef;

  @ViewChild("grid") public grid: GridComponent;
  model: RecordDonate;
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
  @ViewChild("odsTemplate", { static: true }) public odsTemplate: any;
  @ViewChild("optionModal") templateRef: TemplateRef<any>;
  toolbarOptions: any;
  selectionOptions = { checkboxMode: "ResetOnRowClick" };
  fields: object = { text: "name", value: "guid" };
  pigData: DataManager;
  disable: boolean;
  makeOrderGuid: any;
  subscription: Subscription;
  makeOrderValue: any;
  statusDefault = 1;
  statusAgree = 2;
  statusClose = 4;
  statusReject = 5;
  roomGuid: string;
  penGuid: string;
  dataPen: DataManager;
  queryPen: Query;
  checkedData: any = [];

  public actionComplete(e: any): void {}
  constructor(
    private service: RecordDonateService,
    private servicePen: PenService,
    private serviceRoom: RoomService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private servicePig: PigService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    config: NgbTooltipConfig,
    public translate: TranslateService
  ) {
    super(translate,environment.apiUrl);
  }
  pens: any;
  pigs: any;
pigGuid: string;
  estDate: any;
  status: string = '4';
  searchOptions = { fields: ["name"], operator: "contains", ignoreCase: true };

  @ViewChild("statusTemplate", { static: true }) public statusTemplate: any;
  @ViewChild("estTemplate", { static: true }) public estTemplate: any;
  onSelectedEstDateValue(args: any) {
    this.estDate = args;
    this.loadData();
  }
  onSelectedPenValue(args: any) {
    this.penGuid = args;
    this.loadData();
  }
  onSelectedPigValue(args: any) {
    this.pigGuid = args;
    this.loadData();
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  ngOnInit() {
    this.toolbarOptions = [
      "ExcelExport",
      { template: this.odsTemplate },
      "Add",
      { template: this.statusTemplate },
      { template: this.estTemplate },
      "Search",
    ];
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

  loadPenGuid() {
    this.servicePen
      .getPenByRecord(this.model?.guid || "", "Record_Donate")
      .subscribe((res: any) => {
        this.penGuid = res?.penGuid;
        this.loadPig();
        console.log("load pig", new Date());
      });
  }
  loadRoomGuid() {
    return this.serviceRoom
      .getRoomByRecord(this.model?.guid || "", "Record_Donate")
      .toPromise();
  }
  loadPen() {
    this.queryPen = new Query()
      .skip(this.skip)
      .take(this.take)
      .where("roomGuid", "equal", this.roomGuid)
      .where("farmGuid", "equal", localStorage.getItem("farmGuid"))
      .where("status", "equal", 1);

    this.dataPen = new DataManager(
      {
        url: `${this.baseUrl}Pen/GetDataDropdownlist`,
        adaptor: new UrlAdaptor(),
        crossDomain: true,
      },
      this.queryPen
    );
  }
  loadPig() {
    const accessToken = localStorage.getItem("token");
    this.pigData = new DataManager({
      url: `${this.baseUrl}Pig/GetPigsByPen?penGuid=${
        this.penGuid || ""
      }&recordGuid=${this.model?.guid || ""}&type=Record_Donate`,
      adaptor: new UrlAdaptor(),
      headers: [{ authorization: `Bearer ${accessToken}` }],
    });
  }
  onChangeRoom(e) {
    this.roomGuid = e.value;
    this.loadPen();
  }
  onChangePen(e) {
    this.penGuid = e.value;
    this.loadPig();
  }
  // life cycle ejs-grid
  rowSelected(args) {
    //console.log(args.data);
  }
  recordClick(args: any) {
    //console.log(args.rowData);
    this.service.changeRecordDonate(args.rowData);
  }

  onDoubleClick(args: any): void {
    this.setFocus = args.column; // Get the column from Double click event
  }
  onChangeEst(e) {
    if (e.isInteracted) {
      this.estDate = e.value;
      this.loadData();
    }
  }
  onChangeStatus(e) {
    if (e.isInteracted) {
      this.status = e.value;
      this.loadData();
    }
  }
  onChange(args, data) {
    data.isDefault = args.checked;
  }

  actionBegin(args) {}
  odsExport() {
    const functionName = this.functionName;
    const printBy = this.printBy;
    const accountName =
      JSON.parse(localStorage.getItem("user"))?.accountName || "N/A";
    const header = {
      headerRows: 3,
      rows: [
        {
          cells: [
            {
              colSpan: 5,
              value: `* ${functionName}`,
              style: {
                fontColor: "#fd7e14",
                fontSize: 18,
                hAlign: "Left",
                bold: true,
              },
            },
          ],
        },
        {
          cells: [
            {
              colSpan: 5,
              value: `* ${this.datePipe.transform(
                new Date(),
                "yyyyMMdd_HHmmss"
              )}`,
              style: {
                fontColor: "#fd7e14",
                fontSize: 18,
                hAlign: "Left",
                bold: true,
              },
            },
          ],
        },
        {
          cells: [
            {
              colSpan: 5,
              value: `* ${printBy} ${accountName}`,
              style: {
                fontColor: "#fd7e14",
                fontSize: 18,
                hAlign: "Left",
                bold: true,
              },
            },
          ],
        },
      ],
    } as any;

    const fileName = `${functionName}_${this.datePipe.transform(
      new Date(),
      "yyyyMMdd_HHmmss"
    )}.ods`;
    const excelExportProperties: ExcelExportProperties = {
      hierarchyExportMode: "All",
      fileName: fileName,
      header: header,
    };

    this.isodsExport = true;

    this.grid.excelExport(excelExportProperties, null, null, true);
  }

  excelExpComplete(args: ExcelExportCompleteArgs) {
    if (this.isodsExport) {
      const fileName = `${this.functionName}_${this.datePipe.transform(
        new Date(),
        "yyyyMMdd_HHmmss"
      )}.ods`;

      args.promise.then((e: { blobData: Blob }) => {
        const model = {
          functionName: fileName,
          file: e.blobData,
        };
        this.service.downloadODSFile(model).subscribe((res: any) => {
          this.service.downloadBlob(
            res.body,
            fileName,
            "application/vnd.oasis.opendocument.spreadsheet"
          );
        });
      });
    }
  }
  toolbarClick(args) {
    const functionName = this.functionName;
    const printBy = this.printBy;
    switch (args.item.id) {
      case "grid_excelexport":
        const accountName =
          JSON.parse(localStorage.getItem("user"))?.accountName || "N/A";
        const header = {
          headerRows: 3,
          rows: [
            {
              cells: [
                {
                  colSpan: 5,
                  value: `* ${functionName}`,
                  style: {
                    fontColor: "#fd7e14",
                    fontSize: 18,
                    hAlign: "Left",
                    bold: true,
                  },
                },
              ],
            },
            {
              cells: [
                {
                  colSpan: 5,
                  value: `* ${this.datePipe.transform(
                    new Date(),
                    "yyyyMMdd_HHmmss"
                  )}`,
                  style: {
                    fontColor: "#fd7e14",
                    fontSize: 18,
                    hAlign: "Left",
                    bold: true,
                  },
                },
              ],
            },
            {
              cells: [
                {
                  colSpan: 5,
                  value: `* ${printBy} ${accountName}`,
                  style: {
                    fontColor: "#fd7e14",
                    fontSize: 18,
                    hAlign: "Left",
                    bold: true,
                  },
                },
              ],
            },
          ],
        } as any;

        const fileName = `${functionName}_${this.datePipe.transform(
          new Date(),
          "yyyyMMdd_HHmmss"
        )}.xlsx`;
        const excelExportProperties: ExcelExportProperties = {
          hierarchyExportMode: "All",
          fileName: fileName,
          header: header,
        };
        this.grid.excelExport(excelExportProperties);
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

  // end life cycle ejs-grid

  // api
  getAudit(id) {
    this.service.getAudit(id).subscribe((data) => {
      this.audit = data;
    });
  }
  loadData() {
    this.query = new Query();
    if (this.estDate) {
      this.query.where("estDate", "equal", this.convertDateTime(this.estDate));
    }
    if (this.status) {
      this.query.where("status", "equal", this.status);
    }
    const accessToken = localStorage.getItem("token");
    const farmGuid = localStorage.getItem("farmGuid");
    this.data = new DataManager(
      {
        url: `${this.baseUrl}RecordDonate/LoadData?farmGuid=${farmGuid}&makeOrderGuid=&lang=${this.globalLang}`,
        adaptor: new UrlAdaptor(),
        headers: [{ authorization: `Bearer ${accessToken}` }],
      },
      this.query
    );
  }
  getCheckedData() {
    this.servicePig
      .getPigsByPenAndRecord(
        this.penGuid || "",
        this.model?.guid,
        "Record_Donate"
      )
      .subscribe((data) => {
        this.checkedData = data;
        this.model.pigs = data;
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
        this.model.roomGuid = this.roomGuid;
        this.model.penGuid = this.penGuid;

        this.model.pigs = this.checkedData;
        this.model.applyDate = this.convertDateTime(this.model.applyDate);
        this.model.agreeDate = this.convertDateTime(this.model.agreeDate);
        this.model.rejectDate = this.convertDateTime(this.model.rejectDate);
        this.model.executeDate = this.convertDateTime(this.model.executeDate);
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
            this.alertify.warning(this.alert.system_error_msg);
          }
        );
      },
      () => {
        this.alertify.error(this.alert.cancelMessage);
      }
    );
  }

  setStatus(model: RecordDonate) {
    if (model.agreeGuid && !model.executeGuid) {
      this.model.status = this.statusConts.Agree;
    } else if (model.executeGuid) {
      this.model.status = this.statusConts.Execute;
    } else if (model.rejectGuid) {
      this.model.status = this.statusConts.Reject;
    } else if (!model.rejectGuid && model.agreeGuid) {
      this.model.status = this.statusConts.Agree;
    }
  }
  convertDateTime(data) {
    if (data instanceof Date) {
      return this.datePipe.transform(data as Date, "yyyy-MM-dd");
    }
    return data;
  }
  update() {
    this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.updateTitle,
      this.alert.updateMessage,
      () => {

        this.model.roomGuid = this.roomGuid;
        this.model.penGuid = this.penGuid;
        this.model.pigs = this.checkedData;
        this.model.applyDate = this.convertDateTime(this.model.applyDate);
        this.model.agreeDate = this.convertDateTime(this.model.agreeDate);
        this.model.rejectDate = this.convertDateTime(this.model.rejectDate);
        this.model.executeDate = this.convertDateTime(this.model.executeDate);
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
            this.alertify.warning(this.alert.system_error_msg);
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
  onChangeChecked(e, data) {
    let checked = e.checked;
    if (checked) {
      this.checkedData.push(data.guid);
    } else {
      this.checkedData = this.checkedData.filter((pig) => pig !== data.guid);
    }
    console.log(this.checkedData);
  }
  save() {
    if (this.model.id > 0) {
      this.update();
    } else {
      this.create();
    }
  }
  agree() {
    this.model.status = this.statusConts.Agree;
    this.model.agreeGuid = JSON.parse(localStorage.getItem("user")).guid;
    this.model.agreeDate = new Date();
    this.update();
  }
  reject() {
    this.model.status = this.statusConts.Reject;
    this.model.agreeGuid = null;
    this.model.rejectGuid = JSON.parse(localStorage.getItem("user")).guid;
    this.model.rejectDate = new Date();
    this.update();
  }
  execute() {
    this.model.status = this.statusConts.Close;
    this.model.executeGuid = JSON.parse(localStorage.getItem("user")).guid;
    this.model.executeDate = new Date();
    this.save();
  }
  async openModal(template, data = {} as any) {
    this.roomGuid = "";
    this.penGuid = "";
    this.checkedData = [];
    this.pigData = new DataManager();
    if (data?.id > 0) {
      this.model = { ...data };

      var roomData = await this.loadRoomGuid();
      this.roomGuid = roomData?.roomGuid;
      this.loadPen();
      this.loadPenGuid();
      this.getCheckedData();
      this.getAudit(this.model.id);
      this.model.makeOrderGuid = this.makeOrderGuid;
      this.title = "RECORD_DONATE_EDIT_MODAL";
    } else {
      this.model.id = 0;
      this.model.makeOrderGuid = this.makeOrderGuid;
      this.model.status = this.statusConts.Close;
      this.model.executeGuid = JSON.parse(localStorage.getItem("user")).guid;
      this.model.executeDate = new Date();
      this.model.estDate = new Date();
      this.title = "RECORD_DONATE_ADD_MODAL";
    }
    this.modalReference = this.modalService.open(template, {
      size: "xl",
      backdrop: "static",
    });
  }

  toggleRecordDate(id) {
    this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.updateTitle,
      this.alert.updateMessage,
      () => {
        this.service.toggleRecordDate(id).subscribe(
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
            this.alertify.warning(this.alert.system_error_msg);
          }
        );
      },
      () => {
        this.alertify.error(this.alert.cancelMessage);
      }
    );
  }
}
