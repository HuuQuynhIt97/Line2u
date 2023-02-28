

import { NgxSpinnerService } from 'ngx-spinner';

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

import { PenService, RoomService } from "src/app/_core/_service/farms";
import { Record2PigService } from 'src/app/_core/_service/apply-orders';
import { SowSiloService } from '../../services/new/sow-silo.service';
import { SowSilo } from '../../config';

declare let window: any;
@Component({
  selector: 'pigfarm-sow-silo',
  templateUrl: './sow-silo.component.html',
  styleUrls: ['./sow-silo.component.scss']
})
export class SowSiloComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public query: Query;
  localLang = window.navigator.userLanguage || window.navigator.language;
  @Output() selectSowSilo = new EventEmitter();
  data: DataManager;
  baseUrl = environment.apiUrl;
  password = "";
  modalReference: NgbModalRef;

  @ViewChild("grid") public grid: GridComponent;
  model: SowSilo;
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
  @ViewChild("makeOrderGuidSearchTemplate", { static: true }) public makeOrderGuidSearchTemplate: any;
    @ViewChild("optionModal") templateRef: TemplateRef<any>;
    makeOrderGuidSearch:any;
  toolbarOptions: any;
  selectionOptions = { checkboxMode: "ResetOnRowClick" };
  fields: object = { text: "name", value: "guid" };
  pigData: DataManager;
  recordValue: any;
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
  checkedData: any[] = [];
  orderStatusCheckedData: any[] = [];
    orderStatus: any;
  configButtonData: any;
  getDate = new Date();
  public actionComplete(e: any): void {}
  enabledInput(date : any) {
    if (date === "" || date === null || date === undefined) { return true; }
    let date1 = "";
    if (date && date instanceof Date) {
      date1 = this.datePipe.transform(date, "yyyy/MM/dd");
    } else {
      date1 = this.datePipe.transform(new Date(date), "yyyy/MM/dd")
    }
    let date2 = ""
    if (this.getDate && this.getDate instanceof Date) {
      date2 = this.datePipe.transform(this.getDate, "yyyy/MM/dd");
    } else {
      date2 = this.datePipe.transform(new Date(this.getDate), "yyyy/MM/dd")
    }
    //const date2 = this.datePipe.transform(new Date(), "yyyy/MM/dd");
    const d1 =  new Date(date1);
    const d2 = new Date(date2);
    if(d1 > d2){
      return false;
    } else if(date1 < date2){
        return false;
    } else{
        return true;
    }
  }
  disabledInput(date : any) {
    if (date === "" || date === null || date === undefined) { return false; }
    let date1 = "";
    if (date && date instanceof Date) {
      date1 = this.datePipe.transform(date, "yyyy/MM/dd");
    } else {
      date1 = this.datePipe.transform(new Date(date), "yyyy/MM/dd")
    }
    let date2 = ""
    if (this.getDate && this.getDate instanceof Date) {
      date2 = this.datePipe.transform(this.getDate, "yyyy/MM/dd");
    } else {
      date2 = this.datePipe.transform(new Date(this.getDate), "yyyy/MM/dd")
    }
    //const date2 = this.datePipe.transform(new Date(), "yyyy/MM/dd");
    const d1 =  new Date(date1);
    const d2 = new Date(date2);
    if(d1 > d2){
      return true;
    } else if(date1 < date2){
        return true;
    } else{
        return false;
    }
  }
    constructor(
    private service: SowSiloService,
    private servicePen: PenService,
    private serviceRoom: RoomService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private servicePig: PigService,
    private route: ActivatedRoute,
private router: Router,
      public record2PigService: Record2PigService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    public translate: TranslateService
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
   ngOnInit() {
      this.onParamChange();
      this.toolbarOptions = [
              { text: this.translate.instant('Excelexport'), align: 'Right', id:'grid_excelexport', prefixIcon: 'e-excelexport e-icons'},
              { template: this.odsTemplate, align: 'Right' },
              "Add",
              { template: this.statusTemplate },
              { template: this.estTemplate },
              { text: 'Search', align: 'Left'},
              { template: this.makeOrderGuidSearchTemplate, align: 'Left' },
            ];
    // this.Permission(this.route);
    let lang = localStorage.getItem("lang");
    let languages = JSON.parse(localStorage.getItem("languages"));
    // setCulture(lang);
    let load = {
      [lang]: {
        grid: languages["grid"],
        pager: languages["pager"],
          "multi-select": languages["multiselect"]
      },
    };
    L10n.load(load);
      this.loadConfig();
    this.loadData();
    this.loadOrderStatus();
    this.loadButtonConfig();
  }


  loadRoomGuid() {
    return this.serviceRoom
      .getRoomByRecord(this.model?.guid || "", "Sow_Silo")
      .toPromise();
  }
    onChangeMakeOrder(e) {
    if (e.isInteracted) {
      this.roomGuid = e.itemData?.roomGuid;
    }
  }
  onChangeRoom(e) {
    // this.roomGuid = e.value;
  }

  loadButtonConfig() {
    let query = new Query();
    const accessToken = localStorage.getItem("token");
    let predicate: Predicate = new Predicate("type", "equal", "Sow_Silo");
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
    this.service.changeSowSilo(args.rowData);
  }

  onDoubleClick(args: any): void {
    this.setFocus = args.column; // Get the column from Double click event
  }
  onChangemakeOrderGuidSearch(e) {
      if (e.isInteracted) {
        this.makeOrderGuidSearch = e.value;
          this.loadData();
        }
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
    query.where("type", "equal", "Sow_Silo");
    query.where("no", "equal", "insert");

    const accessToken = localStorage.getItem("token");
    new DataManager(
      {
        url: `${this.baseUrl}SystemConfig/GetDataDropdownlist`,
        adaptor: new UrlAdaptor(),
        headers: [{ authorization: `Bearer ${accessToken}` }],
      }).executeQuery(query).then((x: any)=> {
        const configData = x.result;
        const item = configData[0];
        if (item && item.value === '0') {
          this.toolbarOptions = [
            { text: this.translate.instant('Excelexport'), align: 'Right', id:'grid_excelexport', prefixIcon: 'e-excelexport e-icons'},
            { template: this.odsTemplate, align: 'Right' },
            { template: this.statusTemplate },
            { template: this.estTemplate },
            { text: 'Search', align: 'Left'},
            { template: this.makeOrderGuidSearchTemplate, align: 'Left' },
          ];
        } else {
          this.toolbarOptions = [
            { text: this.translate.instant('Excelexport'), align: 'Right', id:'grid_excelexport', prefixIcon: 'e-excelexport e-icons'},
            { template: this.odsTemplate, align: 'Right' },
            "Add",
            { template: this.statusTemplate },
            { template: this.estTemplate },
            { text: 'Search', align: 'Left'},
            { template: this.makeOrderGuidSearchTemplate, align: 'Left' },
          ];
        }
      });
  }
  loadData() {
    this.query = new Query();
    if (this.estDate) {
      this.query.where("estDate", "equal", this.convertDateTime(this.estDate));
    }
    if (this.makeOrderGuidSearch) {
      this.query.where("makeOrderGuid", "equal", this.makeOrderGuidSearch);
    }
    if (this.orderStatusCheckedData.length > 1) {
      let predicate: Predicate = Predicate.or();
      predicate.predicates = [];
      for (const status of this.orderStatusCheckedData) {
          predicate.predicates.push(new Predicate("status", "equal", status));
      }
      this.query.where(predicate);
    } else if(this.orderStatusCheckedData.length == 1) {
      this.query.where(new Predicate("status", "equal", this.orderStatusCheckedData[0]));
    }
    const accessToken = localStorage.getItem("token");
    const farmGuid = localStorage.getItem("farmGuid");
    this.data = new DataManager(
      {
        url: `${this.baseUrl}SowSilo/LoadData?farmGuid=${farmGuid}&makeOrderGuid=&lang=${this.globalLang}`,
        adaptor: new UrlAdaptor(),
        headers: [{ authorization: `Bearer ${accessToken}` }],
      },
      this.query.sortByDesc("estDate").sortByDesc("createDate")
    );
  }
  getCheckedData() {
    this.servicePig
      .getPigsByPenAndRecord(
        this.penGuid || "",
        this.model?.guid,
        "Sow_Silo"
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
          if (key === 'createDate') {
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
        this.model.roomGuid = this.roomGuid;
        this.model.penGuid = this.penGuid;
        this.setStatus(this.model);
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

  setStatus(model: SowSilo) {
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
  done() {
      const params = {
        type: 'Sow_Silo',
        recordGuid: this.model.guid,
        recordValue: this.recordValue
      }
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
    this.update();
  }
  onParamChange() {
      this.route.paramMap.subscribe((params: any) => {
        const upperguid = params.get('upperguid');
        const recordguid = params.get('recordguid');
        if (upperguid) {
          // this.service.getByRecordGuid(upperguid,recordguid)
          // .subscribe((model: any) => {
          //   this.model = {...model};
          //   this.model.upperGuid = upperguid;
          //   this.model.upperRecord= recordguid;
          //   this.openModal(this.templateRef, this.model);
          // });
        }

      })
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
this.getAudit(this.model.id);
      this.title = "Sow_Silo_EDIT_MODAL";
    } else {
      this.model.id = 0;
      this.model.makeOrderGuid = '';
      this.model.status = this.statusConts.Default;
      this.model.applyGuid = JSON.parse(localStorage.getItem("user")).guid;
      this.model.applyDate = new Date();
      this.model.estDate = new Date();
      this.title = "Sow_Silo_ADD_MODAL";
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
        // this.service.toggleRecordDate(id).subscribe(
        //   (res) => {
        //     if (res.success === true) {
        //       this.alertify.success(this.alert.updated_ok_msg);
        //       this.loadData();
        //       this.modalReference.dismiss();
        //     } else {
        //       this.alertify.warning(this.alert.system_error_msg);
        //     }
        //   },
        //   (error) => {
        //     this.alertify.warning(this.alert.system_error_msg);
        //   }
        // );
      },
      () => {
        this.alertify.error(this.alert.cancelMessage);
      }
    );
  }

  rowDataBoundApplyOrder(args){
    if(args.data.status === 2){
      args.row.classList.add('status-2');
    }
    if(args.data.status === 4){
      args.row.classList.add('status-4');
    }
    if(args.data.status === 5){
      args.row.classList.add('status-5');
    }
  }
  loadOrderStatus() {
    new DataManager({
      url: `${this.baseUrl}CodeType/GetDataDropdownlist?lang=${localStorage.getItem('lang')}&codeType=Order_Status`,
      adaptor: new UrlAdaptor,
      crossDomain: true,
    })
    .executeQuery(new Query()
    .skip(this.skip)
    .take(this.take)
    .addParams("lang", localStorage.getItem('lang')))
    .then((data: any)=> {
      this.orderStatus = data.result.filter(x=> x.guid != "");
    });
  }
  onCheckedChangeOrderStatus(e, data) {
    if (e.checked) {
      if (data.guid) {
        this.orderStatusCheckedData.push(+data.guid);
      }
    } else {
      if (data.guid) {
        this.orderStatusCheckedData = [...this.orderStatusCheckedData.filter(x=> x !== +data.guid)];
       }
    }
    this.loadData();
  }

  ngModelChangeEstAmount() {
    const est  = this.model.estAmount || 0;
    const remaining  = this.model.remainingAmount || 0;
    const real = this.model.realAmount || 0;
    if (est + remaining > real && real > 0) {
      this.model.estAmount = 0;
      const mes = this.translate.instant('EST_Amount + Remaining_Amount > Real_Amount');
      this.alertify.warning(mes, true)
    }
  }
  ngModelChangeRemainingAmount() {
    const est  = this.model.estAmount || 0;
    const remaining  = this.model.remainingAmount || 0;
    const real = this.model.realAmount || 0;
    if (est + remaining > real && real > 0) {
      const mes = this.translate.instant('EST_Amount + Remaining_Amount > Real_Amount');
      this.model.remainingAmount = 0;

      this.alertify.warning(mes, true)
    }
  }
  ngModelChangeRealAmount(e) {
    const est  = this.model.estAmount || 0;
    const remaining  = this.model.remainingAmount || 0;
    const real = this.model.realAmount || 0;
    if (est + remaining > real && real > 0) {
      const mes = this.translate.instant('EST_Amount + Remaining_Amount > Real_Amount');
      this.model.realAmount = 0;
      this.alertify.warning(mes, true)
    }
  }

}
