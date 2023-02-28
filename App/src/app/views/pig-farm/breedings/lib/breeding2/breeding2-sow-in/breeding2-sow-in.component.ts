
import {
  DataManager,
  Query,
  UrlAdaptor,
} from "@syncfusion/ej2-data";
declare let window: any;
import { L10n, setCulture } from "@syncfusion/ej2-base";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from "@angular/core";
import { BaseComponent } from "herr-core";
import { environment } from "src/environments/environment";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ExcelExportCompleteArgs, ExcelExportProperties, GridComponent } from "@syncfusion/ej2-angular-grids";
import { Breeding2SowConst, Breeding2SowIn } from "../../../config";
import { Observable, of, Subscription } from "rxjs";

import { DatePipe } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertifyService } from "src/app/_core/_service/alertify.service";
import { Breeding2SowInService } from "../../../services";

@Component({
  selector: "app-breeding2-sow-in",
  templateUrl: "./breeding2-sow-in.component.html",
  styleUrls: ["./breeding2-sow-in.component.scss"],
})
export class Breeding2SowInComponent  extends BaseComponent implements OnInit, OnDestroy, OnChanges {
  public query: Query;
  localLang = window.navigator.userLanguage || window.navigator.language;
  @Output() selectSowIn = new EventEmitter();
  data: DataManager;
  baseUrl = environment.apiUrl;
  modalReference: NgbModalRef;
@Input() breedingGuid: any;
@Input() penGuid: any;
  @ViewChild("griddetail") public grid: GridComponent;
  model: Breeding2SowIn;
  setFocus: any;
  locale = localStorage.getItem("lang");

  title: any;
  @ViewChild("odsTemplate", { static: true }) public odsTemplate: any;

  @ViewChild("optionModal", { static: false }) templateRef: TemplateRef<any>;

  breedingGuidSearch: any;
  toolbarOptions: any;
  selectionOptions = { checkboxMode: "ResetOnRowClick" };
  fields: object = { text: "name", value: "guid" };
  subscription: Subscription;
  editSettings = { showDeleteConfirmDialog: false, allowEditing: false, allowAdding: true, allowDeleting: false, mode: 'Normal' };

  constructor(
    private service: Breeding2SowInService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private cdRef: ChangeDetectorRef
  ) {
    super(translate,environment.apiUrl);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['breedingGuid']) {
      this.loadData();
    }
  }
  
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  ngOnInit() {
    this.toolbarOptions = [
      {
        text: this.translate.instant("Excelexport"),
        align: "Right",
        id: "grid-detailexcelexport",
        prefixIcon: "e-excelexport e-icons",
      },
      { template: this.odsTemplate, align: "Right" },
      "Add",
      { text: "Search", align: "Left" },
    ];
    let lang = localStorage.getItem("lang");
    let languages = JSON.parse(localStorage.getItem("languages"));
    // setCulture(lang);
    let load = {
      [lang]: {
        grid: languages["grid"],
        pager: languages["pager"],
        "multi-select": languages["multiselect"],
      },
    };
    L10n.load(load);
    this.loadConfig();
  }


  // life cycle ejs-grid
  rowSelected(args) {
  }
  recordClick(args: any) {
  }

  onDoubleClick(args: any): void {
    this.setFocus = args.column; // Get the column from Double click event
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
      case "grid-detail_excelexport":
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
      case "grid-detail_add":
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
 
  loadConfig() {
    let query = new Query();
    query.where("type", "equal", Breeding2SowConst.Breeding2SowIn);
    query.where("no", "equal", "insert");

    const accessToken = localStorage.getItem("token");
    new DataManager({
      url: `${this.baseUrl}SystemConfig/GetDataDropdownlist`,
      adaptor: new UrlAdaptor(),
      headers: [{ authorization: `Bearer ${accessToken}` }],
    })
      .executeQuery(query)
      .then((x: any) => {
        const configData = x.result;
        const item = configData[0];
        if (item && item.value === "0") {
          this.toolbarOptions = [
            {
              text: this.translate.instant("Excelexport"),
              align: "Right",
              id: "grid-detailexcelexport",
              prefixIcon: "e-excelexport e-icons",
            },
            { template: this.odsTemplate, align: "Right" },
            { text: "Search", align: "Left" },
          ];
        } else {
          this.toolbarOptions = [
            {
              text: this.translate.instant("Excelexport"),
              align: "Right",
              id: "grid-detailexcelexport",
              prefixIcon: "e-excelexport e-icons",
            },
            { template: this.odsTemplate, align: "Right" },
            "Add",
            { text: "Search", align: "Left" },
          ];
        }
      });
  }
  loadData() {
    this.query = new Query();
  
    if (this.breedingGuid) {
      this.query.where("breedingGuid", "equal", this.breedingGuid);
    }
    const accessToken = localStorage.getItem("token");
    this.data = new DataManager(
      {
        url: `${this.baseUrl}Breeding2SowIn/LoadData?lang=${this.globalLang}`,
        adaptor: new UrlAdaptor(),
        headers: [{ authorization: `Bearer ${accessToken}` }],
      },
      this.query.sortByDesc("id")
    );
   
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
        if (key === "createDate") {
          model[key] = this.datePipe.transform(value, "yyyy/MM/dd HH:mm:ss");
        } else {
          model[key] = this.datePipe.transform(value, "yyyy/MM/dd");
        }
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

 
  convertDateTime(data) {
    if (data instanceof Date) {
      return this.datePipe.transform(data as Date, "yyyy-MM-dd");
    }
    return data;
  }
  save() {
    if (this.model.id > 0) { this.update() }
    else {this.create()}
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
 
 

  async openModal(template, data = {} as any) {
    this.penGuid = "";
    if (data?.id > 0) {
      this.model = { ...data };
      this.title = "Breeding2_SowIN_EDIT_MODAL";
    } else {
      this.model.id = 0;
      this.model.breedingGuid = this.breedingGuid
    
      this.title = "Breeding2_SowIN_ADD_MODAL";
    }
    this.modalReference = this.modalService.open(template, {
      size: "xxl",
      backdrop: "static",
    });
    this.modalReference.shown.subscribe(async () => {
      if (data?.id > 0) {
        try {
          this.spinner.show("default");
        } catch {
          this.spinner.hide("default");
        }
        this.spinner.hide("default");
      }
    });
  }
  showModal(template) {
    this.modalReference = this.modalService.open(template, {
      size: "xxl",
      backdrop: "static",
    });
  }
  
}
