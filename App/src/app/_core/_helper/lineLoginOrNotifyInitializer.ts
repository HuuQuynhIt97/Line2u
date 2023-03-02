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
          let backUrl = '/home';
          // let uri = this.route.snapshot.queryParams.uri || backUrl;
          
          if(isLineAccount === "1") {
            router.navigate(['/mobile/home']);
          }else {
            router.navigate([backUrl]);
          }
        }).add(resolve);
      }else {
        lineService.getProfileFake('').subscribe(data => {}).add(resolve);
      }
    });
}
