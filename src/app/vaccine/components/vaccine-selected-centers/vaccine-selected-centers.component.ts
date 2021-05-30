import { NgxSpinnerService } from 'ngx-spinner';
import { SubscribedCenter } from './../../models/subscribedCenter';
import { SubscriptionService } from './../../services/subscription.service';
import { Subscriptions } from './../../models/subscriptions';
import { LocalStorageService } from 'src/app/core/localstorage.service';
import { Component, OnInit } from '@angular/core';
import * as DayJs from 'dayjs';
@Component({
  selector: 'app-vaccine-selected-centers',
  templateUrl: './vaccine-selected-centers.component.html',
  styleUrls: ['./vaccine-selected-centers.component.scss'],
})
export class VaccineSelectedCentersComponent implements OnInit {
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
    this.subscriptionService
      .deleteSubscriptionCenter(subscriptionId)
      .subscribe((data) => {
        console.log('posted success ', data);
        let index = this.subscribedCenters.findIndex(
          (center) => center._id === subscriptionId
        );
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
