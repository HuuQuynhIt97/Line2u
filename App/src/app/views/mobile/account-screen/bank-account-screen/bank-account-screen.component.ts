import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService,BaseComponent, UtilitiesService } from 'herr-core';
import { ImagePathConstants } from 'src/app/_core/_constants';
import { environment } from 'src/environments/environment';
import { User2BankService } from 'src/app/_core/_service/evse/user-2bank.service';

declare let $: any;
@Component({
  selector: 'app-bank-account-screen',
  templateUrl: './bank-account-screen.component.html',
  styleUrls: ['./bank-account-screen.component.scss']
})
export class BankAccountScreenComponent  extends BaseComponent implements OnInit {
  model = {} as any;
  file
  baseUrl = environment.apiUrl;
  apiHost = environment.apiUrl.replace('/api/', '');
  noImage = ImagePathConstants.NO_IMAGE;
  user: any = JSON.parse(localStorage.getItem('user_landlord'))

  constructor(
    private utilityService: UtilitiesService,
    private alertify: AlertifyService,
    public translate: TranslateService,
    private service: User2BankService,
    public datePipe: DatePipe,
    public router: Router,
  ) { 
    super(translate,environment.apiUrl);
  }

  ngOnInit() {
    this.configImage();
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
      deleteUrl: `${environment.apiUrl}Landlord/DeleteUploadFile`
    };
    if (this.model.photoPath) {
      this.model.photoPath = this.imagePath(this.model.photoPath);
      const img = `<img src='${this.model.photoPath}' class='file-preview-image' alt='Desert' title='Desert'>`;
      option.initialPreview = [img]

      const a = {
        caption: '',
        width: '',
        url: `${environment.apiUrl}Landlord/DeleteUploadFile`, // server delete action
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
  create() {
    this.alertify.confirm4(
       this.alert.yes_message,
       this.alert.no_message,
       this.alert.createTitle,
       this.alert.createMessage,
       () => {
         delete this.model['column'];
         delete this.model['index'];
         this.model.status = 1
         this.model.userGuid = this.user.guid
         this.model.file = this.file || [];
         this.service.insertForm(this.ToFormatModel(this.model)).subscribe(
           (res) => {
             if (res.success === true) {
               this.alertify.success(this.alert.created_ok_msg);
               this.router.navigate(['/mobile/account/bank/finish'])
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
   cancel() {
    this.router.navigate(['/mobile/account'])
   }
}
