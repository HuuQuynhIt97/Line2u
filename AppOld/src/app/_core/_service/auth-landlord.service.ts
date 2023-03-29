import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Subscription, throwError } from 'rxjs';
import { map, tap, delay, finalize, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApplicationUser } from '../_model/application-user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { OperationResult } from '../_model/operation.result';

@Injectable({
  providedIn: 'root',
})
export class AuthLandlordService implements OnDestroy {
  baseUrl = environment.apiUrl + 'auth/login';
  base = environment.apiUrl;

  private readonly apiUrl = `${environment.apiUrl}auth`;
  private timer: Subscription;

  private storageEventListener(event: StorageEvent) {
    if (event.storageArea === localStorage) {
      // if (event.key === 'logout-event') {
      //   this.stopTokenTimer();
      // }
      // if (event.key === 'login-event') {
      //   this.stopTokenTimer();
      // }
      // if (event.key === 'refresh-token' || event.key === 'token') {
      //   if (event.newValue === 'undefined' || event.newValue === '' || event.newValue === null || event.newValue === undefined ) {
      //     this.logOut();
      //     window.location.reload();
      //   }
      // }
      // if (event.key === 'user') {
      //   if (event.oldValue !== null && JSON.stringify(event.oldValue) !== JSON.stringify(event.newValue)) {
      //     this.logOut();
      //     window.location.reload();
      //   }
      // }

    }
  }
  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private cookieService: CookieService  ) {
    window.addEventListener('storage', this.storageEventListener.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageEventListener.bind(this));
  }


  loginlanlord(username: string, password: string) {
    return this.http
      .post<OperationResult>(`${this.apiUrl}/loginlandlord`, { username, password })
      .pipe(
        map(res => {
          const applicationUser = res.data as ApplicationUser;
          this.cookieService.set("refreshToken_landlord", applicationUser.refreshToken,  {
            expires: 1000 * 60 * 365,
            domain: environment.domain,
            secure: true,
            sameSite:'Strict'
        })
          this.setLocalStorageLandlord(applicationUser);
          return applicationUser;
        })
      );
  }

  registerLandlord(username, password) {
    return this.http
      .post<OperationResult>(`${this.apiUrl}/RegisterLandlord`, { username, password })
     ;
  }
  loginRememberMeLandlord(id) {
    return this.http
      .post<OperationResult>(`${this.apiUrl}/LoginRememberLandlord`, { id })
      .pipe(
        map(res => {
          const applicationUser = res.data as ApplicationUser;
          const user = res.data.user;
          this.setLocalStorageLandlord(applicationUser);
          return applicationUser;
        })
      );
  }

  
  refreshTokenLandlord() {
    const refreshToken = localStorage.getItem('refresh-token_landlord');
    const token = localStorage.getItem('token_landlord');
    if (!refreshToken || refreshToken === undefined + '') {
      this.clearLocalStorageLandlord();
      return of(null);
    }
    const timeout = this.jwtHelper.isTokenExpired();
    if (timeout === false) {
      return of(null);
    }
    return this.http
      .post<OperationResult>(`${this.apiUrl}/RefreshTokenLandlord`, {token, refreshToken })
      .pipe(
        map( res => {
          const applicationUser = res.data as ApplicationUser;
          this.setLocalStorageLandlord(applicationUser);
          this.startTokenTimer();
          return applicationUser;
        }),
        catchError((err) => {
          this.clearLocalStorageLandlord();
          return throwError(err);
        }),
      );
  }

  
  setLocalStorageLandlord(data: ApplicationUser) {
    localStorage.setItem('user_landlord', JSON.stringify(data.user));
    localStorage.setItem('token_landlord', data.token);
    localStorage.setItem('refresh-token_landlord', data.refreshToken);
    localStorage.setItem('login-event_landlord', 'login' + Math.random());
  }

  

  clearLocalStorageLandlord() {
    localStorage.removeItem('user_landlord');
    localStorage.removeItem('token_landlord');
    localStorage.removeItem('refresh-token_landlord');
    localStorage.removeItem('login-event_landlord');
    localStorage.removeItem('functions_landlord');
    localStorage.removeItem('menuItem_landlord');
    localStorage.removeItem('farmGuid_landlord');
    localStorage.removeItem('menus_landlord');
    localStorage.removeItem('lastAction_landlord');
    localStorage.setItem('logout-event_landlord', 'logout' + Math.random());
  }
  private getTokenRemainingTime() {
    const accessToken = localStorage.getItem('token_landlord');
    if (!accessToken) {
      return 0;
    }
    const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    return expires.getTime() - Date.now();
  }

  private startTokenTimer() {

    const timeout = this.getTokenRemainingTime();
    this.timer = of(true)
      .pipe(
        delay(timeout),
        tap(() => this.refreshTokenLandlord().subscribe())
      )
      .subscribe();
  }

  private stopTokenTimer() {
    this.timer?.unsubscribe();
  }
  private validToken() {
    const token = localStorage.getItem('token');
    const pattern = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
    const result = pattern.test(token);
    return result;
  }
  public loggedIn() {
    if (localStorage.getItem("access_token_landlord")) {
      return true;
    }
    return false;
  }
  logOut() {
    const refreshToken = localStorage.getItem('refresh-token_landlord');
    if (!refreshToken || refreshToken === undefined + '' || this.validToken() === false) {
      this.clearLocalStorageLandlord();
      return of(null);
    }
    return this.http
      .post(`${this.apiUrl}/logoutlogoutlandlord`, {})
      .pipe(
        finalize(() => {
          this.clearLocalStorageLandlord();
          this.stopTokenTimer();
      })
      );
  }
  logOutLandlord() {
    const refreshToken = localStorage.getItem('refresh-token_landlord');
    if (!refreshToken || refreshToken === undefined + '' || this.validToken() === false) {
      this.clearLocalStorageLandlord();
      return of(null);
    }
    return this.http
      .post(`${this.apiUrl}/logoutLandlord`, {})
      .pipe(
        finalize(() => {
          this.clearLocalStorageLandlord();
          this.stopTokenTimer();
      })
      );
  }
  getMenus(lang) {
    return this.http.get<any>(`${this.base}SysMenu/getMenus?lang=${lang}`, {});
  }
  getPermissions(accountGuid, lang) {
    return this.http.get<any>(`${this.base}XAccount/getPermissions?accountGuid=${accountGuid}&lang=${lang}`, {});
  }
  getLanguages(lang) {
    const isAdminLang = JSON.parse(localStorage.getItem('user'))?.groupCode === 'ADMIN_LANGUAGE';
    if (isAdminLang) {
      return of({});
    }
    return this.http.get<any>(`${this.base}SystemLanguage/getLanguages?lang=${lang}`, {});
  }
  forgotPassword(email) {
    return this.http.get<any>(`${this.base}Auth/ForgotPassword?email=${email}`, {});
  }
  forgotUsername(data) {
    return this.http.post<any>(`${this.base}Auth/forgotUsername`, data);
  }
  resetPassword(data) {
    return this.http.post<any>(`${this.base}Auth/ResetPassword`, data);
  }
}
