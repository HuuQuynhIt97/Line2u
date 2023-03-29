
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { BaseComponent } from 'herr-core';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewChild, TemplateRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { ExcelExportCompleteArgs, ExcelExportProperties, Grid, GridComponent, RowDD, RowDDService } from '@syncfusion/ej2-angular-grids';
import { NgbModal, NgbModalRef, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { ReportConfig } from 'src/app/_core/_model/report-config';
import { ReportConfigService } from 'src/app/_core/_service/report-config.service';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
Grid.Inject(RowDD);
declare let $;
@Component({
  selector: 'app-column-config',
  templateUrl: './column-config.component.html',
  styleUrls: ['./column-config.component.scss']
})
export class ColumnConfigComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() systemMenuGuid: string;
  @Input() bottomHeight: any;
  isAdmin = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_CANCEL';
  data: DataManager;
  baseUrl = environment.apiUrl;
  password = '';
  modalReference: NgbModalRef;

  @ViewChild('grid') public grid: GridComponent;
  model: ReportConfig;
  setFocus: any;
  locale ;
  editSettings = { showDeleteConfirmDialog: false, allowEditing: true, allowAdding: true, allowDeleting: false, mode: 'Normal' };
  title: any;
  @ViewChild('optionModal') templateRef: TemplateRef<any>;
  @ViewChild('odsTemplate', {static:true}) public odsTemplate: any;
  selectOptions = { type: 'Multiple' };
  reorderRow =[];
  keyRules: object;
  commonRules: object;
  commentRules: object;
  widthRules: object;
  value = 'value';
  public customFn: (args: { [key: string]: string }) => boolean = (args: { [key: string]: string }) => {
    return args[this.value].length <= 50;
 }
 public commonFn: (args: { [key: string]: string }) => boolean = (args: { [key: string]: string }) => {
  return args[this.value].length <= 500;
}
public commentFn: (args: { [key: string]: string }) => boolean = (args: { [key: string]: string }) => {
  return args[this.value].length <= 100;
}
  textAlign: any = 'Left';
  constructor(
    private service: ReportConfigService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
     private config: NgbTooltipConfig,
    public translate: TranslateService,
  ) {
	    super(translate,environment.apiUrl);
      if (this.isAdmin === false) {
        config.disableTooltip = true;
      }

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.systemMenuGuid?.previousValue != changes.systemMenuGuid?.currentValue) {
      this.systemMenuGuid = changes.systemMenuGuid.currentValue;
      if ( this.systemMenuGuid) {
        this.loadData();
      }
    }
    if (this.bottomHeight != changes.bottomHeight?.currentValue) {
      this.bottomHeight = changes.bottomHeight?.currentValue;
    }
  }
  ngOnInit() {
    this.toolbarOptions = ['ExcelExport',{template: this.odsTemplate}, 'Add', 'Search'];
    this.keyRules = { required: [true, this.validationGrid.requireField], maxLength: [this.customFn, `${this.validationGrid.textLength} <= 50`] };
    this.commonRules = { maxLength: [this.commonFn, `${this.validationGrid.textLength} <= 500`] };
    this.commentRules = { maxLength: [this.commentFn, `${this.validationGrid.textLength} <= 100`] };
    this.widthRules = { min: 0 };
    let lang = localStorage.getItem('lang');
    this.locale = lang;
    let languages = JSON.parse(localStorage.getItem('languages'));
    // setCulture(lang);
    let load = {
      [lang]: {
        grid: languages['grid'],
        pager: languages['pager']
      }
    };
    L10n.load(load);
    this.loadLang();
    // this.Permission(this.route);
  }
  // life cycle ejs-grid

  rowDrop(args) {
    const dropIndex = args.dropIndex;
    const fromIndex = args.fromIndex;
    if (fromIndex !== dropIndex) {
      this.service.updateBySequence(args.data[0].systemMenuGuid, fromIndex, dropIndex).subscribe(() => {
        this.loadData();
      });
    }
  }

  headerCellInfo(args) {
 }
  onDoubleClick(args: any): void {
    this.setFocus = args.column; // Get the column from Double click event
  }

  onChange(args, data) {
    data.isDefault = args.checked;

  }

  actionBegin(args) {
    if (args.requestType === 'beginEdit') {
      this.textAlign = args.rowData?.textAlign || null;
    }
    if (args.requestType === 'save' && args.action === 'add') {
      this.model = {...args.data};
      this.model.id = 0;
      this.model.systemMenuGuid = this.systemMenuGuid;
      this.model.textAlign = this.textAlign;
      this.model.slpage = 'Report';
      this.model.sltype = 'Report Column';
      this.create();

    }
    if (args.requestType === 'save' && args.action === 'edit') {
      this.model = {...args.data};
      this.model.textAlign = this.textAlign;
      this.update();
    }
  }

loadLang() {
  this.translate.get('Report Column').subscribe( functionName => {
    this.functionName = functionName;
  });
   this.translate.get('Print by').subscribe(printBy => {
    this.printBy = printBy;
  });
}
// life cycle ejs-grid
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
          // args.cancel = true;
          // this.model = {} as any;
          // this.openModal(this.templateRef);
          break;
        default:
          break;
      }
  }
  actionComplete(args) {
    if (args.requestType === 'beginEdit') {
      if (this.setFocus.field === 'textAlign') {
        args.form.elements.namedItem('comment').focus();

      } else {
        args.form.elements.namedItem(this.setFocus.field).focus();
      }
      }
  }

  // end life cycle ejs-grid

  // api
  loadData() {
    // this.service.getAll().subscribe(data => {
    //   this.data = data;
    // });
    const accessToken = localStorage.getItem('token');
    this.data = new DataManager({
      url: `${this.baseUrl}ReportConfig/LoadReportColumnData?systemMenuGuid=${this.systemMenuGuid}`,
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
      this.service.add(this.model).subscribe(
          (res) => {
            if (res.success === true) {
              this.textAlign = 'Left';
              this.alertify.success(this.alert.created_ok_msg);
              this.loadData();
              //this.modalReference.dismiss();
            } else {
              this.alertify.warning(res.message, true);
            }
          },
          (error) => {
            if (error.indexOf('error') == -1) {
              this.alertify.warning(error, true);
            } else {
             this.alertify.warning(this.alert.serverError, true);
            }
          }
        );
  }
  update() {
    this.service.update(this.model).subscribe(
      (res) => {
        if (res.success === true) {
          this.alertify.success(this.alert.updated_ok_msg);
          this.loadData();
          //this.modalReference.dismiss();
        } else {
          this.alertify.warning(res.message, true);
        }
      },
      (error) => {
        if (error.indexOf('error') == -1) {
          this.alertify.warning(error, true);
        } else {
         this.alertify.warning(this.alert.serverError, true);

        }
      }
    );
  }
  // end api
  NO(index) {
    return (this.grid.pageSettings.currentPage - 1) * this.grid.pageSettings.pageSize + Number(index) + 1;
  }
  save() {
    if (this.model.id > 0) {
      //this.update();
    } else {
      //this.create();
    }
  }
  openModal(template, data = {} as ReportConfig) {
    if (!this.systemMenuGuid) {
      this.alertify.warning(this.translate.instant('Please select a system report menu'), true);
      return;
    }
    this.model = {...data} ;
    this.model.slpage = 'Report';
    this.model.sltype = 'Report Column';
    if (this.model.id > 0) {
      this.title = 'COLUMN_REPORT_EDIT_MODAL';
    } else {
      this.title = 'COLUMN_REPORT_ADD_MODAL';
      this.model.id = 0;
      this.model.systemMenuGuid = this.systemMenuGuid;

    }
    this.modalReference = this.modalService.open(template, { size: 'xl' });

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


