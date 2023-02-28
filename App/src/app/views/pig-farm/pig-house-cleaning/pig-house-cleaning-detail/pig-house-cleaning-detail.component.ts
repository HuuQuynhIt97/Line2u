import { BaseDetailComponent } from 'herr-core';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { PigHouseCleaning } from 'src/app/_core/_model/pig-house-cleaning';
import { PigHouseCleaningService } from 'src/app/_core/_service/pig-house-cleaning';
import { XAccountService } from 'src/app/_core/_service/xaccount.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
@Component({
  selector: 'app-pig-house-cleaning-detail',
  templateUrl: './pig-house-cleaning-detail.component.html',
  styleUrls: ['./pig-house-cleaning-detail.component.scss']
})
export class PigHouseCleaningDetailComponent extends BaseDetailComponent implements  OnInit, OnDestroy,OnChanges {
  localLang =  (window as any).navigator.userLanguage || (window as any).navigator.language;
  model: PigHouseCleaning = {} as  PigHouseCleaning;
  @Input() bottomDetailHeight: any;
  fields: object = { text: 'name', value: 'guid' };
  subscription = new Subscription();
  accountData: any;
  constructor(
    private service: PigHouseCleaningService,
    private serviceAccount: XAccountService,
    private alertify: AlertifyService,
    translate: TranslateService
    ) { super(translate,environment.apiUrl) }


  ngOnChanges(changes: SimpleChanges): void {

    if (this.bottomDetailHeight != changes.bottomDetailHeight.currentValue) {
      this.bottomDetailHeight = changes.bottomDetailHeight.currentValue;
    }
  }
  ngOnInit() {
    this.getXAccountsForDropdown();
    this.subscription = this.service.currentPigHouseCleaning.subscribe(pigDisease => {
      this.model = pigDisease as PigHouseCleaning || {} as  PigHouseCleaning;
      if (this.model?.id > 0) {
        this.getAudit(this.model.id);
      }
    });
  }
  getXAccountsForDropdown() {
    const farmGuid = localStorage.getItem('farmGuid');
    this.serviceAccount.getXAccountsForDropdown(farmGuid).subscribe(data => {
      this.accountData = data;
    })
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  typeChange(value) { this.model.type = value; }
  pigTypeChange(value) { this.model.pigType = value; }
  save() {
    this.alertify.confirm4(
       this.alert.yes_message,
       this.alert.no_message,
       this.alert.updateTitle,
       this.alert.updateMessage,
       () => {
         this.service.update(this.model as any).subscribe(
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
       }, () => {
         this.alertify.error(this.alert.cancelMessage);
       }
     );


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
}
