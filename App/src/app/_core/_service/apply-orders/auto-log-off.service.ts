import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AlertifyService } from "herr-core";
import { CookieService } from "ngx-cookie-service";
import { BehaviorSubject, interval, Observable, ReplaySubject, Subject, Subscription, timer } from "rxjs";
import { AuthService } from "../auth.service";
import { environment } from "src/environments/environment";

import {
    DataManager,
    Query,
    UrlAdaptor,
    Predicate,
  } from "@syncfusion/ej2-data";
import { map, takeUntil, tap } from "rxjs/operators";

  
@Injectable({
    providedIn: 'root'
  })
  export class AutoLogoutService {
  
    //log off details
    isLogin = false;
    clock: Subscription = new Subscription();
    downTimeSubscription: Subscription = new Subscription();
    mins = 0;
    downTimeSource = new Subject<string>();
    currentDownTime = this.downTimeSource.asObservable();

    private reset$ = new Subject();
    timer$: Observable<any>;
    subscription: Subscription;

    changeDownTime(time) {
      this.downTimeSource.next(time);
    }
    constructor(
        private router: Router,
        private ngZone: NgZone,
        private authService: AuthService,
        private cookieService: CookieService,
        private trans: TranslateService,
        private alertify: AlertifyService,
        
    ) {
      if(this.isUserLoggedIn()){
        this.isLogin=true;
      }
      this.loadConfig(() => {
        this.changeDownTime("INIT")
        this.lastAction(Date.now());
        this.check();
        this.initListener();
        this.initInterval();
      });
    
    }

    /**
     * last action
     */
    getLastAction() {
      return localStorage.getItem('lastAction');
    }
  
    /**
     * set last action
     * @param value
     */
    lastAction(value) {
      localStorage.setItem('lastAction', JSON.stringify(value))
    }
  
    /**
     * start event listener
     */
    initListener() {
      this.ngZone.runOutsideAngular(() => {
        document.body.addEventListener('click', () => this.reset());
      });
    }
  
    /**
     * time interval
     */
    initInterval() {
      this.ngZone.runOutsideAngular(() => {
      this.clock.add(interval(1000).subscribe(val => {
        this.check();
      }));
     })
    }
  
    /**
     * reset timer
     */
    reset() {
      this.lastAction(Date.now());
      this.changeDownTime("RESET")
    }
  
    /**
     * check timer
     */
    check() {
        const now = Date.now();
        const timeLeft = parseInt(this.getLastAction()) + (this.mins === 0 ? 60 : this.mins) * 60 * 1000;
        const diff = timeLeft - now;
        const isTimeout = diff < 0;
       
      this.ngZone.run(() => {

        if (isTimeout && this.isLogin) {
            this.authService.logOut().subscribe(() => {
                const uri = this.router.url;
                this.cookieService.deleteAll("/");
                this.router.navigate(["login"], {
                  queryParams: { uri },
                  replaceUrl: true,
                });
                this.alertify.errorBackToLogin(this.trans.instant("Session Expired"), this.trans.instant("ok"), () => {
               
                })
              });
          

        }
      });
    }
    getTimer () {
      let distance =  ((this.mins / 60) * 60 * 60 * 1000) - 1000;
      return timer(0, 1000).pipe(
        takeUntil(timer(distance)),
        map(() => {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          distance -= 1000;
          return `${days ? days + 'd' : ''} ${hours ? hours + 'h' : ''} ${minutes ? minutes + '' : ''}:${seconds ? seconds + '' : ''}`;
        })
      );
    };
    /**
     *check if a user is logged in
     */
    isUserLoggedIn():string{
      return localStorage.getItem('user');
    }

    loadConfig(callBack) {
        let query = new Query();
        query.where("type", "equal", "AutoLogOut");
        query.where("no", "equal", "minutes");
    
        const accessToken = localStorage.getItem("token");
        new DataManager({
          url: `${environment.apiUrl}SystemConfig/GetDataDropdownlist`,
          adaptor: new UrlAdaptor(),
          headers: [{ authorization: `Bearer ${accessToken}` }],
        })
          .executeQuery(query)
          .then((x: any) => {
            const configData = x.result;
            if (configData.length > 0) {
                const min = +configData[0].value;
                this.mins = min === 0 || min === NaN ? 60 : min;
            } else {
              this.mins = 60;
            }
            callBack()
          }).catch(x=> {
            this.mins = 60;
            callBack()
          });
      }
  }