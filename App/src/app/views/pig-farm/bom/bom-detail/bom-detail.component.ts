import { AlertifyService } from './../../../../_core/_service/alertify.service';
import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseDetailComponent } from 'herr-core';
import { Bom } from 'src/app/_core/_model/bom';
import { BOMShareService } from 'src/app/_core/_service/bom.share.service';
import { BOMService } from 'src/app/_core/_service/bom.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bom-detail',
  templateUrl: './bom-detail.component.html',
  styleUrls: ['./bom-detail.component.scss']
})
export class BomDetailComponent extends BaseDetailComponent implements OnInit, OnDestroy {
  bom: Bom;
  subscription: Subscription;

  constructor(
    private serviceShare: BOMShareService,
    private service: BOMService,
    private alertify: AlertifyService,
    translate: TranslateService
    ) { super(translate,environment.apiUrl) }

  ngOnInit() {
    this.subscription = this.serviceShare.currentBOM.subscribe(bom => {
      this.bom = bom
      if (this.bom?.id > 0) {
        this.getAudit(this.bom.id);
      }
    });

  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  save() {
    this.alertify.confirm4(
       this.alert.yes_message,
       this.alert.no_message,
       this.alert.updateTitle,
       this.alert.updateMessage,
       () => {
         this.service.update(this.bom as Bom).subscribe(
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
    this.service.getById(this.bom.id).subscribe( data => {
      this.bom = data;
    })
  }
  getAudit(id) {
    this.service.getAudit(id).subscribe(data => {
      this.audit = data;
    });

  }
}
