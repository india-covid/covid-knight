import { Route } from '@angular/compiler/src/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/core/localstorage.service';
import { Center } from '../../models/center.model';
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
  ngOnInit(): void {
    const sub = this.subscriptionService.wizardResult.subscribe(wizardRes => {
      this.wizardResult = wizardRes;
      if(wizardRes.expired) {
        sub.unsubscribe();
        this.timeExpired();
      }
    });
    this.subs.add(sub);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private timeExpired() {
    this.router.navigate(['/']);
  }

}
