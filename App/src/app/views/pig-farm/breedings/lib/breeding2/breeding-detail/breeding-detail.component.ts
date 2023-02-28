import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { BaseDetailComponent } from 'herr-core';
import { SystemConfigConst } from 'src/app/_core/_constants';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { DataManager, Query, UrlAdaptor } from "@syncfusion/ej2-data";
import { Breeding } from '../../../config';
import { environment } from 'src/environments/environment';

import { inputs } from '@syncfusion/ej2-angular-buttons/src/button/button.component';
import { BreedingService } from '../../../services';

@Component({
  selector: 'app-breeding-detail',
  templateUrl: './breeding-detail.component.html',
  styleUrls: ['./breeding-detail.component.scss']
})
export class BreedingDetailComponent  extends BaseDetailComponent implements OnInit,OnDestroy,AfterViewInit, OnChanges {
  isAdmin = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_CANCEL';
  model: Breeding;
  subscription: Subscription;
  localLang =  (window as any).navigator.userLanguage || (window as any).navigator.language;
  isLoadding = false;
  penGuid = '';
  roomGuid = '';
  @Input() id;
  @Input() pigType;
  @Input("onSaved") onSaveChange = new EventEmitter();
  constructor(
    private service: BreedingService,
    private alertify: AlertifyService,
    private cd: ChangeDetectorRef,
    translate: TranslateService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService
    ) { super(translate,environment.apiUrl) }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && changes.id.currentValue) {
      this.loadData(this.id);
      this.getAudit(this.id);
    }
  }
    ngAfterViewInit (): void {
      this.cd.detectChanges();
    }
  ngOnInit() {
    this.model = {} as Breeding;
    this.model.id = 0;
    this.model.breedingName = '';
    this.model.breedingNo =  '';
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  typeChange(value) { this.model.type = value; }
  onChangePen(e) {
    this.penGuid = e.itemData?.guid;
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
  update() {
    this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.updateTitle,
      this.alert.updateMessage,
      () => {
        this.isLoadding = true;
        this.spinner.show('default')
        this.model.penGuid = this.penGuid;
        this.model.roomGuid = this.roomGuid;
        this.service.update(this.ToFormatModel(this.model)).subscribe(
          (res) => {
            if (res.success === true) {
              this.onSaveChange.emit();
              this.alertify.success(this.alert.updated_ok_msg);
              this.loadData(res.data.id);
              this.getAudit(res.data.id);
              this.penGuid = null;
              this.roomGuid = null;
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
        this.model.penGuid = this.penGuid;
        this.model.roomGuid = this.roomGuid;
        this.service.add(this.ToFormatModel(this.model)).subscribe(
          (res) => {
            if (res.success === true) {
              this.onSaveChange.emit();
              this.alertify.success(this.alert.created_ok_msg);
              this.loadData(res.data.id);
              this.getAudit(res.data.id);
              this.penGuid = null;
              this.roomGuid = null;
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
    this.update();
   } else {
    this.create();
   }
   }
  loadData(id) {
    this.service.getById(id).subscribe( data => {
      this.model = data;
      this.roomGuid = data.roomGuid
      this.penGuid = data.penGuid
    })
  }

  getAudit(id) {
    this.service.getAudit(id).subscribe(data => {
      this.audit = data;
    });

  }
  
  onChangeRoom(e) {
    this.roomGuid = e.value
  }

}
