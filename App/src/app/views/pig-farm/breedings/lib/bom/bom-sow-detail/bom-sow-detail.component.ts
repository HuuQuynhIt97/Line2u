import { TranslateService } from '@ngx-translate/core';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { BomSowService } from '../../../services';
import { BomSow } from '../../../config';
import { BaseDetailComponent } from 'herr-core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bom-sow-detail',
  templateUrl: './bom-sow-detail.component.html',
  styleUrls: ['./bom-sow-detail.component.scss']
})
export class BomSowDetailComponent extends BaseDetailComponent implements OnInit, OnDestroy {
  model: BomSow;
  subscription: Subscription;

  constructor(
    private service: BomSowService,
    private alertify: AlertifyService,
    translate: TranslateService
    ) { super(translate,environment.apiUrl) }

  ngOnInit() {
    this.subscription = this.service.currentBomSow.subscribe(model => {
      this.model = model as any;
      if (this.model?.id > 0) {
        this.getAudit(this.model.id);
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
         this.service.update(this.model as BomSow).subscribe(
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
