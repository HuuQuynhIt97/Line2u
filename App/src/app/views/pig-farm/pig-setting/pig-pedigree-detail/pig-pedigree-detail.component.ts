import { BaseDetailComponent } from 'herr-core';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { PigPedigreeService } from 'src/app/_core/_service/pigs';
import { PigPedigree } from 'src/app/_core/_model/pigs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pig-pedigree-detail',
  templateUrl: './pig-pedigree-detail.component.html',
  styleUrls: ['./pig-pedigree-detail.component.scss']
})
export class PigPedigreeDetailComponent extends BaseDetailComponent implements OnInit, OnChanges {
  isAdmin = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_CANCEL';
  @Input() pigPedigree: PigPedigree = {} as PigPedigree;
  constructor(
    private service: PigPedigreeService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    public translate: TranslateService,
  ) { super(translate,environment.apiUrl);  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pigPedigree.currentValue != changes.pigPedigree.previousValue) {
      this.pigPedigree = changes.pigPedigree.currentValue;
      if (this.pigPedigree?.id > 0) {
        this.getAudit(this.pigPedigree?.id || 0);

      }
    }
  }

  ngOnInit() {
  }
  fromFarmChange(value) { this.pigPedigree.fromPigFarm = value; }
  fatherChange(value) { this.pigPedigree.fatherGuid = value; }
  motherChange(value) { this.pigPedigree.motherGuid = value; }
  save() {
    this.alertify.confirm4(
       this.alert.yes_message,
       this.alert.no_message,
       this.alert.updateTitle,
       this.alert.updateMessage,
       () => {
         this.service.update(this.pigPedigree as any).subscribe(
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
    this.service.getById(this.pigPedigree.id).subscribe( data => {
      this.pigPedigree = data;
    })
  }
  getAudit(id) {
    this.service.getAudit(id).subscribe(data => {
      this.audit = data;
    });

  }
}
