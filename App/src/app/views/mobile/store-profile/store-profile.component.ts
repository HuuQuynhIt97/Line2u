import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService, UtilitiesService } from 'herr-core';
import { ImagePathConstants, MessageConstants } from 'src/app/_core/_constants';
import { Landlord } from 'src/app/_core/_model/evse/model';
import { StoreProfile, XAccount } from 'src/app/_core/_model/xaccount';
import { LandlordService } from 'src/app/_core/_service/evse/landlord.service';
import { StoreProfileService } from 'src/app/_core/_service/evse/store-profile.service';
import { XAccountService } from 'src/app/_core/_service/xaccount.service';
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
  baseUrl = environment.apiUrl;
  apiHost = environment.apiUrl.replace('/api/', '');
  noImage = ImagePathConstants.NO_IMAGE;
  user = JSON.parse(localStorage.getItem('user'))
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
  constructor(
    private utilityService: UtilitiesService,
    private landlordService: LandlordService,
    private service: StoreProfileService,
    private alertify: AlertifyService,
    public translate: TranslateService,
    public datePipe: DatePipe,
    public router: Router,
    

    ) { }
  loadDetail() {
    const guid = this.user.uid;
    if (guid) {
      this.service.GetWithGuid(guid).subscribe(x=> {
        if(x !== null) {
          console.log(x)
          this.model = x;
          this.start_times = x.storeOpenTime
          this.end_times = x.storeCloseTime != null ? x.storeCloseTime :  this.end_times
        }else {
          console.log(this.model)
        }
        this.configImage();
      })
    }
    
  }
  ngOnInit(): void {
    this.loadDetail();
    // this.configImage();
    // this.configImageQR();
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
      defaultPreviewContent: '<img src="../../../../../assets/images/no-img.jpg" alt="No Image">',
      layoutTemplates: { main2: '{preview} ' + ' {browse}' },
      allowedFileExtensions: ["jpg", "png", "gif"],
      initialPreview: [],
      initialPreviewConfig: [],
      deleteUrl: `${environment.apiUrl}StoreProfile/DeleteUploadFile`
    };
    if (this.model.photoPath) {
      this.model.photoPath = this.imagePath(this.model.photoPath);
      const img = `<img src='${this.model.photoPath}' class='file-preview-image' alt='Desert' title='Desert'>`;
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
      console.log('Key = ' + key);
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
  save() {
    if (this.model.id > 0) {
      this.update();
    } else {
      this.create();
    }
    // this.update();
  }
  create() {
    this.alertify.confirm4(
       this.alert.yes_message,
       this.alert.no_message,
       this.alert.createTitle,
       this.alert.createMessage,
       () => {
        this.model.createBy = this.user.id;
        this.model.accountGuid = this.user.uid
        this.model.storeOpenTime = this.start_times
        this.model.storeCloseTime = this.end_times
         this.model.file = this.file || [];
         delete this.model['column'];
         delete this.model['index'];
         this.service.insertFormMobile(this.ToFormatModel(this.model)).subscribe(
           (res) => {
             if (res.success === true) {
               this.alertify.success(this.alert.created_ok_msg);
               this.loadDetail();
             } else {
               this.translate.get(res.message).subscribe((data: string) => {
                 this.alertify.warning(data, true);
               });
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
        this.model.createBy = this.user.id;
         this.model.file = this.file || [];
         this.service.updateFormMobile(this.ToFormatModel(this.model)).subscribe(
           (res) => {
             if (res.success === true) {
               this.alertify.success(this.alert.updated_ok_msg);
               this.loadDetail();
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
  cancel() {
    this.router.navigate(['/mobile/home'])
  }


}
