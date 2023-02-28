import { Pig2ModalComponent } from './pig2-modal/pig2-modal.component';

import { UrlAdaptor, DataManager } from '@syncfusion/ej2-data';
import { L10n,setCulture } from '@syncfusion/ej2-base';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { MessageConstants } from 'src/app/_core/_constants';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { BaseComponent } from 'herr-core';
import { TranslateService } from '@ngx-translate/core';
import { PigService } from 'src/app/_core/_service/pigs';
import { Pig } from 'src/app/_core/_model/pigs';
import { environment } from 'src/environments/environment';
import { DatePipe, ViewportScroller } from '@angular/common';
import { MakeOrderService } from 'src/app/_core/_service/records';
import { Subscription } from 'rxjs';
declare let window:any;
@Component({
  selector: 'app-pig2',
  templateUrl: './pig2.component.html',
  styleUrls: ['./pig2.component.scss']
})
export class Pig2Component extends BaseComponent implements OnInit, OnChanges, OnDestroy {
  @Input() makeOrderGuid: any;
  @Input() pigType: any;
  isAdmin = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_CANCEL';
  localLang =  window.navigator.userLanguage || window.navigator.language;
  data:DataManager;
  baseUrl = environment.apiUrl;

  @ViewChild('grid') public grid: GridComponent;
  model: Pig;
  setFocus: any;
  locale = localStorage.getItem('lang');
  editSettings = { showDeleteConfirmDialog: false, allowEditing: false, allowAdding: true, allowDeleting: false, mode: 'Normal' };
  title: any;
  toolbarOptions = ['Add', 'Search'];
  subscription = new Subscription()
  constructor(
    private service: PigService,
    private serviceMakeOrder: MakeOrderService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    public translate: TranslateService,
    ) { super(translate,environment.apiUrl); }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.makeOrderGuid.currentValue != changes.makeOrderGuid.previousValue) {
    // }
    //this.makeOrderGuid = changes.makeOrderGuid.currentValue;
  }
  dataBound() {
    this.grid.autoFitColumns();
  }
  ngOnInit() {
    this.loadLang();
    this.onLoadData();
    this.subscription = this.serviceMakeOrder.currentMakeOrder.subscribe((value: any) => {
      this.makeOrderGuid = value.guid;
      if (this.makeOrderGuid) {
        this.loadData();
      }
    });
  }
  loadLang() {
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
  onLoadData() {
    this.service.currentMessage
    .subscribe(arg => {
      if (arg === 200) {
        this.loadData();
      }
    });
  }
  toolbarClick(args) {
    switch (args.item.id) {
      case 'grid_excelexport':
        this.grid.excelExport({ hierarchyExportMode: 'All' });
        break;
      case 'grid_add':
        args.cancel = true;
        this.model = {} as any;
        this.openModal();
        break;
      default:
        break;
    }
  }

  // end life cycle ejs-grid

  // api

  loadData() {
    const accessToken = localStorage.getItem('token');
    const farmGuid = localStorage.getItem('farmGuid');
    this.data = new DataManager({
      url: `${this.baseUrl}Pig/LoadData?lang=${this.globalLang}&farmGuid=${farmGuid}&makeOrderGuid=${this.makeOrderGuid}`,
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
              this.serviceMakeOrder.changeMakeOrder2(200);
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

  // end api
  NO(index) {
    return (this.grid.pageSettings.currentPage - 1) * this.grid.pageSettings.pageSize + Number(index) + 1;
  }

  openModal(data = {} as any) {
     const farmGuid = localStorage.getItem('farmGuid');
     if (data?.id > 0) {
      this.model = {...data};
      this.model.farmGuid = farmGuid
      this.title = 'PIG_EDIT_MODAL';
    } else {
      this.model.id = 0;
      this.model.makeOrderGuid = this.makeOrderGuid;
      this.model.pigType = this.pigType;
      this.model.phase = this.pigType;
      this.model.farmGuid = farmGuid;
      this.title = 'PIG_ADD_MODAL';
    }
    const modalRef = this.modalService.open(Pig2ModalComponent, {size: 'xl',backdrop: 'static'});
    modalRef.componentInstance.title = this.title;
    modalRef.componentInstance.model = this.model;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

}
