import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { CommandModel, GridComponent } from '@syncfusion/ej2-angular-grids';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'herr-core';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { Record2PigService } from 'src/app/_core/_service/apply-orders';
import { PenService } from 'src/app/_core/_service/farms';
import { PigService } from 'src/app/_core/_service/pigs';
import { Breeding2SowInService, Breeding2SowService } from '../../services';
import { environment } from 'src/environments/environment';
import {
  DataManager,
  Query,
  UrlAdaptor,
  Predicate,
} from "@syncfusion/ej2-data";
import { BreedingDataService } from '../../services/breeding-data.service';
import { Breeding2Sow } from '../../config';

@Component({
  selector: 'app-breeding-sow',
  templateUrl: './breeding-sow.component.html',
  styleUrls: ['./breeding-sow.component.css']
})
export class BreedingSowComponent 
extends BaseComponent
implements OnInit, OnDestroy, OnChanges
{
  @Input() sowFosterGuid: any;
  @Input() penGuid: any;
  editSettings = {
    showDeleteConfirmDialog: false,
    allowEditing: true,
    allowAdding: false,
    allowDeleting: false,
    mode: "Normal",
  };
  data: Breeding2Sow[] = [] as Breeding2Sow[];
  model: Breeding2Sow;

  public query: Query;
  title: any;
  modalReference: NgbModalRef;
  toolbarOptions = [
    "Add"
  ];
  constructor(
    private service: Breeding2SowService,
    private serviceBreeding2SowIn: Breeding2SowInService,
    private servicePen: PenService,
    private alertify: AlertifyService,
    private servicePig: PigService,
    public record2PigService: Record2PigService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    public modalService: NgbModal,
    private dataService: BreedingDataService

  ) {
    super(translate,environment.apiUrl);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sowFosterGuid'] && changes.sowFosterGuid.currentValue) {
      this.loadData();
    }
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
  }
  toolbarClick(args) { }
  excelExpComplete(args) { }

  
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

  loadData() {
    this.query = new Query();
    if (this.sowFosterGuid) {
      this.query.where("sowFosterGuid", "equal", this.sowFosterGuid);
    }
    const accessToken = localStorage.getItem("token");
    const farmGuid = localStorage.getItem("farmGuid");
    const data = new DataManager(
      {
        url: `${this.baseUrl}Breeding2Sow/LoadData?lang=${this.globalLang}`,
        adaptor: new UrlAdaptor(),
        headers: [{ authorization: `Bearer ${accessToken}` }],
      },
      this.query
    );
    data.executeQuery(this.query).then((x) => {
      this.data = x["result"];
    });
  }
  async openModal(template, data = {} as any) {
    
    if (data?.id > 0) {
      this.model = { ...data };
      try {
        this.spinner.show("default");
        // const roomData = await this.loadRoomGuid();
        // if (roomData) {
        //   this.roomGuid = roomData?.roomGuid;
        //   await this.loadPen();
        //   await this.getCheckedData();
        // }
      } catch {
        this.spinner.hide("default");
      }
      this.spinner.hide("default");
      this.title = "SOW_EDIT_MODAL";
    } else {
      this.model = {} as Breeding2Sow;
      this.model.id = 0;
      this.model.sowFosterGuid = this.sowFosterGuid;
      this.title = "SOW_ADD_MODAL";
    }
    this.modalReference = this.modalService.open(template, {
      size: "xl",
      backdrop: "static",
    });
  }

  update() {
    this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.updateTitle,
      this.alert.updateMessage,
      () => {
        this.model.penGuid = this.penGuid;
        this.model.fosterPenGuid = this.sowFosterGuid;
        this.service.update(this.ToFormatModel(this.model)).subscribe(
          (res) => {
            if (res.success === true) {
              this.alertify.success(this.alert.updated_ok_msg);
              this.loadData();
              this.modalReference.dismiss();
            } else {
              this.alertify.warning(this.alert.system_error_msg);
            }
          },
          (error) => {
            this.alertify.warning(this.alert.system_error_msg);
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
        if (key === "createDate") {
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
  save(grid2: GridComponent) {
    this.update();
  }
}
