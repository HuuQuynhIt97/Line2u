import { Component, OnDestroy, OnInit, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { AuthService } from "src/app/_core/_service/auth.service";
import { AlertifyService } from "herr-core";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: 'app-landlord-register',
  templateUrl: './landlord-register.component.html',
  styleUrls: ['./landlord-register.component.css']
})
export class LandlordRegisterComponent implements OnInit {
  username;
  password;
  agree
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService,
    private alertifyService: AlertifyService,
    private trans: TranslateService
  ) { }

  ngOnInit(): void {
  }
  authentication() {
    return this.authService
      .registerLandlord(this.username, this.password)
      .toPromise();
  }
  async register() {
    if (!this.username || !this.password) {
      return;
    }
    try {
      const data = await this.authentication();
      this.username= null;
      this.password= null;
      this.agree = null;
      this.alertifyService.success(this.trans.instant("Register Success!"));
    } catch (error) {
      if (error.indexOf("error") == -1) {
        this.alertifyService.warning(this.trans.instant(error), true);
      } else {
        this.alertifyService.warning(this.trans.instant("Server error!"), true);
      }
    }
  }

}
