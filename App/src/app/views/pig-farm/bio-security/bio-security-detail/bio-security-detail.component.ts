import { BaseDetailComponent } from 'herr-core';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { BioSMaster } from 'src/app/_core/_model/bios';
import { BioSMasterService } from 'src/app/_core/_service/bios';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bio-security-detail',
  templateUrl: './bio-security-detail.component.html',
  styleUrls: ['./bio-security-detail.component.scss']
})
export class BioSecurityDetailComponent  extends BaseDetailComponent implements  OnInit, OnDestroy,OnChanges {
  localLang =  (window as any).navigator.userLanguage || (window as any).navigator.language;
  model: BioSMaster;
  @Input() bottomDetailHeight: any;

  subscription: Subscription;
  fields: object = { text: 'name', value: 'guid' };
  makeOrderData: any;

  constructor(
    private service: BioSMasterService,
    private alertify: AlertifyService,
    translate: TranslateService
    ) { super(translate,environment.apiUrl) }
  ngOnChanges(changes: SimpleChanges): void {

    if (this.bottomDetailHeight != changes.bottomDetailHeight.currentValue) {
      this.bottomDetailHeight = changes.bottomDetailHeight.currentValue;
    }
  }
  ngOnInit() {
    this.loadMakeOreder();
    this.subscription = this.service.currentBioSMaster.subscribe(model => {
        this.model = model as BioSMaster;
        if (this.model?.id > 0) {
          this.getAudit(this.model?.id || 0);

        }
    });

  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  loadMakeOreder() {
    const farmGuid = localStorage.getItem('farmGuid');
   this.service.getOrders(farmGuid).subscribe(data=> {

    this.makeOrderData = data;
  });
  }
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
