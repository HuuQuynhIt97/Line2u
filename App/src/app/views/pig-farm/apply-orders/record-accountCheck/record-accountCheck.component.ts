import { NgxSpinnerService } from "ngx-spinner";

import {
  DataManager,
  Query,
  UrlAdaptor,
  Predicate,
} from "@syncfusion/ej2-data";

import { L10n, setCulture } from "@syncfusion/ej2-base";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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

import { RecordAccountCheck } from "src/app/_core/_model/apply-orders";
import { PenService, RoomService } from "src/app/_core/_service/farms";
import {
  RecordAccountCheckService,
  Record2PigService,
  Record2TreatmentService,
} from "src/app/_core/_service/apply-orders";
import { XAccountService } from "src/app/_core/_service/xaccount.service";
declare let window: any;
@Component({
  selector: "app-record-accountCheck",
  templateUrl: "./record-accountCheck.component.html",
  styleUrls: ["./record-accountCheck.component.css"],
})
export class RecordAccountCheckComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public query: Query;
  localLang = window.navigator.userLanguage || window.navigator.language;
  @Output() selectRecordAccountCheck = new EventEmitter();
  data: DataManager;
  baseUrl = environment.apiUrl;
  password = "";
  modalReference: NgbModalRef;

  @ViewChild("grid") public grid: GridComponent;
  model: RecordAccountCheck;
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
  makeOrderGuidSearch: any;
  toolbarOptions: any;
  selectionOptions = { checkboxMode: "ResetOnRowClick" };
  fields: object = { text: "name", value: "guid" };
  pigData: any;
  recordValue: any;
  disable: boolean;
  makeOrderGuid: any;
  subscription: Subscription;
  makeOrderValue: any;
  statusDefault = 1;
  statusAgree = 2;
  statusClose = 4;
  statusReject = 5;
  roomGuid: string = null;
  areaGuid: string= null;
  barnGuid: string= null;
  penGuid: string= null;
  dataPen: any;
  dataAccount: any;
  queryAccount: Query;
  queryPen: Query;
  checkedData: any[] = [];
  orderStatusCheckedData: number[] = [];
  orderStatus: any;
  configButtonData: any;
  selectedAccount: any[] = [];
  selectedPen: any[] = [];
  selectedPenData: any[] = [];
  accountDataSource: any[] = [];
  accountSelected: any[] = [];
  oldaccountDataSource: any;
  public actionComplete(e: any): void {
    e.result = e.result.filter((x) => x.guid != "");
  }
  public onFiltering: any = (e: any) => {
    let query: Query = new Query()
      .skip(this.skip)
      .take(this.take)
      .where("roomGuid", "equal", this.roomGuid)
      .where("farmGuid", "equal", localStorage.getItem("farmGuid"))
      .where("status", "equal", 1);
    //frame the query based on search string with filter type.
    query = e.text !== "" ? query.search(e.text, ["penName", "penNo"]) : query;
    //pass the filter data source, filter query to updateData method.
    e.updateData(this.dataPen, query);
  };
  enabledInput(date: any) {
    if (date === "" || date === null || date === undefined) {
      return true;
    }
    let date1 = "";
    if (date && date instanceof Date) {
      date1 = this.datePipe.transform(date, "yyyy/MM/dd");
    } else {
      date1 = this.datePipe.transform(new Date(date), "yyyy/MM/dd");
    }
    const date2 = this.datePipe.transform(new Date(), "yyyy/MM/dd");
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (d1 > d2) {
      return false;
    } else if (date1 < date2) {
      return false;
    } else {
      return true;
    }
  }
  disabledInput(date: any) {
    if (date === "" || date === null || date === undefined) {
      return false;
    }
    let date1 = "";
    if (date && date instanceof Date) {
      date1 = this.datePipe.transform(date, "yyyy/MM/dd");
    } else {
      date1 = this.datePipe.transform(new Date(date), "yyyy/MM/dd");
    }
    const date2 = this.datePipe.transform(new Date(), "yyyy/MM/dd");
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (d1 > d2) {
      return true;
    } else if (date1 < date2) {
      return true;
    } else {
      return false;
    }
  }

  constructor(
    private service: RecordAccountCheckService,
    private servicePen: PenService,
    private serviceRoom: RoomService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private router: Router,
    public record2PigService: Record2PigService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private accountService: XAccountService,
  ) {
    super(translate,environment.apiUrl);
    
  }
  pens: any;
  pigs: any;
  pigGuid: string;
  estDate: any;
  status: string;
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
  ngAfterContentChecked() {
    this.cdr.detectChanges()
 // call or add here your code
}
  ngOnInit() {
    this.onParamChange();
    this.toolbarOptions = [
      {
        text: this.translate.instant("Excelexport"),
        align: "Right",
        id: "grid_excelexport",
        prefixIcon: "e-excelexport e-icons",
      },
      { template: this.odsTemplate, align: "Right" },
      "Add",
      { template: this.statusTemplate },
      { template: this.estTemplate },
      { text: "Search", align: "Left" },
    ];
    // this.Permission(this.route);
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
    this.loadData();
    this.loadOrderStatus();
    this.loadButtonConfig();
    this.loadAccount();
  }

  loadRoomGuid() {
    return this.serviceRoom
      .getRoomByRecord(this.model?.guid || "", "Record_Disinfection")
      .toPromise();
  }
  loadPen() {
    this.servicePen
      .getPensByFarmGuidAndRoomGuid(
        localStorage.getItem("farmGuid"),
        this.roomGuid
      )
      .subscribe((x) => {
        this.dataPen = x;
        this.getCheckedData();
      });
  }
  loadAccount() {
    const accessToken = localStorage.getItem("token");
    this.dataAccount = new DataManager({
      url: `${this.baseUrl}XAccount/GetDataDropdownlist`,
      adaptor: new UrlAdaptor(),
      headers: [{ authorization: `Bearer ${accessToken}` }],
    });
  }
  loadPig() {
    const accessToken = localStorage.getItem("token");
    this.pigData = new DataManager({
      url: `${this.baseUrl}Pig/GetPigsByPen?penGuid=${
        this.penGuid || ""
      }&recordGuid=${this.model?.guid || ""}&type=Record_Disinfection`,
      adaptor: new UrlAdaptor(),
      headers: [{ authorization: `Bearer ${accessToken}` }],
    });
  }
  onChangeMakeOrder(e) {
    if (e.isInteracted) {
      this.roomGuid = e.itemData?.roomGuid;
    }
  }
  onChangeArea(e) {}
  onChangeBarn(e) {}
  onChangeRoom(e) {
    this.roomGuid = e.itemData?.guid;
    this.loadPen();
  }
  actionCompleteChange() {
    this.accountSelected =  this.accountDataSource.map(x=> x.accountGuid);
  }
async  onChangeAccount(e) {
  if (e.isInteracted) {
    const accounts = this.accountDataSource.map(x=> x.accountGuid);
    this.accountDataSource = await  this.service.getSelectedRecordAccount({
        accounts: e.value.concat(accounts),
        guid: this.model.guid || ""
      }).toPromise()
      this.accountSelected =  this.accountDataSource.map(x=> x.accountGuid);
   
  }

  }
  async getRecord2Account() {
    return  await  this.service.getSelectedRecordAccount({
      accounts: this.accountSelected,
      guid: this.model.guid || ""
    }).toPromise();
  }
  onChangePen(e) {
    this.loadSelectedPen();
  }
  loadSelectedPen() {
    this.servicePen.getSelectedPen(this.selectedPen).subscribe((res: any) => {
      this.selectedPenData = res;
    });
  }
  loadButtonConfig() {
    let query = new Query();
    const accessToken = localStorage.getItem("token");
    let predicate: Predicate = new Predicate(
      "type",
      "equal",
      "Record_Disinfection"
    );
    predicate = predicate.and("link", "notequal", null);
    predicate = predicate.and("link", "notequal", "");

    query.where(predicate).sortBy("sort");

    new DataManager({
      url: `${this.baseUrl}SystemConfig/GetDataDropdownlist`,
      adaptor: new UrlAdaptor(),
      headers: [{ authorization: `Bearer ${accessToken}` }],
    })
      .executeQuery(query)
      .then((x: any) => {
        this.configButtonData = x.result;
        console.log(x.result);
      });
  }
  goToLink(item) {
    try {
      const uri = item.link?.trim() + this.model.guid;
      this.router.navigate([uri]);
      this.modalReference.dismiss();
    } catch (error) {}
  }
  // life cycle ejs-grid
  rowSelected(args) {
    //console.log(args.data);
  }
  recordClick(args: any) {
    //console.log(args.rowData);
    this.service.changeRecordAccountCheck(args.rowData);
  }

  onDoubleClick(args: any): void {
    this.setFocus = args.column; // Get the column from Double click event
  }
  onChangemakeOrderGuidSearch(e) {
    console.log(e);
  }
  onChangeEst(e) {
    if (e.isInteracted) {
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
  loadConfig() {
    let query = new Query();
    query.where("type", "equal", "Record_Disinfection");
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
              id: "grid_excelexport",
              prefixIcon: "e-excelexport e-icons",
            },
            { template: this.odsTemplate, align: "Right" },
            { template: this.statusTemplate },
            { template: this.estTemplate },
            { text: "Search", align: "Left" },
          ];
        } else {
          this.toolbarOptions = [
            {
              text: this.translate.instant("Excelexport"),
              align: "Right",
              id: "grid_excelexport",
              prefixIcon: "e-excelexport e-icons",
            },
            { template: this.odsTemplate, align: "Right" },
            "Add",
            { template: this.statusTemplate },
            { template: this.estTemplate },
            { text: "Search", align: "Left" },
          ];
        }
      });
  }
  loadData() {
    this.query = new Query();
    if (this.estDate) {
      this.query.where("estDate", "equal", this.convertDateTime(this.estDate));
    }
    if (this.orderStatusCheckedData.length > 1) {
      let predicate: Predicate = Predicate.or();
      predicate.predicates = [];
      for (const status of this.orderStatusCheckedData) {
        predicate.predicates.push(new Predicate("status", "equal", status));
      }
      this.query.where(predicate);
    } else if (this.orderStatusCheckedData.length == 1) {
      this.query.where(
        new Predicate("status", "equal", this.orderStatusCheckedData[0])
      );
    }
    const accessToken = localStorage.getItem("token");
    const farmGuid = localStorage.getItem("farmGuid");
    this.data = new DataManager(
      {
        url: `${this.baseUrl}RecordAccountCheck/LoadData?farmGuid=${farmGuid}&makeOrderGuid=&lang=${this.globalLang}`,
        adaptor: new UrlAdaptor(),
        headers: [{ authorization: `Bearer ${accessToken}` }],
      },
      this.query.sortByDesc("id").sortByDesc("estDate")
    );
  }
  getCheckedData() {
    this.servicePen
      .getPensByRoomAndRecord(
        this.roomGuid || "",
        this.model?.guid,
        "Record_Disinfection"
      )
      .subscribe((data) => {
        this.selectedPen = data.map((x) => x.guid);
        this.loadSelectedPen();
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
        this.model.farmGuid = farmGuid;
        this.model.record2Accounts = this.accountDataSource

        this.setStatus(this.model);
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

  setStatus(model: RecordAccountCheck) {
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
  update(callBack) {
    this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.updateTitle,
      this.alert.updateMessage,
      () => {
        callBack()
        this.model.record2Accounts = this.accountDataSource
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
  done() {
    const params = {
      type: "Record_Disinfection",
      recordGuid: this.model.guid,
      recordValue: this.recordValue,
    };
    this.record2PigService.updateWeight(params).subscribe(
      (res) => {
        if (res.success === true) {
          this.alertify.success(this.alert.updated_ok_msg);
        } else {
          this.alertify.warning(this.alert.system_error_msg);
        }
      },
      (error) => {
        this.alertify.warning(this.alert.system_error_msg);
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
      this.update(()=> {});
    } else {
      this.create();
    }
  }
  agree() {
  
    this.update(()=> {
      if (this.model.status == this.statusConts.Default) {
        this.model.status = this.statusConts.Agree;
      }
      this.model.agreeGuid = JSON.parse(localStorage.getItem("user")).guid;
      this.model.agreeDate = new Date();
    });
  }
  reject() {
   
    this.update(()=> {
      if (this.model.status == this.statusConts.Default) {
        this.model.status = this.statusConts.Reject;
      }
      this.model.agreeGuid = null;
      this.model.rejectGuid = JSON.parse(localStorage.getItem("user")).guid;
      this.model.rejectDate = new Date();
    });
  }

  execute() {
   
    this.update(()=> {
      if (this.model.status == this.statusConts.Reject || this.model.status == this.statusConts.Agree) {
        this.model.status = this.statusConts.Close;
      }
      this.model.status = this.statusConts.Close;
      this.model.executeGuid = JSON.parse(localStorage.getItem("user")).guid;
      this.model.executeDate = new Date();
    });
  }
  onParamChange() {
    this.route.paramMap.subscribe((params: any) => {
      const upperguid = params.get("upperguid");
      const recordguid = params.get("recordguid");
      if (upperguid) {
        this.service
          .getByRecordGuid(upperguid, recordguid)
          .subscribe((model: any) => {
            this.model = { ...model };
            this.openModal(this.templateRef, this.model);
          });
      }
    });
  }

 
 
  async openModal(template, data = {} as any) {
    this.roomGuid = null;
    this.penGuid = null;
    this.areaGuid = null;
    this.barnGuid =  null;
    this.checkedData = [];
    this.accountDataSource = [];
    this.accountSelected = [];
    this.oldaccountDataSource = [];
    this.pigData = [];
    if (data?.id > 0) {
      this.model = { ...data };
      this.accountDataSource = await this.getRecord2Account();
      this.accountSelected =  this.accountDataSource.map(x=> x.accountGuid);

      this.getAudit(this.model.id);
      this.title = "RecordAccountCheck_EDIT_MODAL";
    } else {
      this.model.id = 0;
      this.model.status = this.statusConts.Default;
      this.model.applyGuid = JSON.parse(localStorage.getItem("user")).guid;
      this.model.applyDate = new Date();
      this.model.estDate = new Date();
      this.model.endDate = null;
      this.title = "RecordAccountCheck_ADD_MODAL";
    }
    this.modalReference = this.modalService.open(template, {
      size: "xl",
      backdrop: "static",
    });
    this.cdr.detectChanges();

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

  rowDataBoundApplyOrder(args) {
    if (args.data.status === 2) {
      args.row.classList.add("status-2");
    }
    if (args.data.status === 4) {
      args.row.classList.add("status-4");
    }
    if (args.data.status === 5) {
      args.row.classList.add("status-5");
    }
  }
  loadOrderStatus() {
    new DataManager({
      url: `${
        this.baseUrl
      }CodeType/GetDataDropdownlist?lang=${localStorage.getItem(
        "lang"
      )}&codeType=Order_Status`,
      adaptor: new UrlAdaptor(),
      crossDomain: true,
    })
      .executeQuery(
        new Query()
          .skip(this.skip)
          .take(this.take)
          .addParams("lang", localStorage.getItem("lang"))
      )
      .then((data: any) => {
        this.orderStatus = data.result.filter((x) => x.guid != "");
      });
  }
  onCheckedChangeOrderStatus(e, data) {
    if (e.checked) {
      if (data.guid) {
        this.orderStatusCheckedData.push(+data.guid);
      }
    } else {
      if (data.guid) {
        this.orderStatusCheckedData = [
          ...this.orderStatusCheckedData.filter((x) => x !== +data.guid),
        ];
      }
    }
    this.loadData();
  }

  born(record2Account: any) {
    if (this.model.id > 0) {
      this.alertify.confirm4(
        this.alert.yes_message,
        this.alert.no_message,
        this.alert.updateTitle,
        this.alert.updateMessage,
        () => {
          this.accountService.SP_Record_AccountCheck_Born(this.model.guid).subscribe(
            (res) => {
              this.alertify.success(this.alert.updated_ok_msg);
              record2Account.recordGuid = this.model.guid;
                record2Account.loadData();
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
  removeAccount(record2Account: any) {
    if (this.model.id > 0) {
      this.alertify.confirm4(
        this.alert.yes_message,
        this.alert.no_message,
        this.alert.deleteTitle,
        this.alert.deleteMessage,
        () => {
          this.accountService.SP_Record_AccountCheck_Remove(this.model.guid).subscribe(
            (res) => {
              this.alertify.success(this.alert.deleted_ok_msg);
              record2Account.recordGuid = this.model.guid;
              record2Account.loadData();
            },
            (err) => this.alertify.warning(this.alert.system_error_msg)
          );
        },
        () => {
          this.alertify.error(this.alert.cancelMessage);
        }
      );
    
  }
}

}
