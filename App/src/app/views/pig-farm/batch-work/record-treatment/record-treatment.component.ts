import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { Component, OnInit, TemplateRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { MessageConstants } from 'src/app/_core/_constants';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { BaseComponent } from 'herr-core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { PigTreatment, PigDisease } from 'src/app/_core/_model/pig-disease';
import { PigDiseaseService, PigTreatmentService } from 'src/app/_core/_service/pig-disease';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { IBatchWorkCommon } from 'src/app/_core/commons/batch-work-common';
@Component({
  selector: 'app-record-treatment',
  templateUrl: './record-treatment.component.html',
  styleUrls: ['./record-treatment.component.scss']
})
export class RecordTreatmentComponent extends BaseComponent implements OnInit, OnChanges, IBatchWorkCommon {
  localLang =  (window as any).navigator.userLanguage || (window as any).navigator.language;
  pigDisease: PigDisease;
  @Input() bottomHeight: any;
  data: DataManager;
  baseUrl = environment.apiUrl;
  modalReference: NgbModalRef;

  @ViewChild('grid') public grid: GridComponent;
  model: PigTreatment;
  setFocus: any;
  locale = localStorage.getItem('lang');
  editSettings = { showDeleteConfirmDialog: false, allowEditing: false, allowAdding: true, allowDeleting: false, mode: 'Normal' };
  title: any;
  @ViewChild('optionModal') templateRef: TemplateRef<any>;
  toolbarOptions:any;
  subscription: Subscription;
  constructor(
    private service: PigTreatmentService,
    private servicePigDisease: PigDiseaseService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    public datePipe: DatePipe,
    public translate: TranslateService,
  ) { super(translate,environment.apiUrl);  }
  pigGuid: string;
  penGuid: string;
  estDate = new Date();
  pens: any;
  pigs: any;
  @ViewChild('estDateTemplate', {static:true}) public estDateTemplate: any;
  @ViewChild('penTemplate', {static:true}) public penTemplate: any;
  @ViewChild('pigTemplate', {static:true}) public pigTemplate: any;
  onSelectedEstDateValue(args: any) {
    this.estDate = args;
    this.loadData();
  }
  onSelectedPenValue(args: any) {
    this.penGuid = args;
    this.loadData();
  }
  onSelectedPigValue(args: any) {
    this.pigGuid = args;
    this.loadData();
  }
  ngOnChanges(changes: SimpleChanges): void {

    if (this.bottomHeight != changes.bottomHeight?.currentValue) {
      this.bottomHeight = changes.bottomHeight?.currentValue;
    }

  }

  ngOnInit() {
    this.toolbarOptions =['Add',
    {template: this.penTemplate},
    {template: this.pigTemplate},
    {template: this.estDateTemplate},
    'Search'];
    // this.Permission(this.route);
    let lang = localStorage.getItem('lang');
    let languages = JSON.parse(localStorage.getItem('languages'));
    // setCulture(lang);
    let load = {
      [lang]: {
        grid: languages['grid'],
        pager: languages['pager']
      }
    };
    L10n.load(load);
    this.loadData();


  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  typeChange(value) { this.model.type = value; }

  onDoubleClick(args: any): void {
    this.setFocus = args.column; // Get the column from Double click event
  }

  actionBegin(args) {
  }
  toolbarClick(args) {
    switch (args.item.id) {
      case 'grid_excelexport':
        this.grid.excelExport({ hierarchyExportMode: 'All' });
        break;
      case 'grid_add':
        args.cancel = true;
        this.model = {} as any;
        this.openModal(this.templateRef);
        break;
      default:
        break;
    }
  }
  actionComplete(args) {
    // if (args.requestType === 'add') {
    //   args.form.elements.namedItem('name').focus(); // Set focus to the Target element
    // }
  }

  // end life cycle ejs-grid

  // api
  getAudit(id) {
    this.service.getAudit(id).subscribe(data => {
      this.audit = data;
    });

  }
  loadData() {
    const accessToken = localStorage.getItem('token');
    const farmGuid = localStorage.getItem('farmGuid');
    let estDate = this.estDate ? (this.estDate as Date).toDateString() : "";
    let query = `penGuid=${this.penGuid || ""}&pigGuid=${this.pigGuid || ""}&estDate=${estDate || ""}`;
    this.data = new DataManager({
      url: `${this.baseUrl}PigTreatment/BatchWorkLoadData?farmGuid=${farmGuid}&lang=${this.globalLang}&${query}`,
      adaptor: new UrlAdaptor,
      headers: [{ authorization: `Bearer ${accessToken}` }]
    });
  }
  delete(id) {
    this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.deleteTitle,
      this.alert.deleteMessage,
      () => {
        this.service.delete(id).subscribe(
          (res) => {
            if (res.success === true) {
              this.alertify.success(this.alert.deleted_ok_msg);
              this.loadData();
            } else {
              this.alertify.warning(this.alert.system_error_msg);
            }
          },
          (err) => this.alertify.warning(this.alert.system_error_msg)
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

        this.model.upperGuid = this.pigDisease?.guid;
        this.service.add(this.ToFormatModel(this.model)).subscribe(
          (res) => {
            if (res.success === true) {
              this.alertify.success(this.alert.created_ok_msg);
              this.loadData();
              this.modalReference.dismiss();

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
  update() {

   this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.updateTitle,
      this.alert.updateMessage,
      () => {
        this.model.upperGuid = this.pigDisease?.guid;
        this.service.update(this.ToFormatModel(this.model)).subscribe(
          (res) => {
            if (res.success === true) {
              this.alertify.success(this.alert.updated_ok_msg);
              this.loadData();
              this.modalReference.dismiss();
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
  // end api
  ToFormatModel(model: any) {
    for (let key in model) {
      let value = model[key];
      if (value &&  value instanceof Date) {
        model[key] = this.datePipe.transform(value, "yyyy/MM/dd");
      } else {
        model[key] = value;
      }

    }
    return model;
  }
  NO(index) {
    return (this.grid.pageSettings.currentPage - 1) * this.grid.pageSettings.pageSize + Number(index) + 1;
  }
  save() {
    if (this.model.id > 0) {
      this.update();
    } else {
      this.create();
    }
  }
  openModal(template, data = {} as any) {

    if (data?.id > 0) {
      this.model = {...data};
      this.getAudit(this.model.id);
      this.title = 'PIG_TREATMENT_EDIT_MODAL'
    } else {
      this.model.id = 0;
      this.model.farmGuid = localStorage.getItem('farmGuid');
      this.title = 'PIG_TREATMENT_ADD_MODAL';
    }
    this.modalReference = this.modalService.open(template, { size: 'xl', backdrop: 'static' });
  }
  execute() {
    const ct = new Date();
    const hours = ct.getHours();
    const mins = ct.getMinutes();
    this.model.recordDate = new Date();
    this.model.recordTime = `${ hours < 10 ? `0${hours}` : hours}:${mins < 10 ? `0${mins}` : mins}`;
  }
  toggleRecordDate(id) {
    this.alertify.confirm4(
       this.alert.yes_message,
       this.alert.no_message,
       this.alert.updateTitle,
       this.alert.updateMessage,
       () => {

         this.service.toggleRecordDate(id).subscribe(
           (res) => {
             if (res.success === true) {
               this.alertify.success(this.alert.updated_ok_msg);
               this.loadData();
               this.modalReference.dismiss();
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
}
