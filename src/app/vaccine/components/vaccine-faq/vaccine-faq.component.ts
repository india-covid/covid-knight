import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-vaccine-faq',
  templateUrl: './vaccine-faq.component.html',
  styleUrls: ['./vaccine-faq.component.scss'],
  animations: [
    trigger('enterAnimationLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('150ms', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
    ]),
    trigger('enterAnimationRight', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('150ms', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),

    ]),

  ],
})
export class VaccineFaqComponent implements OnInit {
  faqs: any = [];
  selectedRowIndex: number = -1;

  constructor() {}

  ngOnInit(): void {
    this.faqs = [
      {
        question: 'What about privacy?',
        answer:
          `We do not collect any other information other than WhatsApp number. Phone numbers are automatically deleted after the notification subscription expires. We do not run any kind of ads. You can support us by <a href="https://vaccine.india-covid.info/#donate" target="_blank">donating</a>.`,
      },
      {
        question: 'Can I Stop the notifications?',
        answer:
          `Yes, you can stop the notification anytime by visiting this website.`,
      },
      {
        question: 'Can I check vaccine availability on this website?',
        answer:
          `Yes, you can check Vaccine availability on this website for the entire India. Data is synced real time with Cowin. We use Cowin’s <a href="https://apisetu.gov.in/public/marketplace/api/cowin" target="_blank">public API</a>.`,
      },
      {
        question: 'Can I book vaccine from this website?',
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
