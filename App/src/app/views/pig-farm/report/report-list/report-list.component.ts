import { NgxSpinnerService } from "ngx-spinner";
import { Subscription } from "rxjs";
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import {
  ExcelExportProperties,
  GridComponent,
  PdfExportProperties,
  ColumnModel,
  ExcelExportCompleteArgs,
  ColumnChooserService,
  ToolbarService,
} from "@syncfusion/ej2-angular-grids";
import { environment } from "src/environments/environment";
import { DisplayTextModel } from "@syncfusion/ej2-angular-barcode-generator";
import { Employee } from "src/app/_core/_model/employee";
import { setCulture, L10n } from "@syncfusion/ej2-base";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { ReportService } from "src/app/_core/_service/report.service";
import { distinctUntilChanged, filter, map } from "rxjs/operators";
import { ReportConfigService } from "src/app/_core/_service/report-config.service";
import { DataManager, Query, UrlAdaptor } from "@syncfusion/ej2-data";
import { BaseComponent } from "herr-core";

declare let window: any;

@Component({
  selector: "app-report-list",
  templateUrl: "./report-list.component.html",
  styleUrls: ["./report-list.component.scss"],
  providers: [ToolbarService, ColumnChooserService],
})
export class ReportListComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  isAdmin =
    JSON.parse(localStorage.getItem("user"))?.groupCode === "ADMIN_CANCEL";
  localLang = window.navigator.userLanguage || window.navigator.language;
  //data: DataManager;
  data = [];
  resizeSettings = { mode: "Normal" };

  @ViewChild("grid") public grid: GridComponent;
  excelDownloadUrl: string;
  modalReference: NgbModalRef;
  selectOptions = { persistSelection: true };
  selectedData: Employee[] = [];
  displayTextMethod: DisplayTextModel = {
    visibility: false,
  };
  baseUrl = environment.apiUrl;
  checkedAll = false;
  locale = localStorage.getItem("lang");
  sortSettings = { columns: [{ field: "id", direction: "Descending" }] };
  editSettings = {
    showDeleteConfirmDialog: false,
    allowEditing: false,
    allowAdding: false,
    allowDeleting: false,
    mode: "Normal",
  };
  title: any;
  @ViewChild("optionModal") templateRef: TemplateRef<any>;
  toolbarOptions = [];
  orderBy: string;
  thenBy: string;
  roomGuid1: string = "";
  roomGuid2: string = "";
  makeOrderGuid1: string = "";
  makeOrderGuid2: string = "";
  roomGuid1Visibled: boolean;
  roomGuid2Visibled: boolean;
  makeOrderGuid1Visibled: boolean;
  makeOrderGuid2Visibled: boolean;
  startDate: any = new Date();
  endDate: any = new Date();
  menuItem: any;
  kind: string;
  subscription: Subscription = new Subscription();
  columns: ColumnModel[] = [];
  fields: object = { text: "headerText", value: "field" };
  menu: Object;
  warningAlert = false;
  keyWord: string;
  @ViewChild("odsTemplate", { static: true }) public odsTemplate: any;
  @ViewChild("jsonTemplate", { static: true }) public jsonTemplate: any;
  isodsExport = false;
  formatCol = true;
  constructor(
    public modalService: NgbModal,
    private service: ReportService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private serviceReportConfig: ReportConfigService,
    private datePipe: DatePipe,
    public translate: TranslateService
  ) {
    super(translate,environment.apiUrl);
    this.kind = route.snapshot.paramMap.get("kind");
    if (this.kind) {
      this.getColumns();
    }
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit() {
    this.toolbarOptions = [
      "ExcelExport",
      { template: this.odsTemplate },
      { template: this.jsonTemplate },
      "Search",
    ];
    this.kind = this.route.snapshot.paramMap.get("kind");
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
    this.subscription.add(
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          distinctUntilChanged()
        )
        .pipe(map(() => this.route))
        .subscribe((e) => {
          this.kind = e.snapshot.paramMap.get("kind");
          this.grid.dataSource = [];
          this.columns = [];
          this.grid.columns = this.columns;
          this.grid.refreshColumns();
          if (this.kind) {
            this.getColumns();
          }
          this.loadConfig();
        })
    );
    if (this.kind) {
      this.getColumns();
      this.loadConfig();
    }
  }
  jsonExport() {
    const fileName = `${
      this.menuItem?.name.trim() || "Report"
    } ${this.datePipe.transform(new Date(), "yyyyMMdd")}.json`;
    const d1 = this.datePipe.transform(
      this.startDate || new Date(1970, 1, 1),
      "yyyy/MM/dd"
    );
    const d2 = this.datePipe.transform(
      this.endDate || new Date(1970, 1, 1),
      "yyyy/MM/dd"
    );
    const keyWord = this.keyWord || "";
    const sort = this.orderBy || "";
    const sort2 = this.thenBy || "";

    const roomGuid1 = this.roomGuid1 || "";
    const roomGuid2 = this.roomGuid2 || "";
    const makeOrderGuid1 = this.makeOrderGuid1 || "";
    const makeOrderGuid2 = this.makeOrderGuid2 || "";
    const farmGuid = localStorage.getItem("farmGuid");
    const menuLink = `/report/${this.kind}`;
    this.service.jsonExport({
      d1,
      d2,
      keyWord,
      sort,
      sort2,
      menuLink,
      farmGuid,
      makeOrderGuid1,
      makeOrderGuid2,
      roomGuid1,
      roomGuid2
    }).subscribe((res: any) => {
      this.service.downloadBlob(
        res.body,
        fileName,
        {encoding:"UTF-8",type:"application/json;charset=UTF-8"}
      );
    });
  }
  loadConfig() {
    const menuLink = `/report/${this.kind}`;
    let query = new Query();
    query.where("type", "equal", menuLink);
    const accessToken = localStorage.getItem("token");
    new DataManager({
      url: `${this.baseUrl}SystemConfig/GetDataDropdownlist`,
      adaptor: new UrlAdaptor(),
      headers: [{ authorization: `Bearer ${accessToken}` }],
    })
      .executeQuery(query)
      .then((x: any) => {
        const configData = x.result || [];
        this.makeOrderGuid1Visibled = false;
        this.makeOrderGuid2Visibled = false;
        this.roomGuid1Visibled = false;
        this.roomGuid2Visibled = false;
        for (const x of configData) {
          switch (x.no) {
            case "MakeOrderGuid1":
              setTimeout(
                () =>
                  (this.makeOrderGuid1Visibled = x.value === "1" ? true : false)
              );
              break;
            case "MakeOrderGuid2":
              setTimeout(
                () =>
                  (this.makeOrderGuid2Visibled = x.value === "1" ? true : false)
              );
              break;
            case "RoomGuid1":
              setTimeout(
                () => (this.roomGuid1Visibled = x.value === "1" ? true : false)
              );
              break;
            case "RoomGuid2":
              setTimeout(
                () => (this.roomGuid2Visibled = x.value === "1" ? true : false)
              );
              break;
            default:
              this.makeOrderGuid1Visibled = false;
              this.makeOrderGuid2Visibled = false;
              this.roomGuid1Visibled = false;
              this.roomGuid2Visibled = false;
              break;
          }
        }
      });
  }
  getColumns() {
    const menuLink = `/report/${this.kind}`;
    const lang = localStorage.getItem("lang");
    this.serviceReportConfig
      .getReportColumns(menuLink, lang)
      .subscribe((columns) => {
        this.columns = columns;
        this.warningAlert = this.columns.length === 0;
        this.grid.refreshColumns();
      });
  }

  formatNumber(field) {
    if (this.data.length === 0) {
      return "";
    }
    let valueTemp = this.data[0][field];

    return typeof valueTemp === "number" ? "N" : "";
  }
  dataBound() {
    // var index= 0;
    // for (const cols of this.grid.columns) {
    //   if (this.data.length > 0) {
    //     if (typeof this.data[0][(cols as any).field] === 'number') {
    //       (cols as any).format = 'N';
    //       (cols as any).textAlign = 'Right';
    //       this.grid.refreshColumns();
    //   }
    //   }
    //   index++;
    // }
    // let index2 = 0;
    // for (const item of this.data) {
    //   if (this.formatCol) {
    //     for (var field of Object.keys(item)) {
    //       if (typeof item[field] === 'number') {
    //         let cols = (this.grid.columns as any[]).filter((x: any)=> x.field === field )[0];
    //         if (cols) {
    //           cols.format = 'N';
    //           this.grid.refreshColumns();
    //         }
    //       }
    //     }
    //   }
    //   if (index2 == 1) {
    //     this.formatCol = false;
    //     break;
    //   }
    //   index2++;
    // }
  }
  loadData() {
    const d1 = this.datePipe.transform(
      this.startDate || new Date(1970, 1, 1),
      "yyyy/MM/dd"
    );
    const d2 = this.datePipe.transform(
      this.endDate || new Date(1970, 1, 1),
      "yyyy/MM/dd"
    );
    const keyWord = this.keyWord || "";
    const sort = this.orderBy || "";
    const sort2 = this.thenBy || "";

    const roomGuid1 = this.roomGuid1 || "";
    const roomGuid2 = this.roomGuid2 || "";
    const makeOrderGuid1 = this.makeOrderGuid1 || "";
    const makeOrderGuid2 = this.makeOrderGuid2 || "";
    const farmGuid = localStorage.getItem("farmGuid");
    const menuLink = `/report/${this.kind}`;
    this.spinner.show("default");
    this.service
      .getReports(
        d1,
        d2,
        keyWord,
        sort,
        sort2,
        menuLink,
        farmGuid,
        makeOrderGuid1,
        makeOrderGuid2,
        roomGuid1,
        roomGuid2
      )
      .subscribe(
        (data) => {
          if (this.columns.length === 0) {
            this.data = [];
          } else {
            this.data = data;
          }
          this.spinner.hide("default");
        },
        () => this.spinner.hide("default")
      );
  }
  odsExport() {
    this.isodsExport = true;
    this.menuItem = JSON.parse(localStorage.getItem("menuItem"));
    const fileName = `${
      this.menuItem?.name.trim() || "Report"
    } ${this.datePipe.transform(new Date(), "yyyyMMdd")}.ods`;
    const excelExportProperties: ExcelExportProperties = {
      hierarchyExportMode: "All",
      fileName: fileName,
    };
    this.grid.excelExport(excelExportProperties, null, null, true);
  }
  excelExpComplete(args: ExcelExportCompleteArgs) {
    if (this.isodsExport) {
      const fileName = `${
        this.menuItem?.name.trim() || "Report"
      } ${this.datePipe.transform(new Date(), "yyyyMMdd")}.ods`;
      args.promise.then((e: { blobData: Blob }) => {
        const model = {
          functionName: this.menuItem?.name.trim() || "Report.ods",
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
    const currentDate = this.datePipe.transform(new Date(), "yyyy.MM.dd");
    const accoutName = JSON.parse(localStorage.getItem('user')).accountName;
    switch (args.item.id) {
      case "grid_excelexport":
        this.isodsExport = false;

        this.menuItem = JSON.parse(localStorage.getItem("menuItem"));
        const title = this.menuItem?.name.trim() || "Report";
        const fileName = `${
          this.menuItem?.name.trim() || "Report"
        } ${this.datePipe.transform(new Date(), "yyyyMMdd")}.xlsx`;

        const colSpan = this.columns.length;
        const excelExportProperties: ExcelExportProperties = {
          hierarchyExportMode: "All",
          fileName: fileName,
          header: {
            headerRows: 3,
            rows: [
              {
                cells: [
                  {
                    colSpan: colSpan,
                    value: title,
                    style: {
                      fontColor: "#000000",
                      fontSize: 18,
                      hAlign: "Center",
                      bold: true,
                    },
                  },
                ],
              },
              {
                cells: [
                  {
                    colSpan: 2,
                    value: '日期: ' + currentDate,
                    style: {
                      fontColor: "#000000",
                      hAlign: "Left",
                    },
                  },
                  {},
                  {},
                  {
                    colSpan: 2,
                    value: '列印人員: ' + accoutName,
                    style: {
                      fontColor: "#000000",
                      hAlign: "Right",
                    },
                  },
                ],
                
              },
            ],
          },
        };
        this.grid.excelExport(excelExportProperties);
        break;
      case "grid_pdfexport":
        this.isodsExport = false;

        this.menuItem = JSON.parse(localStorage.getItem("menuItem"));
        const pdfFileName = `${
          this.menuItem?.name.trim() || "Report"
        } ${this.datePipe.transform(new Date(), "yyyyMMdd")}.pdf`;
        const pdfExportProperties: PdfExportProperties = {
          hierarchyExportMode: "All",
          fileName: pdfFileName,
          dataSource: this.data,
          
        };
        this.grid.pdfExport(pdfExportProperties);
        break;
      case "grid_open":
        this.openModal(this.templateRef);
        break;
      default:
        break;
    }
  }

  actionComplete(args) {}
  actionBegin(args) {}
  reset() {
    this.startDate = null;
    this.endDate = null;
    const d1 = this.datePipe.transform(new Date(1970, 1, 1), "yyyy/MM/dd");
    const d2 = this.datePipe.transform(new Date(1970, 1, 1), "yyyy/MM/dd");
    const keyWord = "";
    const sort = "";
    const sort2 = "";
    const roomGuid1 = "";
    const roomGuid2 = "";
    const makeOrderGuid1 = "";
    const makeOrderGuid2 = "";
    this.keyWord = keyWord;
    this.orderBy = sort;
    this.thenBy = sort2;
    this.makeOrderGuid1 = makeOrderGuid1;
    this.makeOrderGuid2 = makeOrderGuid2;
    this.roomGuid1 = roomGuid1;
    this.roomGuid2 = roomGuid2;
    const menuLink = `/report/${this.kind}`;
    const farmGuid = localStorage.getItem("farmGuid");
    this.spinner.show("default");
    this.service
      .getReports(
        d1,
        d2,
        keyWord,
        sort,
        sort2,
        menuLink,
        farmGuid,
        makeOrderGuid1,
        makeOrderGuid2,
        roomGuid1,
        roomGuid2
      )
      .subscribe(
        (data) => {
          if (this.columns.length === 0) {
            this.data = [];
          } else {
            this.data = data;
          }
          this.spinner.hide("default");
        },
        () => this.spinner.hide("default")
      );
  }
  filter() {
    this.loadData();
  }
  openModal(template) {
    this.title = "REPORT_PARAMETER_MODAL";
    this.modalReference = this.modalService.open(template, {
      size: "lg",
      backdrop: "static",
    });
  }
}
