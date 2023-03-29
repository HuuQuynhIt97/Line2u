import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService, BaseComponent, UtilitiesService } from 'herr-core';
import { Subscription } from 'rxjs';
import { ImagePathConstants } from 'src/app/_core/_constants';
import { Landlord } from 'src/app/_core/_model/evse/model';
import { LandlordService } from 'src/app/_core/_service/evse/landlord.service';
import { environment } from 'src/environments/environment';
declare let $: any;
@Component({
  selector: 'app-landlord-detail',
  templateUrl: './landlord-detail.component.html',
  styleUrls: ['./landlord-detail.component.css']
})
export class LandlordDetailComponent extends BaseComponent implements OnInit {
  model: Landlord = {} as Landlord;
  file: any;
  apiHost = environment.apiUrl.replace('/api/', '');
  noImage = ImagePathConstants.NO_IMAGE;
  landLordGuid: any;
  subscription = new Subscription()

  constructor(
    private alertify: AlertifyService,
    private datePipe: DatePipe,
    private service: LandlordService,
    public translate: TranslateService,
    private utilityService: UtilitiesService,


  ) { 
    super(translate,environment.apiUrl);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.subscription.add(this.service.currentLandlord.subscribe(x=> {
      this.landLordGuid = x;
      if (this.landLordGuid) {
        if (this.model?.id) {
          this.getAudit(this.model.id);
        }
        this.service.getByGuid(x).subscribe(a=> {
          this.model = a;
        });
      }
    
    }))
    this.configImage();
  }
  getAudit(id) {
    this.service.getAudit(id).subscribe(data => {
      this.audit = data;
    });

  }
  sexChange(value) {
    this.model.landLordSex = value;
    }
  save() {
    if (this.model.id > 0) {
      this.update();
    } else {
      this.create();
    }
  }
  create() {
    this.alertify.confirm4(
       this.alert.yes_message,
       this.alert.no_message,
       this.alert.createTitle,
       this.alert.createMessage,
       () => {
         this.model.file = this.file || [];
         delete this.model['column'];
         delete this.model['index'];
         this.service.insertForm(this.ToFormatModel(this.model)).subscribe(
           (res) => {
             if (res.success === true) {
               this.alertify.success(this.alert.created_ok_msg);
 
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
         this.model.file = this.file || [];
         delete this.model['column'];
         delete this.model['index'];
         this.service.updateForm(this.ToFormatModel(this.model)).subscribe(
           (res) => {
             if (res.success === true) {
               this.alertify.success(this.alert.updated_ok_msg);
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
  cancel() {
    this.audit = {}
    this.file = null
    this.model = {} as Landlord;
  }
}
