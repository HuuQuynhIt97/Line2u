import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
    constructor( ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const pathname = document.location.pathname;
        if (pathname.indexOf('mobile') !== -1) {
            const token = localStorage.getItem('token_landlord');
            if (token && token !== 'undefined') {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
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
