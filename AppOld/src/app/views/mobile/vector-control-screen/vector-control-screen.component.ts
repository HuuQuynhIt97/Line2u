import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UrlAdaptor, DataManager } from '@syncfusion/ej2-data';
import { BaseComponent } from 'herr-core';
import { PigFarmVectorControl } from 'src/app/_core/_model/pig-farm-vector';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { PigFarmVectorControlService } from 'src/app/_core/_service/pig-farm-vector';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-vector-control-screen',
  templateUrl: './vector-control-screen.component.html',
  styleUrls: ['./vector-control-screen.component.scss']

})
export class VectorControlScreenComponent extends BaseComponent  implements OnInit  {
  globalLang = localStorage.getItem('lang');
  pens: any;
  recordDate: any = new Date();
  penGuid: string = "";
  baseUrl = environment.apiUrl;
  data: DataManager;
  model: PigFarmVectorControl = {} as PigFarmVectorControl;
  model2: PigFarmVectorControl =  {} as PigFarmVectorControl;
  constructor(
    private router: Router,
    private service: PigFarmVectorControlService,
    private alertify: AlertifyService,
    public translate: TranslateService,
    private datePipe: DatePipe,

  ) {
	    super(translate,environment.apiUrl);
     }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const accessToken = localStorage.getItem('token');
    const farmGuid = localStorage.getItem('farmGuid');
    let recordDate = this.recordDate ? (this.recordDate as Date).toLocaleDateString() : "";
    let query = `penGuid=${this.penGuid || ""}&pigGuid=&recordDate=${recordDate || ""}`;
    this.data = new DataManager({
      url: `${this.baseUrl}PigFarmVectorControl/LoadMobileData?farmGuid=${farmGuid}&lang=${this.globalLang}&${query}`,
      adaptor: new UrlAdaptor,
      headers: [{ authorization: `Bearer ${accessToken}` }]
    });
  }
  toggleRecordDate(id) {
    this.service.toggleRecordDate(id).subscribe(
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
  cancel() {
    this.router.navigate(['/mobile/operate-detail']);
  }
  save()  {
    this.router.navigate(['/mobile/operate-detail']);
  }
  goToOperateDetail() { this.router.navigate(['/mobile/operate-detail']); }
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
  onChange(e, data) {
    if (e.isInteracted) {
      this.model2 = {...data};
      this.model2.penGuid = this.model.penGuid;
      this.model2.roomGuid = this.model.roomGuid;
      this.model2.vectorControlGuid = this.model.vectorControlGuid;
      this.model2.useType = this.model.useType;
      this.model2.useUnit = this.model.useUnit;
      this.model2.capacity = this.model.capacity;
      this.service.update(this.ToFormatModel(this.model2)).subscribe(
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

  }
}
