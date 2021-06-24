import { SubscribedCenter } from './../../../models/subscribedCenter';
import { SubscriptionService } from './../../../services/subscription.service';
import { Subscriptions } from './../../../models/subscriptions';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { LocalStorageService } from 'src/app/core/localstorage.service';
import * as DayJs from 'dayjs';
import { trigger, style, animate, transition, useAnimation } from '@angular/animations';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Center } from 'src/app/vaccine/models/center.model';
import { filter, take } from 'rxjs/operators';
import { enterAnimationLeft, enterAnimationRight } from 'src/app/core/animations/pageAnimation';

@Component({
  selector: 'app-subscribed-centers',
  templateUrl: './subscribed-centers.component.html',
  styleUrls: ['./subscribed-centers.component.scss'],
  animations: [
    trigger(
      'enterAnimationLeft', [
      transition(':enter', [
        useAnimation(enterAnimationLeft, {
          params: {
            time: '150ms'
          }
        })
      ])
    ]
    ),
    trigger(
      'enterAnimationRight', [
      transition(':enter', [
        useAnimation(enterAnimationRight, {
          params: {
            time: '150ms'
          }
        })
      ])
    ]
    )
  ],
})
export class SubscribedCentersComponent implements OnInit {
  subscribedCenters: SubscribedCenter[] = [];
  isNoCenterSubscribed:boolean=false;
  routeTo:string="";
  constructor(
    private storageService: LocalStorageService,
    private subscriptionService: SubscriptionService,
    private spinner:NgxSpinnerService,
    private route:ActivatedRoute,
    private toastr: ToastrService

  ) {
    this.spinner.show();

      this.subscriptionService.subscribedCenters$.subscribe((subscribedCenters) => {
        this.spinner.hide();
        if(!subscribedCenters){return };


        if(subscribedCenters.length===0){
          this.isNoCenterSubscribed=true;
        }
        this.subscribedCenters = subscribedCenters;
      })

      this.route.queryParams.subscribe((params) => {
        if(params.routeTo){
          this.routeTo = params.routeTo;
        }
      })
  }

  ngOnInit() {}

  unsubscribedCenters:SubscribedCenter[]=[];
  UnSubscribeCenter(subscriptionId: string) {
     let index = this.subscribedCenters.findIndex(
          (center) => center._id === subscriptionId
        );
    this.unsubscribedCenters.push(this.subscribedCenters[index]);
    let center = this.subscribedCenters[index];
    this.subscribedCenters.splice(index, 1);

    this.subscriptionService
      .deleteSubscriptionCenter(subscriptionId)
      .subscribe((data) => {
        this.unsubscribedCenters.shift();
        this.toastr.success(center.center.name, 'Unsubscribed successfully',{
          positionClass: 'toast-bottom-right',
          timeOut:2000
       });
        if(this.subscribedCenters.length===0){
          this.isNoCenterSubscribed=true;
        }

      },(err)=>{
        this.subscribedCenters.push(this.unsubscribedCenters[0]);
        this.unsubscribedCenters.shift();
        this.toastr.error('Can not unsubscribe', 'Please ty again in some time');
      });
  }

  getRemainingTime(to:string) {
    const date1 = DayJs();
    const date2 = DayJs(to);
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
