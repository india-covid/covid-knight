import { SubscribedCenter } from './../../models/subscribedCenter';
import { SubscriptionService } from './../../services/subscription.service';
import { AuthService } from 'src/app/core/auth.service';
import { Component, OnInit, } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { User } from 'src/app/core/models/user.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-vaccine-auth-home',
  templateUrl: './vaccine-auth-home.component.html',
  styleUrls: ['./vaccine-auth-home.component.scss'],
  animations: [
    trigger(
      'enterAnimationLeft', [
        transition(':enter', [
          style({transform: 'translateX(-100%)', opacity: 0}),
          animate('150ms', style({transform: 'translateX(0)', opacity: 1}))
        ])
      ]
    ),
    trigger(
      'enterAnimationRight', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('150ms', style({transform: 'translateX(0)', opacity: 1}))
        ])
      ]
    )
  ],

})
export class VaccineAuthHomeComponent implements OnInit {
  user:User;
  subscribedCenters:SubscribedCenter[]=[];

  constructor(private authService:AuthService,
    private router: Router,
    private subscriptionService:SubscriptionService) {
    this.user = this.authService.getCurrentUser();
    this.getSubscribedCenters();
   }
  ngOnInit() {
  }

  logout(){
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  getSubscribedCenters() {
    this.subscriptionService.getSubscriptionCenters().subscribe((data) => {
      this.subscribedCenters = data;
    });
  }
}
