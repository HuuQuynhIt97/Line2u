import { DatePipe, ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageConstants } from 'src/app/_core/_constants';
import { Pig } from 'src/app/_core/_model/pigs';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { PigService } from 'src/app/_core/_service/pigs';
import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-piglist-detail-screen',
  templateUrl: './piglist-detail-screen.component.html',
  styleUrls: ['./piglist-detail-screen.component.scss']
})
export class PiglistDetailScreenComponent implements OnInit {
  title:string;
  model:Pig = {} as Pig;
  isAdmin = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_CANCEL';
  fields = { text: 'name', value: 'guid' };
  farmData= [];
  areaData= [];
  barnData= [];
  roomData= [];
  penData= [];
  cullingTankData= [];
  audit: any;
  alert = {
    updateMessage: this.translate.instant(MessageConstants.UPDATE_MESSAGE),
    updateTitle: this.translate.instant(MessageConstants.UPDATE_TITLE),
    createMessage:this.translate.instant(MessageConstants.CREATE_MESSAGE),
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
    choose_farm_message: this.translate.instant(MessageConstants.CHOOSE_FARM_MESSAGE),
    select_order_message: this.translate.instant(MessageConstants.SELECT_ORDER_MESSAGE),
    yes_message: this.translate.instant(MessageConstants.YES_MSG),
    no_message: this.translate.instant(MessageConstants.NO_MSG),
  };
  id: any;
  makeOrderGuid: string;
  type: any;
  constructor(
    private service: PigService,
    private cdr: ChangeDetectorRef,
    private alertify: AlertifyService,
    private datePipe: DatePipe,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router

    ) {


    }

  ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type');
    this.id = +this.route.snapshot.paramMap.get('id');
    this.makeOrderGuid = this.route.snapshot.paramMap.get('orderId');
    this.loadData();
    this.getFarms();
    if (this.id > 0) {
      this.getAudit(this.id);
    }

  }
  fatherChange(value) { this.model.fatherGuid = value; }
  motherChange(value) { this.model.motherGuid = value; }
  sexChange(value) { this.model.sex = value; }

  goToTop() {
    document.getElementById("modal-header").scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
  }
  getAudit(id) {
    this.service.getAudit(id).subscribe(data => {
      this.audit = data;
    });

  }
  loadData() {
    this.service.getById(this.id).subscribe( model => {
      this.model = model;
      this.model.farmGuid = localStorage.getItem('farmGuid');
    })
  }
  farmChange(args) {
    const item = args.itemData;
    this.model.farmGuid = item.guid;
    this.getAreas();
  }
  areaChange(args) {
    const item = args.itemData;
    this.model.areaGuid = item.guid;
    this.getBarns();
    this.getCullingTanks();

  }
  barnChange(args) {
    const item = args.itemData;
    this.model.barnGuid = item.guid;
    this.getRooms();

  }
  cullingTankChange(args) {
    const item = args.itemData;
    this.model.cullingTankGuid = item.guid;

  }
  roomChange(args) {
    const item = args.itemData;
    this.model.roomGuid = item.guid;
    this.getPens();

  }
  penChange(args) {
    const item = args.itemData;
    this.model.penGuid = item.guid;
  }
  getFarms() {
    this.service.getFarms().subscribe(data => {
      this.farmData = data;
    })
  }
  getAreas() {
    const farmGuid = this.model?.farmGuid || '';
    this.service.getAreas(farmGuid).subscribe(data => {
      this.areaData = data;
    })
  }
  getBarns() {
    const farmGuid = this.model?.farmGuid || '';
    const areaGuid = this.model?.areaGuid || '';
    this.service.getBarns(farmGuid,areaGuid).subscribe(data => {
      this.barnData = data;
    })
  }
  getCullingTanks() {
    const farmGuid = this.model?.farmGuid || '';
    const areaGuid = this.model?.areaGuid || '';
    this.service.getCullingTanks(farmGuid,areaGuid).subscribe(data => {
      this.cullingTankData = data;
    })
  }
  getRooms() {
    const farmGuid = this.model?.farmGuid || '';
    const areaGuid = this.model?.areaGuid || '';
    const barnGuid = this.model?.barnGuid || '';
    this.service.getRooms(farmGuid,areaGuid,barnGuid).subscribe(data => {
      this.roomData = data;
    })
  }
  getPens() {
    const farmGuid = this.model?.farmGuid || '';
    const areaGuid = this.model?.areaGuid || '';
    const barnGuid = this.model?.barnGuid || '';
    const roomGuid = this.model?.roomGuid || '';
    this.service.getPens(farmGuid,areaGuid,barnGuid,roomGuid).subscribe(data => {
      this.penData = data;
    })
  }
  create() {
   this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.createTitle,
      this.alert.createMessage,
      () => {
        const farmGuid = localStorage.getItem('farmGuid');
        if (!farmGuid) {
        this.alertify.warning(this.alert.choose_farm_message, true);
          return;
        }
        this.service.add(this.ToFormatModel(this.model)).subscribe(
          (res) => {
            if (res.success === true) {
              this.alertify.success(this.alert.created_ok_msg);
              this.service.changeMessage(200);

            } else {
              this.alertify.warning(this.alert.system_error_msg);
            }

          },
          (error) => {
            this.alertify.warning(this.alert.system_error_msg);
          }
        );
      }, () => {
        this.alertify.error(this.alert.cancelMessage);
      }
    );

  }
  ToFormatModel(model: any) {
    for (let key in model) {
      let value = model[key];
      if (value &&  value instanceof Date) {
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
              this.router.navigate(['/mobile/pigdata/piglist/' + this.type + '/' + this.makeOrderGuid])
              this.loadData();
            } else {
              this.alertify.warning(this.alert.system_error_msg);
            }
          },
          (error) => {
            this.alertify.warning(this.alert.system_error_msg);
          }
        );
      }, () => {
        this.alertify.error(this.alert.cancelMessage);
      }
    );


  }
  save() {
    if (this.model.id > 0) {
      this.update();
    } else {
      this.create();
    }
  }
}
