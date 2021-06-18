import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vaccine-faq',
  templateUrl: './vaccine-faq.component.html',
  styleUrls: ['./vaccine-faq.component.scss'],
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
          'We do not collect any other information other than WhatsApp number. Phone numbers are automatically deleted after the notification subscription expires. We do not run any kind of ads. You can support us by donating,',
      },
      {
        question: 'Can I Stop the notifications?',
        answer:
          'Yes, you can stop the notification anytime by visiting this website',
      },
      {
        question: 'Can I check vaccine availability on this website?',
        answer:
          'Yes, you can check Vaccine availability on this website for the entire India. Data is synced real time with Cowin. We use Cowin’s public API.',
      },
      {
        question: 'Can I book vaccine from this website?',
        answer:
          'No, Currently we only send notifications and show availability. Please visit Cowin to book appointments.',
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
