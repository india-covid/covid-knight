
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {  tap } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { UserRegisterLogin } from './models/auth.model';
import { User } from './models/user.model';
import { CookieService } from 'ngx-cookie';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authMainLoginUrl = '/auth'
  private _userSubject = new ReplaySubject<User>();

  constructor(private httpClient: HttpClient, private cookieService: CookieService) {
    this._userSubject = new ReplaySubject<User>();
  }

  public get user$() {
    return this._userSubject.asObservable();
  }

  getStatus() {
    const url = environment.apiUrl + '/auth/status';
    return this.httpClient.get<User>(url).pipe(tap(user => {
      this._userSubject.next(user);
    }));
  }

  vaccineLoginOrSignup(authInfo: UserRegisterLogin) {
    if(!authInfo.phoneNumber || !authInfo.otp) {
      throw new Error('Missing fields');
    }
    authInfo.otp = btoa('' + authInfo.otp);
    const url = environment.apiUrl + this.authMainLoginUrl;
    return this.httpClient.post<any>(url, authInfo).pipe(tap(body => {
      const { token, ...others } = body;
      if(token?.token) {
        this.cookieService.put('Authorization', token.token, {expires: token.expiresIn + '' });
      }
      this._userSubject.next(others);
    }));
  }

}
