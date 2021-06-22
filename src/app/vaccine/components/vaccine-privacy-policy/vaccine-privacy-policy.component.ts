import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-vaccine-privacy-policy',
  templateUrl: './vaccine-privacy-policy.component.html',
  styleUrls: ['./vaccine-privacy-policy.component.scss'],
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
export class VaccinePrivacyPolicyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
