import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { Products } from 'src/app/_core/_model/evse/products';
declare let window:any;
declare let $: any;
import { Browser } from '@syncfusion/ej2-base';
import { ProductsService } from 'src/app/_core/_service/evse/products.service';
import { MainCategoryService } from 'src/app/_core/_service/evse/main-category.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/_core/_service/data.service';
import { ToastrService } from 'ngx-toastr';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]
})
export class MenuListComponent extends BaseComponent implements OnInit {

  user = JSON.parse(localStorage.getItem('user'))
  isAdmin = JSON.parse(localStorage.getItem('user'))?.uid === 'admin';
  data: DataManager;
  modalReference: NgbModalRef;
  active = "Detail"
  @ViewChild('grid') public grid: GridComponent;
  model: Products = {} as Products;
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
  @ViewChild("parentTemplate", { static: true })
  public parentTemplate: any;
  public initialGridLoad = true;
  categoryData: any;
  categoryFields: object = { text: 'categoryName', value: 'guid' };
  $CategoryFilter: any;
  store: any;
  storeInfo = JSON.parse(localStorage.getItem('store'))

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  productSize: string[] = [];
  productOption: string[] = [];
  allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  @ViewChild('fruitInput', {static: false}) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
  formArraySize:FormArray = new FormArray([]);
  formArrayOption:FormArray = new FormArray([]);
  constructor(
    private service: ProductsService,
    private serviceMainCategory: MainCategoryService,
    public modalService: NgbModal,
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private toast: ToastrService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
     private config: NgbTooltipConfig,
    public translate: TranslateService,
    public dataService: DataService,
    private utilityService: UtilitiesService,

  ) {
	    super(translate,environment.apiUrl);
      if (this.isAdmin === false) {
        config.disableTooltip = true;
      }

      this.dataService.currentMessage.subscribe((res: any) => {
        if(res === 'load products') {
          this.loadAllData()
        }
      })

      // this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      //   startWith(null),
      //   map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));

    }

  ngOnInit() {
    // this.store = this.route.snapshot.paramMap.get('id')
    // if(this.store === null) {
    //   this.store = this.storeInfo.id
    // }
    this.toolbarOptions = [ 'Add',{ template: this.parentTemplate }, 'Search'];
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
    this.loadAllData()
    this.loadLang()
  }

  getFormGroup(data) {
    data = data || ({} as any);
    return new FormGroup({
      name: new FormControl(data.name,Validators.required),
      price: new FormControl(data.price,Validators.required),
    });
  }

  getFormGroupOption(data) {
    data = data || ({} as any);
    return new FormGroup({
      name: new FormControl(data.name,Validators.required),
      price: new FormControl(data.price,Validators.required),
    });
  }
  addSize(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.model.productSize.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.fruitCtrl.setValue(null);
  }

  addOption(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.model.productOption.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.fruitCtrl.setValue(null);
  }

  removeSize(fruit: string): void {
    const index = this.model.productSize.indexOf(fruit);
    if (index >= 0) {
      this.model.productSize.splice(index, 1);
    }
  }

  removeOption(fruit: string): void {
    const index = this.model.productOption.indexOf(fruit);
    if (index >= 0) {
      this.model.productOption.splice(index, 1);
    }
  }

  selectedSize(event: MatAutocompleteSelectedEvent): void {
    this.productSize.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }


  selectedOption(event: MatAutocompleteSelectedEvent): void {
    this.productOption.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }


  loadAllData() {
    this.store = this.route.snapshot.paramMap.get('id')
    if(this.store === null) {
      this.store = this.storeInfo.id
    }
    this.loadDataAdmin()
    this.loadDataCategoryAdmin()
    // if(this.user.uid === 'admin') {
    //   if(this.user.uid === this.storeInfo.accountGuid && this.store !== null) {
    //     this.loadDataAdmin()
    //     this.loadDataCategoryAdmin()
    //   }else if (this.user.uid === this.storeInfo.accountGuid && this.store === null) {
    //     this.spinner.hide()
    //   }
    //   else {
    //     this.loadDataCategory()
    //     this.loadData();
    //   }
    // }else {
    //   this.loadDataCategory()
    //   this.loadData();
    // }
  }
  dataBound() {

}
  loadDataCategory() {
    this.serviceMainCategory.getCategoryByUserID(this.storeInfo.accountGuid).subscribe(res => {
      this.categoryData = res

    })
  }
  loadDataCategoryAdmin() {
    this.serviceMainCategory.getCategoryByUserIDAndStore(this.user.uid,this.store).subscribe(res => {
      this.categoryData = res

    })
  }
  loadLang() {
    this.translate.get('WebNews').subscribe( functionName => {
      this.functionName = functionName;
    });
     this.translate.get('Print by').subscribe(printBy => {
      this.printBy = printBy;
    });
  }
  public onOpenPopUpFuneralModal(event) {
    setTimeout(() => {
      if (Browser.isDevice) {
        event.popup.position = { X: 'left', Y: 'bottom' };
        event.popup.width = document.getElementById('categorydropdown').offsetWidth;
        event.popup.dataBind();
        event.popup.element.classList.remove('e-ddl-device', 'e-popup-full-page'
        );
        event.popup.element.style.top = parseInt(event.popup.element.style.top) + 'px';
        event.popup.element.style.bottom = 'auto';
        event.popup.element.style.maxHeight = 300;
        event.popup.element.querySelector('.e-content').style.maxHeight = 300 + 'px';
        event.popup.element.querySelector('.e-content').style.height = 'initial';
      }
    });
  }
  CategoryFilter(args) {
    if(args.isInteracted) {
      this.spinner.show()
      if(args.value === '' || args.value === null)
        this.loadData()
      this.loadDataProductWithCategory(args.value)
    }
  }
  loadDataProductWithCategory(value){
    this.service.getByGuid(value).subscribe(res => {
      this.data = res
      this.spinner.hide()
    })
  }
  public onOpenPopUpMainDropdown(event) {
    setTimeout(() => {
      if (Browser.isDevice) {
        event.popup.position = { X: 'left', Y: 'bottom' };
        event.popup.width = document.getElementById('toolbar_dropdown').offsetWidth;
        event.popup.dataBind();
        event.popup.element.classList.remove('e-ddl-device', 'e-popup-full-page'
        );
        event.popup.element.style.top = parseInt(event.popup.element.style.top) + 'px';
        event.popup.element.style.bottom = 'auto';
        event.popup.element.style.maxHeight = 300;
        event.popup.element.querySelector('.e-content').style.maxHeight = 300 + 'px';
        event.popup.element.querySelector('.e-content').style.height = 'initial';
      }
    });
  }
  // life cycle ejs-grid
  toolbarClick(args) {
    const functionName = this.functionName;
    const printBy = this.printBy;
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
      url: `${this.baseUrl}Products/LoadData?lang=${lang}&uid=${this.storeInfo.accountGuid}`,
      adaptor: new UrlAdaptor,
      headers: [{ authorization: `Bearer ${accessToken}` }]
    });

    this.spinner.hide()
  }

  loadDataAdmin() {

    const accessToken = localStorage.getItem('token');
    const lang = localStorage.getItem('lang');
    this.data = new DataManager({
      url: `${this.baseUrl}Products/LoadDataAdmin?lang=${lang}&uid=${this.user.uid}&storeId=${this.store}`,
      adaptor: new UrlAdaptor,
      headers: [{ authorization: `Bearer ${accessToken}` }]
    });
    this.spinner.hide()
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
              this.loadDataAdmin();
              this.loadDataCategoryAdmin();
              // if(this.isAdmin) {
              // }else {
              //   this.loadData();
              //   this.loadDataCategory()
              // }
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
    this.model.createBy = this.user.id;
    this.model.accountUid = this.user.uid;
    this.model.storeId = storeId;
    this.model.file = this.file || [];
    delete this.model['column'];
    delete this.model['index'];
    this.model.productSize = this.formArraySize.value
    this.model.productOption = this.formArrayOption.value
    this.service.insertForm(this.ToFormatModel(this.model)).subscribe(
      (res) => {
        if (res.success === true) {

          const productSizeModel = this.model.productSize.map(item => {
            return {
              Size: item.name,
              ProductId: res.data.id,
              Price: item.price
            }
          })
          if(productSizeModel.filter(x => x.Price === null).length > 0) {
            this.toast.warning(this.translate.instant('SIZE PRICE IS REQUIRE'))
            return;
          }
          const productOptionModel = this.model.productOption.map(item => {
            return {
              Topping: item.name,
              ProductId: res.data.id,
              Price: item.price
            }
          })
          if(productOptionModel.filter(x => x.Price === null).length > 0) {
            this.toast.warning(this.translate.instant('OPTION PRICE IS REQUIRE'))
            return;
          }
          this.addProSize(productSizeModel)
          this.addProOption(productOptionModel)
          this.toast.success(this.alert.created_ok_msg);
          this.loadDataAdmin();
          this.loadDataCategoryAdmin();
          this.modalReference.dismiss();

        } else {
          this.toast.warning(this.alert.system_error_msg);
        }

      },
      (error) => {
        this.toast.warning(this.alert.system_error_msg);
      }
    );
  //  this.alertify.confirm4(
  //     this.alert.yes_message,
  //     this.alert.no_message,
  //     this.alert.createTitle,
  //     this.alert.createMessage,
  //     () => {

  //     }, () => {
  //       this.toast.error(this.alert.cancelMessage);
  //     }
  //   );

  }
  addProSize(model) {
    this.service.addSize(model).subscribe(res => {})
  }
  addProOption(model) {
    this.service.addOption(model).subscribe(res => {})
  }
  update() {
    let storeId = JSON.parse(localStorage.getItem('store'))?.id
    this.model.updateBy = this.user.id;
    this.model.file = this.file || [];
    this.model.storeId = storeId;
    delete this.model['column'];
    delete this.model['index'];
    this.model.productSize = this.formArraySize.value
    this.model.productOption = this.formArrayOption.value
    const productSizeModel = this.model.productSize.map(item => {
      return {
        Size: item.name,
        ProductId: this.model.id,
        Price: item.price
      }
    })
    if(productSizeModel.filter(x => x.Price === null).length > 0) {
      this.toast.warning(this.translate.instant('SIZE PRICE IS REQUIRE'))
      return;
    }
    const productOptionModel = this.model.productOption.map(item => {
      return {
        Topping: item.name,
        ProductId: this.model.id,
        Price: item.price
      }
    })
    if(productOptionModel.filter(x => x.Price === null).length > 0) {
      this.toast.warning(this.translate.instant('OPTION PRICE IS REQUIRE'))
      return;
    }
    this.service.updateForm(this.ToFormatModel(this.model)).subscribe(
      (res) => {
        if (res.success === true) {
          this.addProSize(productSizeModel)
          this.addProOption(productOptionModel)
          this.toast.success(this.alert.updated_ok_msg);
          this.loadDataAdmin();
          this.loadDataCategoryAdmin();
          this.modalReference.dismiss();
          this.formArraySize = new FormArray([])
          this.formArrayOption = new FormArray([])

        } else {
          this.toast.warning(this.alert.system_error_msg);
        }
      },
      (error) => {
        this.toast.warning(this.alert.system_error_msg);

      }
    );
  //  this.alertify.confirm4(
  //     this.alert.yes_message,
  //     this.alert.no_message,
  //     this.alert.updateTitle,
  //     this.alert.updateMessage,
  //     () => {

  //     }, () => {
  //       this.toast.error(this.alert.cancelMessage);
  //     }
  //   );

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
  openModal(template, data = {} as Products) {
    this.formArraySize = new FormArray([])
    if (data?.id > 0) {
      this.model = {...data};
      this.getAudit(this.model.id);
      this.model.productSize.map(item => {
        let items = new FormGroup({
          name: new FormControl(item.size,Validators.required),
          price: new FormControl(item.price),
        });
        this.formArraySize.push(items)
      })

      this.model.productOption.map(item => {
        let items = new FormGroup({
          name: new FormControl(item.topping,Validators.required),
          price: new FormControl(item.price),
        });
        this.formArrayOption.push(items)
      })
      this.title = 'Edit_Model';
    } else {
      this.model.id = 0;
      this.model.status = 1;
      this.title = 'Add_Model';
    }
    this.modalReference = this.modalService.open(template, {size: 'xl',backdrop: 'static'});
    this.modalReference.result.then((result) => {
      this.formArraySize = new FormArray([])
      this.formArrayOption = new FormArray([])
      }, (reason) => {
      this.formArraySize = new FormArray([])
      this.formArrayOption = new FormArray([])
    });
    this.configImage();
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
      deleteUrl: `${environment.apiUrl}Products/DeleteUploadFile`
    };
    if (this.model.photoPath) {
      this.model.photoPath = this.imagePath(this.model.photoPath);
      const img = `<img src='${this.model.photoPath}' class='file-preview-image' alt='Desert' title='Desert'>`;
      option.initialPreview = [img]

      const a = {
        caption: '',
        width: '',
        url: `${environment.apiUrl}Products/DeleteUploadFile`, // server delete action
        key: this.model.id,
        extra: { id: this.model.id }
      }
      option.initialPreviewConfig = [a];
    }
    $("#avatar-1").fileinput(option);;
    let that = this;
    $('#avatar-1').on('filedeleted', function (event, key, jqXHR, data) {
      that.file = null;
      that.model.file = null;
      that.model.photoPath = null;
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
    this.model = {} as Products;
  }
  rowSelected(args) {
    this.model = {...args.data};
    this.getAudit(this.model.id)
  }

}
