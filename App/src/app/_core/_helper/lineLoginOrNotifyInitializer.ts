import {  Router } from "@angular/router";
import { LineLoginOrNotifyService } from "../_service/evse/lineLoginOrNotify.service";

export function lineLoginOrNotifyInitializer(
  lineService: LineLoginOrNotifyService,
  router: Router
  ) {
    // let token = window.location.pathname.split('/')[3]

    return () =>
    new Promise((resolve, reject) => {
      if (window.location.href.indexOf('tokenLogin=') > 0) {
        let token = window.location.href.split('?')[1].replace('tokenLogin=', '');
        let userID = JSON.parse(localStorage.getItem('user'))?.uid || 0
        lineService.getProfile(token,userID).subscribe(data => {
          let isLineAccount = JSON.parse(localStorage.getItem('user'))?.isLineAccount
          let isCustomer = JSON.parse(localStorage.getItem('user'))?.isCustomer
          let backUrl = '/home';
          let isLogin_Cus_url = localStorage.getItem('isLogin_Cus')

          router.navigate([isLogin_Cus_url]);

        }).add(resolve);
      }
      else {
        lineService.getProfileFake('').subscribe(data => {}).add(resolve);
      }
    });
}
