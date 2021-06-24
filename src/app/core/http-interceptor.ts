import { PwaService } from 'src/app/core/services/pwa/pwa.service';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
import { CookieService } from 'ngx-cookie';
import { catchError, timeout } from 'rxjs/operators';
import { ConnectionService } from './services/connection/connection.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable()
export class HttpHeaderInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService,private conService:ConnectionService,private spinner:NgxSpinnerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

     let sendReq = req;
     if(req.url.includes(environment.apiBase)) {
        const jwt = this.cookieService.get('Authorization');
        if(!jwt) return next.handle(sendReq).pipe(
          catchError( err => {
            console.log(err);
            if ((err instanceof HttpErrorResponse) && !req.url.includes('last-sync') && !req.url.includes('status') && err.status!=400) {
              this.conService.setOnline(false);
            }
            this.spinner.hide();
            throw err;
          })
         );
        sendReq = req.clone({headers: req.headers.set('authorization', `Bearer ${jwt}`)});
     }
     return next.handle(sendReq).pipe(
      catchError( err => {
        console.log(err);
        if ((err instanceof HttpErrorResponse) && !req.url.includes('last-sync') && !req.url.includes('status') && err.status!=400) {
          this.conService.setOnline(false);
        }
         this.spinner.hide();
        throw err;
      })
     )

  }

}
