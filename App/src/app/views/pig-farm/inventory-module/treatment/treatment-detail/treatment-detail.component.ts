import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { GridComponent, ExcelExportProperties, ExcelExportCompleteArgs } from '@syncfusion/ej2-angular-grids';
import { BaseComponent } from 'herr-core';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { TreatmentDetailService } from 'src/app/_core/_service/inventories';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { TreatmentMaster, TreatmentDetail } from 'src/app/_core/_model/inventories';
import { DataManager, Query, UrlAdaptor } from '@syncfusion/ej2-data';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-treatment-detail',
  templateUrl: './treatment-detail.component.html',
  styleUrls: ['./treatment-detail.component.scss']
})
export class TreatmentDetailComponent extends BaseComponent implements OnInit, OnChanges {
   @Input() master: TreatmentMaster;
    data:DataManager;
    baseUrl = environment.apiUrl;
    modalReference: NgbModalRef;
    @ViewChild('grid') public grid: GridComponent;
    model: TreatmentDetail;
    setFocus: any;
    locale = localStorage.getItem('lang');
    editSettings = { showDeleteConfirmDialog: false, allowEditing: false, allowAdding: true, allowDeleting: false, mode: 'Normal' };
    title: any;
    @ViewChild('optionModal') templateRef: TemplateRef<any>;
    toolbarOptions = ['Add', 'Search'];
    selectionOptions = { checkboxMode: 'ResetOnRowClick'};
    fields: object = { text: 'name', value: 'guid' };
    treatmentDetail: any;
  constructor(
    public modalService: NgbModal,
    private datePipe: DatePipe,
    public translate: TranslateService,
    public service: TreatmentDetailService,
    private alertify: AlertifyService,

  ) {
	    super(translate,environment.apiUrl);
    }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['master']) {
      if (changes.master.currentValue) {  
        this.loadData();
      }
    }
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
  
      this.loadData();
    }
   
    // life cycle ejs-grid
    rowSelected(args) {
      this.treatmentDetail = args.data;
    }
    recordClick(args: any) {
      this.treatmentDetail = args.rowData;
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
      this.data = new DataManager({
        url: `${this.baseUrl}TreatmentDetail/LoadDataByTreatmentGuid?treatmentGuid=${this.master?.guid || ''}&lang=${this.globalLang}`,
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
          const farmGuid = localStorage.getItem('farmGuid');
          if (!farmGuid) {
          this.alertify.warning(this.alert.choose_farm_message, true);
            return;
          }
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
      if (data?.id > 0) {
        this.model = {...data};
        this.getAudit(this.model.id);
        this.title = 'TREATMENT_MASTER_EDIT_MODAL';
      } else {
        this.model.id = 0;
        this.model.treatmentGuid = this.master.guid;
        this.title = 'TREATMENT_MASTER_ADD_MODAL';
      }
      this.modalReference = this.modalService.open(template, {size: 'xl',backdrop: 'static'});
    }
  
  }
  