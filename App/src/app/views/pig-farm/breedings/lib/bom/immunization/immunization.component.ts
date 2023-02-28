import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { L10n,setCulture } from '@syncfusion/ej2-base';
import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { MessageConstants } from 'src/app/_core/_constants';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { BaseComponent } from 'herr-core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { BOMImmunization } from 'src/app/_core/_model/bom-immunization';
import { BOMImmunizationService } from 'src/app/_core/_service/bom-immunization.service';
import { BomSow } from '../../../config';
import { BomSowService } from '../../../services';
@Component({
  selector: 'app-immunization',
  templateUrl: './immunization.component.html',
  styleUrls: ['./immunization.component.css']
})
export class ImmunizationComponent extends BaseComponent implements OnInit {
  @Input() bomSow: BomSow;
  data: DataManager;
  baseUrl = environment.apiUrl;
  modalReference: NgbModalRef;

  @ViewChild('grid') public grid: GridComponent;
  model: BOMImmunization;
  setFocus: any;
  locale = localStorage.getItem('lang');
  editSettings = { showDeleteConfirmDialog: false, allowEditing: false, allowAdding: true, allowDeleting: false, mode: 'Normal' };
  title: any;
  @ViewChild('optionModal') templateRef: TemplateRef<any>;
  toolbarOptions = ['Add', 'Search'];
  subscription: Subscription;
  sortSettings = { columns: [{ field: 'applyDays', direction: 'Ascending' }] };
  constructor(
    private service: BOMImmunizationService,
    private serviceShare: BomSowService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    public translate: TranslateService,
  ) { super(translate,environment.apiUrl);  }

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
    this.subscription = this.serviceShare.currentBomSow.subscribe(bomSow => {
      this.bomSow = bomSow as any
      if (this.bomSow?.guid) {
        this.loadData();
      }
    });
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
      url: `${this.baseUrl}BOMImmunization/LoadDataByBomGuid?farmGuid=${localStorage.getItem('farmGuid')}&bomGuid=${this.bomSow?.guid}&lang=${this.globalLang}`,
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


        this.model.bomGuid = this.bomSow?.guid;
        this.model.applyDays = (this.model?.applyDays|| 0)  + '';

        this.service.add(this.model as BOMImmunization).subscribe(
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

    this.model.bomGuid = this.bomSow?.guid;
    this.model.applyDays = (this.model?.applyDays|| 0)  + '';

    this.service.update(this.model as BOMImmunization).subscribe(
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
    if (!this.bomSow?.guid) {
      this.alertify.warning(this.translate.instant('Please choose the BomSow!'), true);
      return;
    }
    if (data?.id > 0) {
      this.model = {...data};
      this.getAudit(this.model.id);
      this.title = 'BomSow_IMMUNIZATION_EDIT_MODAL'
    } else {
      this.model.id = 0;
      this.title = 'BomSow_IMMUNIZATION_ADD_MODAL';
    }
    this.modalReference = this.modalService.open(template, {size: 'xl',backdrop: 'static'});
  }
}
