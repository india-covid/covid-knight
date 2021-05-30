import { SubscribedCenter } from './../../../models/subscribedCenter';
import { SubscriptionService } from './../../../services/subscription.service';
import { Subscriptions } from './../../../models/subscriptions';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { LocalStorageService } from 'src/app/core/localstorage.service';
import * as DayJs from 'dayjs';
import { trigger, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-subscribed-centers',
  templateUrl: './subscribed-centers.component.html',
  styleUrls: ['./subscribed-centers.component.scss'],
  animations: [
    trigger(
      'enterAnimationLeft', [
        transition(':enter', [
          style({transform: 'translateX(-100%)', opacity: 0}),
          animate('150ms', style({transform: 'translateX(0)', opacity: 1}))
        ])
      ]
    ),
    trigger(
      'enterAnimationRight', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('150ms', style({transform: 'translateX(0)', opacity: 1}))
        ])
      ]
    )
  ],
})
export class SubscribedCentersComponent implements OnInit {
  subscribedCenters: SubscribedCenter[] = [];
  constructor(
    private storageService: LocalStorageService,
    private subscriptionService: SubscriptionService,
    private spinner:NgxSpinnerService
  ) {
    this.spinner.show();
    this.subscriptionService
      .getSubscriptionCenters()
      .subscribe((subscribedCenters) => {
        console.log(subscribedCenters);
        this.spinner.hide();
        this.subscribedCenters = subscribedCenters;
      });
  }

  ngOnInit() {}

  UnSubscribeCenter(subscriptionId: string) {
     let index = this.subscribedCenters.findIndex(
          (center) => center._id === subscriptionId
        );
    this.subscriptionService
      .deleteSubscriptionCenter(subscriptionId)
      .subscribe((data) => {
        console.log('posted success ', data);

        this.subscribedCenters.splice(index, 1);
      });
  }

  getRemainingTime(t1:string,t2:string) {
    const date1 = DayJs(t1);
    const date2 = DayJs(t2);

    let hours = date2.diff(date1, 'hours');
    const days = Math.floor(hours / 24);
    hours = hours - days * 24;
    if(days!=0){
      return `${days} days, ${hours} hours`
    }else{
      return `${hours} hours`
    }

  }
}
