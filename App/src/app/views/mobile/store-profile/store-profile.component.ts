import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { ToolbarType } from '@syncfusion/ej2-richtexteditor';
import { AlertifyService, UtilitiesService } from 'herr-core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ImagePathConstants, MessageConstants } from 'src/app/_core/_constants';
import { FunctionUtility } from 'src/app/_core/_helper/function-utility';
import { Landlord } from 'src/app/_core/_model/evse/model';
import { StoreProfile, XAccount } from 'src/app/_core/_model/xaccount';
import { DataService } from 'src/app/_core/_service/data.service';
import { LandlordService } from 'src/app/_core/_service/evse/landlord.service';
import { StoreProfileService } from 'src/app/_core/_service/evse/store-profile.service';
import { XAccountService } from 'src/app/_core/_service/xaccount.service';
import { Query } from '@syncfusion/ej2-data';
declare let $: any;
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-store-profile',
  templateUrl: './store-profile.component.html',
  styleUrls: ['./store-profile.component.scss'],
  providers: [DatePipe]
})
export class StoreProfileComponent  implements OnInit {
  start_times = "00:00";
  end_times = "23:59"
  model: StoreProfile = {} as StoreProfile;
  file
  fileQR
  countyData: any
  townshipData: any
  storeCountyFields: object = { text: 'countyName', value: 'countyId' };
  storeTownShipFields: object = { text: 'townshipName', value: 'townshipId' };
  baseUrl = environment.apiUrl;
  apiHost = environment.apiUrl.replace('/api/', '');
  noImage = ImagePathConstants.NO_IMAGE;
  user = JSON.parse(localStorage.getItem('user'))
  store: any
  public tools: ToolbarModule = {
    type: ToolbarType.Expand,
    enableFloating :false,
    items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
        'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
        'Formats', 'Alignments', 'NumberFormatList', 'BulletFormatList',
        'Outdent', 'Indent', '|', 'ClearFormat',
        'SourceCode', 'FullScreen', '|', 'Undo', 'Redo']
};
  alert = {
    updateMessage: this.translate.instant(MessageConstants.UPDATE_MESSAGE),
    updateTitle: this.translate.instant(MessageConstants.UPDATE_TITLE),
    createMessage:this.translate.instant(MessageConstants.CREATE_MESSAGE),
    createTitle: this.translate.instant(MessageConstants.CREATE_TITLE),
    deleteMessage: this.translate.instant(MessageConstants.DELETE_MESSAGE),
    deleteTitle: this.translate.instant(MessageConstants.DELETE_TITLE),
    cancelMessage: this.translate.instant(MessageConstants.CANCEL_MESSAGE),
    serverError: this.translate.instant(MessageConstants.SERVER_ERROR),
    deleted_ok_msg: this.translate.instant(MessageConstants.DELETED_OK_MSG),
    created_ok_msg: this.translate.instant(MessageConstants.CREATED_OK_MSG),
    updated_ok_msg: this.translate.instant(MessageConstants.UPDATED_OK_MSG),
    system_error_msg: this.translate.instant(MessageConstants.SYSTEM_ERROR_MSG),
    exist_message: this.translate.instant(MessageConstants.EXIST_MESSAGE),
    choose_farm_message: this.translate.instant(MessageConstants.CHOOSE_FARM_MESSAGE),
    select_order_message: this.translate.instant(MessageConstants.SELECT_ORDER_MESSAGE),
    yes_message: this.translate.instant(MessageConstants.YES_MSG),
    no_message: this.translate.instant(MessageConstants.NO_MSG),
  };
  listFile: File[] = [];
  userAccount: any[];
  permissionData: [] = [];
  public onFiltering: any = (e: FilteringEventArgs) => {
    let query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text != "") ? query.where("name", "contains ", e.text, true) : query;
    //pass the filter data source, filter query to updateData method.
    e.updateData(this.permissionData, query);
  };
  siteData: any
  siteFields: object = { text: 'accountName', value: 'accountId' };
  sites: any[];
  isAdmin = JSON.parse(localStorage.getItem('user'))?.uid === 'admin';
  constructor(
    private utilityService: UtilitiesService,
    private landlordService: LandlordService,
    private service: StoreProfileService,
    private serviceAccount: XAccountService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private functionUtility: FunctionUtility,
    private toast: ToastrService,
    public translate: TranslateService,
    public datePipe: DatePipe,
    private spin: NgxSpinnerService,
    public router: Router,
    private dataService: DataService

    ) { }

  loadDetail() {
    this.spin.show()
    const guid = this.user.uid;
    if (guid) {
      return new Promise((result, rej) => {
        this.service.GetWithGuid(guid).subscribe(
          (x: any) => {
            if(x !== null) {
              this.model = x;
              localStorage.setItem('store', JSON.stringify(x));
              let listFileImage: string[] = [];
              listFileImage.push(this.model.photoPath);
              listFileImage = listFileImage.filter(item => item !== null);
              if (listFileImage?.length > 0) {
                this.functionUtility.convertToFile(listFileImage, this.apiHost, this.listFile);
              }
              this.start_times = x.storeOpenTime
              this.end_times = x.storeCloseTime != null ? x.storeCloseTime :  this.end_times
              this.spin.hide()
            }else {
            }
            result(result);
          },
          (error) => {
            rej(error);
          }
        );
      });
      // this.service.GetWithGuid(guid).subscribe(x=> {
      //   if(x !== null) {
      //     this.model = x;
      //     localStorage.setItem('store', JSON.stringify(x));
      //     let listFileImage: string[] = [];
      //     listFileImage.push(this.model.photoPath);
      //     listFileImage = listFileImage.filter(item => item !== null);
      //     if (listFileImage?.length > 0) {
      //       this.functionUtility.convertToFile(listFileImage, this.apiHost, this.listFile);
      //     }
      //     this.start_times = x.storeOpenTime
      //     this.end_times = x.storeCloseTime != null ? x.storeCloseTime :  this.end_times
      //   }else {
      //   }
      // })
    }

  }
  statusChange(value) {
    this.model.status = value.target.checked === true ? 1 : 0;
    console.log('statusChange', this.model.status);
  }

  payfeeChange(value) {
    this.model.active = value.target.checked === true ? 1 : 0;
    console.log('payfeeChange', this.model.active);
  }
  onCheckedChange(value) {
    this.model.active = value === true ? 1 : 0;
    console.log(this.model.active);
  }
  loadDetailAdmin() {
    if(this.store !== null) {
      this.spin.show()
      return new Promise((result, rej) => {
        this.service.getById(this.store).subscribe(
          async (x: any) => {
            if(x !== null) {
              this.sites = [];
              this.model.multiStores = {
                sites: this.sites
              }
              this.model = x;
              console.log(this.model);
              this.model.status = 1
              localStorage.setItem('store', JSON.stringify(x));

              let listFileImage: string[] = [];
              listFileImage.push(this.model.photoPath);
              const sites = await this.service.getMultiUserAccessStore(this.model.createBy,this.model.id).toPromise();
              this.sites = sites || [];
              this.model.multiStores = {
                stores: this.sites
              }
              listFileImage = listFileImage.filter(item => item !== null);
              if (listFileImage?.length > 0) {
                this.functionUtility.convertToFile(listFileImage, this.apiHost, this.listFile);
              }
              this.start_times = x.storeOpenTime
              this.end_times = x.storeCloseTime != null ? x.storeCloseTime :  this.end_times
              this.spin.hide()
            }else {
            }
            result(result);
          },
          (error) => {
            rej(error);
          }
        );
      });
    }
  }

  toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}


  ngOnInit(): void {
    this.getAllAccount()
    this.store = this.route.snapshot.paramMap.get('id')
    this.getCountyTownShip()
  }
  getAllAccount(){
    this.service.getAllAccountAccess().subscribe(res => {
      this.siteData = res
    })

  }


  onChangePermission() {
    this.model.multiStores = {
      stores: this.sites
    }
  }
  async getCountyTownShip() {
    await this.getAllCounty()
    await this.getAllTownShip()
    await this.loadDetailAdmin()
    // if(this.user.uid === 'admin' && this.store !== null) {
    // }else if (this.user.uid === 'admin' && this.store === null) {
    //   await this.getAllCounty()
    //   await this.getAllTownShip()
    // }
    // else {
    //   await this.getAllCounty()
    //   await this.getAllTownShip()
    //   await this.loadDetail()
    // }
  }

  countyChange(args) {
    if(args.isInteracted) {
      this.model.countyId = args.value
      this.getAllTownShipByCounty();
    }
  }
  getAllCounty() {
    return new Promise((result, rej) => {
      this.service.getAllCounty().subscribe(
        (res: any) => {
          this.countyData  = res
          result(result);
        },
        (error) => {
          rej(error);
        }
      );
    });
    // this.service.getAllCounty().subscribe(res => {
    //   this.countyData  = res
    // })
  }
  getAllTownShip() {
    return new Promise((result, rej) => {
      this.service.getAllTowship().subscribe(
        (res: any) => {
          this.townshipData  = res
          result(result);
        },
        (error) => {
          rej(error);
        }
      );
    });

  }

  getAllTownShipByCounty() {
    return new Promise((result, rej) => {
      this.service.getTowshipByCounty(this.model.countyId).subscribe(
        (res: any) => {
          this.townshipData  = res
          result(result);
        },
        (error) => {
          rej(error);
        }
      );
    });
    // this.service.getTowshipByCounty(this.model.countyId).subscribe(res => {
    //   this.townshipData  = res
    // })
  }
  startTimesChange(args) {
    this.model.storeOpenTime = args.text
    this.start_times = args.text
  }
  closeTimesChange(args) {
    this.model.storeCloseTime = args.text
    this.end_times = args.text
  }
  sexChange(value) {
    // this.model.landLordSex = value;
  }
  onFileChangeLogo(args) {
    this.file = args.target.files[0];
  }
  onFileChangeLogoQR(args) {
    this.fileQR = args.target.files[0];
  }
  configImage() {
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
      defaultPreviewContent: `<img src="../../../../../assets/images/no-img.jpg" alt="No Image">`,
      layoutTemplates: { main2: '{preview} ' + ' {browse}' },
      allowedFileExtensions: ["jpg", "png", "gif"],
      initialPreview: [],
      initialPreviewConfig: [],
      deleteUrl: `${environment.apiUrl}StoreProfile/DeleteUploadFile`
    };
    if (this.model.photoPath) {
      // this.model.photoPath = this.imagePath(this.model.photoPath);
      const img = `<img src='${this.imagePath(this.model.photoPath)}' class='file-preview-image' alt='Desert' title='Desert'>`;
      option.initialPreview = [img]

      const a = {
        caption: '',
        width: '',
        url: `${environment.apiUrl}StoreProfile/DeleteUploadFile`, // server delete action
        key: this.model.guid,
        extra: { guid: this.model.guid }
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
  onRemove(event) {
    this.listFile.splice(this.listFile.indexOf(event), 1);
    this.removeImage()
  }
  removeImage() {
    this.service.deleteImage(this.model?.id || 0).subscribe(res => {})
  }
  onSelect(event) {
    let fileSize = 0;
    let length = 0;
    if(this.listFile !== null) {
      length = this.listFile.length;
      this.listFile.forEach(item => {
        fileSize += item.size;
      });
    }
    // Kiểm tra tổng dung lượng của tất cả file import
    if (event.addedFiles && event.addedFiles[0]) {
      length += event.addedFiles.length;
      if (length > 5) {
        this.translate.get('You can upload 5 files images').subscribe(data => {
          this.alertify.warning(data, true);
        })
        return;
      }

      event.addedFiles.forEach(element => {
        fileSize += element.size;
      });
      if (fileSize > 26214400) {
        this.translate.get("Sum all image file size upload can't more than 25M").subscribe(data => {
          this.alertify.warning(data, true);
        })
      }
      else {
        this.listFile = []
        this.listFile.push(...event.addedFiles);
      }
    }
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
  save() {
    if (this.model.id > 0) {
      if(this.isAdmin) {
        this.updateAdmin();
      }else {

        this.update();
      }
    } else {
      if(this.isAdmin) {
        this.createAdmin();
      }else {

        this.create();
      }
    }
    // this.update();
  }
  create() {
    this.model.createBy = this.user.id;
    this.model.status = 1;
    this.model.active = 0;
    this.model.accountGuid = this.user.uid
    this.model.storeOpenTime = this.start_times
    this.model.storeCloseTime = this.end_times
    this.model.file = this.listFile || [];
    delete this.model['column'];
    delete this.model['index'];
    this.service.insertFormMobile(this.ToFormatModel(this.model)).subscribe(
      (res) => {
        if (res.success === true) {
        this.listFile = []
          this.toast.success(this.alert.created_ok_msg);
          this.store = res?.data.id
          this.loadDetailAdmin();
          this.dataService.changeMessage('nextStep2')
        } else {
          this.translate.get(res.message).subscribe((data: string) => {
            this.toast.warning(data);
          });
        }

      },
      (error) => {
        this.toast.warning(this.alert.system_error_msg);
      }
    );

   }
  update() {

    //  this.model.createBy = this.user.id;
     this.model.updateBy = this.user.id;
     this.model.file = this.listFile || [];
     this.service.updateFormMobile(this.ToFormatModel(this.model)).subscribe(
       (res) => {
         if (res.success === true) {
         this.listFile = []
           this.toast.success(this.alert.updated_ok_msg);
           this.loadDetailAdmin();
           this.dataService.changeMessage('nextStep2')
         } else {
           this.toast.warning(this.alert.system_error_msg);
         }
       },
       (error) => {
         this.toast.warning(this.alert.system_error_msg);
       }
     );


  }
  createAdmin() {
    this.model.createBy = this.user.id;
    this.model.status = 1;
    this.model.active = 0;
    this.model.accountGuid = this.user.uid
    this.model.storeOpenTime = this.start_times
    this.model.storeCloseTime = this.end_times
    this.model.file = this.listFile || [];
    delete this.model['column'];
    delete this.model['index'];
    this.service.insertFormAdmin(this.ToFormatModel(this.model)).subscribe(
      (res) => {
        if (res.success === true) {
          this.listFile = []
          this.toast.success(this.alert.created_ok_msg);
          this.store = res?.data.id
          this.loadDetailAdmin();
          this.dataService.changeMessage('nextStep2')
        } else {
          this.translate.get(res.message).subscribe((data: string) => {
            this.toast.warning(data);
          });
        }

      },
      (error) => {
        this.toast.warning(this.alert.system_error_msg);
      }
    );

   }
  updateAdmin() {
     this.model.updateBy = this.user.id;
     this.model.file = this.listFile || [];
     this.service.updateFormAdmin(this.ToFormatModel(this.model)).subscribe(
       (res) => {
         if (res.success === true) {
         this.listFile = []
           this.toast.success(this.alert.updated_ok_msg);
           this.loadDetailAdmin();
           this.dataService.changeMessage('nextStep2')
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
  cancel() {
    this.router.navigate(['/mobile/home'])
  }


}
