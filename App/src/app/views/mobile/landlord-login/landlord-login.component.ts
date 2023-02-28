import { Component, OnDestroy, OnInit, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { UserForLogin } from "src/app/_core/_model/user";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/_core/_service/auth.service";
import { TranslateService } from "@ngx-translate/core";
import { AlertifyService } from "herr-core";
import { AuthLandlordService } from "src/app/_core/_service/auth-landlord.service";
import {
  DataManager,
  Query,
  UrlAdaptor,
  Predicate,
} from "@syncfusion/ej2-data";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-landlord-login",
  templateUrl: "./landlord-login.component.html",
  styleUrls: ["./landlord-login.component.css"],
})
export class LandlordLoginComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  baseUrl = environment.apiUrlImage;

  username = "";
  password = "";
  private subscription: Subscription;
  user: UserForLogin = {
    username: "",
    password: "",
  };
  uri: any;
  remember = false;
  loading = 0;
  key: string;
  logo: any;
  titleName: any = '後台管理系統';
  bg: any = '#fff9f1';
  public urlLineAuth = environment.redirectOfficialAccount;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthLandlordService,
    private cookieService: CookieService,
    private alertifyService: AlertifyService,
    private trans: TranslateService
  ) {
    if (this.cookieService.get("remember_landlord") !== undefined) {
      if (this.cookieService.get("remember_landlord") === "Yes") {
        this.key = this.cookieService.get("key_temp_landlord");
        this.remember = true;
        this.loginRememberMe(+this.key);
      }
    }
    let backUrl = "/mobile/home";
    this.uri = this.route.snapshot.queryParams.uri || backUrl;
  }
  role: number;
  ngAfterViewInit(): void {}
  ngOnInit(): void {
    let skip = +this.route.snapshot.data.skip
    if (skip == 0) {
      this.router.navigate(['/mobile/landlord-demo']);
    }
    this.loadConfigData();
    this.loadLogoData();
    const accessToken = localStorage.getItem("token_landlord");
    const refreshToken = localStorage.getItem("refresh_token_landlord");
    if (
      accessToken &&
      refreshToken &&
      this.route.routeConfig.path === "/mobile/landlord-login"
    ) {
      let backUrl = "/mobile/home";
      const uri = decodeURI(this.uri) || backUrl;
      this.router.navigate([uri]);
    }
    if (this.authService.loggedIn()) {
      let backUrl = "/mobile/home";
      const uri = decodeURI(this.uri) || backUrl;
      this.router.navigate([uri]);
    }
  }
  onChangeRemember(args) {
    this.remember = args.target.checked;
  }
  authentication() {
    return this.authService
      .loginlanlord(this.username, this.password)
      .toPromise();
  }

  async login() {
    if (!this.username || !this.password) {
      return;
    }
    this.loading = 1;
    try {
      const data = await this.authentication();
      const currentLang = localStorage.getItem("lang");
      if (currentLang) {
        localStorage.setItem("lang", currentLang);
      } else {
        localStorage.setItem("lang", "tw");
      }

      if (this.remember) {
        this.cookieService.set("remember_landlord", "Yes");
        this.cookieService.set("key_temp_landlord", data.user.id);
      } else {
        this.cookieService.set("remember_landlord", "No");
        this.cookieService.set("key_temp_landlord", "");
      }
     
      let backUrl = "/mobile/home";
      this.router.navigate([backUrl]);
      this.alertifyService.success(this.trans.instant("Login Success!"));
      this.loading = 0;
    } catch (error) {
      if (error.indexOf("error") == -1) {
        this.alertifyService.warning(this.trans.instant(error), true);
      } else {
        this.alertifyService.warning(this.trans.instant("Server error!"), true);
      }
      this.loading = 0;
    }
  }

  async loginRememberMe(key) {
    this.loading = 1;
    if (!key) {
      setTimeout(() => {
        this.loading = 0;
        return;
      }, 500);
    }
    try {
      const data = await this.authService
        .loginRememberMeLandlord(key)
        .toPromise();
      const currentLang = localStorage.getItem("lang");
      if (currentLang) {
        localStorage.setItem("lang", currentLang);
      } else {
        localStorage.setItem("lang", "en");
      }

      if (this.remember) {
        this.cookieService.set("remember_landlord", "Yes");
        this.cookieService.set("key_temp_landlord", data.user.id);
      } else {
        this.cookieService.set("remember_landlord", "No");
        this.cookieService.set("key_temp_landlord", "");
      }
     
      let backUrl = "/evse/home";
      this.router.navigate([backUrl]);
      this.loading = 0;
    } catch (error) {
      if (error.indexOf("error") == -1) {
        this.alertifyService.warning(this.trans.instant(error), true);
      } else {
        this.alertifyService.warning(this.trans.instant("Server error!"), true);
      }
      this.loading = 0;
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  loadLogoData() {
    let query = new Query();
    query.where("type", "equal", "Logo");
    new DataManager({
      url: `${environment.apiUrl}WebNews/LoadData?lang=${localStorage.getItem(
        "lang"
      )}`,
      adaptor: new UrlAdaptor(),
    })
      .executeQuery(query.sortBy("sortId"))
      .then((res: any) => {
        var data = res.result.result;
        this.logo = data.length > 0 ? data[0].photoPath : "../../../assets/images/logo.png";
      })
      .catch((err) => {});
  }
  loadConfigData() {
    let query = new Query();
    query.where("type", "equal", "Evse_Login_Config");
    const accessToken = localStorage.getItem("token");
    new DataManager({
      url: `${environment.apiUrl}SystemConfig/GetDataDropdownlist`,
      adaptor: new UrlAdaptor(),
      headers: [{ authorization: `Bearer ${accessToken}` }],
    })
      .executeQuery(query)
      .then((x: any) => {
        const configData = x.result;
        for (const item of configData) {
          if (item.no === 'title') {
            this.titleName = item.value;
          } 
          if (item.no === 'background-color') {
            this.bg = item.value
          }
        }
       
      });
  }
}
