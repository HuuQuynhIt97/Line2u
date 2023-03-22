import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from 'herr-core';
import { environment } from 'src/environments/environment';
import { ImagePathConstants, MessageConstants } from 'src/app/_core/_constants';
import { OrderService } from 'src/app/_core/_service/evse/order.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  constructor(
    private utilityService: UtilitiesService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.orderGuid = this.route.snapshot.paramMap.get('id')
    this.getDetailOrder()
  }
  getDetailOrder() {
    this.orderService.getDetailOrder(this.orderGuid).subscribe(res => {
      console.log(res)
      this.trackingData = res
    })
  }
  Back() {
    this.router.navigate([`mobile/cart-order`]);
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
