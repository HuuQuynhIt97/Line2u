import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService } from 'herr-core';
@Component({
  selector: 'app-restaurantrightsidebar',
  templateUrl: './restaurantrightsidebar.component.html',
  styleUrls: ['./restaurantrightsidebar.component.scss']
})
export class RestaurantrightsidebarComponent implements OnInit {
  count: any = 0;
  constructor(
    private router: Router,
    private translate: TranslateService,
    private alertify: AlertifyService,
  ) { }

  ngOnInit() {
  }
  openCart(){
    // if(this.count === 0) {
    //   return this.alertify.warning(this.translate.instant('CART_EMPTY'),true)
    // }else {
    // }
    const uri = this.router.url;
    localStorage.setItem('isLogin_Cus',uri)
    this.router.navigate([`home/store/shop-cart/check-out/payment`])
   
  }
}
