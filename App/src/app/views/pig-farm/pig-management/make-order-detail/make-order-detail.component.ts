import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { BaseDetailComponent } from 'herr-core';
import { SystemConfigConst } from 'src/app/_core/_constants';
import { MakeOrder } from 'src/app/_core/_model/records';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { MakeOrderService } from 'src/app/_core/_service/records';
import { environment } from 'src/environments/environment';
import { DataManager, Query, UrlAdaptor } from "@syncfusion/ej2-data";

@Component({
  selector: 'app-make-order-detail',
  templateUrl: './make-order-detail.component.html',
  styleUrls: ['./make-order-detail.component.scss']
})
export class MakeOrderDetailComponent extends BaseDetailComponent implements OnInit,OnDestroy,AfterViewInit {
  isAdmin = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_CANCEL';
  model: MakeOrder;
  subscription: Subscription;
  localLang =  (window as any).navigator.userLanguage || (window as any).navigator.language;
  isLoadding = false;
  roomGuid = '';
  @Input() pigType: string;
  constructor(
    private service: MakeOrderService,
    private alertify: AlertifyService,
    private cd: ChangeDetectorRef,
    translate: TranslateService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService
    ) { super(translate,environment.apiUrl) }
    ngAfterViewInit (): void {
      this.cd.detectChanges();
    }
  ngOnInit() {
    this.subscription = this.service.currentMakeOrder.subscribe((value: any) => {
      this.model = {...value};
      this.roomGuid = value.roomGuid || '';
      if (value.id > 0) {
        this.service.getById(value.id).subscribe(x=> {
          this.model = {...x};
          this.model.roomGuid = this.model.roomGuid || ''
          this.roomGuid = this.model.roomGuid || ''
        });
        this.getAudit(this.model.id);
      } else {
        this.caculate((res) => {
          this.model.id = 0;
          this.model.orderAmound = 0;
          this.model.pigType = this.pigType;
          this.model.customerGuid = this.model.customerGuid || "";
          this.model.bomGuid = this.model.bomGuid || "";
          this.model.orderDate = new Date();
          this.model.realStartDate = new Date();
          this.caulateType(res.result);
        });
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  typeChange(value) { this.model.orderType = value; }
  onChangeRoom(e) {
    this.roomGuid = e.itemData?.guid;
  }

  reject() {
    const NORMAL_STATUS = 1;
    this.update(() => {
      this.model.status = NORMAL_STATUS;
    });
  }
  agree() {
    const AGREE_STATUS = 4;
    this.update(() => {
      this.model.status =AGREE_STATUS;
      this.model.agreeGuid = JSON.parse(localStorage.getItem("user")).guid;
      this.model.agreeDate = new Date();
    });
  }
  close() {
    const CLOSE_STATUS = 3;
    this.update(() => {
      this.model.closeGuid = JSON.parse(localStorage.getItem("user")).guid;
      this.model.closeDate = new Date();  
      this.model.status = CLOSE_STATUS;
    });
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
  update(setStatus) {
    this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.updateTitle,
      this.alert.updateMessage,
      () => {
        this.isLoadding = true;
        this.spinner.show('default')
        setStatus()
        this.model.roomGuid = this.roomGuid;
        this.service.update(this.ToFormatModel(this.model)).subscribe(
          (res) => {
            if (res.success === true) {
              this.alertify.success(this.alert.updated_ok_msg);
              this.service.changeMakeOrder3(200);
              this.loadData();
            } else {
              this.alertify.warning(this.alert.system_error_msg);
            }
            this.isLoadding = false;
            this.spinner.hide('default')

          },
          (error) => {
            const message = this.translate.instant(error) || this.alert.system_error_msg;
            this.alertify.warning(message);
            this.isLoadding = false;
            this.spinner.hide('default')

          }
        );
      }, () => {
        this.alertify.error(this.alert.cancelMessage);
      }
    );


  }
  create() {
    this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.createTitle,
      this.alert.createMessage,
      () => {
        this.spinner.show('default')
        this.isLoadding = true;
        const farmGuid = localStorage.getItem('farmGuid');
        if (!farmGuid) {
          this.alertify.warning(this.alert.choose_farm_message, true);
          return;
        }
        this.model.farmGuid = farmGuid;
        this.model.pigType = this.pigType;
        this.model.roomGuid = this.roomGuid;
        this.service.add(this.ToFormatModel(this.model)).subscribe(
          (res) => {
            if (res.success === true) {
              this.alertify.success(this.alert.created_ok_msg);
              this.loadData();
              this.service.changeMakeOrder3(200);
            } else {
              this.alertify.warning(this.alert.system_error_msg);
            }
            this.isLoadding = false;
            this.spinner.hide('default');
          },
          (error) => {
            const message = this.translate.instant(error) || this.alert.system_error_msg;
            this.alertify.warning(message);
            this.isLoadding = false;
            this.spinner.hide('default')
          }
        );
      }, () => {
        this.alertify.error(this.alert.cancelMessage);
      }
    );

  }
  save() {
   if (this.model.id > 0) {
    this.update(() => {});
   } else {
    this.create();
   }
   }
  loadData() {
    this.service.getById(this.model.id).subscribe( data => {
      this.model = data;
    })
  }

  getAudit(id) {
    this.service.getAudit(id).subscribe(data => {
      this.audit = data;
    });

  }
  addDate(date: Date, numberOfDaysToAdd: number) {
    const dateCopy = new Date(date.getTime());
    let result = dateCopy.setDate(dateCopy.getDate() + numberOfDaysToAdd);
    return new Date(result);
  }
  removeDate(date: Date, numberOfDaysToAdd: number) {
    const dateCopy = new Date(date.getTime());
    let result = dateCopy.setDate(dateCopy.getDate() - numberOfDaysToAdd);
    return new Date(result);
  }
  caulateType(configs) {
    console.clear();
    configs = configs || [];
    let suckling = configs.filter((x) => x.no == SystemConfigConst.Sucking); // S
    let finisher = configs.filter((x) => x.no == SystemConfigConst.Finisher); //F
    let grower = configs.filter((x) => x.no == SystemConfigConst.Grower); // G
    let nursry = configs.filter((x) => x.no == SystemConfigConst.Nursry); // N
    let sale = configs.filter((x) => x.no == SystemConfigConst.Sale); // A
    let sucklingValue = suckling.length == 0 ? 0 : +suckling[0].value;
    let finisherValue = finisher.length == 0 ? 0 : +finisher[0].value;
    let growerValue = grower.length == 0 ? 0 : +grower[0].value;
    let nursryValue = nursry.length == 0 ? 0 : +nursry[0].value;
    let saleValue = sale.length == 0 ? 0 : +sale[0].value;
    let allValue = sucklingValue + finisherValue + growerValue + nursryValue + saleValue;

    if (this.pigType.toLowerCase() == SystemConfigConst.Sucking.toLowerCase()) {
      this.model.estimateStartDate = this.model.realStartDate
      this.model.estimateEndDate = this.addDate(this.model.estimateStartDate, allValue)
    } else if (
      this.pigType.toLowerCase() == SystemConfigConst.Nursry.toLowerCase()
    ) {
      this.model.estimateStartDate = this.removeDate(this.model.realStartDate, sucklingValue) 
      this.model.estimateEndDate = this.addDate(this.model.estimateStartDate, allValue)
    } else if (
      this.pigType.toLowerCase() == SystemConfigConst.Grower.toLowerCase()
    ) {
      this.model.estimateStartDate =this.removeDate(this.model.realStartDate, nursryValue + sucklingValue)
      this.model.estimateEndDate = this.addDate(this.model.estimateStartDate, allValue)

    } else if (
      this.pigType.toLowerCase() == SystemConfigConst.Finisher.toLowerCase()
    ) {
      this.model.estimateStartDate = this.removeDate(this.model.realStartDate, nursryValue + sucklingValue + growerValue)
      this.model.estimateEndDate = this.addDate(this.model.estimateStartDate, allValue)
    }
  }
  caculate(callBack) {
    const query = new Query()
      .skip(this.skip)
      .take(this.take)
      .where("status", "equal", 1)
      .where("type", "equal", "GrowDays");
    new DataManager({
      url: `${this.baseUrl}SystemConfig/GetDataDropdownlist`,
      adaptor: new UrlAdaptor(),
      crossDomain: true,
    })
      .executeQuery(query)
      .then((x) => {
        callBack(x);
      });
  }
}
