import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { SubscribedCenter } from './../../models/subscribedCenter';
import { SubscriptionService } from './../../services/subscription.service';
import { AuthService } from 'src/app/core/auth.service';
import { Component, OnInit,Renderer2 ,ViewChild,ElementRef} from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { User } from 'src/app/core/models/user.model';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-vaccine-auth-home',
  templateUrl: './vaccine-auth-home.component.html',
  styleUrls: ['./vaccine-auth-home.component.scss'],
  animations: [
    trigger(
      'enterAnimationLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('150ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]
    ),
    trigger(
      'enterAnimationRight', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('150ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]
    )
  ],

})
export class VaccineAuthHomeComponent implements OnInit {
  user: User | null = null;
  subscribedCenters: SubscribedCenter[] = [];
  @ViewChild('authHomeBody') authHomeBody:ElementRef|null=null;

  constructor(private authService: AuthService,
    private router: Router,
    private renderer:Renderer2,
    private subscriptionService: SubscriptionService,private spinner:NgxSpinnerService) {
    this.getSubscribedCenters();
    this.authService.user$.pipe(take(1)).subscribe(user => {
      this.user = user;
    })


  }
  ngOnInit() {
  }

  logout() {
    this.spinner.show();
    this.authService.logout().subscribe(() => {
      this.spinner.hide();
      this.router.navigate(['/']);
    });
  }

  getSubscribedCenters() {
    this.subscriptionService.getSubscriptionCenters().subscribe((data) => {
      this.spinner.hide();
      this.subscribedCenters = data;
    });
  }


   //set height dynamically

   setHeight(){
    this.renderer.setStyle(this.authHomeBody?.nativeElement, 'height', (window.innerHeight-50)+"px");
    console.log(this.authHomeBody?.nativeElement,window.innerHeight);
  }

  ngAfterViewInit() {
   this.setHeight();
  }
}
