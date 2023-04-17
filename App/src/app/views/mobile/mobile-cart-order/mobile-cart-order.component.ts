import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal, NgbModalRef, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { ExcelExportCompleteArgs, ExcelExportProperties, GridComponent } from '@syncfusion/ej2-angular-grids';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { ImagePathConstants, MessageConstants } from 'src/app/_core/_constants';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { BaseComponent, UtilitiesService } from 'herr-core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { WebNews } from 'src/app/_core/_model/evse/model';
import { WebNewsService } from 'src/app/_core/_service/evse/web-news.service';
import { ToolbarService, LinkService, ImageService, TableService, HtmlEditorService, ToolbarType } from '@syncfusion/ej2-angular-richtexteditor';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { MainCategoryService } from 'src/app/_core/_service/evse/main-category.service';
import { MainCategory } from 'src/app/_core/_model/evse/mainCategory';
import { OrderService } from 'src/app/_core/_service/evse/order.service';
import { StoreProfileService } from 'src/app/_core/_service/evse/store-profile.service';
import { StoreProfile } from 'src/app/_core/_model/xaccount';
import { Order } from 'src/app/_core/_model/evse/order';
import { DateRangePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { NgxSpinnerService } from 'ngx-spinner';
declare let window:any;
declare let $: any;

@Component({
  selector: 'app-mobile-cart-order',
  templateUrl: './mobile-cart-order.component.html',
  styleUrls: ['./mobile-cart-order.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService, DatePipe]
})
export class MobileCartOrderComponent extends BaseComponent implements OnInit {

  isAdmin = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_CANCEL';
  data: any;
  modalReference: NgbModalRef;
  active = "Detail"
  @ViewChild('grid') public grid: GridComponent;
  model: Order = {} as Order;
  locale = localStorage.getItem('lang');
  editSettings = { showDeleteConfirmDialog: false, allowEditing: false, allowAdding: true, allowDeleting: false, mode: 'Normal' };
  title: any;
  @ViewChild('optionModal') templateRef: TemplateRef<any>;
  selectionOptions = { checkboxMode: 'ResetOnRowClick'};
  baseUrl = environment.apiUrl;
  fields: object = { text: 'name', value: 'guid' };
  webNewsData: any = [];
  @ViewChild('odsTemplate', {static:true}) public odsTemplate: any;
  file: any;
  apiHost = environment.apiUrl.replace('/api/', '');
  noImage = ImagePathConstants.NO_IMAGE;
  user = JSON.parse(localStorage.getItem('user'))
  @ViewChild("parentTemplate", { static: true })
  public parentTemplate: any;
  public tools: ToolbarModule = {
    type: ToolbarType.Expand,
    enableFloating :false,
    items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
        'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
        'Formats', 'Alignments', 'NumberFormatList', 'BulletFormatList',
        'Outdent', 'Indent', '|', 'ClearFormat',
        'SourceCode', 'FullScreen', '|', 'Undo', 'Redo']
 };
 public initialGridLoad = true;
//  storeInfo: StoreProfile = {} as StoreProfile;
  hoveredDate: NgbDate | null = null;
  @ViewChild('range')
  public DateRange: DateRangePickerComponent;
	fromDate: NgbDate | null;
	toDate: NgbDate | null;
  value: any;
  startDate: any = new Date();
  endDate: any = new Date();
  storeGuid: string;
  storeInfo = JSON.parse(localStorage.getItem('store'))
  constructor(
    private service: MainCategoryService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private orderService: OrderService,
    private serviceStore: StoreProfileService,
    private datePipe: DatePipe,
     private config: NgbTooltipConfig,
    public translate: TranslateService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private calendar: NgbCalendar, 
    private route: ActivatedRoute,
    public formatter: NgbDateParserFormatter,
    private utilityService: UtilitiesService,

  ) {
    
	    super(translate,environment.apiUrl);
      if (this.isAdmin === false) {
        config.disableTooltip = true;
      }
      
    }

  ngOnInit() {
    this.storeGuid = this.route.snapshot.paramMap.get('id')
    console.log(this.storeGuid)
    const ischangeTime = localStorage.getItem('ischangeTime')
    if( ischangeTime !== null || ischangeTime === 'true')
    {
      this.value = [new Date(localStorage.getItem('startDate')), new Date(localStorage.getItem('endDate'))];
      this.startDate = this.datePipe.transform(this.value[0] || new Date(1970, 1, 1), 'yyyy/MM/dd');
      this.endDate = this.datePipe.transform(this.value[1] || new Date(1970, 1, 1), 'yyyy/MM/dd');
    }else {
      this.value = [new Date(), new Date()];
    }
    this.toolbarOptions = [{ template: this.parentTemplate }, 'Search'];
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
    this.loadData()
    this.loadLang()
    
  }

  deposit(args) {
    if(args.isInteracted) {

      this.value = this.DateRange.value;
      this.startDate = this.datePipe.transform(this.value[0] || new Date(1970, 1, 1), 'yyyy/MM/dd');
      this.endDate = this.datePipe.transform(this.value[1] || new Date(1970, 1, 1), 'yyyy/MM/dd');
      localStorage.setItem('startDate',this.datePipe.transform(this.startDate || new Date(1970, 1, 1), 'yyyy/MM/dd'))
      localStorage.setItem('ischangeTime','true')
      localStorage.setItem('endDate',this.datePipe.transform(this.endDate || new Date(1970, 1, 1), 'yyyy/MM/dd'))
      this.loadData()
    }
  }
  refresh() {
    this.value = [new Date(), new Date()];
    this.startDate = this.datePipe.transform( new Date() || new Date(1970, 1, 1), 'yyyy/MM/dd');
    this.endDate = this.datePipe.transform( new Date() || new Date(1970, 1, 1), 'yyyy/MM/dd');
    localStorage.setItem('startDate',this.datePipe.transform(this.startDate || new Date(1970, 1, 1), 'yyyy/MM/dd'))
    localStorage.setItem('ischangeTime','false')
    localStorage.setItem('endDate',this.datePipe.transform(this.endDate || new Date(1970, 1, 1), 'yyyy/MM/dd'))
    this.loadData()
  }
  tranformss(date) {

  }
  getStoreInfor() {
    this.serviceStore.GetWithGuid(this.user?.uid).subscribe(res => {
      this.storeInfo = res;
      localStorage.setItem('store', JSON.stringify(res));
      this.loadData()
    })
  }
  detail(item) {
    const uri = this.router.url;
    localStorage.setItem('isLogin_Cus',uri)
    this.router.navigate([`mobile/cart-order-detail/${item.guid}`]);
  }
  dataBound() {
  if (this.initialGridLoad) {
      this.initialGridLoad = false;
      const pager = document.getElementsByClassName('e-gridpager');
      let topElement;
      if (this.grid.allowGrouping || this.grid.toolbar) {
          topElement = this.grid.allowGrouping ? document.getElementsByClassName('e-groupdroparea') :
              document.getElementsByClassName('e-toolbar');
      } else {
          topElement = document.getElementsByClassName('e-gridheader');
      }
      this.grid.element.insertBefore(pager[0], topElement[0]);
    }
  // this.grid.autoFitColumns();
}
  loadLang() {
    this.translate.get('WebNews').subscribe( functionName => {
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
    this.spinner.show()
    const accessToken = localStorage.getItem('token');
    const lang = localStorage.getItem('lang');
    this.orderService.getTrackingOrderForStore(this.storeInfo?.guid,this.datePipe.transform(this.startDate || new Date(1970, 1, 1), 'yyyy/MM/dd'),this.datePipe.transform(this.endDate || new Date(1970, 1, 1), 'yyyy/MM/dd')).subscribe(res => {
      this.data = res
      this.spinner.hide()
    })
    // this.data = new DataManager({
    //   url: `${this.baseUrl}MainCategory/LoadData?lang=${lang}&uid=${this.user.uid}`,
    //   adaptor: new UrlAdaptor,
    //   headers: [{ authorization: `Bearer ${accessToken}` }]
    // });
    // this.order
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
  //  this.alertify.confirm4(
  //     this.alert.yes_message,
  //     this.alert.no_message,
  //     this.alert.createTitle,
  //     this.alert.createMessage,
  //     () => {
  //       this.model.accountUid = this.user.uid
  //       this.model.createBy = this.user.id;
  //       this.model.file = this.file || [];
  //       delete this.model['column'];
  //       delete this.model['index'];
  //       this.service.insertForm(this.ToFormatModel(this.model)).subscribe(
  //         (res) => {
  //           if (res.success === true) {
  //             this.alertify.success(this.alert.created_ok_msg);
  //             this.loadData();
  //             this.modalReference.dismiss();

  //           } else {
  //             this.alertify.warning(this.alert.system_error_msg);
  //           }

  //         },
  //         (error) => {
  //           this.alertify.warning(this.alert.system_error_msg);
  //         }
  //       );
  //     }, () => {
  //       this.alertify.error(this.alert.cancelMessage);
  //     }
  //   );

  }
  update() {
   this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.updateTitle,
      this.alert.updateMessage,
      () => {
        delete this.model['column'];
        delete this.model['index'];
        this.orderService.update(this.model).subscribe(
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
      if (value && value instanceof Date) {
        if (key === 'createDate') {
          model[key] = this.datePipe.transform(value, "yyyy/MM/dd HH:mm:ss");
        } else {
          model[key] = this.datePipe.transform(value, "yyyy/MM/dd");
        }
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
  openModal(template, data = {} as Order) {
    if (data?.id > 0) {
      this.model = {...data};
      this.getAudit(this.model.id);
      this.title = 'Edit_Model';
    } else {
      this.model.id = 0;
      this.model.status = 1;
      this.title = 'Add_Model';
    }
    this.modalReference = this.modalService.open(template, {size: 'xl',backdrop: 'static'});
   this.configImage();
  }
  configImage(id="avatar-1") {
    // const option = {
    //   overwriteInitial: true,
    //   maxFileSize: 1500,
    //   showClose: false,
    //   showCaption: false,
    //   browseLabel: '',
    //   removeLabel: '',
    //   browseIcon: '<i class="bi-folder2-open"></i>',
    //   removeIcon: '<i class="bi-x-lg"></i>',
    //   removeTitle: 'Cancel or reset changes',
    //   elErrorContainer: '#kv-avatar-errors-1',
    //   msgErrorClass: 'alert alert-block alert-danger',
    //   defaultPreviewContent: '<img src="../../../../../assets/images/no-img.jpg" alt="No Image">',
    //   layoutTemplates: { main2: '{preview} ' + ' {browse}' },
    //   allowedFileExtensions: ["jpg", "png", "gif"],
    //   initialPreview: [],
    //   initialPreviewConfig: [],
    //   deleteUrl: `${environment.apiUrl}MainCategory/DeleteUploadFile`
    // };
    // if (this.model.photoPath) {
    //   this.model.photoPath = this.imagePath(this.model.photoPath);
    //   const img = `<img src='${this.model.photoPath}' class='file-preview-image' alt='Desert' title='Desert'>`;
    //   option.initialPreview = [img]

    //   const a = {
    //     caption: '',
    //     width: '',
    //     url: `${environment.apiUrl}MainCategory/DeleteUploadFile`, // server delete action
    //     key: this.model.id,
    //     extra: { id: this.model.id }
    //   }
    //   option.initialPreviewConfig = [a];
    // }
    // $("#avatar-1").fileinput(option);;
    // let that = this;
    // $('#avatar-1').on('filedeleted', function (event, key, jqXHR, data) {
    //   console.log('Key = ' + key);
    //   that.file = null;
    //   that.model.file = null;
    //   that.model.photoPath = null;
    //   option.initialPreview = [];
    //   option.initialPreviewConfig = [];
    //   $(this).fileinput(option);

    // });
  }
  imagePath(path) {
    if (path !== null && this.utilityService.checkValidImage(path)) {
      if (this.utilityService.checkExistHost(path)) {
        return path;
      }
      return this.apiHost + path;
    }
    return this.noImage;
  }
  onFileChangeLogo(args) {
    this.file = args.target.files[0];
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
  cancel() {
    this.audit = {}
    this.model = {} as Order;
  }
  rowSelected(args) {
    this.model = {...args.data};
    this.getAudit(this.model.id)
  }

}
