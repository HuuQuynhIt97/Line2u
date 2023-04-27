import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { ExcelExportCompleteArgs, ExcelExportProperties, GridComponent } from '@syncfusion/ej2-angular-grids';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { ImagePathConstants, MessageConstants } from 'src/app/_core/_constants';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { BaseComponent, UtilitiesService } from 'herr-core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, DefaultUrlSerializer, UrlSerializer } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { WebNews } from 'src/app/_core/_model/evse/model';
import { WebNewsService } from 'src/app/_core/_service/evse/web-news.service';
import { ToolbarService, LinkService, ImageService, TableService, HtmlEditorService, ToolbarType } from '@syncfusion/ej2-angular-richtexteditor';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { MainCategoryService } from 'src/app/_core/_service/evse/main-category.service';
import { MainCategory } from 'src/app/_core/_model/evse/mainCategory';
import { DataService } from 'src/app/_core/_service/data.service';
import { ToastrService } from 'ngx-toastr';
import { StoreProfileService } from 'src/app/_core/_service/evse/store-profile.service';
import { StoreTable } from 'src/app/_core/_model/xaccount';
import { DisplayTextModel } from '@syncfusion/ej2-angular-barcode-generator';
import { WINDOW } from 'src/app/_core/_helper/windowProvider';
import { SafeUrl } from '@angular/platform-browser';
declare let window:any;
declare let $: any;

@Component({
  selector: 'app-store-table',
  templateUrl: './store-table.component.html',
  styleUrls: ['./store-table.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]
})
export class StoreTableComponent extends BaseComponent implements OnInit {

  isAdmin = JSON.parse(localStorage.getItem('user'))?.uid === 'admin';
  data: any;
  modalReference: NgbModalRef;
  active = "Detail"
  @ViewChild('grid') public grid: GridComponent;
  model: StoreTable = {} as StoreTable;
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
  storeInfo = JSON.parse(localStorage.getItem('store'))
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
 public displayTextMethod: DisplayTextModel = {
  visibility: false
};
 public initialGridLoad = true;
  store: any;
  public qrcode = 'Initial QR code data string';
  storeId = JSON.parse(localStorage.getItem('store'))?.id
  public qrCodeDownloadLink: SafeUrl = "";
  constructor(
    private service: MainCategoryService,
    private serviceStore: StoreProfileService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private toast: ToastrService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
     private config: NgbTooltipConfig,
    public translate: TranslateService,
    private utilityService: UtilitiesService,

  ) {
	    super(translate,environment.apiUrl);
      if (this.isAdmin === false) {
        config.disableTooltip = true;
      }

    }

  ngOnInit() {
    // this.store = this.route.snapshot.paramMap.get('id')

    this.toolbarOptions = ['Add', 'Search'];
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
    // if(this.user.uid === 'admin') {

    // }else {
    //   this.store = this.storeInfo.id
    // }
    this.loadData();
    this.loadLang()
  }
  dataBound() {

}
private convertBase64ToBlob(Base64Image: any) {
  // SPLIT INTO TWO PARTS
  const parts = Base64Image.split(';base64,');
  // HOLD THE CONTENT TYPE
  const imageType = parts[0].split(':')[1];
  // DECODE BASE64 STRING
  const decodedData = window.atob(parts[1]);
  // CREATE UNIT8ARRAY OF SIZE SAME AS ROW DATA LENGTH
  const uInt8Array = new Uint8Array(decodedData.length);
  // INSERT ALL CHARACTER CODE INTO UINT8ARRAY
  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i);
  }
  // RETURN BLOB IMAGE AFTER CONVERSION
  return new Blob([uInt8Array], { type: imageType });
}
onChangeURL(url: SafeUrl) {
  console.log('onChangeURL',url)
  this.qrCodeDownloadLink = url;
}
printData(data,parent) {
  var hostname = window.location.host;
  var protocol = window.location.protocol;
  let host = protocol + hostname
  let link = `/home/store/shop/${this.storeId}/${data.tableNumber}/device`
  let link1 = `${host}${link}`
  this.qrcode = link1
  console.log(this.qrcode)
 // fetches base 64 date from image
 setTimeout(() => {
   const parentElement = parent.qrcElement.nativeElement.querySelector("img").src;
   let blobData = this.convertBase64ToBlob(parentElement);

   if (window.navigator && window.navigator.msSaveOrOpenBlob) { //IE
     window.navigator.msSaveOrOpenBlob(blobData, 'Qrcode');
   } else { // chrome
     const blob = new Blob([blobData], { type: "image/png" });
     const url = window.URL.createObjectURL(blob);
     // window.open(url);
     const link = document.createElement('a');
     link.href = url;
     link.download = `${this.storeInfo.storeName} - ${data.tableNumber}`;
     link.click();
   }
 }, 300);

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
    this.store = this.route.snapshot.paramMap.get('id')
    if(this.store === null) {
      this.store = this.storeInfo.id
    }
    const accessToken = localStorage.getItem('token');
    const lang = localStorage.getItem('lang');
    this.serviceStore.getAllStoreTable(this.store).subscribe(res => {
      this.data = res
    })
    // this.data = new DataManager({
    //   url: `${this.baseUrl}MainCategory/LoadData?lang=${lang}&uid=${this.storeInfo.accountGuid}`,
    //   adaptor: new UrlAdaptor,
    //   headers: [{ authorization: `Bearer ${accessToken}` }]
    // });
  }

  loadDataAdmin() {
    const accessToken = localStorage.getItem('token');
    const lang = localStorage.getItem('lang');
    this.data = new DataManager({
      url: `${this.baseUrl}MainCategory/LoadDataAdmin?lang=${lang}&uid=${this.storeInfo.accountGuid}&storeId=${this.store}`,
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
        this.alertify.error(this.alert.cancelMessage);

      }
    );

  }
  create() {
    let storeId = JSON.parse(localStorage.getItem('store'))?.id
    this.model.storeId = storeId;
    delete this.model['column'];
    delete this.model['index'];
    this.serviceStore.addTable(this.model).subscribe(
      (res) => {
        if (res.success === true) {
          this.toast.success(this.alert.created_ok_msg);
          this.loadData();
          this.modalReference.dismiss();

        } else {
          this.toast.warning(this.alert.system_error_msg);
        }

      },
      (error) => {
        this.toast.warning(this.alert.system_error_msg);
      }
    );

  }
  update() {
    let storeId = JSON.parse(localStorage.getItem('store'))?.id
    delete this.model['column'];
    delete this.model['index'];
    this.model.storeId = storeId;
    this.serviceStore.updateTable(this.model).subscribe(
      (res) => {
        if (res.success === true) {
          this.toast.success(this.alert.updated_ok_msg);
          this.loadData();
          this.modalReference.dismiss();
        } else {
          this.toast.warning(this.alert.system_error_msg);
        }
      },
      (error) => {
        this.toast.warning(this.alert.system_error_msg);
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
  openModal(template, data = {} as StoreTable) {
    if (data?.id > 0) {
      this.model = {...data};
      this.getAudit(this.model.id);
      this.title = 'Edit_Model';
    } else {
      this.model.id = 0;
      this.title = 'Add_Model';
    }
    this.modalReference = this.modalService.open(template, {size: 'xl',backdrop: 'static'});
  //  this.configImage();
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
      deleteUrl: `${environment.apiUrl}MainCategory/DeleteUploadFile`
    };


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
    this.model = {} as StoreTable;
  }
  rowSelected(args) {
    this.model = {...args.data};
    this.getAudit(this.model.id)
  }

}
