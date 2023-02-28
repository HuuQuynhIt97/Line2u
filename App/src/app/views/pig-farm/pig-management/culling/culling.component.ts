
import { UrlAdaptor, DataManager } from '@syncfusion/ej2-data';
import { L10n,setCulture } from '@syncfusion/ej2-base';
import { Component, EventEmitter, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { MessageConstants } from 'src/app/_core/_constants';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { BaseComponent } from 'herr-core';
import { TranslateService } from '@ngx-translate/core';
import { MakeOrderService, RecordCullingService } from 'src/app/_core/_service/records';
import { RecordCulling } from 'src/app/_core/_model/records';
import { environment } from 'src/environments/environment';
import { PigService } from 'src/app/_core/_service/pigs/pig.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
declare let window:any;
@Component({
  selector: 'app-culling',
  templateUrl: './culling.component.html',
  styleUrls: ['./culling.component.scss']
})
export class CullingComponent extends BaseComponent implements OnInit,OnDestroy {
  isAdmin = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_CANCEL';
  localLang =  window.navigator.userLanguage || window.navigator.language;
  @Output() selectRecordCulling = new EventEmitter();
  data:DataManager;
  baseUrl = environment.apiUrl;
  password = '';
  modalReference: NgbModalRef;

  @ViewChild('grid') public grid: GridComponent;
  model: RecordCulling;
  setFocus: any;
  locale = localStorage.getItem('lang');
  editSettings = { showDeleteConfirmDialog: false, allowEditing: false, allowAdding: true, allowDeleting: false, mode: 'Normal' };
  title: any;
  @ViewChild('optionModal') templateRef: TemplateRef<any>;
  toolbarOptions = ['Add', 'Search'];
  selectionOptions = { checkboxMode: 'ResetOnRowClick'};
  fields: object = { text: 'name', value: 'guid' };
  pigData: any;
  disable: boolean;
  makeOrderGuid: any;
  subscription: Subscription;
  makeOrderValue: any;

  constructor(
    private service: RecordCullingService,
    private serviceMakeOrder: MakeOrderService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private servicePig: PigService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    config: NgbTooltipConfig,
    public translate:TranslateService
    ) {
      super(translate,environment.apiUrl);
      if (this.isAdmin === false) {
        config.disableTooltip = true;
      }
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  ngOnInit() {
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
    this.service.changeRecordCulling({});
    this.subscription = this.serviceMakeOrder.currentMakeOrder.subscribe((value: any) => {
      this.makeOrderGuid = value.guid;
      if (this.makeOrderGuid) {
        this.loadData();
      }
    });
    //this.loadPigData();
  }

  loadPigData() {
    this.servicePig.getPigs(localStorage.getItem('farmGuid')).subscribe((res: any) => {
      this.pigData = res as [];
    })
  }

  // life cycle ejs-grid
  rowSelected(args) {
    //console.log(args.data);
  }
  recordClick(args: any) {
    //console.log(args.rowData);
    this.service.changeRecordCulling(args.rowData);

 }
 recordCullingTypeChange(value) {
  this.model.cullingReason = value || "";
 }

 valueChange(value) {
  this.model.pigGuid = value || "";
 }

  onDoubleClick(args: any): void {
    this.setFocus = args.column; // Get the column from Double click event
  }

  onChange(args, data) {
    console.log(args);
    data.isDefault = args.checked;

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
    this.data = new DataManager({
      url: `${this.baseUrl}RecordCulling/LoadData?farmGuid=${farmGuid}&makeOrderGuid=${this.makeOrderGuid}&lang=${this.globalLang}`,
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
  create() {
   this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.createTitle,
      this.alert.createMessage,
      () => {
        const farmGuid = localStorage.getItem('farmGuid');
        if (!farmGuid) {
        this.alertify.warning(this.alert.choose_farm_message, true);
          return;
        }
        this.model.farmGuid = farmGuid;
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
    if (!this.makeOrderGuid) {
      this.alertify.warning(this.alert.select_order_message, true);
       return;
     }
    if (data?.id > 0) {
      this.model = {...data};
      this.getAudit(this.model.id);
      this.model.makeOrderGuid = this.makeOrderGuid;
      this.title = 'RECORD_CULLING_EDIT_MODAL';
    } else {
      this.model.id = 0;
      this.model.makeOrderGuid = this.makeOrderGuid;
      this.model.recordDate = new Date();
      this.title = 'RECORD_CULLING_ADD_MODAL';
    }
    this.modalReference = this.modalService.open(template, {size: 'xl',backdrop: 'static'});
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
