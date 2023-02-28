
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService, BaseComponent, UtilitiesService } from 'herr-core';
import { ImagePathConstants } from 'src/app/_core/_constants';
import { User2Bank} from 'src/app/_core/_model/evse/model';
import { User2BankService } from 'src/app/_core/_service/evse/user-2bank.service';

import { environment } from 'src/environments/environment';
declare let $: any;
@Component({
  selector: 'app-landlord-bank-action',
  templateUrl: './landlord-bank-action.component.html',
  styleUrls: ['./landlord-bank-action.component.scss']
})
export class LandlordBankActionComponent   extends BaseComponent implements OnInit {
  @Input() title: string = "User2Bank_Detail";
  @Input() guid: string | null;
  @Output() saveChange = new EventEmitter()
  model: User2Bank
  file: any;
  apiHost = environment.apiUrl.replace('/api/', '');
  noImage = ImagePathConstants.NO_IMAGE;
  constructor(
    private modalService: NgbModal,
    private service: User2BankService,
    public translate: TranslateService,
    private alertify: AlertifyService,
    private datePipe: DatePipe,
    private utilityService: UtilitiesService,


    ) {
	    super(translate,environment.apiUrl);

     }
  @ViewChild('actionModal') actionModal: TemplateRef<any>;

  ngOnInit() {
  }
  initModel() {
    this.model = {} as User2Bank;
    this.guid = null;
  }
  open() {
    if (this.guid) {
      this.service.getByGuid(this.guid).subscribe(data=> {
        this.model = data;
       
        this.model.status = this.model.status + ''

        this.modalService.open(this.actionModal, { ariaLabelledBy: 'modal-basic-title', size: 'lg' });
       this.configImage();
      
      })
    } else {
      this.modalService.open(this.actionModal, { ariaLabelledBy: 'modal-basic-title', size: 'lg' });
      this.configImage();
   
    }
   
	}
  
  close() {
		this.modalService.dismissAll();
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
         this.model.status = +this.model.status
         this.model.file = this.file || [];
         this.service.insertForm(this.ToFormatModel(this.model)).subscribe(
           (res) => {
             if (res.success === true) {
               this.alertify.success(this.alert.created_ok_msg);
               this.saveChange.emit()
               this.close();
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
         delete this.model['column'];
         delete this.model['index'];
         this.model.status = +this.model.status
         this.model.file = this.file || [];
         this.service.updateForm(this.ToFormatModel(this.model)).subscribe(
           (res) => {
             if (res.success === true) {
               this.alertify.success(this.alert.updated_ok_msg);
               this.saveChange.emit();
               this.close();
             } else {
               this.alertify.warning(res.message, true);
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
   save() {

    if (this.model.id > 0) {
      this.update();
    } else {
      this.create();
    }
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
      defaultPreviewContent: '<img src="../../../../../../assets/images/no-img.jpg" alt="No Image">',
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
    $("#avatar-3").fileinput(option);;
    let that = this;
    $('#avatar-3').on('filedeleted', function (event, key, jqXHR, data) {
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
 

}
