import { paymentUrl } from './../../../core/data/razorpay.data';
import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition, useAnimation } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { enterAnimationLeft, enterAnimationRight } from 'src/app/core/animations/pageAnimation';

@Component({
  selector: 'app-vaccine-donate',
  templateUrl: './vaccine-donate.component.html',
  styleUrls: ['./vaccine-donate.component.scss'],
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
export class VaccineDonateComponent implements OnInit {
  paymentUrl = paymentUrl;
  constructor(private spinner:NgxSpinnerService) {
    this.spinner.hide();
  }

  ngOnInit() {
  }

}
