import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition, useAnimation } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { enterAnimationLeft, enterAnimationRight } from 'src/app/core/animations/pageAnimation';

@Component({
  selector: 'app-vaccine-privacy-policy',
  templateUrl: './vaccine-privacy-policy.component.html',
  styleUrls: ['./vaccine-privacy-policy.component.scss'],
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
export class VaccinePrivacyPolicyComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.hide();
  }

}
