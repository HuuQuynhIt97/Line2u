import { SALE_ORDER_TAB_Constant, PIG_SETTING_TAB_Constant } from 'src/app/_core/_constants';
import { UrlAdaptor, DataManager } from '@syncfusion/ej2-data';
import { L10n,setCulture } from '@syncfusion/ej2-base';
import { Component, EventEmitter, HostListener, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { MessageConstants } from 'src/app/_core/_constants';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { BaseComponent } from 'herr-core';
import { TranslateService } from '@ngx-translate/core';
import { SalesOrderService } from 'src/app/_core/_service/sale-orders';
import { SalesOrder } from 'src/app/_core/_model/sale-orders';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { RequisitionService } from 'src/app/_core/_service/requisitions';
import { XAccountService } from 'src/app/_core/_service/xaccount.service';
import { CustomerService } from 'src/app/_core/_service/customer.service';
declare let window:any;
let height = window.innerHeight - 92;
@Component({
  selector: 'app-sale-order',
  templateUrl: './sale-order.component.html',
  styleUrls: ['./sale-order.component.scss']
})
export class SaleOrderComponent extends BaseComponent implements OnInit {
  isAdmin = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_CANCEL';
  active: string;
  localLang =  window.navigator.userLanguage || window.navigator.language;
  data:DataManager;
  baseUrl = environment.apiUrl;
  password = '';
  modalReference: NgbModalRef;
  
  @ViewChild('grid') public grid: GridComponent;
  model: SalesOrder;
  setFocus: any;
  locale = localStorage.getItem('lang');
  editSettings = { showDeleteConfirmDialog: false, allowEditing: false, allowAdding: true, allowDeleting: false, mode: 'Normal' };
  title: any;
  @ViewChild('optionModal') templateRef: TemplateRef<any>;
  toolbarOptions = ['Add', 'Search'];
  selectionOptions = { checkboxMode: 'ResetOnRowClick'};
  fields: object = { text: 'name', value: 'guid' };
  saleOrder: any;
  requisitionData: any;
  bottomDetailHeight = (height / 2) -40- 15;
  bottomHeight = (height / 2) - 117 - 15;
  topHeight = (height / 2) - 117 - 15;
  screenHeight = height;
  leftHeight = this.screenHeight / 2 + 'px';
  rightHeight = this.screenHeight / 2+ 'px';
  @HostListener('window:resize', ['$event'])
  rejectData= [];
  customerData= [];
onResize(event) {
  const h = event.target.innerHeight - 92;
  this.leftHeight = h / 2 + 'px';
  this.rightHeight = h / 2+ 'px';
  this.bottomHeight = (h / 2) - 117 - 15;
  this.topHeight = (h / 2) - 117 - 15;
  this.bottomDetailHeight = (h / 2) - 40 -15
}
  constructor(
    private service: SalesOrderService,
    private serviceCustomer: CustomerService,
    private serviceAccount: XAccountService,
    private serviceRequisition: RequisitionService,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    public translate: TranslateService,
  ) { super(translate,environment.apiUrl);  }

  ngOnInit() {
    this.active = SALE_ORDER_TAB_Constant.Detail;

    // this.Permission(this.route);
    let lang = localStorage.getItem('lang');
    let languages = JSON.parse(localStorage.getItem('languages'));
    // setCulture(lang);
    let load = {
      [lang]: {
        grid: languages['grid'],
        pager: languages['pager']
      }
    };
    L10n.load(load);

    this.loadData();
    this.getRequisitions();
    this.getRejectsData();
    this.getCustomers();
  }
  getRejectsData() {
    const farmGuid = localStorage.getItem('farmGuid');
    this.serviceAccount.getRejectsBySalesOrder(farmGuid).subscribe(data => {
      this.rejectData = data;
    })
  }

  getCustomers() {
    const farmGuid = localStorage.getItem('farmGuid');
    this.serviceCustomer.getCustomers(farmGuid).subscribe(data => {
      this.customerData = data;
    })
  }
  // life cycle ejs-grid
  rowSelected(args) {
    //console.log(args.data);
    this.saleOrder = args.data;
    this.service.changeSalesOrder(this.saleOrder);
  }
  recordClick(args: any) {
    //console.log(args.rowData);
    this.saleOrder = args.rowData;
    this.service.changeSalesOrder(this.saleOrder);
 }
  onDoubleClick(args: any): void {
    this.setFocus = args.column; // Get the column from Double click event
  }

  onChange(args, data) {
    console.log(args);
    data.isDefault = args.checked;

  }

  actionBegin(args) {
  }
  toolbarClick(args) {
    switch (args.item.id) {
      case 'grid_excelexport':
        this.grid.excelExport({ hierarchyExportMode: 'All' });
        break;
      case 'grid_add':
        args.cancel = true;
        this.model = {} as any;
        this.openModal(this.templateRef);
        break;
      default:
        break;
    }
  }
  actionComplete(args) {
    // if (args.requestType === 'add') {
    //   args.form.elements.namedItem('name').focus(); // Set focus to the Target element
    // }
  }

  // end life cycle ejs-grid

  // api
  getAudit(id) {
    this.service.getAudit(id).subscribe(data => {
      this.audit = data;
    });

  }
  getRequisitions() {
    const farmGuid = localStorage.getItem('farmGuid');
    this.serviceRequisition.getRequisitions(farmGuid).subscribe(data => {
      this.requisitionData = data;
    })
  }
  loadData() {
    const accessToken = localStorage.getItem('token');
    const farmGuid = localStorage.getItem('farmGuid');
    this.data = new DataManager({
      url: `${this.baseUrl}SalesOrder/LoadData?farmGuid=${farmGuid}`,
      adaptor: new UrlAdaptor,
      headers: [{ authorization: `Bearer ${accessToken}` }]
    });
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
      }, () => {
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
        const farmGuid = localStorage.getItem('farmGuid');
        if (!farmGuid) {
        this.alertify.warning(this.alert.choose_farm_message, true);
          return;
        }
        this.service.add(this.ToFormatModel(this.model)).subscribe(
          (res) => {
            if (res.success === true) {
              this.alertify.success(this.alert.created_ok_msg);
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
      }, () => {
        this.alertify.error(this.alert.cancelMessage);
      }
    );

  }
  ToFormatModel(model: any) {
    for (let key in model) {
      let value = model[key];
      if (value &&  value instanceof Date) {
        model[key] = this.datePipe.transform(value, "yyyy/MM/dd");
      } else {
        model[key] = value;
      }

    }
    return model;
  }

  update() {
   this.alertify.confirm4(
      this.alert.yes_message,
      this.alert.no_message,
      this.alert.updateTitle,
      this.alert.updateMessage,
      () => {

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
      }, () => {
        this.alertify.error(this.alert.cancelMessage);
      }
    );


  }
  // end api
  NO(index) {
    return (this.grid.pageSettings.currentPage - 1) * this.grid.pageSettings.pageSize + Number(index) + 1;
  }

  save() {
    if (this.model.id > 0) {
      this.update();
    } else {
      this.create();
    }
  }
  openModal(template, data = {} as any) {
    const farmGuid = localStorage.getItem('farmGuid');
    if (data?.id > 0) {
      this.model = {...data};
      this.getAudit(this.model.id);
      this.title = 'SALE_ORDER_EDIT_MODAL';
    } else {
      this.model.id = 0;
      this.model.farmGuid = farmGuid;
      this.model.accountGuid = JSON.parse(localStorage.getItem('user'))?.guid;
      this.title = 'SALE_ORDER_ADD_MODAL';
    }
    this.modalReference = this.modalService.open(template, {size: 'xl',backdrop: 'static'});
  }

}
