import { DatePipe } from '@angular/common';
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
import { RepairRecord, Repair } from 'src/app/_core/_model/repairs';
import { RepairService, RepairRecordService } from 'src/app/_core/_service/repairs';
import { Subscription } from 'rxjs';
import { XAccountService } from 'src/app/_core/_service/xaccount.service';
@Component({
  selector: 'app-repair-record',
  templateUrl: './repair-record.component.html',
  styleUrls: ['./repair-record.component.scss']
})
export class RepairRecordComponent extends BaseComponent implements OnInit, OnChanges {
  localLang =  (window as any).navigator.userLanguage || (window as any).navigator.language;
  repair: Repair;
  fields: object = { text: 'name', value: 'guid' };
  @Input() bottomHeight: any;
  data: DataManager;
  baseUrl = environment.apiUrl;
  modalReference: NgbModalRef;
  
  @ViewChild('grid') public grid: GridComponent;
  model: RepairRecord;
  setFocus: any;
  locale = localStorage.getItem('lang');
  editSettings = { showDeleteConfirmDialog: false, allowEditing: false, allowAdding: true, allowDeleting: false, mode: 'Normal' };
  title: any;
  @ViewChild('optionModal') templateRef: TemplateRef<any>;
  toolbarOptions = ['Add', 'Search'];
  subscription: Subscription;
  rejectData = [];
  constructor(
    private service: RepairRecordService,
    private serviceAccount: XAccountService,
    private serviceRepair: RepairService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    public datePipe: DatePipe,
    public translate: TranslateService,
  ) { super(translate,environment.apiUrl);  }
  ngOnChanges(changes: SimpleChanges): void {

    if (this.bottomHeight != changes.bottomHeight?.currentValue) {
      this.bottomHeight = changes.bottomHeight?.currentValue;
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
    this.subscription = this.serviceRepair.currentRepair.subscribe(repair => {
      this.repair = repair as Repair;
      if (this.repair?.guid) {
        this.loadData();
      }
    });
    this.getRejectsData();

  }
  getRejectsData() {
    const farmGuid = localStorage.getItem('farmGuid');
    this.serviceAccount.getRejectsByRepair(farmGuid).subscribe(data => {
      this.rejectData = data;
    })
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

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
    this.data = new DataManager({
      url: `${this.baseUrl}RepairRecord/LoadData?repairGuid=${this.repair?.guid}`,
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

        this.model.repairGuid = this.repair?.guid;
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
        this.model.repairGuid = this.repair?.guid;
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
    if (!this.repair?.guid) {
      this.translate.get('Please choose the repair!').subscribe(data => {
        this.alertify.warning(data, true);
      })
      return;
    }
    if (data?.id > 0) {
      this.model = {...data};
      this.getAudit(this.model.id);
      this.title = 'REPAIR_RECORD_EDIT_MODAL'
    } else {
      this.model.id = 0;
      this.model.accountGuid = JSON.parse(localStorage.getItem('user'))?.guid;
      this.model.farmGuid = localStorage.getItem('farmGuid');
      this.title = 'REPAIR_RECORD_ADD_MODAL';
    }
    this.modalReference = this.modalService.open(template, { size: 'xl', backdrop: 'static' });
  }
}
