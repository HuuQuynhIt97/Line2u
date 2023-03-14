import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationUser, CURDService, OperationResult, UtilitiesService } from 'herr-core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { XuserLine } from '../../_model/evse/XuserLine';

@Injectable({
  providedIn: 'root'
})
export class LineLoginOrNotifyService extends CURDService<XuserLine> {

  baseUrl = environment.apiUrl;
  ModalNameSource = new BehaviorSubject<number>(0);
  currentModalName = this.ModalNameSource.asObservable();
  lang: any;
  userid: any;
  constructor(
    http: HttpClient, 
    utilitiesService: UtilitiesService,
    private cookieService: CookieService
  ) {
    super(environment.apiUrl,http,"Line", utilitiesService);
    this.lang = localStorage.getItem('lang');
   }
  sendFormMessage(model: XuserLine): Observable<OperationResult> {
    for (const key in model) {
      if (Object.prototype.hasOwnProperty.call(model, key)) {
        let item = model[key];
        if (item instanceof Date) {
          model[key] = `${(item as Date).toLocaleDateString()} ${(item as Date).toLocaleTimeString('en-GB')}`
        }
      }
    }
    const userLine = model.listUserLine;
    delete model.listUserLine;
    const params = this.utilitiesService.ToFormData(model);
    if (userLine?.user.length > 0) {
      for (var i = 0; i < userLine?.user.length; i++) {
        params.append('ListUserLine', userLine.user[i]);
      }
    }
    return this.http.post<OperationResult>(`${this.baseUrl}Line/sendFormMessage`, params).pipe(catchError(this.handleError));
  }
  getProfile(accessToken,userID) {
    return this.http
      .get<any>(this.baseUrl + `Line/GetProfile?accessToken=${accessToken}&userID=${userID}`)
      .pipe(
        map(res => {
          const applicationUser = res.data as ApplicationUser;
          if(applicationUser !== null) {
            this.cookieService.set("refreshToken", applicationUser.refreshToken,  {
              expires: 1000 * 60 * 365,
              domain: environment.domain,
              secure: true,
              sameSite:'Strict'
            })
            this.setLocalStorage(applicationUser);
            return applicationUser;
          }else {
            return res;
          }
          // return res;
        })
      );
  }
  getUrlQr(uid){
    return this.http.get(`${this.baseUrl}Line/GetLineQrCodeLink?uid=${uid}`, {});
  }
  getBotInfor(uid){
    return this.http.get(`${this.baseUrl}Line/GetBotInfo?uid=${uid}`, {});
  }
  getAllMessage(officialID , userLineID){
    return this.http.get(`${this.baseUrl}Line/getAllMessage?officialID=${officialID}&userLineID=${userLineID}`, {});
  }
  loginLineAgain(accountID) {
    return this.http
      .get<any>(this.baseUrl + `Line/LoginWithlineAccountAgain?accountID=${accountID}`)
      .pipe(
        map(res => {
          const applicationUser = res.data as ApplicationUser;
          if(applicationUser !== null) {
            this.cookieService.set("refreshToken", applicationUser.refreshToken,  {
              expires: 1000 * 60 * 365,
              domain: environment.domain,
              secure: true,
              sameSite:'Strict'
            })
            this.setLocalStorage(applicationUser);
            return applicationUser;
          }else {
            return res;
          }
          // return res;
        })
      );
  }

  getProfileFake(accessToken) {
    return this.http
      .get<any>(this.baseUrl + `Line/GetProfileFake?accessToken=${accessToken}`)
      .pipe(
        map(res => {
          const applicationUser = res.data as ApplicationUser;
          if(applicationUser !== null) {
            return applicationUser;
          }else {
            return res;
          }
          // return res;
        })
      );
  }
  addMessage(chat) {
    return this.http.post(`${this.baseUrl}Line/AddMessage`, chat);
  }
  setLocalStorage(data: ApplicationUser) {
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    localStorage.setItem('refresh-token', data.refreshToken);
    localStorage.setItem('login-event', 'login' + Math.random());
  }

}
