import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
import { CookieService } from 'ngx-cookie';
export const alwaysAbsoluteUrls = ['/auth/api/access-token', '/auth/api/login'];

@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     let sendReq = req;
     if(req.url.includes(environment.apiUrl)) {
        const jwt = this.cookieService.get('Authorization');
        if(!jwt) return next.handle(sendReq);
        sendReq = req.clone({headers: req.headers.set('authorization', `Bearer ${jwt}`)});
     }
     return next.handle(sendReq)
  }

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     let jwt: string;
//     if(!req.url.includes(environment.apiUrl) || !(jwt = this.cookieService.get('Authorization'))) {
//       return next.handle(req)
//     }
//     console.log(jwt)
//     const headers = req.headers.set('authorization', jwt)
//     req = req.clone({headers});
//     return next.handle(req)
//  }

}
