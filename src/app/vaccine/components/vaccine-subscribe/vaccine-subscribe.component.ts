import { SubscribedCenter } from './../../models/subscribedCenter';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import * as DayJs from 'dayjs';
import { NgOtpInputComponent } from 'ng-otp-input/lib/components/ng-otp-input/ng-otp-input.component';
import { of, Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/core/localstorage.service';
import { isNonEmptyArray } from 'src/app/core/utils';
import { Center } from '../../models/center.model';
import { VaccineSession } from '../../models/vaccine-session.model';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthService } from 'src/app/core/auth.service';
import { environment } from '../../../../environments/environment'
import { NgxSpinnerService } from 'ngx-spinner';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-vaccine-subscribe',
  templateUrl: './vaccine-subscribe.component.html',
  styleUrls: ['./vaccine-subscribe.component.scss']
})
export class VaccineSubscribeComponent implements OnInit, OnDestroy {

    authSub:Subscription;
    private navigationExtras!:NavigationExtras;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private router: Router,
    private storageService: LocalStorageService,
    private spinner:NgxSpinnerService
    ) {
      this.authSub = this.authService.user$.subscribe((user) => {
        if (user && user.phoneNumber) {
          this.router.navigate(["/home"])
        }
        this.spinner.hide();
      });


      this.navigationExtras=  { ...this.route.snapshot.queryParams };

    }

  loading = false;
  otpLength = environment.otpLength;
  private subs: Subscription = new Subscription();
  wizardResult: { phoneNumber?: string, countryCode?: string, centers?: Center[], minLeft?: number, secLeft?: number } = {};
  centers: Center[] = [];
  now = DayJs();
  threeDaysFromNow = [new Date(), DayJs().add(1, 'day').toDate(), DayJs().add(2, 'day').toDate()]
  sessionsInfo: { [centerIdDate: string]: VaccineSession } = {};
  isOtpLengthValid = false
  otp: string = ''
  isOtpWrong:boolean =false;
  selectedCenters: Center[] = [];
  subscriptionRequest$ = of();

  @ViewChild('ngOtpInput') ngOtpInputRef: NgOtpInputComponent | null = null;

  ngOnInit(): void {
    const sub = this.subscriptionService.wizardResult.subscribe(wizardRes => {
      this.wizardResult = wizardRes;
      if (wizardRes.expired) {
        sub.unsubscribe();
        this.timeExpired();
        return;
      }
      this.createSubscriptionRequest(this.wizardResult.centers as any);
    });
    this.subs.add(sub);
  }
  createSubscriptionRequest(centers: Center[]) {
    if (isNonEmptyArray(this.centers)) {
      return;
    }
    const centerIds = centers.map(c => c._id);
    this.subscriptionRequest$ = this.subscriptionService.postSubscriptionCenter({ centers: centerIds });
  }

  sessionInfo(center: Center) {
    return this.subscriptionService.getDetailedCenterInfo(center,0);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private timeExpired() {
    this.router.navigate(['/']);
  }

  onOtpChange(otp: string) {
    if (otp.length !== this.otpLength) {
      this.isOtpLengthValid = false;
      return;
    }
    this.isOtpLengthValid = true
    this.otp = otp
    // this.ngOtpInputRef?.otpForm.disable();
  }

  signUpUser() {
    if (!this.isOtpLengthValid) {
      return;
    }
    this.spinner.show();
    this.loading = true;

    this.authService.vaccineLoginOrSignup({
      otp: this.otp,
      phoneNumber: this.wizardResult.phoneNumber as string,
    }).pipe(switchMap(() => this.subscriptionRequest$)).subscribe(res => {
      this.subscriptionService.getSubscriptionCenters();
      this.spinner.hide();
      this.isOtpWrong=false;
      this.storageService.delete('subscription');
      this.router.navigate(['home']);
     // this.router.navigate(["slots"],{queryParams:this.navigationExtras});
    }, err => {
      this.spinner.hide();
      this.isOtpWrong=true;
      this.loading = false;
      this.isOtpLengthValid = false;
      this.ngOtpInputRef?.otpForm.enable();
      this.ngOtpInputRef?.setValue('');
    });

  }

}
