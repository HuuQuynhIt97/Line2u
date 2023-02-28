
import { NgxSpinnerService } from 'ngx-spinner';

import { DataManager, Query, UrlAdaptor, Predicate } from "@syncfusion/ej2-data";

import { L10n, setCulture } from "@syncfusion/ej2-base";
import {
  AfterViewInit,
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
import { Breeding2GiltIn, NewBoarIn } from '../../../config';

import { NewBoarInService } from '../../../services/new/new-boar-in.service';
import { Breeding2GiltInService } from '../../../services';
import { Breeding2BoarInComponent } from './breeding2-gilt-in/breeding2-gilt-in.component';

declare let window: any;
@Component({
  selector: 'app-new-boar-in',
  templateUrl: './new-boar-in.component.html',
  styleUrls: ['./new-boar-in.component.scss']
})
export class NewBoarInComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit
  {
    public query: Query;
    localLang = window.navigator.userLanguage || window.navigator.language;
    @Output() selectNewBoarIn = new EventEmitter();
    data: DataManager;
    baseUrl = environment.apiUrl;
    password = "";
    modalReference: NgbModalRef;

    @ViewChild("grid") public grid: GridComponent;
    model: NewBoarIn;
    setFocus: any;
    locales = localStorage.getItem("lang");
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
    // @ViewChild("makeOrderGuidSearchTemplate", { static: true }) public makeOrderGuidSearchTemplate: any;
    @ViewChild("optionModal") templateRef: TemplateRef<any>;
    makeOrderGuidSearch:any;
    toolbarOptions: any;
    selectionOptions = { checkboxMode: "ResetOnRowClick" };
    fields: object = { text: "name", value: "guid" };
    pigData: DataManager;
  recordValue: any;
    disable: boolean;
    makeOrderGuid: any;
    subscription: Subscription = new Subscription();
    makeOrderValue: any;
    statusDefault = 1;
    statusAgree = 2;
    statusClose = 4;
    statusReject = 5;
    roomGuid: string;
    penGuid: string;
    pen: any;
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
  breeding2GiltInsData: Breeding2GiltIn[];
  realTotalWeight: any;
  realQty: any;
  @ViewChild(Breeding2BoarInComponent, {static: false}) breeding2NewBoarInComponent: Breeding2BoarInComponent
    public actionCompletePig(e: any): void {
      e.result = e.result?.filter(x=> x?.guid != "");
    }
    actionBeginPig(e:any) {
      // console.log(e)
      if (e.action === 'edit' && e.requestType === 'save') {

        const index = this.selectedPigData.findIndex((obj => obj.pigGuid === e.data.pigGuid));
        if (index !== -1) {
          this.selectedPigData[index].recordAmount = e.data.recordAmount;
          this.selectedPigData[index].recordWeight = e.data.recordWeight;

          this.selectedPigData = [...this.selectedPigData];
          const weights = this.selectedPigData.map(x=> x.recordWeight);
        // this.selectedPig = this.selectedPigData.map(x=> x.pigGuid);
          this.avgWeight = +this.average(weights).toFixed(0);
          this.totalWeight = +this.total(weights).toFixed(0);
        }
      }
    }
    public actionComplete(e: any): void {
      e.result = e.result?.filter(x=> x?.guid != "");
    }
    public onFiltering: any = (e: any) => {
      let query: Query = new Query().skip(this.skip)
      .take(this.take)
      .where("roomGuid", "equal", this.roomGuid)
      .where("farmGuid", "equal", localStorage.getItem("farmGuid"))
      .where("status", "equal", 1)
      //frame the query based on search string with filter type.
      query = (e.text !== '') ? query.search(e.text, ['penName', 'penNo']) : query;
      //pass the filter data source, filter query to updateData method.
      e.updateData(this.dataPen, query);
  };
public onFilteringPig: any = (e: any) => {
    let query: Query = new Query().skip(this.skip)
    .take(this.take)
    .where("farmGuid", "equal", localStorage.getItem("farmGuid"))
    .where("status", "equal", 1)
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.search(e.text, ['name']) : query;
    //pass the filter data source, filter query to updateData method.
       e.updateData(this.dataPig, query);
  };
    enabledInput(date : any) {
    if (date === "" || date === null || date === undefined) { return true; }
    let date1 = "";
    if (date && date instanceof Date) {
      date1 = this.datePipe.transform(date, "yyyy/MM/dd");
    } else {
      date1 = this.datePipe.transform(new Date(date), "yyyy/MM/dd")
    }
    const date2 = this.datePipe.transform(new Date(), "yyyy/MM/dd");
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
    const date2 = this.datePipe.transform(new Date(), "yyyy/MM/dd");
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
      private service: NewBoarInService,
      private servicePen: PenService,
      private serviceRoom: RoomService,
      public modalService: NgbModal,
      private alertify: AlertifyService,
      private servicePig: PigService,
      private route: ActivatedRoute,
private router: Router,
      public breeding2GiltInService: Breeding2GiltInService,
      private datePipe: DatePipe,
      private spinner: NgxSpinnerService,
    public translate: TranslateService,
    ) {
      super(translate,environment.apiUrl);
    }
  ngAfterViewInit(): void {
    this.subscription.add(this.breeding2GiltInService.currentbreeding2GiltIn.subscribe(x=> {
      if (JSON.stringify(x) !== JSON.stringify(this.breeding2GiltInsData )) {
        this.breeding2GiltInsData = x as any;
      }
    }));

    this.subscription.add(this.breeding2GiltInService.realTotalWeightCurrent.subscribe(x=> {
      if (x) {
        this.realTotalWeight = x as any;
      }
    }));

    this.subscription.add(this.breeding2GiltInService.realQtyCurrent.subscribe(x=> {
      if (x) {
        this.realQty = x as any;
      }
    }));

  }
  penGuidName: any;
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
              // { template: this.makeOrderGuidSearchTemplate, align: 'Left' },
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
        .getRoomByRecord(this.model?.guid || "", "NewBoarIn")
        .toPromise();
    }
    async loadPen() {
      this.dataPen = await this.servicePen.getPensByFarmGuidAndRoomGuid(localStorage.getItem("farmGuid"), this.roomGuid).toPromise();
    }
   async loadPig() {
      const obj = {
        pens: this.selectedPen,
        farmGuid: localStorage.getItem("farmGuid"),
        roomGuid: this.roomGuid || ""
      }
      this.dataPig = await this.servicePig.getPigByManyPen(obj).toPromise();
    }
      onChangeMakeOrder(e) {
      this.roomGuid = e.itemData?.roomGuid;
  }
  onChangeRoom(e) {
      // this.roomGuid = e.value;
      if (!this.penGuid) {
        this.loadPig();
      }
      this.loadPen();
    }
    onChangePen(e) {
      this.penGuidName = e.itemData?.name;
      if (e.isInteracted) {
        this.loadSelectedPen();
        this.loadPig();
      }
    }
 
    loadSelectedPen() {
      this.servicePen.getSelectedPen(this.selectedPen).subscribe((res: any) => {
        this.selectedPenData = res;
      });
    }
    onChangePig(e) {
      if (e.isInteracted) {
        this.loadSelectedPig();
      }
    }
    onChangeRecordNext(e, data) {
      if(e.isInteracted) {
        data.recordNext = e.itemData?.recordNext;
        const index = this.selectedPigData.findIndex((obj => obj.pigGuid === data.pigGuid));
        if (index !== -1) {
          this.selectedPigData[index].recordNext = e.value;
        }
      }
    }
    onChangeDisease(e, data) {
      if(e.isInteracted) {
        data.recordDisease = e.itemData?.guid;
        data.recordDiseaseName = e.itemData?.name;
        const index = this.selectedPigData.findIndex((obj => obj.pigGuid === data.pigGuid));
        if (index !== -1) {
          this.selectedPigData[index].recordDisease = e.itemData?.guid;
          this.selectedPigData[index].recordDiseaseName = e.itemData?.name;
        }
      }

    }
    loadSelectedPig() {
      this.oldselectedPigData = this.selectedPigData;
      const p = {
        pigs: this.selectedPig,
        recordGuid: this.model.guid || '',
        type: 'NewBoarIn'
      }
      this.servicePig.getSelectedPig3(p).subscribe((res: any) => {
        this.selectedPigData = res;
        for (const old of this.oldselectedPigData) {
          for (const news of this.selectedPigData) {
            if (old.pigGuid === news.pigGuid) {
              news.recordAmount = old.recordAmount;
              news.recordWeight = old.recordWeight;
              news.recordDisease = old.recordDisease;
              news.recordDiseaseName = old.recordDiseaseName;
              news.recordNext = old.recordNext;
            }
          }
        }
        const weights = this.selectedPigData.map(x=> x.recordWeight);
        // this.selectedPig = this.selectedPigData.map(x=> x.pigGuid);
        this.avgWeight = +this.average(weights).toFixed(0);
        this.totalWeight = +this.total(weights).toFixed(0);
      });
    }
    loadButtonConfig() {
    let query = new Query();
    const accessToken = localStorage.getItem("token");
    let predicate: Predicate = new Predicate("type", "equal", "NewBoarIn");
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
      this.service.changeNewBoarIn(args.rowData);
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
      query.where("type", "equal", "NewBoarIn");
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
              //{ template: this.makeOrderGuidSearchTemplate, align: 'Left' },
            ];
          } else {
            this.toolbarOptions = [
              { text: this.translate.instant('Excelexport'), align: 'Right', id:'grid_excelexport', prefixIcon: 'e-excelexport e-icons'},
              { template: this.odsTemplate, align: 'Right' },
              "Add",
              { template: this.statusTemplate },
              { template: this.estTemplate },
              { text: 'Search', align: 'Left'},
              //{ template: this.makeOrderGuidSearchTemplate, align: 'Left' },
            ];
          }
        });
    }
    loadData() {
      this.query = new Query();
      if (this.estDate) {
        this.query.where("estDate", "equal", this.convertDateTime(this.estDate));
      }
      // if (this.makeOrderGuidSearch) {
      //   this.query.where("makeOrderGuid", "equal", this.makeOrderGuidSearch);
      // }
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
          url: `${this.baseUrl}NewBoarIn/LoadData?farmGuid=${farmGuid}&lang=${this.globalLang}`,
          adaptor: new UrlAdaptor(),
          headers: [{ authorization: `Bearer ${accessToken}` }],
        },
        this.query.sortByDesc("estDate").sortByDesc("createDate")
      );
    }
    async getCheckedData() {
      const data = await this.servicePen
      .getPensByRoomAndRecord(
        this.roomGuid || "",
        this.model?.guid,
        "NewBoarIn"
      ).toPromise();
        this.selectedPen = data.map(x=> x.guid)
        this.model.pens = data.map(x=> x.guid);
        this.loadSelectedPen();
        await this.loadPig();
        this.getCheckedPigData();
  }
    getCheckedPigData() {
      this.servicePig
        .getSelectedPigsByRecord(
          this.model?.guid,
          "NewBoarIn"
        )
        .subscribe((data: any) => {
          this.selectedPig = data.map(x=> x.guid)
          this.model.pigs = data.map(x=> x.guid);
         this.loadSelectedPig();
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
      // this.service2.endEditChange(true);
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
          this.model.pens = this.selectedPen;
          this.model.pigs = this.selectedPig;
          // this.model.record2Pigs = this.selectedPigData;
          this.model.breeding2GiltIns = this.breeding2GiltInsData;
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

    setStatus(model: NewBoarIn) {
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
      // this.service2.endEditChange(true);

      this.alertify.confirm4(
        this.alert.yes_message,
        this.alert.no_message,
        this.alert.updateTitle,
        this.alert.updateMessage,
        () => {
          this.model.roomGuid = this.roomGuid;
          this.model.penGuid = this.penGuid;
          this.model.pens = this.selectedPen;
          this.model.pigs = this.selectedPig;
          // this.model.record2Pigs = this.selectedPigData;
          this.model.breeding2GiltIns = this.breeding2GiltInsData;
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
        type: 'NewBoarIn',
        recordGuid: this.model.guid,
        recordValue: this.recordValue
      }
      // this.breeding2NewBoarInService.updateWeight(params).subscribe(
      //   (res) => {
      //     if (res.success === true) {
      //       this.alertify.success(this.alert.updated_ok_msg);
      //     } else {
      //       this.alertify.warning(this.alert.system_error_msg);
      //     }
      //   },
      //   (error) => {
      //     this.alertify.warning(this.alert.system_error_msg);
      //   }
      // );
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
    }
    save(giltIn) {
      giltIn.grid.endEdit();
      if (this.model.id > 0) {
        this.update();
      } else {
        this.create();
      }
    }
    
    agree(giltIn) {
      giltIn.grid.endEdit();
      this.model.status = this.statusConts.Agree;
      this.model.agreeGuid = JSON.parse(localStorage.getItem("user")).guid;
      this.model.agreeDate = new Date();
      this.update();
    }
    reject(giltIn) {
      giltIn.grid.endEdit();
      this.model.status = this.statusConts.Reject;
      this.model.agreeGuid = null;
      this.model.rejectGuid = JSON.parse(localStorage.getItem("user")).guid;
      this.model.rejectDate = new Date();
      this.update();
    }
    veterinary(giltIn) { 
      giltIn.grid.endEdit();
      this.model.status = this.statusConts.Execute;
      this.model.veterinaryGuid = JSON.parse(localStorage.getItem("user")).guid;
      this.model.veterinaryDate = new Date();
      //this.model.realTotalWeight = this.realTotalWeight
      this.update();
    }
    execute(giltIn) {
      giltIn.grid.endEdit();
      this.model.status = this.statusConts.Close;
      this.model.executeGuid = JSON.parse(localStorage.getItem("user")).guid;
      this.model.executeDate = new Date();
      //this.model.realTotalWeight = this.realTotalWeight
      this.update();
    }
    onParamChange() {
      this.route.paramMap.subscribe((params: any) => {
        const upperguid = params.get('upperguid');
        const recordguid = params.get('recordguid');
        if (upperguid) {
          this.service.getByRecordGuid(upperguid,recordguid)
          .subscribe((model: any) => {
            this.model = {...model};
            // this.model.upperGuid = upperguid;
            // this.model.upperRecord= recordguid;
            this.openModal(this.templateRef, this.model);
          });
        }

      })
    }
    //GetSelectedBreeding2NewBoarIn
    getselected() {
      let query = new Query().skip(this.skip)
      .take(this.take);
      query.where("recordGuid", "equal", this.model.guid)
      query.where("type", "equal", "NewBoar_IN")
    new DataManager({
        url: `${this.baseUrl}NewBoarIn/GetSelectedBreeding2NewBoarIn`,
        adaptor: new UrlAdaptor,
        crossDomain: true,
      })
      .executeQuery(query)
      .then((data: any)=> {
        this.breeding2GiltInsData = data.result;
      });
    }
    async openModal(template, data = {} as any) {
      this.roomGuid = "";
      this.penGuid = "";
      this.checkedData = [];
      this.selectedPen = [];
      this.selectedPenData = [];
      this.selectedPig = [];
      this.selectedPigData = [];
      this.breeding2GiltInsData = [] as Breeding2GiltIn[];
      this.pigData = new DataManager();
      if (data?.id > 0) {
        this.model = { ...data };
        this.penGuid = data.penGuid;
        console.log(this.model)
        try
        {
          this.spinner.show('default');
          this.breeding2GiltInService.getAll
          this.getAudit(this.model.id);
        }
        catch {
                    this.spinner.hide('default');
        }
        this.spinner.hide('default');
        this.title = "NewBoarIn_EDIT_MODAL";
      } else {
        this.model.id = 0;
        this.model.status = this.statusConts.Default;
        this.model.applyGuid = JSON.parse(localStorage.getItem("user")).guid;
        this.model.applyDate = new Date();
        this.model.estDate = new Date();
        this.title = "NewBoarIn_ADD_MODAL";
      }
      this.modalReference = this.modalService.open(template, {
        size: "xxl",
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
   
    onChangemakeOrderGuid(e) {
      setTimeout(() => {
        this.penGuid = e.itemData?.penGuid;
        this.roomGuid = e.itemData?.roomGuid;
        console.log('penGuid', this.penGuid)
        console.log('roomGuid', this.roomGuid)
      },0)
    }
  }