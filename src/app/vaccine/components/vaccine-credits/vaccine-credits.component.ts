import { paymentUrl } from './../../../core/data/razorpay.data';
import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition, useAnimation } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { credits } from '../../../core/data/credits.data';
import { enterAnimationLeft, enterAnimationRight } from 'src/app/core/animations/pageAnimation';
@Component({
  selector: 'app-vaccine-credits',
  templateUrl: './vaccine-credits.component.html',
  styleUrls: ['./vaccine-credits.component.scss'],
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
export class VaccineCreditsComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService) { }
  credits = credits;
  paymentUrl = paymentUrl;


  ngOnInit(): void {
    this.spinner.hide();
  }


}
