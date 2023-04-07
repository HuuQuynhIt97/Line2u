import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SidebarComponent } from '@syncfusion/ej2-angular-navigations';
import { CookieService } from 'ngx-cookie-service';
import { AlertifyService } from 'src/app/_core/_service/alertify.service';
import { AuthService } from 'src/app/_core/_service/auth.service';
import { DashboardService } from 'src/app/_core/_service/dashboard.service';
import { Location } from "@angular/common";
import { Subscription } from 'rxjs';
import { filter, distinctUntilChanged, map } from 'rxjs/operators';
import { SystemGroupNo } from 'src/app/_core/enum/SystemGroupNo';
import { User2MessageService } from 'src/app/_core/_service/evse/user2-message.service';
import { LineLoginOrNotifyService } from 'src/app/_core/_service/evse/lineLoginOrNotify.service';
import { QRCodeLink } from 'src/app/_core/_model/evse/QRCodeLink';
import { environment } from 'src/environments/environment';
import { UtilitiesService } from 'herr-core';
import { ImagePathConstants, MessageConstants } from 'src/app/_core/_constants';
import { SysMenuService } from 'src/app/_core/_service/sys-menu.service';
import { StoreProfile } from 'src/app/_core/_model/xaccount';
import { StoreProfileService } from 'src/app/_core/_service/evse/store-profile.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  user = JSON.parse(localStorage.getItem('user_landlord'))
  user_infor = JSON.parse(localStorage.getItem('user'))

  fieldsLang: object = { text: "name", value: "id" };
  fields: object = { text: "siteName", value: "guid" };
  lang= this.capitalize(localStorage.getItem("lang"));
  languageData = [
    { id: "Tw", name: "Tw" },
    { id: "En", name: "En" },
    // { id: "Cn", name: "Cn" },
    // { id: "Vi", name: "Vi" },
  ];
  @ViewChild("sidebarTreeviewInstance")
  public sidebarTreeviewInstance: SidebarComponent;
  public width: string = "290px";
  mediaQuery: string = "(min-width: 600px)";
  target: string = ".main-content";
  currentRouter_default: string = '/mobile/home'
  noImage = ImagePathConstants.NO_IMAGE_QR;
  currentRouter: string = ''
  subscription: Subscription = new Subscription();
  count: any = 0;
  menus: any;
  storeInfo: StoreProfile = {} as StoreProfile;
  apiHost = environment.apiUrl.replace('/api/', '');
  qrCodeLink: QRCodeLink = {} as QRCodeLink;
  constructor(
    private router: Router,
    private location: Location,
    private trans: TranslateService,
    private sysMenu: SysMenuService,
    private authService: AuthService,
    private cookieService: CookieService,
    private alertify: AlertifyService,
    private serviceDash: DashboardService,
    private utilityService: UtilitiesService,
    private lineService: LineLoginOrNotifyService,
    private serviceStore: StoreProfileService,
    private user2MessageService: User2MessageService,

  ) {
    this.router.events.pipe( filter((event: any) => event instanceof NavigationEnd) ).subscribe(event => { 
      this.currentRouter = event.url
    });
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  myFunction() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }
  public data: Object[] = [
    {
      nodeId: "01",
      nodeText: this.trans.instant("Desktop mode"),
      iconCss: "icon-microchip icon",
    },
    
    {
      nodeId: "10",
      nodeText: "Sign out",
      iconCss: "icon-bookmark-empty icon",
    },
  ];
  public field: Object = {
    dataSource: this.data,
    id: "nodeId",
    text: "nodeText",
    child: "nodeChild",
    iconCss: "iconCss",
  };

  openClick() {
    this.sidebarTreeviewInstance.toggle();
  }
  goToHome() {
    this.router.navigate(["/mobile/home"]);
  }
  ngOnInit() {
    this.getQrcodeLink();
    this.getStoreInfor()
    this.getMenuTopMobile();
   this.subscription.add(this.user2MessageService.currentUser2Message.subscribe(check => {
      if (check) {
        this.countAlert();
      }
    }))
    this.countAlert();
  }
  getStoreInfor() {
    let uid = this.user_infor?.uid || ''
    this.serviceStore.GetWithGuid(uid).subscribe(res => {
      this.storeInfo = res;
    })
  }
  getMenuTopMobile() {
    this.sysMenu.getMenuTopMobile(this.lang,"MOBILE").subscribe(res => {
      this.menus = res
    })
  }
  getQrcodeLink(){
    this.lineService.getUrlQr(this.user_infor.id).subscribe((res: any) => {
      this.qrCodeLink = res
    })
   }
  openModelQrcode() {
    let height = window.screen.availHeight-100;
    let width = window.screen.availWidth-150;
    if(this.qrCodeLink.pictureUrl !== null) {
      window.open(this.imagePath(this.qrCodeLink.pictureUrl),'targetWindow',`width=${width},height=${height}`);
    }else {
      window.open(this.qrCodeLink.lineBotID,'targetWindow',`width=${width},height=${height}`);
    }
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
  countAlert() {
    this.user2MessageService.countByUserId(this.user?.guid).subscribe(count => {
      this.count = count
    })
  }
  toggleSidebar() {
    var x = document.getElementById("myLinks");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }
  goBack() {
    const homeUrl = this.router.url.includes("home");
    if (!homeUrl) {
      this.location.back();
    }else {
      this.router.navigate(['/landlord-login'])
      .then(() => {
        window.location.reload();
      });
    }
  }
  onCreated(e: any): void {
    this.sidebarTreeviewInstance.element.style.visibility = "visible";
  }

  logout() {
    this.authService.logOutLandlord().subscribe(() => {
      const uri = this.router.url;
      this.cookieService.delete('remember_landlord');
      this.cookieService.delete('key_temp_landlord');
      localStorage.setItem('lang','tw')
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      // this.router.navigate(['/mobile/landlord-login']);
      this.router.navigate(['/home']);
      this.alertify.message(this.trans.instant('Logged out'));
    });
  }
  onNodeClicked(e) {
    if (e.node.dataset.uid === "10") {
      this.logout();
      return;
    } else if (e.node.dataset.uid === "01") {
      this.router.navigate(["/mobile/landlord-login"]);
      return;
    }
  }
  langValueChange(args) {
    const lang = args.itemData.id.toLowerCase();
    localStorage.removeItem("lang");
    localStorage.setItem("lang", lang);
    this.lang = this.capitalize(localStorage.getItem("lang"));
    location.reload();
  }
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
 

}
