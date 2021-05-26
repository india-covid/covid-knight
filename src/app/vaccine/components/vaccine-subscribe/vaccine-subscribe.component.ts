import { Route } from '@angular/compiler/src/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as DayJs from 'dayjs';
import { forkJoin, Subscription } from 'rxjs';
import { mergeAll, take } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/core/localstorage.service';
import { isNonEmptyArray } from 'src/app/core/utils';
import { Center, CenterWithSessions } from '../../models/center.model';
import { VaccineSession } from '../../models/vaccine-session.model';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-vaccine-subscribe',
  templateUrl: './vaccine-subscribe.component.html',
  styleUrls: ['./vaccine-subscribe.component.scss']
})
export class VaccineSubscribeComponent implements OnInit, OnDestroy {

  constructor(private storageService: LocalStorageService,
    private route: ActivatedRoute,
    private subscriptionService: SubscriptionService,
    private router: Router) { }

  private subs: Subscription = new Subscription();
  wizardResult: {phoneNumber?: string, countryCode?: string, centers?: Center[], minLeft?: number, secLeft?: number}= {};
  centers: CenterWithSessions[] = [];
  now = DayJs();
  threeDaysFromNow = [new Date(), DayJs().add(1, 'day').toDate(), DayJs().add(2, 'day').toDate()]
  sessionsInfo: {[centerIdDate: string]: VaccineSession} = {};


  ngOnInit(): void {
    const sub = this.subscriptionService.wizardResult.subscribe(wizardRes => {
      this.wizardResult = wizardRes;
      if(wizardRes.expired) {
        sub.unsubscribe();
        this.timeExpired();
        return;
      }
      this.init(this.wizardResult.centers as any);
    });
    this.subs.add(sub);
  }
  init(centers: Center[]) {
    if(isNonEmptyArray(this.centers)) {
      return;
    }

  }

  sessionInfo(center: Center) {
    return this.subscriptionService.getDetailedCenterInfo(center);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private timeExpired() {
    this.router.navigate(['/']);
  }

  onOtpChange(otp: any) {
    console.log(otp)
  }

}
