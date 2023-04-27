import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService } from 'herr-core';
import { NgxSpinnerService } from 'ngx-spinner';
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
  cartModel: Cart = {} as Cart;
  isLineAccount: string = JSON.parse(localStorage.getItem('user'))?.isLineAccount
  constructor(
    private router: Router,
    private translate: TranslateService,
    public sanitizer: DomSanitizer,
    private dataService: DataService,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
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
  deleteCart(item) {
    this.spinner.show()
    let isLogin_Cus = localStorage.getItem("isLogin_Cus")
    if((isLogin_Cus?.length === 0 || isLogin_Cus === null) || this.isLineAccount !== '1') {
      const uri = this.router.url;
      localStorage.setItem('isLogin_Cus',uri)
      this.router.navigate(["user-login"], {
        queryParams: { uri },
        replaceUrl: true,
      });
    }else {
      this.serviceCart.delete(item.id).subscribe(res => {
        this.toast.success(this.translate.instant('Remove_Cart_Success'))
        this.cartCountTotal()
        this.getProductsInCart()
        this.dataService.changeMessage('load cart')
        this.cartAmountTotal();
        this.spinner.hide()
      })
    }
  }
  removeCart(item) {
    this.spinner.show()
    let isLogin_Cus = localStorage.getItem("isLogin_Cus")
    if((isLogin_Cus?.length === 0 || isLogin_Cus === null) || this.isLineAccount !== '1') {
      const uri = this.router.url;
      localStorage.setItem('isLogin_Cus',uri)
      this.router.navigate(["user-login"], {
        queryParams: { uri },
        replaceUrl: true,
      });
    }else {
      this.cartModel.id = item.id
      this.cartModel.updateBy = this.user.id
      this.cartModel.quantity = item.quantity - 1
      if(item.id > 0) {
        if(this.cartModel.quantity === 0) {
          this.serviceCart.delete(this.cartModel.id).subscribe(res => {
            this.cartCountTotal()
            this.getProductsInCart()
            this.dataService.changeMessage('load cart')
            this.cartAmountTotal();
            this.spinner.hide()
          })
        }
        else {
          this.serviceCart.update(this.cartModel).subscribe(res => {
            this.toast.success(this.translate.instant('Update_Cart_Success'))
            this.cartCountTotal()
            this.getProductsInCart()
            this.dataService.changeMessage('load cart')
            this.cartAmountTotal();
            this.spinner.hide()
          })
        }
      }else {
        this.spinner.hide()
      }
    }
  }
  addToCart(item) {
    this.spinner.show()
    let isLogin_Cus = localStorage.getItem("isLogin_Cus")
    if((isLogin_Cus?.length === 0 || isLogin_Cus === null) || this.isLineAccount !== '1') {
      const uri = this.router.url;
      localStorage.setItem('isLogin_Cus',uri)
      this.router.navigate(["user-login"], {
        queryParams: { uri },
        replaceUrl: true,
      });
    }else {
      console.log(item)
      this.cartModel = {...item}
      this.cartModel.accountUid = this.user.uid
      this.cartModel.createBy = this.user.id
      this.cartModel.quantity = 1
      this.cartModel.productGuid = item.guid
      this.cartModel.storeGuid = item.storeGuid
      this.cartModel.productId = item.productId
      this.cartModel.productPrice = item.productPrice
      if(item.cartId > 0) {
        this.cartModel.productSizeAdd = item.productSizeAdd
        this.cartModel.productOptionAdd = item.productOptionAdd
      }
      this.serviceCart.add(this.cartModel).subscribe(res => {
        this.toast.success(this.translate.instant('Add_To_Cart_Success'))
        this.cartCountTotal()
        this.getProductsInCart()
        this.dataService.changeMessage('load cart')
        this.cartAmountTotal();
        this.spinner.hide()
      })
    }
  }
  openCart(){
    if(this.count === 0) {
      return this.toastr.warning(this.translate.instant('CART_EMPTY'))
    }else {
      const uri = this.router.url;
      console.log(uri);
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
