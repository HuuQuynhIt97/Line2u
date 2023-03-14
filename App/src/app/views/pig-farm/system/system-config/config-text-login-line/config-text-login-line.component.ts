import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SystemConfig } from 'src/app/_core/_model/systemconfig';
import { ToolbarService, LinkService, ImageService, TableService, HtmlEditorService, ToolbarType } from '@syncfusion/ej2-angular-richtexteditor';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { SystemConfigService } from 'src/app/_core/_service/systemconfig.service';
import { AlertifyService, BaseComponent } from 'herr-core';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-config-text-login-line',
  templateUrl: './config-text-login-line.component.html',
  styleUrls: ['./config-text-login-line.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, TableService]
})
export class ConfigTextLoginLineComponent extends BaseComponent implements OnInit {
  model: SystemConfig;
  @Input() datas: any;
  public tools: ToolbarModule = {
    type: ToolbarType.Expand,
    enableFloating :false,
    items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
        'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
        'Formats', 'Alignments', 'NumberFormatList', 'BulletFormatList',
        'Outdent', 'Indent', '|', 'ClearFormat',
        'SourceCode', 'FullScreen', '|', 'Undo', 'Redo']
   };
  constructor(
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private service: SystemConfigService,
    private datePipe: DatePipe,
    private alertify: AlertifyService,
    public translate: TranslateService,
  ) {super(translate,environment.apiUrl); }

  ngOnInit() {
    console.log(this.datas)
    this.model = this.datas 
  }

  save(){
    this.model.sort =  this.model.sort || 0
    this.update();
    
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
  update() {
    this.service.update(this.ToFormatModel(this.model)).subscribe(
      (res) => {
        if (res.success === true) {
          this.alertify.success(this.alert.updated_ok_msg);
          this.activeModal.dismiss();
        } else {
          this.alertify.warning(this.alert.system_error_msg);
        }
      },
      (error) => {
        this.alertify.warning(this.alert.system_error_msg);
      }
    );
  }

}
