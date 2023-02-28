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

import { PenService, RoomService } from "src/app/_core/_service/farms";
import { Breeding2SowConst, Breeding2SowIn, SowIn } from "../../config";
import { Record2PigService } from "src/app/_core/_service/apply-orders";
import { BreedingService, SowInService } from "../../services";
declare let window: any;
@Component({
  selector: "app-sow-in",
  templateUrl: "./sow-in.component.html",
  styleUrls: ["./sow-in.component.scss"],
})
export class SowInComponent extends BaseComponent implements OnInit, OnDestroy {
  public query: Query;
  localLang = window.navigator.userLanguage || window.navigator.language;
  @Output() selectSowIn = new EventEmitter();
  data: DataManager;
  baseUrl = environment.apiUrl;
  password = "";
  modalReference: NgbModalRef;

  @ViewChild("grid") public grid: GridComponent;
  model: SowIn;
  setFocus: any;
  locale = localStorage.getItem("lang");
  editSettings = {
    showDeleteConfirmDialog: false,
    allowEditing: false,
    allowAdding: true,
    allowDeleting: false,
    mode: "Normal",
  };
  editSettingsPig = {
    showDeleteConfirmDialog: false,
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: "Normal",
  };
  title: any;
  avgWeight: any;
  totalWeight: any;
  @ViewChild("odsTemplate", { static: true }) public odsTemplate: any;
  @ViewChild("breedingGuidSearchTemplate", { static: true })
  public breedingGuidSearchTemplate: any;
  @ViewChild("optionModal", { static: false }) templateRef: TemplateRef<any>;

  breedingGuidSearch: any;
  toolbarOptions: any;
  selectionOptions = { checkboxMode: "ResetOnRowClick" };
  fields: object = { text: "name", value: "guid" };
  pigData: any;
  recordValue: any;
  disable: boolean;
  breedingGuid: any;
  subscription: Subscription;
  makeOrderValue: any;
  statusDefault = 1;
  statusAgree = 2;
  statusClose = 4;
  statusReject = 5;
  roomGuid: string;
  penGuid: string;
  dataPen: any;
  queryPen: Query;
  dataPig: any;
  queryPig: Query;
  checkedData: any[] = [];
  orderStatusCheckedData: number[] = [];
  orderStatus: any;
  configButtonData: any;
  selectedPen: any[] = [];
  selectedPenData: any[] = [];
  selectedPig: any[] = [];
  selectedPigData: any[] = [];
  oldselectedPigData: any[];
  selectedPig2: any[];
  firstValue: any;
  penGuidName: any;
  public actionCompletePig(e: any): void {
    e.result = e.result?.filter((x) => x?.guid != "");
  }

  public actionComplete(e: any): void {
    e.result = e.result?.filter((x) => x?.guid != "");
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
  public onFilteringPig: any = (e: any) => {
    let query: Query = new Query()
    //frame the query based on search string with filter type.
    query = e.text !== "" ? query.search(e.text, ["name"]) : query;
    //pass the filter data source, filter query to updateData method.
    e.updateData(this.dataPig, query);
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
    private service: SowInService,
    private serviceBreeding: BreedingService,
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
    public translate: TranslateService,
    private cdRef: ChangeDetectorRef
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
  // @ViewChild("estTemplate", { static: true }) public estTemplate: any;
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
      {
        text: this.translate.instant("Excelexport"),
        align: "Right",
        id: "grid_excelexport",
        prefixIcon: "e-excelexport e-icons",
      },
      { template: this.odsTemplate, align: "Right" },
      "Add",
      { template: this.statusTemplate },
      // { template: this.estTemplate },
      { text: "Search", align: "Left" },
      { template: this.breedingGuidSearchTemplate, align: "Left" },
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
  }

  loadRoomGuid() {
    return this.serviceRoom
      .getRoomByRecord(this.model?.guid || "", Breeding2SowConst.SowIn)
      .toPromise();
  }

  async loadPig() {
    if (this.penGuid) {
      this.dataPig = await this.servicePig
        .getPigByRoom(this.roomGuid)
        .toPromise();
    }
  }
  onChangebreedingGuid(e) {
    this.roomGuid = e.itemData?.roomGuid;
    setTimeout(() => {
      this.penGuid = e.itemData?.penGuid;
      console.log('penGuid', this.penGuid)
    },0)
    this.model.breedingGuid = e.itemData?.guid;
  }

  async onChangePen(e) {
    this.penGuid = e.itemData?.guid;
    this.penGuidName = e.itemData?.name;
    if (this.penGuid) {
      await this.loadPig();
    }
  }
  async onChangeRoom(e) {
    this.roomGuid = e.itemData?.guid;
    if (this.roomGuid) {
      await this.loadPig();
    }
  }
  // onChangePen(e) {
  //   if (e.isInteracted) {
  //     this.loadSelectedPen();
  //     this.loadPig();
  //   }
  // }
  loadSelectedPen() {
    this.servicePen.getSelectedPen(this.selectedPen).subscribe((res: any) => {
      this.selectedPenData = res;
    });
  }
  async onChangePig(e) {
    if (e.isInteracted) {
      this.selectedPig = e.value;
      await this.loadSelectedPigChangePigs();
    }
  }
  onChangeRecordNext(e, data) {
    if (e.isInteracted) {
      data.recordNext = e.itemData?.recordNext;
      const index = this.selectedPigData.findIndex(
        (obj) => obj.pigGuid === data.pigGuid
      );
      if (index !== -1) {
        this.selectedPigData[index].recordNext = e.value;
      }
    }
  }
  onChangeDisease(e, data) {
    if (e.isInteracted) {
      data.recordDisease = e.itemData?.guid;
      data.recordDiseaseName = e.itemData?.name;
      const index = this.selectedPigData.findIndex(
        (obj) => obj.pigGuid === data.pigGuid
      );
      if (index !== -1) {
        this.selectedPigData[index].recordDisease = e.itemData?.guid;
        this.selectedPigData[index].recordDiseaseName = e.itemData?.name;
      }
    }
  }
  async loadSelectedPig() {
    if (this.model.id > 0) {
      this.oldselectedPigData = this.selectedPigData;
      const p = {
        pigs: this.selectedPig,
        recordGuid: this.model.guid || "",
        breedingGuid: this.model.breedingGuid || "",
        type: Breeding2SowConst.SowIn,
        lang: this.locale,
      };
      const res = await this.servicePig.getSelectedSowInForHeating(p).toPromise();
      this.selectedPigData = res;
      for (let old of this.oldselectedPigData) {
        for (let news of this.selectedPigData) {
          if (old.sowGuid === news.sowGuid) {
            news = { ...old };
          }
        }
      }
      for (let item of this.selectedPigData) {
       item.lastStatus = item.lastStatus ? item.lastStatus : this.firstValue.guid
       item.lastStatusName =  item.lastStatusName ?  item.lastStatusName : this.firstValue.name
       item.heatingDate = item.heatingDate ?? new Date();
       item.matingDate =item.matingDate ?? new Date();
      
      }
    } else {
      const pigs = this.dataPig.filter(x=> this.selectedPig.includes(x.guid));
      this.selectedPigData = pigs.map(a=> {
        return {
          id: Math.random() * -1,
          sowGuid: a.guid,
          sowGuidName: a.name,
          penGuid:  this.penGuid,
          penGuidName:  this.penGuidName,
          heatingDate:  new Date(),
          matingDate:  new Date(),
          lastStatus:  this.firstValue.guid,
          lastStatusName:  this.firstValue.name,
        } as Breeding2SowIn
      })
    }
    
  }
  async loadSelectedPigChangePigs() {
   
      const pigs = this.dataPig.filter(x=> this.selectedPig.includes(x.guid));
      this.selectedPigData = pigs.map(a=> {
        return {
          id: Math.random() * -1,
          sowGuid: a.guid,
          sowGuidName: a.name,
          penGuid:  this.penGuid,
          penGuidName:  this.penGuidName,
          heatingDate:  new Date(),
          matingDate:  new Date(),
          lastStatus:  this.firstValue.guid,
          lastStatusName:  this.firstValue.name,
        } as Breeding2SowIn
      })
  }
   getFirstStatus() {
    let query = new Query()
    .addParams("lang", localStorage.getItem('lang'));
    let data = new DataManager({
      url: `${this.baseUrl}CodeType/GetDataDropdownlist?lang=${localStorage.getItem('lang')}&codeType=Breeding_STATUS`,
      adaptor: new UrlAdaptor,
      crossDomain: true,
    });

    data.executeQuery(query.sortBy('guid')).then((x: any)=> {
      const data2 = x.result.sort((a,b) => +a.guid - +b.guid);
      if ( data2.length > 0) {
        this.firstValue = data2[0]
      }
    });
    
  }
  loadButtonConfig() {
    let query = new Query();
    const accessToken = localStorage.getItem("token");
    let predicate: Predicate = new Predicate(
      "type",
      "equal",
      Breeding2SowConst.SowIn
    );
    predicate = predicate.and("link", "notequal", null);
    predicate = predicate.or("link", "notequal", "");

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
    this.service.changeSowIn(args.rowData);
  }

  onDoubleClick(args: any): void {
    this.setFocus = args.column; // Get the column from Double click event
  }
  onChangebreedingGuidSearch(e) {
    if (e.isInteracted) {
      this.breedingGuidSearch = e.value;
      this.loadData();
    }
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
  loadConfig() {
    let query = new Query();
    query.where("type", "equal", Breeding2SowConst.SowIn);
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
            // { template: this.estTemplate },
            { text: "Search", align: "Left" },
            { template: this.breedingGuidSearchTemplate, align: "Left" },
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
            // { template: this.estTemplate },
            { text: "Search", align: "Left" },
            { template: this.breedingGuidSearchTemplate, align: "Left" },
          ];
        }
      });
  }
  loadData() {
    this.query = new Query();
    // if (this.estDate) {
    //   this.query.where("estDate", "equal", this.convertDateTime(this.estDate));
    // }
    if (this.breedingGuidSearch) {
      this.query.where("breedingGuid", "equal", this.breedingGuidSearch);
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
        url: `${this.baseUrl}SowIn/LoadData?farmGuid=${farmGuid}&lang=${this.globalLang}`,
        adaptor: new UrlAdaptor(),
        headers: [{ authorization: `Bearer ${accessToken}` }],
      },
      this.query.sortByDesc("id")
    );
  }
  async getCheckedData() {
    await this.loadPig();
    const selectedPig = await this.servicePig
      .getSelectedPigsByBreedingSowInGuid(
        this.model?.guid,
        Breeding2SowConst.SowIn
      )
      .toPromise();
    this.selectedPig = selectedPig.map((x) => x.guid) || null;
    await this.loadSelectedPig();
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
  getPenByBreedingGuid() {
    return this.serviceBreeding.getByGuid(this.model.breedingGuid).toPromise();
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
        this.setStatus(this.model);

        this.model.breeding2Sow = this.selectedPigData;
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

  setStatus(model: SowIn) {
    if (model.executeGuid) {
      this.model.status = this.statusConts.Execute;
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
        this.model.executeDate = this.convertDateTime(this.model.executeDate);
        this.model.breeding2Sow = this.selectedPigData;
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
      type: Breeding2SowConst.SowIn,
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
      this.update();
    } else {
      this.create();
    }
  }

  execute() {
    if (this.model.id == 0) {
      this.create();
    } else {
      this.model.status = this.statusConts.Close;
      this.model.executeGuid = JSON.parse(localStorage.getItem("user")).guid;
      this.model.executeDate = new Date();
      this.update();
    }
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
    this.penGuid = "";
    this.checkedData = [];
    this.selectedPig = [];
    this.selectedPigData = [];
    this.pigData = [];
    this.getFirstStatus();
    if (data?.id > 0) {
      this.model = { ...data };
      this.title = "Sow_In_EDIT_MODAL";
    } else {
      this.model.id = 0;
      this.model.breedingGuid = "";
      this.model.status = this.statusConts.Default;
      this.model.executeGuid = JSON.parse(localStorage.getItem("user")).guid;
      this.model.executeDate = new Date();
      this.title = "Sow_In_ADD_MODAL";
    }
    this.modalReference = this.modalService.open(template, {
      size: "xxl",
      backdrop: "static",
    });
    this.modalReference.shown.subscribe(async () => {
      if (data?.id > 0) {
        try {
          this.spinner.show("default");
          const breedingItem = await this.getPenByBreedingGuid();
          if (breedingItem) {
           setTimeout(() => {
            this.penGuid = breedingItem.penGuid;
           }, 0);
            await this.getCheckedData();
          }
          this.getAudit(this.model.id);
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
}
