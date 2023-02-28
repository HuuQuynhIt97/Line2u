import { BaseDetailComponent } from 'herr-core';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { PigDisease } from 'src/app/_core/_model/pig-disease';
import { PigDiseaseService } from 'src/app/_core/_service/pig-disease';
import { XAccountService } from 'src/app/_core/_service/xaccount.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pig-disease-detail',
  templateUrl: './pig-disease-detail.component.html',
  styleUrls: ['./pig-disease-detail.component.scss']
})
export class PigDiseaseDetailComponent extends BaseDetailComponent implements  OnInit, OnDestroy,OnChanges {
  localLang =  (window as any).navigator.userLanguage || (window as any).navigator.language;
  model: PigDisease = {} as  PigDisease;
  @Input() bottomDetailHeight: any;
  fields: object = { text: 'name', value: 'guid' };
  subscription = new Subscription();
  accountData: any;
  constructor(
    private service: PigDiseaseService,
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
    this.subscription = this.service.currentPigDisease.subscribe(pigDisease => {
      this.model = pigDisease as PigDisease || {} as  PigDisease;
      if (this.model?.id > 0) {
        this.getAudit(this.model?.id || 0);

      }
    });
    this.getXAccountsForDropdown();
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
