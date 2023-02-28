import { Bios2pigModalComponent } from './bios-2pig-modal/bios-2pig-modal.component';
import { async } from '@angular/core/testing';
import { DataManager, UrlAdaptor, ODataV4Adaptor,Query } from '@syncfusion/ej2-data';
import { L10n, setCulture, EmitType } from '@syncfusion/ej2-base';
import { Component, OnInit, TemplateRef, ViewChild, Input ,OnChanges, SimpleChanges} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { MessageConstants } from 'src/app/_core/_constants';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { BaseComponent } from 'herr-core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { BioS2pig, BioSMaster } from 'src/app/_core/_model/bios';
import { BioSMasterService, BioS2pigService } from 'src/app/_core/_service/bios';
import { Subscription } from 'rxjs';
import { PigService } from 'src/app/_core/_service/pigs/pig.service';
import { DropDownListComponent, FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
@Component({
  selector: 'app-bios-2pig',
  templateUrl: './bios-2pig.component.html',
  styleUrls: ['./bios-2pig.component.scss']
})
export class Bios2pigComponent extends BaseComponent implements OnInit,OnChanges {
  localLang =  (window as any).navigator.userLanguage || (window as any).navigator.language;
  @Input() bioSMaster: BioSMaster;
  @Input() bottomHeight: any;
  @ViewChild('remote') public dropdownObj: DropDownListComponent
  data: DataManager;
  baseUrl = environment.apiUrl;
  modalReference: NgbModalRef;
  
  @ViewChild('grid') public grid: GridComponent;
  model: BioS2pig;
  setFocus: any;
  locale = localStorage.getItem('lang');
  editSettings = { showDeleteConfirmDialog: false, allowEditing: false, allowAdding: true, allowDeleting: false, mode: 'Normal' };
  title: any;
  @ViewChild('optionModal') templateRef: TemplateRef<any>;
  toolbarOptions = ['Add', 'Search'];
  subscription: Subscription;
  fields: object = { text: 'name', value: 'guid' };

  constructor(
    private service: BioS2pigService,
    private serviceBioSMaster: BioSMasterService,
    private servicPig: PigService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    public translate: TranslateService,
  ) { super(translate,environment.apiUrl);  }
  ngOnChanges(changes: SimpleChanges): void {

    if (this.bottomHeight != changes.bottomHeight.currentValue) {
      this.bottomHeight = changes.bottomHeight.currentValue;
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
    this.subscription = this.serviceBioSMaster.currentBioSMaster.subscribe(bioSMaster => {
      this.bioSMaster = bioSMaster as BioSMaster;
      if (this.bioSMaster?.guid) {
        this.loadData();
      }
    });
    this.onLoadData();
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  onLoadData() {
    this.service.currentMessage
    .subscribe(arg => {
      if (arg === 200) {
        this.loadData();
      }
    });
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

  loadData() {
    const accessToken = localStorage.getItem('token');
    this.data = new DataManager({
      url: `${this.baseUrl}BioS2pig/LoadData?bioSMasterGuid=${this.bioSMaster?.guid}`,
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

  // end api
  NO(index) {
    return (this.grid.pageSettings.currentPage - 1) * this.grid.pageSettings.pageSize + Number(index) + 1;
  }

   openModal(template, data = {} as any) {
    if (!this.bioSMaster?.guid) {
       this.translate.get('Please choose the bio security master!').subscribe(data => {
        this.alertify.warning(data, true);
      })
      return;
    }

    if (data?.id > 0) {
      this.model = { ...data };
      this.title = 'BIO_SECURITY_2PIG_EDIT_MODAL'
    } else {
      this.model.id = 0;
      this.title = 'BIO_SECURITY_2PIG_ADD_MODAL';
    }
    this.modalReference = this.modalService.open(Bios2pigModalComponent, { size: 'md', backdrop: 'static' });
    this.modalReference.componentInstance.title = this.title;
    this.modalReference.componentInstance.bioSMaster = this.bioSMaster;
    this.modalReference.componentInstance.model = this.model;

  }


}
