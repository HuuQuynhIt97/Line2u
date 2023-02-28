import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { extend } from '@syncfusion/ej2-angular-grids';
import { config } from 'rxjs';
import { BaseComponent } from 'herr-core';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { DataManager, Query, UrlAdaptor } from '@syncfusion/ej2-data';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Breeding } from '../../config';
import { BreedingService } from '../../services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-breeding',
  templateUrl: './breeding.component.html',
  styleUrls: ['./breeding.component.css']
})
export class BreedingComponent extends BaseComponent implements OnInit {
  data: any;
  query: any;
  model: Breeding;
  toolbarOptions = [];
  modalReference: NgbModalRef;

  constructor(
    public modalService: NgbModal,
    private datePipe: DatePipe,
    private service: BreedingService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private spinner: NgxSpinnerService
  ) {
    super(translate,environment.apiUrl);
    }

  ngOnInit() {
   
    this.loadData();
  }
  toolbarClick(e) {}
  dataBound() {}
  odsExport() {}

  loadData() {
    this.query = new Query()
    .where('status', 'equal', 1);
    this.data = new DataManager({
      url: `${this.baseUrl}Breeding/GetDataDropdownlist`,
      adaptor: new UrlAdaptor,
      crossDomain: true,
    }, this.query);
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
              this.alertify.success(this.alert.deleted_ok_msg);
              this.loadData();
            } else {
              this.alertify.warning(this.alert.system_error_msg);
            }
          },
          (err) => this.alertify.warning(this.alert.system_error_msg)
        );
      },
      () => {
        this.alertify.error(this.alert.cancelMessage);
      }
    );
  }
  create() {
    this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.createTitle,
      this.alert.createMessage,
      () => {
        this.spinner.show("default");
        const farmGuid = localStorage.getItem("farmGuid");
        if (!farmGuid) {
          this.alertify.warning(this.alert.choose_farm_message, true);
          return;
        }
        this.model.farmGuid = farmGuid;
        this.service.add(this.ToFormatModel(this.model)).subscribe(
          (res) => {
            if (res.success === true) {
              this.alertify.success(this.alert.created_ok_msg);
              this.loadData();
              this.modalReference.dismiss();
            } else {
              this.alertify.warning(this.alert.system_error_msg);
            }
            this.spinner.hide("default");
          },
          (error) => {
            const message =
              this.translate.instant(error) || this.alert.system_error_msg;
            this.alertify.warning(message);
            this.spinner.hide("default");
          }
        );
      },
      () => {
        this.alertify.error(this.alert.cancelMessage);
      }
    );
  }
  
  ToFormatModel(model: any) {
    for (let key in model) {
      let value = model[key];
      if (value && value instanceof Date) {
        model[key] = this.datePipe.transform(value, "yyyy/MM/dd");
      } else {
        model[key] = value;
      }
    }
    return model;
  }

  update(setStatus) {
    this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.updateTitle,
      this.alert.updateMessage,
      () => {
        this.spinner.show("default");
        setStatus();
        this.service.update(this.ToFormatModel(this.model)).subscribe(
          (res) => {
            if (res.success === true) {
              this.alertify.success(this.alert.updated_ok_msg);
              this.loadData();
              this.modalReference.dismiss();
            } else {
              this.alertify.warning(this.alert.system_error_msg);
            }
            this.spinner.hide("default");
          },
          (error) => {
            const message =
              this.translate.instant(error) || this.alert.system_error_msg;
            this.alertify.warning(message);
            this.spinner.hide("default");
          }
        );
      },
      () => {
        this.alertify.error(this.alert.cancelMessage);
      }
    );
  }
  
}
