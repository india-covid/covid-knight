import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/core/localstorage.service';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-vaccine-subscribe',
  templateUrl: './vaccine-subscribe.component.html',
  styleUrls: ['./vaccine-subscribe.component.scss']
})
export class VaccineSubscribeComponent implements OnInit {

  constructor(private storageService: LocalStorageService,
    private route: ActivatedRoute,
    private subscriptionService: SubscriptionService,
    private router: Router) { }

  ngOnInit(): void {
    this.subscriptionService.otpSession.pipe(take(1)).subscribe(otp => {
      console.log(otp);
    })

  }

}
