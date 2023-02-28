import { Component, OnInit } from "@angular/core";
import { RecordDeathService } from "src/app/_core/_service/records";
import { environment } from "src/environments/environment";
import {
  DataManager,
  Query,
  UrlAdaptor,
  Predicate,
} from "@syncfusion/ej2-data";
import { ActivatedRoute, Route, Router } from "@angular/router";
// import {
//   MessageConstants,
//   StatusConstants,
// } from "projects/herr-core/src/_core/_constants";
import { AlertifyService, BaseComponent } from "herr-core";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";
import { PigService } from "src/app/_core/_service/pigs";
import { NgxSpinnerService } from "ngx-spinner";
import { Record2PigService } from "src/app/_core/_service/apply-orders";
import { PenService, RoomService } from "src/app/_core/_service/farms";
import { L10n, setCulture } from "@syncfusion/ej2-base";

@Component({
  selector: "app-edit-record-death",
  templateUrl: "./edit-record-death.component.html",
  styleUrls: ["./edit-record-death.component.css"],
})
export class EditRecordDeathComponent extends BaseComponent implements OnInit {
  model: any = {};
  baseUrl = environment.apiUrl;
  // statusConts = new StatusConstants();

  roomGuid: any;
  penGuid: any;
  selectedPen: any[] = [];
  selectedPig: any[] = [];
  selectedPigData: any[] = [];
  avgWeight: number;
  totalWeight: number;
  oldselectedPigData: any[] = [];
  dataPen: any;
  dataPig: any;
  selectedPenData: any[] = [];
  searchOptions = { fields: ["name"], operator: "contains", ignoreCase: true };
  fields: object = { text: "name", value: "guid" };

  queryPen: Query;
  queryPig: Query;
  configButtonData = [];
  checkedData: any[];
  pigData: any[];
  constructor(
    private _activatedRoute: ActivatedRoute,
    private service: RecordDeathService,
    private servicePen: PenService,
    private serviceRoom: RoomService,
    private alertify: AlertifyService,
    private servicePig: PigService,
    public record2PigService: Record2PigService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private router: Router,
    public translate: TranslateService
  ) {
    super(translate, environment.apiUrl);
  }
  loadButtonConfig() {
    let query = new Query();
    const accessToken = localStorage.getItem("token");
    let predicate: Predicate = new Predicate("type", "equal", "Record_Death");
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
    } catch (error) {}
  }
  async ngOnInit() {
    this.initParams();
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
    this.loadButtonConfig();

    const params = this._activatedRoute.snapshot.params;
    await this.getDetail(params["guid"]);
  }
  initParams() {
    this.roomGuid = "";
    this.penGuid = "";
    this.avgWeight = 0;
    this.checkedData = [];
    this.selectedPen = [];
    this.selectedPenData = [];
    this.selectedPig = [];
    this.selectedPigData = [];
    this.pigData = [];
  }
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
  onChangeMakeOrder(e) {
    if (e.isInteracted) {
      this.roomGuid = e.itemData?.roomGuid;
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

  async getDetail(guid) {
   

    this.spinner.show();
    try {
      this.model = await this.service.getByGuid(guid).toPromise();
      const roomData = await this.loadRoomGuid();
      if (roomData) {
        this.roomGuid = roomData?.roomGuid;
        await this.loadPen();
        await this.getCheckedData();
        this.getAudit(this.model.id);
      }
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }
  loadRoomGuid() {
    return this.serviceRoom
      .getRoomByRecord(this.model?.guid || "", "Record_Death")
      .toPromise();
  }
  getAudit(id) {
    this.service.getAudit(id).subscribe((data) => {
      this.audit = data;
    });
  }
  async getCheckedData() {
    const data = await this.servicePen
      .getPensByRoomAndRecord(
        this.roomGuid || "",
        this.model?.guid,
        "Record_Death"
      )
      .toPromise();
    this.selectedPen = data.map((x) => x.guid);
    this.model.pens = data.map((x) => x.guid);
    this.loadSelectedPen();
    await this.loadPig();
    this.getCheckedPigData();
  }
  getCheckedPigData() {
    this.servicePig
      .getSelectedPigsByRecord(this.model?.guid, "Record_Death")
      .subscribe((data: any) => {
        this.selectedPig = data.map((x) => x.guid);
        this.model.pigs = data.map((x) => x.guid);
        this.loadSelectedPig();
      });
  }
  setStatus(model: any) {
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
  save() {
    if (this.model.id > 0) {
      this.update(() => {});
    }
  }
  agree() {
    this.update(() => {
      if (this.model.status == this.statusConts.Default) {
        this.model.status = this.statusConts.Agree;
      }
      this.model.agreeGuid = JSON.parse(localStorage.getItem("user")).guid;
      this.model.agreeDate = new Date();
    });
  }
  reject() {
    this.update(() => {
      if (this.model.status == this.statusConts.Default) {
        this.model.status = this.statusConts.Reject;
      }
      this.model.agreeGuid = null;
      this.model.rejectGuid = JSON.parse(localStorage.getItem("user")).guid;
      this.model.rejectDate = new Date();
    });
  }
  execute() {
    this.update(() => {
      if (
        this.model.status == this.statusConts.Reject ||
        this.model.status == this.statusConts.Agree
      ) {
        this.model.status = this.statusConts.Close;
      }
      this.model.status = this.statusConts.Close;
      this.model.executeGuid = JSON.parse(localStorage.getItem("user")).guid;
      this.model.executeDate = new Date();
    });
  }
  update(callBack) {
    this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.updateTitle,
      this.alert.updateMessage,
      () => {
        callBack();
        this.model.roomGuid = this.roomGuid;
        this.model.penGuid = this.penGuid;
        this.model.pens = this.selectedPen;
        this.model.pigs = this.selectedPig;
        this.model.record2Pigs = this.selectedPigData;
        this.model.applyDate = this.convertDateTime(this.model.applyDate);
        this.model.agreeDate = this.convertDateTime(this.model.agreeDate);
        this.model.rejectDate = this.convertDateTime(this.model.rejectDate);
        this.model.executeDate = this.convertDateTime(this.model.executeDate);
        this.service.update(this.ToFormatModel(this.model)).subscribe(
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

  onChangeRoom(e) {
    // this.roomGuid = e.value;
    if (!this.penGuid) {
      this.loadPig();
    }
    this.loadPen();
  }
  async loadPen() {
    this.dataPen = await this.servicePen
      .getPensByFarmGuidAndRoomGuid(
        localStorage.getItem("farmGuid"),
        this.roomGuid
      )
      .toPromise();
  }
  async loadPig() {
    const obj = {
      pens: this.selectedPen,
      farmGuid: localStorage.getItem("farmGuid"),
      roomGuid: this.roomGuid || "",
    };
    this.dataPig = await this.servicePig.getPigByManyPen(obj).toPromise();
  }
  onChangePen(e) {
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
  loadSelectedPig() {
    this.oldselectedPigData = this.selectedPigData;
    const p = {
      pigs: this.selectedPig,
      recordGuid: this.model.guid || "",
      type: "Record_Death",
      codeType1: "Death_Next1",
      codeType2: "Death_Next2",
      lang: localStorage.getItem("lang"),
    };
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
      const weights = this.selectedPigData.map((x) => x.recordWeight);
      // this.selectedPig = this.selectedPigData.map(x=> x.pigGuid);
      this.avgWeight = +this.average(weights).toFixed(0);
      this.totalWeight = +this.total(weights).toFixed(0);
    });
  }
  public actionComplete(e: any): void {
    e.result = e.result?.filter((x) => x?.guid != "");
  }
  public actionCompletePig(e: any): void {
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
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = e.text !== "" ? query.search(e.text, ["name"]) : query;
    //pass the filter data source, filter query to updateData method.
    e.updateData(this.dataPig, query);
  };
}
