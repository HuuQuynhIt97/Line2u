import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent, AlertifyService } from 'herr-core';
import { CommandColumnService, CommandModel, EditService, ExcelExportCompleteArgs, ExcelExportProperties, GridComponent } from '@syncfusion/ej2-angular-grids';
import { NgxSpinnerService } from 'ngx-spinner';
import { RecordAccidentFeeService } from 'src/app/_core/_service/apply-orders/record-accident-fee.service';
import { environment } from 'src/environments/environment';
import {
  DataManager,
  Query,
  UrlAdaptor,
  Predicate,
} from "@syncfusion/ej2-data";
@Component({
  selector: 'app-record-accident-fee-modal',
  templateUrl: './record-accident-fee-modal.component.html',
  styleUrls: ['./record-accident-fee-modal.component.css'],
  providers: [ EditService, CommandColumnService]
})
export class RecordAccidentFeeModalComponent extends BaseComponent implements OnInit, OnChanges {
editSettings = { showDeleteConfirmDialog: false, allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };
toolbarOptions = ['Add', 'Search'];
public commands: CommandModel[];

data: any
@Input() makeOrderGuid:  any
@Input() saleGuid:  any 
@Output() closeChange = new  EventEmitter();
model: any;
accidentDisease: any;
  query: Query;
  constructor(
    private service: RecordAccidentFeeService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
  private router: Router,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    public translate: TranslateService
  ) {
    super(translate,environment.apiUrl);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['saleGuid']) {
    }
  }

 
modalReference: NgbModalRef;
@ViewChild("recordAccidentFeeModal") templateRef: TemplateRef<any>;

  @ViewChild('grid') public grid: GridComponent;

  ngOnInit(): void {
    this.commands = [
        { type: 'Delete', buttonOption: { iconCss: 'e-icons e-delete fa fa-trash', cssClass: 'e-flat' } },
       ];
  }
  toolbarClick(args) {
    const functionName = this.functionName;
    const printBy = this.printBy;
      switch (args.item.id) {
        case 'grid_excelexport':
          const accountName = JSON.parse(localStorage.getItem('user'))?.accountName || 'N/A';
          const header = {
            headerRows: 3,
            rows: [
              {
                cells: [{
                    colSpan: 5, value: `* ${functionName}`,
                    style: { fontColor: '#fd7e14', fontSize: 18, hAlign: 'Left', bold: true, }
                }]
            },
            {
              cells: [{
                  colSpan: 5, value: `* ${this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss')}`,
                  style: { fontColor: '#fd7e14', fontSize: 18, hAlign: 'Left', bold: true, }
              }]
          },
          {
            cells: [{
                colSpan: 5, value: `* ${printBy} ${accountName}`,
                style: { fontColor: '#fd7e14', fontSize: 18, hAlign: 'Left', bold: true, }
            }]
        },
            ]
          } as any;

          const fileName = `${functionName}_${this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`
          const excelExportProperties: ExcelExportProperties = {
            hierarchyExportMode: 'All',
            fileName: fileName,
            header: header
        };
          this.grid.excelExport(excelExportProperties);
          break;
        case 'grid_add':
          break;
        default:
          break;
      }
  }
  actionBegin(args) {
    if (args.requestType === 'beginEdit') {
      this.accidentDisease = args.data.accidentDisease;

    }
    if (args.requestType === 'save' && args.action === 'add') {
      this.model = {...args.data};
      this.model.accidentDisease = this.accidentDisease;
      this.model.id = 0;
      this.model.saleGuid =  this.saleGuid
      this.model.farmGuid =  localStorage.getItem('farmGuid')
      this.create();

    }
    if (args.requestType === 'save' && args.action === 'edit') {
      this.model = {...args.data};
      this.model.saleGuid =  this.saleGuid
      this.model.farmGuid =  localStorage.getItem('farmGuid')
      this.update();
    }
  }
  create() {
    this.model.accidentDisease = this.accidentDisease;
    this.service.add(this.ToFormatModel(this.model)).subscribe(
      (res) => {
        if (res.success === true) {
          this.alertify.success(this.alert.created_ok_msg);
          this.loadData();
        } else {
          this.alertify.warning(this.alert.system_error_msg);
        }
      },
      (error) => {
        this.alertify.warning(this.alert.system_error_msg);
      }
    );
  }
  update() {
    this.model.accidentDisease = this.accidentDisease;
    this.service.update(this.ToFormatModel(this.model)).subscribe(
      (res) => {
        if (res.success === true) {
          this.alertify.success(this.alert.updated_ok_msg);
          this.loadData();
        } else {
          this.alertify.warning(this.alert.system_error_msg);
        }
      },
      (error) => {
        this.alertify.warning(this.alert.system_error_msg);
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
  excelExpComplete(args: ExcelExportCompleteArgs) {
    if (this.isodsExport) {
      const fileName = `${this.functionName}_${this.datePipe.transform(new Date(), 'yyyyMMdd_HHmmss')}.ods`

      args.promise.then((e: { blobData: Blob }) => {
        const model = {
          functionName: fileName,
          file: e.blobData
        }
        this.service.downloadODSFile(model).subscribe((res: any) => {
        this.service.downloadBlob(res.body, fileName, 'application/vnd.oasis.opendocument.spreadsheet')
        })
      });
    }

  }
  loadData() {

    this.query = new Query();
    const accessToken = localStorage.getItem("token");
    let predicate: Predicate = new Predicate("saleGuid", "equal", this.saleGuid);
    // predicate = predicate.and("saleGuid", "equal", this.saleGuid);

    this.query.where(predicate).sortBy("id");

    this.data =  new DataManager({
      url: `${this.baseUrl}RecordAccidentFee/LoadData?farmGuid=${localStorage.getItem('farmGuid')}&lang=${localStorage.getItem('lang')}`,
      adaptor: new UrlAdaptor(),
      headers: [{ authorization: `Bearer ${accessToken}` }],
    });
  }
  delete(data) {
    const id = data.id;
    if (id) {
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
        }, () => {
          this.alertify.error(this.alert.cancelMessage);
        }
      );
    } else {
      this.grid.deleteRecord("id", data)
    }
    

  }
  open() {
    this.loadData();
    this.modalReference =  this.modalService.open(this.templateRef, {
      size: "xl",
      backdrop: "static",
    }); 
    this.modalReference.result.then(x=> {
    }, () => {
      this.closeChange.emit(this.saleGuid);
     
    })
  }
  close() {
    this.data = [];
      this.saleGuid = null;
      this.makeOrderGuid = null;
    this.modalReference.close(); 
  }
  
}
