
import { PIG_SETTING_TAB_Constant } from 'src/app/_core/_constants';
import { UrlAdaptor, DataManager } from '@syncfusion/ej2-data';
import { L10n,setCulture } from '@syncfusion/ej2-base';
import { Component, EventEmitter, Input, OnInit, OnChanges, TemplateRef, ViewChild, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { MessageConstants } from 'src/app/_core/_constants';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { BaseComponent } from 'herr-core';
import { TranslateService } from '@ngx-translate/core';
import { PigCodeService } from 'src/app/_core/_service/pigs';
import { PigCode, PigPedigree } from 'src/app/_core/_model/pigs';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
declare let window:any;
@Component({
  selector: 'app-pig-code',
  templateUrl: './pig-code.component.html',
  styleUrls: ['./pig-code.component.scss']
})
export class PigCodeComponent extends BaseComponent implements OnInit, OnChanges {
  isAdmin = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_CANCEL';
  active: string;
  localLang =  window.navigator.userLanguage || window.navigator.language;
  data:DataManager;
  baseUrl = environment.apiUrl;
  password = '';
  modalReference: NgbModalRef;
  
  @ViewChild('grid') public grid: GridComponent;
  model: PigCode;
  setFocus: any;
  locale = localStorage.getItem('lang');
  editSettings = { showDeleteConfirmDialog: false, allowEditing: false, allowAdding: true, allowDeleting: false, mode: 'Normal' };
  title: any;
  @ViewChild('optionModal') templateRef: TemplateRef<any>;
  toolbarOptions = ['Add', 'Search'];
  selectionOptions = { checkboxMode: 'ResetOnRowClick'};
  @Input() pigPedigree: PigPedigree;
  constructor(
    private service: PigCodeService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    public translate: TranslateService,
  ) { super(translate,environment.apiUrl);  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pigPedigree.currentValue != changes.pigPedigree.previousValue) {
      this.pigPedigree = changes.pigPedigree.currentValue;
      this.loadData();
    }
  }
  ngOnInit() {
    this.active = PIG_SETTING_TAB_Constant.Code;

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

  }
  // life cycle ejs-grid


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
      url: `${this.baseUrl}PigCode/LoadData?pigPedigreeGuid=${this.pigPedigree?.guid}`,
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
      if (!this.pigPedigree?.guid) {
      this.alertify.warning('Please choose the pig pedigree!', true);
      return;
    }
    if (data?.id > 0) {
      this.model = {...data};
      this.getAudit(this.model.id);
      this.title = 'PIG_CODE_EDIT_MODAL';
    } else {
      this.model.id = 0;
      this.model.pedigreeGuid = this.pigPedigree.guid;
      this.title = 'PIG_CODE_ADD_MODAL';
    }
    this.modalReference = this.modalService.open(template, {size: 'xl',backdrop: 'static'});
  }

}

