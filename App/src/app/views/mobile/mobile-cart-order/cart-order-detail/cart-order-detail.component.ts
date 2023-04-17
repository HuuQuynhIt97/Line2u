import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { ImagePathConstants, MessageConstants } from 'src/app/_core/_constants';
import { OrderService } from 'src/app/_core/_service/evse/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeStoreAddMoreComponent } from '../../home-store-add-more/home-store-add-more.component';
import { DataService } from 'src/app/_core/_service/data.service';
@Component({
  selector: 'app-cart-order-detail',
  templateUrl: './cart-order-detail.component.html',
  styleUrls: ['./cart-order-detail.component.css']
})
export class CartOrderDetailComponent implements OnInit {
  trackingData: any;
  apiHost = environment.apiUrl.replace('/api/', '');
  noImage = ImagePathConstants.NO_IMAGE_QR;
  orderGuid: string;
  storeInfo = JSON.parse(localStorage.getItem('store'))
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
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    private toast: ToastrService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private dataService: DataService,
    public modalService: NgbModal,
    private router: Router,
  ) {

    this.dataService.currentMessage.subscribe((res: any) => {
      if(res === 'load orderDetail') {
        this.getDetailOrder()
      }
    })
   }

  ngOnInit() {
    this.orderGuid = this.route.snapshot.paramMap.get('id')
    this.getDetailOrder()
  }
  addMoreOrder() {
    const modalRef = this.modalService.open(HomeStoreAddMoreComponent, { size: 'xxl', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.data = this.trackingData;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
  orderConfirm() {
    this.orderService.confirmOrder(this.trackingData?.orderID).subscribe(res => {
      this.toast.success(this.alert.updated_ok_msg);
      let isLogin_Cus_url = localStorage.getItem('isLogin_Cus')
      this.router.navigate([isLogin_Cus_url]);
    })
  }
  orderCancel() {
    this.orderService.cancelOrder(this.trackingData?.orderID).subscribe(res => {
      this.toast.success(this.alert.updated_ok_msg);
      let isLogin_Cus_url = localStorage.getItem('isLogin_Cus')
      this.router.navigate([isLogin_Cus_url]);
    })
  }
  getDetailOrder() {
    this.spinner.show()
    this.orderService.getDetailOrder(this.orderGuid,this.storeInfo?.guid).subscribe(res => {
      this.trackingData = res
      this.spinner.hide()
    })
  }
  Back() {
    let isLogin_Cus_url = localStorage.getItem('isLogin_Cus')
    this.router.navigate([isLogin_Cus_url]);
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
