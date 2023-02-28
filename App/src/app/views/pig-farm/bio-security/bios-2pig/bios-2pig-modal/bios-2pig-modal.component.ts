import { async } from '@angular/core/testing';
import { DataManager, UrlAdaptor, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import { L10n, setCulture, EmitType } from '@syncfusion/ej2-base';
import { Component, OnInit, TemplateRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { MessageConstants } from 'src/app/_core/_constants';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { BaseComponent } from 'herr-core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { BioS2pig, BioSMaster } from 'src/app/_core/_model/bios';
import { BioSMasterService, BioS2pigService } from 'src/app/_core/_service/bios';
import { Subscription } from 'rxjs';
import { PigService } from 'src/app/_core/_service/pigs/pig.service';
import { DropDownListComponent, FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
@Component({
  selector: 'app-bios-2pig-modal',
  templateUrl: './bios-2pig-modal.component.html',
  styleUrls: ['./bios-2pig-modal.component.scss']
})
export class Bios2pigModalComponent extends BaseComponent implements OnInit {
  @Input() model: BioS2pig = {} as BioS2pig;
  @Input() title: string;
  @Input() bioSMaster: BioSMaster;

  @ViewChild('remote') public dropdownObj: DropDownListComponent
  public pigData: DataManager;

  public query: Query ;
  public remoteFields: Object = { text: 'name', value: 'guid' };
  public onOpen(args) {
    let start: number = this.take;
    let end: number = this.take + 5;
    let listElement: HTMLElement = (this.dropdownObj as any).list;
    listElement.addEventListener('scroll', () => {
      if ((Math.round(listElement.scrollTop + listElement.offsetHeight) >= Math.round(listElement.scrollHeight))) {
        let filterQuery = new Query().skip(start).take(this.take).addParams('farmGuid', localStorage.getItem('farmGuid')).addParams('selected', this.model?.pigGuid);
        this.pigData.executeQuery(filterQuery).then((event: any) => {
          start = end;
          end += 5;
          this.dropdownObj.addItem(event.result as { [key: string]: Object }[]);
        }).catch((e: Object) => {
        });
      }
    })
  }
  public onFiltering: any = (e: any) => {
    if (e.text === '') {
      e.updateData(this.pigData);
    } else {
      const query = this.dropdownObj.query.clone().addParams('search', e.text);
      e.updateData(this.pigData, query);
    }
  };

  constructor(
    public activeModal: NgbActiveModal,
    private service: BioS2pigService,
    private serviceBioSMaster: BioSMasterService,
    private servicPig: PigService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    public translate: TranslateService,
  ) { super(translate,environment.apiUrl); }

  ngOnInit() {
    this.query = new Query()
    .skip(this.skip)
    .take(this.take)
    .addParams('farmGuid', localStorage.getItem('farmGuid'))
    .addParams('selected', this.model?.pigGuid);
    this.pigData = new DataManager({
      url: `${this.baseUrl}Pig/GetPigs`,
      adaptor: new ODataV4Adaptor,
      crossDomain: true,
    }, this.query);
  }
  valueChange(value) {
    this.model.pigGuid = value || "";
   }
  create() {

    this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.createTitle,
      this.alert.createMessage,
      () => {

        this.model.bioSMasterGuid = this.bioSMaster?.guid;
        this.service.add(this.model as BioS2pig).subscribe(
          (res) => {
            if (res.success === true) {
              this.alertify.success(this.alert.created_ok_msg);
              this.service.changeMessage(200);
              this.activeModal.dismiss();

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
        this.model.bioSMasterGuid = this.bioSMaster?.guid;
        this.service.update(this.model as BioS2pig).subscribe(
          (res) => {
            if (res.success === true) {
              this.alertify.success(this.alert.updated_ok_msg);
              this.service.changeMessage(200);
              this.activeModal.dismiss();
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
  save() {
    if (this.model.id > 0) {
      this.update();
    } else {
      this.create();
    }
  }
}
