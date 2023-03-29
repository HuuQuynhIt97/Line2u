import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService, UtilitiesService } from 'herr-core';
import { ImagePathConstants, MessageConstants } from 'src/app/_core/_constants';
import { Landlord } from 'src/app/_core/_model/evse/model';
import { XAccount } from 'src/app/_core/_model/xaccount';
import { LandlordService } from 'src/app/_core/_service/evse/landlord.service';
import { XAccountService } from 'src/app/_core/_service/xaccount.service';
declare let $: any;
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [DatePipe]
})
export class UserProfileComponent implements OnInit {

  model: XAccount = {} as XAccount;
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
    private service: XAccountService,
    private alertify: AlertifyService,
    public translate: TranslateService,
    public datePipe: DatePipe,
    public router: Router,
    

    ) { }
  loadDetail() {
    const guid = this.user.guid;
    if (guid) {
      this.service.GetWithGuid(guid).subscribe(x=> {
        console.log(x)
        this.model = x;
        this.configImage();
        this.configImageQR();
      })
    }
    
  }
  ngOnInit(): void {
    this.loadDetail();
    // this.configImage();
    // this.configImageQR();
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 47 && charCode < 58 || charCode === 46  || charCode === 45) {
      return true;
    }
    return false;
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
      deleteUrl: `${environment.apiUrl}XAccount/DeleteUploadFile`
    };
    if (this.model.photoPath) {
      this.model.photoPath = this.imagePath(this.model.photoPath);
      const img = `<img src='${this.model.photoPath}' class='file-preview-image' alt='Desert' title='Desert'>`;
      option.initialPreview = [img]

      const a = {
        caption: '',
        width: '',
        url: `${environment.apiUrl}XAccount/DeleteUploadFile`, // server delete action
        key: this.model.accountId,
        extra: { id: this.model.accountId }
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

  configImageQR() {
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
      deleteUrl: `${environment.apiUrl}XAccount/DeleteUploadFile`
    };
    if (this.model.lineQrPath) {
      this.model.lineQrPath = this.imagePath(this.model.lineQrPath);
      const img = `<img src='${this.model.lineQrPath}' class='file-preview-image' alt='Desert' title='Desert'>`;
      option.initialPreview = [img]

      const a = {
        caption: '',
        width: '',
        url: `${environment.apiUrl}XAccount/DeleteUploadFile`, // server delete action
        key: this.model.accountId,
        extra: { id: this.model.accountId }
      }
      option.initialPreviewConfig = [a];
    }
    $("#avatar-2").fileinput(option);;
    let that = this;
    $('#avatar-2').on('filedeleted', function (event, key, jqXHR, data) {
      console.log('Key = ' + key);
      that.file = null;
      that.model.fileQR = null;
      that.model.lineQrPath = null;
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
    this.update();
  }
  update() {
    this.alertify.confirm4(
       this.alert.yes_message,
       this.alert.no_message,
       this.alert.updateTitle,
       this.alert.updateMessage,
       () => {
         this.model.file = this.file || [];
         this.model.fileQR = this.fileQR || [];
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
