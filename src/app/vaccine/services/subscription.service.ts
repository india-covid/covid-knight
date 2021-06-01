import { SubscribedCenter } from './../models/subscribedCenter';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, timer, of, } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/core/localstorage.service';
import * as DayJs from 'dayjs';
import { VaccineRestService } from './vaccine-rest.service';
import { Center } from '../models/center.model';
import { environment } from 'src/environments/environment';
import { Subscriptions } from './../models/subscriptions';
const OTP_EXPIRE_MIN = 5;
@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly vaccineBase = '/vaccine'

  constructor(private http: HttpClient,private storageService: LocalStorageService, private vaccineRestService: VaccineRestService) { }
  private _secondInterval = timer(0, 1000);
  private storageKey = 'subscription';

  get wizardResult() {
    return this._secondInterval.pipe(map(() => {
      const result = this.storageService.get(this.storageKey);
      if (!result) { return; }
      const timeDIff = DayJs.unix(result.time).add(OTP_EXPIRE_MIN, 'minutes').diff(DayJs(), 'seconds');
      const minutes = Math.floor(timeDIff / 60);
      result.secLeft = timeDIff - minutes * 60;
      result.minLeft = Math.floor(timeDIff / 60);
      if (timeDIff <= 0) {
        result.expired = true;
      }
      return result;
    }));
  }

  getDetailedCenterInfo(center: Center,day:number) {
    const sessionRequests = ([day]
      .map(val => DayJs().add(val, 'day')
        .format('DDMMYYYY'))).map(date => this.vaccineRestService
          .getSessionsByCenterId(center._id, date));

    return forkJoin(sessionRequests);
  }


  getSubscriptionCenters(){
    const url = environment.apiBase + `${this.vaccineBase}/subscriptions`;
    return this.http.get<SubscribedCenter[]>(url);
  }
  postSubscriptionCenter(subscription:Subscriptions){
    const url = environment.apiBase + `${this.vaccineBase}/subscriptions`;
    return this.http.post(url,subscription);
  }
  deleteSubscriptionCenter(subscriptionId:string){
    const url = environment.apiBase + `${this.vaccineBase}/subscriptions/subscription/${subscriptionId}`;
    return this.http.delete(url);
  }

}
