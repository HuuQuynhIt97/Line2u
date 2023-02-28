import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { MessageConstants } from "src/app/_core/_constants";
import { AlertifyService } from "src/app/_core/_service/alertify.service";
import { PenService, RoomService } from "src/app/_core/_service/farms";
import {
  FilteringEventArgs,
  MultiSelectComponent,
} from "@syncfusion/ej2-angular-dropdowns";
import { MakeOrderService } from "src/app/_core/_service/records";
import {
  DataManager,
  Query,
  ODataV4Adaptor,
  UrlAdaptor,
} from "@syncfusion/ej2-data";
import { environment } from "src/environments/environment";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { Subscription } from "rxjs";

@Component({
  selector: "app-make-order-pen",
  templateUrl: "./make-order-pen.component.html",
  styleUrls: ["./make-order-pen.component.scss"],
})
export class MakeOrderPenComponent implements OnInit, OnChanges,OnDestroy {
  alert = {
    updateMessage: this.translate.instant(MessageConstants.UPDATE_MESSAGE),
    updateTitle: this.translate.instant(MessageConstants.UPDATE_TITLE),
    createMessage: this.translate.instant(MessageConstants.CREATE_MESSAGE),
    createTitle: this.translate.instant(MessageConstants.CREATE_TITLE),
    deleteMessage: this.translate.instant(MessageConstants.DELETE_MESSAGE),
    deleteTitle: this.translate.instant(MessageConstants.DELETE_TITLE),
    cancelMessage: this.translate.instant(MessageConstants.CANCEL_MESSAGE),
    serverError: this.translate.instant(MessageConstants.SERVER_ERROR),
    deleted_ok_msg: this.translate.instant(MessageConstants.DELETED_OK_MSG),
    created_ok_msg: this.translate.instant(MessageConstants.CREATED_OK_MSG),
    updated_ok_msg: this.translate.instant(MessageConstants.UPDATED_OK_MSG),
    system_error_msg: this.translate.instant(MessageConstants.SYSTEM_ERROR_MSG),
    exist_message: this.translate.instant(MessageConstants.EXIST_MESSAGE),
    choose_farm_message: this.translate.instant(
      MessageConstants.CHOOSE_FARM_MESSAGE
    ),
    select_order_message: this.translate.instant(
      MessageConstants.SELECT_ORDER_MESSAGE
    ),
    yes_message: this.translate.instant(MessageConstants.YES_MSG),
    no_message: this.translate.instant(MessageConstants.NO_MSG),
  };
  @Input() makeOrderGuid = "";
  @Input() roomGuid: any = "";
  model: any;
  pageSettings = {
    pageCount: 10,
    pageSizes: 20,
    enableQueryString: true,
    pageSize: 10,
    currentPage: 1,
    enableScroll: true,
  };
  searchOptions = { fields: ['penNo', 'penName'], operator: 'contains', ignoreCase: true };
  pens: any[];
  penData: DataManager;
  fields = { text: "name", value: "guid" };
  public onFiltering: any = (e: FilteringEventArgs) => {
    let query = new Query();
    //frame the query based on search string with filter type.
    query =
      e.text != "" ? query.where("name", "contains ", e.text, true) : query;
    //pass the filter data source, filter query to updateData method.
    e.updateData(this.penData, query);
  };
  take = 10;
  skip = 0;
  @ViewChild("multiselect") public dropdownObj: MultiSelectComponent;
  query: Query;
  baseUrl = environment.apiUrl;

  public onOpen(args) {
    let start: number = this.take;
    let end: number = 20;
    let listElement: HTMLElement = (this.dropdownObj as any).list;
    listElement.addEventListener("scroll", () => {
      if (
        Math.round(listElement.scrollTop + listElement.offsetHeight) >=
        Math.round(listElement.scrollHeight)
      ) {
        let filterQuery = new Query()
          .skip(start)
          .take(this.take)
          .addParams("farmGuid", localStorage.getItem("farmGuid"))
          .addParams("roomGuid", this.roomGuid)
          .addParams("selected", JSON.stringify(this.pens));
        this.penData
          .executeQuery(filterQuery)
          .then((event: any) => {
            start = end;
            end += this.take;
            this.dropdownObj.addItem(
              event.result as { [key: string]: Object }[]
            );
          })
          .catch((e: Object) => {});
      }
    });
  }
  @ViewChild('grid') public grid: GridComponent;
  subscription: Subscription;

  constructor(
    private penService: PenService,
    private roomService: RoomService,
    private service: MakeOrderService,
    private alertify: AlertifyService,
    private translate: TranslateService
  ) {}
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.makeOrderGuid != changes.makeOrderGuid?.previousValue) {
      this.makeOrderGuid = changes.makeOrderGuid?.currentValue;
      this.service.getByGuid(this.makeOrderGuid).subscribe((x) => {
        this.roomGuid = x.roomGuid;
        this.loadDataByRoom();
      });
    }
  }
  ngOnInit() {
    this.pens = [];
    this.model = {};
    this.model = {
      guid: this.makeOrderGuid || "",
      pens: this.pens,
    };
    this.subscription = this.service.currentMakeOrder.subscribe((value: any) => {
      this.roomGuid = value.roomGuid || ''
    });
  }
  created(event): void {
    document.getElementById(this.grid.element.id + "_searchbar").addEventListener('keyup', () => {
            this.grid.search((event.target as HTMLInputElement).value)
    });
}
  onChangeChecked(e, data) {
    let checked = e.checked;
    this.toggle(checked, data.guid);
  }
  onChangePen() {
    this.model = {
      guid: this.makeOrderGuid || "",
      pens: this.pens,
    };
  }
  loadDataByRoom() {
    const accessToken = localStorage.getItem("token");
    this.penData = new DataManager({
      url: `${this.baseUrl}Pen/LoadDataByRoom?roomGuid=${
        this.roomGuid || ""
      }&makeOrderGuid=${this.makeOrderGuid || ""}`,
      adaptor: new UrlAdaptor(),
      headers: [{ authorization: `Bearer ${accessToken}` }],
    });
  }
  loadData() {
    const guid = this.makeOrderGuid || "";
    this.query = new Query()
      .skip(this.skip)
      .take(this.take)
      .addParams("farmGuid", localStorage.getItem("farmGuid"))
      .addParams("roomGuid", this.roomGuid)
      .addParams("selected", JSON.stringify(this.pens));
    this.penData = new DataManager(
      {
        url: `${this.baseUrl}Pen/GetPensMultiDropdowns`,
        adaptor: new ODataV4Adaptor(),
        crossDomain: true,
      },
      this.query
    );

    this.service.getMakeOrderPen(guid, this.roomGuid).subscribe((pens) => {
      this.pens = pens || [];
      if (this.pens.length == 0 && this.dropdownObj.value != null) {
        this.dropdownObj.value = [];
        this.dropdownObj.clear();
      }
      this.model = {
        guid: this.makeOrderGuid || "",
        pens: this.pens,
      };
    });
  }
  toggle(checked, penGuid) {
    if (checked === false) {
      this.model = {
        guid: this.makeOrderGuid || "",
        penGuid
      };
      this.service.removeMakeOrder2Pen(this.model).subscribe(
        (res) => {
          if (res.success === true) {
            this.alertify.success(this.alert.deleted_ok_msg);
            this.loadDataByRoom();
          } else {
            this.alertify.warning(this.alert.system_error_msg);
          }
        },
        (error) => {
          this.alertify.warning(this.alert.system_error_msg);
        }
      );
    } else {
      this.model = {
        guid: this.makeOrderGuid || "",
        penGuid
      };
      this.service.addMakeOrder2Pen(this.model).subscribe(
        (res) => {
          if (res.success === true) {
            this.alertify.success(this.alert.created_ok_msg);
            this.loadDataByRoom();
          } else {
            this.alertify.warning(this.alert.system_error_msg);
          }
        },
        (error) => {
          this.alertify.warning(this.alert.system_error_msg);
        }
      );
    }
  }
  save() {
    this.model = {
      guid: this.makeOrderGuid || "",
      pens: this.pens,
    };
    this.service.storeMakeOrder2Pen(this.model).subscribe(
      (res) => {
        if (res.success === true) {
          this.alertify.success(this.alert.updated_ok_msg);
          this.loadData();
        } else {
          this.alertify.warning(this.alert.system_error_msg);
        }
      },
      (error) => {
        this.alertify.warning(this.alert.system_error_msg);
      }
    );
  }
  onChange(args) {
    if (args.isInteracted) {
      this.roomGuid = args.itemData.guid;
      this.service
        .storeRoomGuid({
          roomGuid: args.itemData.guid,
          guid: this.makeOrderGuid,
        })
        .subscribe(
          (res) => {
            this.loadDataByRoom();
            if (res.success === true) {
            } else {
              this.alertify.warning(this.alert.system_error_msg);
            }
          },
          (error) => {
            this.alertify.warning(this.alert.system_error_msg);
          }
        );
    }
  }
}
