import { Subscriptions } from './../../models/subscriptions';
import { SubscriptionService } from './../../services/subscription.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { District } from 'src/app/vaccine/models/district.model';
import { Observable, of, forkJoin, timer, Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { isNonEmptyArray } from 'src/app/core/utils';
import { Center } from 'src/app/vaccine/models/center.model';
import { VaccineRestService } from 'src/app/vaccine/services/vaccine-rest.service';
import { LocalStorageService } from 'src/app/core/localstorage.service';
import * as DayJs from 'dayjs';
import { ThrowStmt } from '@angular/compiler';
@Component({
  selector: 'app-vaccine-slots',
  templateUrl: './vaccine-slots.component.html',
  styleUrls: ['./vaccine-slots.component.scss'],
})
export class VaccineSlotsComponent implements OnInit {
  queryData: any | null = null;
  centers: Center[] = [];
  centerWithSession: any = [];
  // selectedCenters: Center[] = [];
  private subscription!: Subscriptions;
  dateRange: string[] = [];
  activeDay: number = 0;
  constructor(
    private subscriptionService: SubscriptionService,
    private route: ActivatedRoute,
    private router: Router,
    private vaccineRestService: VaccineRestService,
    private storageService: LocalStorageService
  ) {
    let days = 5;
    const dateMove = new Date();
    let strDate;

    while (days > 0) {
      days--;
      strDate = dateMove.toISOString().slice(0, 10);
      this.dateRange.push(DayJs(strDate).format('DD MMM')); // '25/01/2019'
      dateMove.setDate(dateMove.getDate() + 1);
    }
    console.log(this.dateRange);
    this.getSubscription();
    this.route.queryParams.subscribe((params) => {
      this.queryData = params;
      console.log(params);
      if (params.queryType == 'pin') {
        this.vaccineRestService
          .centersByPinCode(params.pincode)
          .subscribe((centers) => {
            this.centers = centers;
            this.getSessionsByDay(0);
          });
      } else if (params.queryType == 'district') {
        this.vaccineRestService
          .centersByDistrictId(params.districtId)
          .subscribe((centers) => {
            this.centers = centers;
            this.getSessionsByDay(0);
          });
      }

      console.log(this.router.navigated);
    });
  }
  async getSubscription() {
    this.subscription = this.storageService.get('subscription');
  }
  ngOnInit() {
    console.log(this.subscription.centers);
  }
  getSessionsForDay(day: number) {
    console.log(day);
    this.activeDay = day;
    this.getSessionsByDay(day);
  }

  getSessionsByDay(day: number) {
    this.centerWithSession = [];
    console.log(day);
    this.centers.map((center) => {
      this.subscriptionService
        .getDetailedCenterInfo(center, day)
        .subscribe((d) => {
          // console.log(d);
          let data;
          if (
            this.subscription.centers &&
            this.subscription.centers.length > 0 &&
            this.checkIfCenterIsSelected(center)
          ) {
            data = {
              selected: true,
              ssessions: d,
              center: center,
            };
          } else {
            data = {
              selected: false,
              ssessions: d,
              center: center,
            };
          }

          this.centerWithSession.push(data);
          // console.log(this.centerWithSession);
        });
    });
  }
  subscribeCenter(center: Center) {
    if (!this.checkIfCenterIsSelected(center)) {
      // this.selectedCenters=[];
      this.subscription.centers.push(center);
      let index = this.centerWithSession.findIndex(
        (c: any) => c.center.name === center.name
      );
      this.centerWithSession[index].selected = true;

      this.storageService.set('subscription', this.subscription);

      console.log('center is added', this.subscription.centers);
    } else {
      console.log('CENTER IS ALREADY SELECTED');
    }
  }
  UnSubscribeCenter(check_center: Center) {
    let index = this.centerWithSession.findIndex(
      (c: any) => c.center.name === check_center.name
    );
    this.centerWithSession[index].selected = false;
    this.subscription.centers = this.subscription.centers.filter(function (
      center
    ) {
      return check_center.name != center.name;
    });
    this.storageService.set('subscription', this.subscription);
    // console.log(this.subscription.centers);
  }

  checkIfCenterIsSelected(check_center: Center) {
    return this.subscription.centers.some(
      (center) => check_center.name === center.name
    );
  }
}
