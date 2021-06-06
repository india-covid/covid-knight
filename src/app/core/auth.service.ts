import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { UserRegisterLogin } from './models/auth.model';
import { User } from './models/user.model';
import { catchError, map, filter } from 'rxjs/operators';
import { BehaviorSubject, of } from "rxjs";
import { CookieService } from 'ngx-cookie';
import { NgxSpinnerService } from "ngx-spinner";
import { LocalStorageService } from 'src/app/core/localstorage.service';
import * as DayJs from 'dayjs'
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authMainLoginUrl = '/auth'
  private _userSubject = new BehaviorSubject<User | null>(null);

  constructor(private router: Router,
    private storageService: LocalStorageService,
    private spinner: NgxSpinnerService,
    private httpClient: HttpClient,
    private cookieService: CookieService) {
    this._getStatus();
  }

  public get user$() {
    return this._userSubject.asObservable().pipe(filter(user => Boolean(user)));
  }

 private _getStatus() {
    const url = environment.apiBase + '/auth/status';
    return this.httpClient.get<User>(url).subscribe(user => {
      this._userSubject.next(user);
    });
  }

  logout() {
    const url = environment.apiBase + '/auth/logout';
    return this.httpClient.post(url, undefined, { responseType: 'text' }).pipe(tap(() => {
      this._userSubject.next(null);
      this.clearCreds();
    }))
  }

  clearCreds() {
    this.cookieService.remove('Authorization');
    this.storageService.delete("User");
  }

  vaccineLoginOrSignup(authInfo: UserRegisterLogin) {
    if (!authInfo.phoneNumber || !authInfo.otp) {
      throw new Error('Missing fields');
    }
    authInfo.phoneNumber = String(authInfo.phoneNumber);
    authInfo.otp = btoa(authInfo.otp);
    const url = environment.apiBase + this.authMainLoginUrl;

    return this.httpClient.post<any>(url, authInfo).pipe(tap(body => {
      const { token, ...user } = body;
      if (token?.token) {
        const expireDate = DayJs().add(token.expiresIn, 'seconds')
        this.cookieService.put('Authorization', token.token, { expires: expireDate.toDate().toUTCString(), sameSite: true, secure: true  });
      }
      this._userSubject.next(user);
    }));
  }


  ping(pingInfo: any, event: string) {
    if (!environment.production) {
      // return of(true);
    }
    const url = environment.apiBase + '/users/ping';
    const now = DayJs();
    pingInfo = { ...pingInfo, event, time: now.toISOString() }
    const message = btoa(JSON.stringify(pingInfo));
    return this.httpClient.post<any>(url, { message });
  }

  requestOtp(phoneNumber?: string) {
    if (!phoneNumber) {
      return of(null);
    }
    phoneNumber = String(phoneNumber);
    const url = environment.apiBase + `${this.authMainLoginUrl}` + '/otp/request';
    return this.httpClient.post<any>(url, { phoneNumber, production: environment.production }); // pass countryCode if not india
  }

}
