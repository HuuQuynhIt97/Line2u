import { PigModalComponent } from './pig-modal/pig-modal.component';
import { PigOrganizationModalComponent } from './pig-organization-modal/pig-organization-modal.component';

import { UrlAdaptor, DataManager } from '@syncfusion/ej2-data';
import { L10n,setCulture } from '@syncfusion/ej2-base';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
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
import { tap } from 'rxjs/operators';
declare let window:any;
@Component({
  selector: 'app-pig',
  templateUrl: './pig.component.html',
  styleUrls: ['./pig.component.scss'],
  providers: [DatePipe]
})
export class PigComponent extends BaseComponent implements OnInit {


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
  toolbarOptions:any;
  @ViewChild('pigPhaseTemplate', {static:true}) public pigPhaseTemplate: any;
  @ViewChild('penTemplate', {static:true}) public penTemplate: any;
  @ViewChild('pigTypeTemplate', {static:true}) public pigTypeTemplate: any;
  pigPhase: any = null;
  pen: any= null;
  pigType: any= null;
  constructor(
    private service: PigService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    public translate: TranslateService,
    private datePipe: DatePipe
    ) { super(translate,environment.apiUrl); }



  ngOnInit() {
    this.toolbarOptions =['Add',
    {
      text: this.translate.instant('All'),
      id: 'grid_all'
    },
    {template: this.penTemplate},
    {template: this.pigTypeTemplate},
    {template: this.pigPhaseTemplate},

    'Search'
  ];

    this.loadLang();
    this.loadData();
    this.onLoadData();
  }
  onSelectedPigPhaseValue(e) {
    this.pigPhase = e;
    this.loadData();
  }
  onSelectedPenValue(e) {
    this.pen = e;
    this.loadData();
  }
  onSelectedPigTypeValue(e) {
    this.pigType = e;
    this.loadData();
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
        case 'grid_all':
          args.cancel = true;
         this.pen = null;
         this.pigPhase = null;
         this.pigType = null;
         this.loadData();
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
      url: `${this.baseUrl}Pig/LoadData2?lang=${this.globalLang}&farmGuid=${farmGuid}&pen=${this.pen || ""}&pigType=${this.pigType|| ""}&pigPhase=${this.pigPhase|| ""}`,
      adaptor: new UrlAdaptor,
      headers: [{ authorization: `Bearer ${accessToken}` }],
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
      this.model.farmGuid = localStorage.getItem('farmGuid');
      // this.model.farmGuid = farmGuid;
      this.title = 'PIG_ADD_MODAL';
    }
    const modalRef = this.modalService.open(PigModalComponent, {size: 'xl',backdrop: 'static'});
    modalRef.componentInstance.title = this.title;
    modalRef.componentInstance.model = this.model;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
  openOrganizationModal(data = {} as any) {
    const farmGuid = localStorage.getItem('farmGuid');

  this.title = 'Pedigree_TreeView_MODAL';
    this.service.getOrganizations(farmGuid, data.guid)
    .pipe(
      tap(nodes=> {
        const modalRef = this.modalService.open(PigOrganizationModalComponent, {size: 'xl',backdrop: 'static'});
        modalRef.componentInstance.title = this.title;
        modalRef.componentInstance.model = this.model;
        modalRef.componentInstance.nodes = nodes;
        modalRef.result.then((result) => {
        }, (reason) => {
        });
      })
    ).subscribe()
 
}
convertDateTime(data) {
  if (data instanceof Date) {
    return this.datePipe.transform(data as Date, "yyyy-MM-dd");
  } else if (data !== null && data !== undefined && data !== "") {
    return this.datePipe.transform(new Date(data) as Date, "yyyy-MM-dd");
  }
  return data;
}
}
