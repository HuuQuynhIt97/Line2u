import { Component, OnInit, AfterViewInit } from "@angular/core";
import { AuthService } from "../../../_core/_service/auth.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { FarmService } from "src/app/_core/_service/farms";
import { DashboardService } from "src/app/_core/_service/dashboard.service";
import { TranslateService } from "@ngx-translate/core";
import { HeaderService } from "src/app/_core/_service/header.service";
import { Query } from "@syncfusion/ej2-data";
import moment from "moment";
import { AutoLogoutService } from "src/app/_core/_service/apply-orders/auto-log-off.service";
import { XAccountService } from "src/app/_core/_service/xaccount.service";
import { AlertifyService } from "herr-core";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  nickName: any;
  username: any;
  farmData: any[];
  farmGuid: any;
  fields: object = { text: "farmName", value: "guid" };
  fieldsLang: object = { text: "name", value: "id" };
  lang: string;
  languageData = [
    { id: "Tw", name: "Tw" },
    { id: "En", name: "En" },
    // { id: "Cn", name: "Cn" },
    // { id: "Vi", name: "Vi" },
  ];
  public onFiltering: any = (e: any) => {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = e.text !== "" ? query.search(e.text, ["farmName"]) : query;
    //pass the filter data source, filter query to updateData method.
    e.updateData(this.farmData, query);
  };
  currentTime: string;
  downTime: string;
  downTimeInterval
  isMobileMode: boolean = JSON.parse(localStorage.getItem('user')).mobileMode
  isLineAccount: string = JSON.parse(localStorage.getItem('user'))?.isLineAccount
  usernameLine: any;
 
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private alertify: AlertifyService,
    private router: Router,
    private service: FarmService,
    private serviceDash: DashboardService,
    private trans: TranslateService,
    private serviceHeader: HeaderService,
    private autoLogoutService: AutoLogoutService,
    private translate:TranslateService,
    private accountService: XAccountService
  ) {}
  ngAfterViewInit(): void {}
  ngOnInit(): void {
    if (this.autoLogoutService.mins) {
      this.startTimer(this.autoLogoutService.mins);
    }
    this.usernameLine =  JSON.parse(localStorage.getItem('user'))?.accountName || "Guest";
    this.currentTime = moment().format('LTS');
    this.autoLogoutService.currentDownTime.subscribe(x=> {
      if (x === "INIT") {
      this.startTimer(this.autoLogoutService.mins);
      } else {
        this.startTimer(this.autoLogoutService.mins);
      }
     
    })
   
    setInterval(() => this.updateCurrentTime(), 1 * 1000);
    this.farmGuid = localStorage.getItem("farmGuid");
    this.lang = this.capitalize(localStorage.getItem("lang"));
    this.nickName =
      JSON.parse(localStorage.getItem("user"))?.nickName || "No Name";
    this.username =
      JSON.parse(localStorage.getItem("user"))?.username || "Guest";

    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.accountService.SP_Record_AccountCheck_NeedCheck(user.guid)
      .subscribe(a => {
        if (a === 1) {
            this.alertify.messagePreventClosed(this.translate.instant("Account_Check_TEXT"), () => {
              this.accountService.SP_Record_AccountCheck_Confirm(user.guid).subscribe()
            })
        }
      })

    }
  }
  
  startTimer(duration) {
      clearInterval(this.downTimeInterval);
      var timer = duration * 60, minutes: any, seconds: any;
      this.downTimeInterval =  setInterval( () => {
        let min = timer / 60;
        let sec = timer % 60;
          minutes = parseInt(min + '', 10) ;
          seconds = parseInt(sec+ '', 10);
  
          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;
  
          this.downTime = minutes + ":" + seconds;
  
          if (--timer < 0) {
              timer = duration;
              clearInterval(this.downTimeInterval);
          }
      }, 1000);
   
}

  updateCurrentTime() {
    this.currentTime = moment().format('LTS');
  }
  getFarmsByAccount() {
    this.service.getFarmsByAccount().subscribe((data: any) => {
      this.farmData = data;
      const farmGuid = localStorage.getItem("farmGuid");
      if (farmGuid) {
        this.farmGuid = farmGuid;
      } else {
        this.farmGuid = data[0]?.guid || "";
      }
      localStorage.setItem("farmGuid", this.farmGuid);
      this.serviceDash.changeFarmGuid(this.farmGuid);
    });
  }
  goToChangePassword() {
    this.router.navigate(["/change-password"]);
  }
  goToProfile() {
    this.router.navigate(["/profile"]);
  }
  logout() {
    this.authService.logOut().subscribe(() => {
      const uri = this.router.url;
      this.cookieService.delete('remember_landlord');
      this.cookieService.delete('key_temp_landlord');

      this.router.navigate(["login"], {
        queryParams: { uri },
        replaceUrl: true,
      });
      this.alertify.message(this.trans.instant("Logged out"));
    });
  }
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  farmValueChange(args) {
    this.farmGuid = args.itemData.guid || "";
    localStorage.setItem("farmGuid", args.itemData.guid);

    if (args.isInteracted === true) {
      location.reload();
    } else {
      setTimeout(() => {
        this.serviceDash.changeFarmGuid(this.farmGuid);
      }, 1000);
    }
  }
  langValueChange(args) {
    const lang = args.itemData.id.toLowerCase();
    localStorage.removeItem("lang");
    localStorage.setItem("lang", lang);
    this.lang = this.capitalize(localStorage.getItem("lang"));
    location.reload();
  }
}
