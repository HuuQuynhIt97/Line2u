import { DatePipe } from '@angular/common';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { ExcelExportCompleteArgs, ExcelExportProperties, GridComponent } from '@syncfusion/ej2-angular-grids';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { MessageConstants } from 'src/app/_core/_constants';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { BaseComponent } from 'herr-core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Feed } from 'src/app/_core/_model/feed';
import { FeedService } from 'src/app/_core/_service/feed.service';
import { environment } from 'src/environments/environment';
import { VendorService } from 'src/app/_core/_service/vendor.service';

declare let window:any;

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent extends BaseComponent implements OnInit {
  isAdmin = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_CANCEL';
  data: DataManager;
  modalReference: NgbModalRef;

  @ViewChild('grid') public grid: GridComponent;
  model: Feed;
  locale = localStorage.getItem('lang');
  editSettings = { showDeleteConfirmDialog: false, allowEditing: false, allowAdding: true, allowDeleting: false, mode: 'Normal' };
  title: any;
  @ViewChild('optionModal') templateRef: TemplateRef<any>;
  @ViewChild('odsTemplate', {static:true}) public odsTemplate: any;

  selectionOptions = { checkboxMode: 'ResetOnRowClick'};
  baseUrl = environment.apiUrl;
  fields: object = { text: 'name', value: 'guid' };
  vendorData: any = [];
  constructor(
    private service: FeedService,
    private serviceVendor: VendorService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private datePipe: DatePipe,
     private config: NgbTooltipConfig,
    public translate: TranslateService,
  ) {
	    super(translate,environment.apiUrl);
      if (this.isAdmin === false) {
        config.disableTooltip = true;
      }

    }

  ngOnInit() {
    this.toolbarOptions = ['ExcelExport',{template: this.odsTemplate}, 'Add', 'Search'];

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
    this.getVendors();
    this.loadLang()
  }
  getVendors() {
    const farmGuid = localStorage.getItem('farmGuid');
    this.serviceVendor.getVendors(farmGuid).subscribe(data => {
      this.vendorData = data;
    })
  }
  loadLang() {
    this.translate.get('Feed').subscribe( functionName => {
      this.functionName = functionName;
    });
     this.translate.get('Print by').subscribe(printBy => {
      this.printBy = printBy;
    });
  }
  typeChange(value) { this.model.feedType = value; }

  // life cycle ejs-grid
  dataBound() {
    this.grid.autoFitColumns();
  }
  toolbarClick(args) {
    const functionName = this.functionName;
    const printBy = this.printBy;
      switch (args.item.id) {
        case 'grid_excelexport':
          const accountName = JSON.parse(localStorage.getItem('user'))?.accountName || 'N/A';
          const header = {
            headerRows: 3,
            rows: [
              {
                cells: [{
                    colSpan: 5, value: `* ${functionName}`,
                    style: { fontColor: '#fd7e14', fontSize: 18, hAlign: 'Left', bold: true, }
                }]
            },
            {
              cells: [{
                  colSpan: 5, value: `* ${this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss')}`,
                  style: { fontColor: '#fd7e14', fontSize: 18, hAlign: 'Left', bold: true, }
              }]
          },
          {
            cells: [{
                colSpan: 5, value: `* ${printBy} ${accountName}`,
                style: { fontColor: '#fd7e14', fontSize: 18, hAlign: 'Left', bold: true, }
            }]
        },
            ]
          } as any;

          const fileName = `${functionName}_${this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`
          const excelExportProperties: ExcelExportProperties = {
            hierarchyExportMode: 'All',
            fileName: fileName,
            header: header
        };
          this.grid.excelExport(excelExportProperties);
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
      url: `${this.baseUrl}Feed/LoadData?farmGuid=${farmGuid}&lang=${this.globalLang}`,
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
        this.model.farmGuid = localStorage.getItem('farmGuid');
        this.model.expireDate = this.convertDate(this.model.expireDate);
        this.service.add(this.model).subscribe(
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
        this.model.farmGuid = localStorage.getItem('farmGuid');
        this.model.expireDate = this.convertDate(this.model.expireDate);
        this.service.update(this.model as Feed).subscribe(
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
  openModal(template, data = {} as Feed) {
    if (data?.id > 0) {
      this.model = {...data};
      this.getAudit(this.model.id);
      this.title = 'FEED_EDIT_MODAL';
    } else {
      this.model.id = 0;
      this.model.farmGuid = localStorage.getItem('farmGuid');
      this.title = 'FEED_ADD_MODAL';
    }
    this.modalReference = this.modalService.open(template, {size: 'xl',backdrop: 'static'});
  }
  odsExport() {
    const functionName = this.functionName;
    const printBy = this.printBy;
    const accountName = JSON.parse(localStorage.getItem('user'))?.accountName || 'N/A';
          const header = {
            headerRows: 3,
            rows: [
              {
                cells: [{
                    colSpan: 5, value: `* ${functionName}`,
                    style: { fontColor: '#fd7e14', fontSize: 18, hAlign: 'Left', bold: true, }
                }]
            },
            {
              cells: [{
                  colSpan: 5, value: `* ${this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss')}`,
                  style: { fontColor: '#fd7e14', fontSize: 18, hAlign: 'Left', bold: true, }
              }]
          },
          {
            cells: [{
                colSpan: 5, value: `* ${printBy} ${accountName}`,
                style: { fontColor: '#fd7e14', fontSize: 18, hAlign: 'Left', bold: true, }
            }]
        },
            ]
          } as any;

          const fileName = `${functionName}_${this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss')}.ods`
          const excelExportProperties: ExcelExportProperties = {
            hierarchyExportMode: 'All',
            fileName: fileName,
            header: header
        };

    this.isodsExport = true;

    this.grid.excelExport(excelExportProperties, null, null, true);
  }
  excelExpComplete(args: ExcelExportCompleteArgs) {
    if (this.isodsExport) {
      const fileName = `${this.functionName}_${this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss')}.ods`

      args.promise.then((e: { blobData: Blob }) => {
        const model = {
          functionName: fileName,
          file: e.blobData
        }
        this.service.downloadODSFile(model).subscribe((res: any) => {
        this.service.downloadBlob(res.body, fileName, 'application/vnd.oasis.opendocument.spreadsheet')
        })
      });
    }

  }
}
