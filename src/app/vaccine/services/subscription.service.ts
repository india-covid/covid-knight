import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/core/localstorage.service';
import * as DayJs from 'dayjs';

const OTP_EXPIRE_MIN = 3;
@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private storageService: LocalStorageService) { }
  private _secondInterval = interval(1000);
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

}
