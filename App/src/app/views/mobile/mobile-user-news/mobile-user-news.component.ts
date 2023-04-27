import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { ExcelExportCompleteArgs, ExcelExportProperties, GridComponent } from '@syncfusion/ej2-angular-grids';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { ImagePathConstants, MessageConstants } from 'src/app/_core/_constants';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { BaseComponent, UtilitiesService } from 'herr-core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { WebNews, WebNewsUser } from 'src/app/_core/_model/evse/model';
import { WebNewsService } from 'src/app/_core/_service/evse/web-news.service';
import { ToolbarService, LinkService, ImageService, TableService, HtmlEditorService, ToolbarType } from '@syncfusion/ej2-angular-richtexteditor';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { WebNewsUserService } from 'src/app/_core/_service/evse/web-news-user.service';
import { ToastrService } from 'ngx-toastr';
declare let window:any;
declare let $: any;

@Component({
  selector: 'app-mobile-user-news',
  templateUrl: './mobile-user-news.component.html',
  styleUrls: ['./mobile-user-news.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]
})
export class MobileUserNewsComponent extends BaseComponent implements OnInit{
  user = JSON.parse(localStorage.getItem('user'))
  storeInfo = JSON.parse(localStorage.getItem('store'))
  public initialGridLoad = true;
  isAdmin = JSON.parse(localStorage.getItem('user'))?.uid === 'admin';
  data: DataManager;
  modalReference: NgbModalRef;
  active = "Detail"
  @ViewChild('grid') public grid: GridComponent;
  model: WebNewsUser = {} as WebNewsUser;
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
  noImage = ImagePathConstants.NO_IMAGE_QR;
  public tools: ToolbarModule = {
    type: ToolbarType.Expand,
    enableFloating :false,
    items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
        'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
        'Formats', 'Alignments', 'NumberFormatList', 'BulletFormatList',
        'Outdent', 'Indent', '|', 'ClearFormat',
        'SourceCode', 'FullScreen', '|', 'Undo', 'Redo']
};
  fileThumbnail: any;
  store: any;
  constructor(
    private service: WebNewsUserService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private toast: ToastrService,
    private datePipe: DatePipe,
     private config: NgbTooltipConfig,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private utilityService: UtilitiesService,

  ) {
	    super(translate,environment.apiUrl);
      if (this.isAdmin === false) {
        config.disableTooltip = true;
      }

    }

  ngOnInit() {
    this.store = this.route.snapshot.paramMap.get('id')
  this.toolbarOptions = [ 'Add', 'Search'];
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
    this.loadDataAdmin()
    // if(this.user.uid === 'admin') {
    //   if(this.user.uid === this.storeInfo.accountGuid && this.store !== null) {
    //   }else if (this.user.uid === this.storeInfo.accountGuid && this.store === null) {
    //   }

    //   else {

    //     this.loadData();
    //   }
    // }else {
    //   this.loadData();
    // }
    this.loadLang()
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
      switch (args.item.id) {
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
    const lang = localStorage.getItem('lang');
    this.data = new DataManager({
      url: `${this.baseUrl}WebNewsUser/LoadData?lang=${lang}&userID=${this.storeInfo.createBy}`,
      adaptor: new UrlAdaptor,
      headers: [{ authorization: `Bearer ${accessToken}` }]
    });
  }
  loadDataAdmin() {
    this.store = this.route.snapshot.paramMap.get('id')
    if(this.store === null) {
      this.store = this.storeInfo.id
    }
    const accessToken = localStorage.getItem('token');
    const lang = localStorage.getItem('lang');
    this.data = new DataManager({
      url: `${this.baseUrl}WebNewsUser/LoadDataAdmin?lang=${lang}&userID=${this.user.id}&storeId=${this.store}`,
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
              this.toast.success(this.alert.deleted_ok_msg);
              if(this.isAdmin) {
                this.loadDataAdmin();
              }else {
                this.loadData();
              }
            } else {
              this.toast.warning(this.alert.system_error_msg);
            }
          },
          (err) => this.toast.warning(this.alert.system_error_msg)
        );
      }, () => {
        this.toast.error(this.alert.cancelMessage);

      }
    );

  }
  create() {
    let storeId = JSON.parse(localStorage.getItem('store'))?.id
   this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.createTitle,
      this.alert.createMessage,
      () => {
        this.model.createBy = this.user.id;
        this.model.storeId = storeId;
        this.model.file = this.file || [];
        this.model.fileThumnail = this.fileThumbnail || [];
        delete this.model['column'];
        delete this.model['index'];
        this.service.insertForm(this.ToFormatModel(this.model)).subscribe(
          (res) => {
            if (res.success === true) {
              this.toast.success(this.alert.created_ok_msg);
              if(this.isAdmin) {
                this.loadDataAdmin();
              }else {
                this.loadData();
              }
              this.modalReference.dismiss();

            } else {
              this.toast.warning(this.alert.system_error_msg);
            }

          },
          (error) => {
            this.toast.warning(this.alert.system_error_msg);
          }
        );
      }, () => {
        this.toast.error(this.alert.cancelMessage);
      }
    );

  }
  update() {
    let storeId = JSON.parse(localStorage.getItem('store'))?.id
   this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.updateTitle,
      this.alert.updateMessage,
      () => {
        this.model.updateBy = this.user.id;
        this.model.file = this.file || [];
        this.model.storeId = storeId;
        this.model.fileThumnail = this.fileThumbnail || [];
        delete this.model['column'];
        delete this.model['index'];
        this.service.updateForm(this.ToFormatModel(this.model)).subscribe(
          (res) => {
            if (res.success === true) {
              this.toast.success(this.alert.updated_ok_msg);
              if(this.isAdmin) {
                this.loadDataAdmin();
              }else {
                this.loadData();
              }
              this.modalReference.dismiss();
            } else {
              this.toast.warning(this.alert.system_error_msg);
            }
          },
          (error) => {
            this.toast.warning(this.alert.system_error_msg);
          }
        );
      }, () => {
        this.toast.error(this.alert.cancelMessage);
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
  openModal(template, data = {} as WebNews) {
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
    this.configImageThubnail();
  }
  configImage(id="avatar-1") {
    const option = {
      overwriteInitial: true,
      maxFileSize: 1500,
      showClose: false,
      showCaption: false,
      browseLabel: '',
      removeLabel: '',
      browseIcon: '<i class="bi-folder2-open"></i>',
      removeIcon: '<i class="bi-x-lg"></i>',
      removeTitle: 'Cancel or reset changes',
      elErrorContainer: '#kv-avatar-errors-1',
      msgErrorClass: 'alert alert-block alert-danger',
      defaultPreviewContent: '<img src="../../../../../assets/images/no-img.jpg" alt="No Image">',
      layoutTemplates: { main2: '{preview} ' + ' {browse}' },
      allowedFileExtensions: ["jpg", "png", "gif"],
      initialPreview: [],
      initialPreviewConfig: [],
      deleteUrl: `${environment.apiUrl}WebNews/DeleteUploadFile`
    };
    if (this.model.photoPath) {
      this.model.photoPath = this.imagePath(this.model.photoPath);
      const img = `<img src='${this.model.photoPath}' class='file-preview-image' alt='Desert' title='Desert'>`;
      option.initialPreview = [img]

      const a = {
        caption: '',
        width: '',
        url: `${environment.apiUrl}WebNews/DeleteUploadFile`, // server delete action
        key: this.model.id,
        extra: { id: this.model.id }
      }
      option.initialPreviewConfig = [a];
    }
    $("#avatar-1").fileinput(option);;
    let that = this;
    $('#avatar-1').on('filedeleted', function (event, key, jqXHR, data) {
      console.log('Key = ' + key);
      that.file = null;
      that.model.file = null;
      that.model.photoPath = null;
      option.initialPreview = [];
      option.initialPreviewConfig = [];
      $(this).fileinput(option);

    });
  }
  configImageThubnail() {
    const option = {
      overwriteInitial: true,
      maxFileSize: 1500,
      showClose: false,
      showCaption: false,
      browseLabel: '',
      removeLabel: '',
      browseIcon: '<i class="bi-folder2-open"></i>',
      removeIcon: '<i class="bi-x-lg"></i>',
      removeTitle: 'Cancel or reset changes',
      elErrorContainer: '#kv-avatar2-errors-1',
      msgErrorClass: 'alert alert-block alert-danger',
      defaultPreviewContent: '<img src="../../../../../assets/images/no-img.jpg" alt="No Image">',
      layoutTemplates: { main2: '{preview} ' + ' {browse}' },
      allowedFileExtensions: ["jpg", "png", "gif"],
      initialPreview: [],
      initialPreviewConfig: [],
      deleteUrl: `${environment.apiUrl}WebNewsUser/DeleteUploadFileThumbnail`
    };
    if (this.model.thumbnail) {
      this.model.thumbnail = this.imagePath(this.model.thumbnail);
      const img = `<img src='${this.model.thumbnail}' class='file-preview-image' alt='Desert' title='Desert'>`;
      option.initialPreview = [img]

      const a = {
        caption: '',
        width: '',
        url: `${environment.apiUrl}WebNewsUser/DeleteUploadFileThumbnail`, // server delete action
        key: this.model.id,
        extra: { id: this.model.id }
      }
      option.initialPreviewConfig = [a];
    }
    $("#avatar-2").fileinput(option);;
    let that = this;
    $('#avatar-2').on('filedeleted', function (event, key, jqXHR, data) {
      console.log('Key = ' + key);
      that.file = null;
      that.model.fileThumnail = null;
      that.model.thumbnail = null;
      option.initialPreview = [];
      option.initialPreviewConfig = [];
      $(this).fileinput(option);

    });
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
  onFileChangeThumbnail(args) {
    this.fileThumbnail = args.target.files[0];
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
    this.model = {} as WebNews;
  }
  rowSelected(args) {
    this.model = {...args.data};
    this.getAudit(this.model.id)
  }
  dataBound() {
    // if (this.initialGridLoad) {
    //     this.initialGridLoad = false;
    //     const pager = document.getElementsByClassName('e-gridpager');
    //     let topElement;
    //     if (this.grid.allowGrouping || this.grid.toolbar) {
    //         topElement = this.grid.allowGrouping ? document.getElementsByClassName('e-groupdroparea') :
    //             document.getElementsByClassName('e-toolbar');
    //     } else {
    //         topElement = document.getElementsByClassName('e-gridheader');
    //     }
    //     this.grid.element.insertBefore(pager[0], topElement[0]);
    // }
}
}
