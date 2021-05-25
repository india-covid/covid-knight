import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/core/localstorage.service';
import * as DayJs from 'dayjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private storageService: LocalStorageService) {}
  private storageKey = 'subscription';

  get otpSession(){
    return of(this.storageService.get(this.storageKey)).pipe(map(val =>  {
     // console.log('from otp session', val);
      return val;
    }))
  }

}
