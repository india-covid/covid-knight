import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { credits } from './credits.data';

@Component({
  selector: 'app-vaccine-credits',
  templateUrl: './vaccine-credits.component.html',
  styleUrls: ['./vaccine-credits.component.scss'],
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
export class VaccineCreditsComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService) { }
  credits = credits;


  ngOnInit(): void {
    this.spinner.hide();
  }


}
