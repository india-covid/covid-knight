import { paymentUrl } from './../../../core/data/razorpay.data';
import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition, useAnimation } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { enterAnimationLeft, enterAnimationRight } from 'src/app/core/animations/pageAnimation';

@Component({
  selector: 'app-vaccine-faq',
  templateUrl: './vaccine-faq.component.html',
  styleUrls: ['./vaccine-faq.component.scss'],
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
export class VaccineFaqComponent implements OnInit {
  faqs: any = [];
  selectedRowIndex: number = -1;
  paymentUrl=paymentUrl;
  constructor(private spinner:NgxSpinnerService) {
    this.spinner.hide();
  }

  ngOnInit(): void {
    this.faqs = [
      {
        question: 'What about privacy?',
        answer:
          `We do not collect any information other than WhatsApp number. Phone numbers are automatically deleted after the notification subscriptions expire. We do not run any kind of ads. You can support us by <a href="${paymentUrl}" target="_blank">donating</a>.`,
      },
      {
        question: 'Why should I use Covid Knight?',
        answer:
          `Covid Knight is blazing fast hybrid app, it's built for low end devices. We also send WhatsApp notifications.`,
      },
      {
        question: 'How do I subscribe to WhatsApp notifications?',
        answer:
          'Click on add centers, select your area, select all the the centers you want to subscribe to and click subscribe.',
      },
      {
        question: 'Can I Stop the notifications?',
        answer:
          `Yes, you can stop the notification anytime by visiting this website/app.`,
      },
      {
        question: 'Can I check vaccine availability on this website/app?',
        answer:
          `Yes, you can check Vaccine availability on this website/app for the entire India. Data is synced real time with Cowin. We use Cowin’s <a href="https://apisetu.gov.in/public/marketplace/api/cowin" target="_blank">public API</a>.`,
      },
      {
        question: 'Can I book vaccine from this website/app?',
        answer:
          'No, Currently we only send notifications and show availability. Please visit <a href="https://www.cowin.gov.in/" target="_blank">Co-WIN</a> to book appointments.',
      },
    ];
  }

  onQuestionClick(i: number) {
    if (this.selectedRowIndex === i) {
      this.selectedRowIndex = -1;
    } else {
      this.selectedRowIndex = i;
    }
  }
}
