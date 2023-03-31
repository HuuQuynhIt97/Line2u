import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService } from 'herr-core';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/_core/_model/evse/cart';
import { StoreProfile } from 'src/app/_core/_model/xaccount';
import { DataService } from 'src/app/_core/_service/data.service';
import { CartService } from 'src/app/_core/_service/evse/cart.service';
import { StoreProfileService } from 'src/app/_core/_service/evse/store-profile.service';
@Component({
  selector: 'app-restaurantrightsidebar',
  templateUrl: './restaurantrightsidebar.component.html',
  styleUrls: ['./restaurantrightsidebar.component.scss']
})
export class RestaurantrightsidebarComponent implements OnInit {
  count: any = 0;
  user = JSON.parse(localStorage.getItem('user'))
  totalPrice: number;
  storeInfo: StoreProfile = {} as StoreProfile;
  cartDetail: Cart[] = [];
  constructor(
    private router: Router,
    private translate: TranslateService,
    public sanitizer: DomSanitizer,
    private dataService: DataService,
    private serviceCart: CartService,
    private serviceStore: StoreProfileService,
    private alertify: AlertifyService,
    private toastr: ToastrService,
  ) { 
    this.dataService.currentMessage.subscribe((res: any) => {
      if(res === 'load cart') {
        this.cartCountTotal()
        this.cartAmountTotal()
        this.getProductsInCart()
      }
    })
  }

  ngOnInit() {
    this.getStoreInfor();
    this.cartCountTotal()
    this.cartAmountTotal()
    this.getProductsInCart()
  }
  openCart(){
    if(this.count === 0) {
      return this.toastr.warning(this.translate.instant('CART_EMPTY'))
    }else {
      const uri = this.router.url;
      localStorage.setItem('isLogin_Cus',uri)
      this.router.navigate([`home/store/shop-cart/check-out/payment`])
    }
   
  }
  safeHtml(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  cartCountTotal() {
    this.serviceCart.cartCountTotal(this.user?.uid || '').subscribe(res => {
      this.count = res
    })
  }
  cartAmountTotal() {
    this.serviceCart.cartAmountTotal(this.user?.uid).subscribe(res => {
      this.totalPrice = res
    })
  }
  getProductsInCart() {
    this.serviceCart.getProductsInCart(this.user?.uid).subscribe(res => {
      console.log('getProductsInCart', res)
      this.cartDetail = res
    })
  }
  getStoreInfor() {
    let uid = this.user?.uid || ''
    this.serviceStore.GetWithGuid(uid).subscribe(res => {
      this.storeInfo = res;
    })
  }
}
