import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
     ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // const token = localStorage.getItem('token');
        // const refreshtoken = localStorage.getItem('refresh-token');
        // if(token === null || refreshtoken === null) {
        //     this.router.navigate(['login']);
        //   }
        const pathname = document.location.pathname;
        if (pathname.indexOf('mobile') !== -1) {
            const table = localStorage.getItem('table')
            const token_login = localStorage.getItem('token');
            const token = localStorage.getItem('token_landlord');
            if (token && token !== 'undefined') {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            if(token_login === null ) {
                this.router.navigate(['home']);
            }
        } else {
            const token = localStorage.getItem('token');
            if (token && token !== 'undefined') {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
        }
       
        return next.handle(request);
    }
}
