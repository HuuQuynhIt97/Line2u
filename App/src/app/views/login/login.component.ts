
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { AlertifyService } from '../../_core/_service/alertify.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserForLogin } from 'src/app/_core/_model/user';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/_core/_service/auth.service';
import { PermissionService } from 'src/app/_core/_service/permission.service';
import { TranslateService } from '@ngx-translate/core';
import { SystemGroupNo } from 'src/app/_core/enum/SystemGroupNo';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  username = '';
  password = '';
  private subscription: Subscription;
  user: UserForLogin = {
    username: '',
    password: ''
  };
  uri: any;
  title: any;
  btnText: any;
  remember = false;
  loading = 0;
  key: string;
  sysConf: any;
  public urlLineAuth = environment.redirectOfficialAccount;
 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService,
    private alertifyService: AlertifyService,
    private trans: TranslateService
  ) {
    this.loadLang()
    if (this.cookieService.get('remember') !== undefined) {
      if (this.cookieService.get('remember') === 'Yes') {
        this.key = this.cookieService.get('key_temp');
        this.remember = true;
        this.loginRememberMe(+this.key);
      }
    }
    let isLineAccount = JSON.parse(localStorage.getItem('user'))?.isLineAccount
    if(isLineAccount === "1") {
      this.removeLocalStore('user')
      this.removeLocalStore('token')
      this.router.navigateByUrl('/login');
      let backUrl = '/line2u/home';
      this.uri = backUrl
    }else {
      let backUrl = '/line2u/home';
      this.uri = this.route.snapshot.queryParams.uri !== undefined ? this.route.snapshot.queryParams.uri : backUrl  || backUrl;
    }
  }
  role: number;
  ngAfterViewInit(): void {

  }
  loadLang() {
    // this.trans.get("Access-denied").subscribe(res => {
    //   this.title = res;
    // });
    // this.trans.get("OK").subscribe(res => {
    //   this.btnText = res;
    // });
  }
  ngOnInit(): void {
    this.sysConf = JSON.parse(localStorage.getItem('sysConf'))
    // this.loadLang()
    const accessToken = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh_token');
    let isLineAccount = JSON.parse(localStorage.getItem('user'))?.isLineAccount
    if (accessToken && refreshToken && this.route.routeConfig.path === 'login') {
      let backUrl = '/line2u/home';
      const uri = decodeURI(this.uri) || backUrl;
      this.router.navigate([uri]);
    }
    if (this.authService.loggedIn()) {
      if(isLineAccount === "1") {
        this.removeLocalStore('user')
        this.removeLocalStore('token')
        let backUrl = '/login';
        const uri = decodeURI(this.uri) || backUrl;
        this.router.navigate([uri]);
      }else {
        let backUrl = '/line2u/home';
        const uri = decodeURI(this.uri) || backUrl;
        this.router.navigate([uri]);
      }
    }
  }
  removeLocalStore(key: string) {
    localStorage.removeItem(key);
  }
  onChangeRemember(args) {
    this.remember = args.target.checked;
  }
  authentication() {
    return this.authService
      .login(this.username, this.password).toPromise();
  }

  checkAccountGroupUser() {
    return this.authService
      .checkAccountGroupUser(this.username, this.password).toPromise();
  }

  async login() {
    if (!this.username || !this.password) {
      return;
    }
    this.loading = 1;
    try {
      var group_user = await this.checkAccountGroupUser();
      console.log(group_user)
      const data = await this.authentication();
      const currentLang = localStorage.getItem('lang');
      if (currentLang) {
        localStorage.setItem('lang', currentLang);
      } else {
        localStorage.setItem('lang', 'tw');
      }

      if (this.remember) {
        this.cookieService.set('remember', 'Yes');
        this.cookieService.set('key_temp', data.user.id);
      } else {
        this.cookieService.set('remember', 'No');
        this.cookieService.set('key_temp', '');
      }
      const lang = localStorage.getItem('lang');

      const functions = await this.authService.getPermissions(data.user.guid,lang ).toPromise();
      localStorage.setItem("functions", JSON.stringify(functions));

      const languages = await this.authService.getLanguages(lang).toPromise();
      localStorage.setItem('languages', JSON.stringify(languages));
      const uri = decodeURI(this.uri);
      const check = this.checkLocalRole();

      if(data.user.groupCode === SystemGroupNo.Customer || data.user.groupCode === SystemGroupNo.Member ) {
        if(data.user.isLineAccount === '1') {
          let mobileUrl = '/mobile/home';
          this.router.navigate([mobileUrl]);
        }else {
          let mobileUrl = '/userLine-login';
          this.router.navigate([mobileUrl]);
        }
      }else {
        if (check ) {
          const uri = decodeURI(this.uri);
          this.router.navigate([uri]);
        } else {
          let backUrl = '/line2u/home';
          this.router.navigate([backUrl]);
        }
      }
    
      this.alertifyService.success(this.trans.instant('Login Success!'));
      this.loading = 0;


    } catch (error) {
      console.log(error)
     if (error.indexOf('error') == -1) {
      if(group_user ===  SystemGroupNo.Customer) {
        let Url = '/login-Fail';
        this.router.navigate([Url]);
      }else { 
        this.alertifyService.warning(this.trans.instant(error), true);
      }
     } else {
      this.alertifyService.warning(this.trans.instant('Server error!'), true);

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
      const data = await this.authService.loginRememberMe(key).toPromise();
      const currentLang = localStorage.getItem('lang');
      if (currentLang) {
        localStorage.setItem('lang', currentLang);
      } else {
        localStorage.setItem('lang', 'en');
      }

      if (this.remember) {
        this.cookieService.set('remember', 'Yes');
        this.cookieService.set('key_temp', data.user.id);
      } else {
        this.cookieService.set('remember', 'No');
        this.cookieService.set('key_temp', '');
      }
      const lang = localStorage.getItem('lang');

      const functions = await this.authService.getPermissions(data.user.id,lang).toPromise();
      localStorage.setItem("functions", JSON.stringify(functions));

      const languages = await this.authService.getLanguages(lang).toPromise();
      localStorage.setItem('languages', JSON.stringify(languages));

      const uri = decodeURI(this.uri);
      // debugger
      const check = this.checkLocalRole();
      if (check ) {
        const uri = decodeURI(this.uri);
        this.router.navigate([uri]);
      } else {
        let backUrl = '/line2u/home';
        this.router.navigate([backUrl]);
      }
      this.loading = 0;
    } catch (error) {
      if (error.indexOf('error') == -1) {
        this.alertifyService.warning(this.trans.instant(error), true);
      } else {
       this.alertifyService.warning(this.trans.instant('Server error!'), true);

      }
      this.loading = 0;
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


  checkLocalRole(): boolean {
    // let navs = [];
    // const accountType = JSON.parse(localStorage.getItem('user'))?.accountType || '';
    const uri = decodeURI(this.uri);
    if (uri == '/login') {
      return false;
    }
    // const permissions = navs.map(x => x.url);
    // for (const url of permissions) {
    //   if (uri.includes(url)) {
    //     return true;
    //   }
    // }
    return true;
  }
}
