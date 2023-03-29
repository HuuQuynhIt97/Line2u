import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UrlAdaptor, DataManager } from '@syncfusion/ej2-data';
import { BaseComponent } from 'herr-core';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { RecordFeedingService } from 'src/app/_core/_service/records';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-feeding',
  templateUrl: './feeding.component.html',
  styleUrls: ['./feeding.component.css']
})
export class FeedingComponent extends BaseComponent  implements OnInit  {
  globalLang = localStorage.getItem('lang');
  pens: any;
  recordDate: any = new Date();
  penGuid: string = "";
  baseUrl = environment.apiUrl;
  data: DataManager;
  constructor(
    private router: Router,
    private service: RecordFeedingService,
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
      url: `${this.baseUrl}RecordFeeding/LoadMobileData?farmGuid=${farmGuid}&lang=${this.globalLang}&${query}`,
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
