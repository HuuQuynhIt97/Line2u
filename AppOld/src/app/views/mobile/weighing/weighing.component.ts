
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UrlAdaptor, DataManager } from '@syncfusion/ej2-data';
import { environment } from 'src/environments/environment';
import { BaseComponent } from 'herr-core';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { RecordWeighingService } from 'src/app/_core/_service/records';
@Component({
  selector: 'app-weighing',
  templateUrl: './weighing.component.html',
  styleUrls: ['./weighing.component.scss']
})
export class WeighingComponent extends BaseComponent  implements OnInit  {
  globalLang = localStorage.getItem('lang');
  pens: any;
  recordDate: any;
  penGuid: string = "";
  baseUrl = environment.apiUrl;
  data: DataManager;
  constructor(
    private router: Router,
    private service: RecordWeighingService,
    private alertify: AlertifyService,
    public translate: TranslateService,
  ) {
	    super(translate,environment.apiUrl);
     }

  ngOnInit() {
  }

  loadData() {
    const accessToken = localStorage.getItem('token');
    const farmGuid = localStorage.getItem('farmGuid');
    let recordDate = this.recordDate ? (this.recordDate as Date).toLocaleDateString() : "";
    let query = `penGuid=${this.penGuid || ""}&pigGuid=&recordDate=${recordDate || ""}`;
    this.data = new DataManager({
      url: `${this.baseUrl}RecordWeighing/LoadMobileData?farmGuid=${farmGuid}&lang=${this.globalLang}&${query}`,
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

}
