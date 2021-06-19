import { AlertService } from './../../services/alert.service';
import { environment } from './../../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { SubscribedCenter } from './../../models/subscribedCenter';
import { SubscriptionService } from './../../services/subscription.service';
import { AuthService } from 'src/app/core/auth.service';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  TemplateRef,
  HostListener,
} from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { User } from 'src/app/core/models/user.model';
import { take } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { VaccineRestService } from '../../services/vaccine-rest.service';



@Component({
  selector: 'app-vaccine-auth-home',
  templateUrl: './vaccine-auth-home.component.html',
  styleUrls: ['./vaccine-auth-home.component.scss'],
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
export class VaccineAuthHomeComponent implements OnInit {
  user: User | null = null;
  subscribedCenters: SubscribedCenter[] = [];
  isSubscriptionLoaded: boolean = false;
  readonly MAXSUBSCRIPTION = environment.maxSubscription;
  @ViewChild('authHomeBody') authHomeBody: ElementRef | null = null;
  @ViewChild('addBtn') addBtn: ElementRef | null = null;


  shareMessage: string =
    `Covid Knight is a website that sends free vaccine alerts on WhatsApp in real-time. You can also check vaccine availability here for all ages and all  types of vaccines. Share it with your friends and family.`;
  readonly shareMessageEncoded =
    'whatsapp://send?text=' + window.encodeURIComponent(this.shareMessage+'https://vaccine.india-covid.info/')


  constructor(
    private authService: AuthService,
    private router: Router,
    private subscriptionService: SubscriptionService,
    private vaccineRestService: VaccineRestService,
    private spinner: NgxSpinnerService,
    private dom: DomSanitizer,
    private alertService:AlertService,
  ) {
    this.getSubscribedCenters();
    this.authService.user$.pipe(take(1)).subscribe((user) => {
      this.user = user;
    });
  }
  ngOnInit() {}

  logout() {
    this.spinner.show();
    this.authService.logout().subscribe(() => {
      this.spinner.hide();
      this.router.navigate(['/']);
    });
  }

  getSubscribedCenters() {

    this.subscriptionService.subscribedCenters$.subscribe((subscribedCenters) => {
      this.isSubscriptionLoaded = true;
      this.spinner.hide();

      this.subscribedCenters = subscribedCenters;
    });

  }

  addCenter() {
    if (!this.isSubscriptionLoaded) {
      return;
    }
    if (this.subscribedCenters.length >= this.MAXSUBSCRIPTION) {
      this.alertService.maxSubReached(this.MAXSUBSCRIPTION,this.subscribedCenters.length);
      return;
    }
    this.router.navigate(['/add-subscription']);
  }


  lastSyncTime() {
    return this.vaccineRestService.lastSyncTime();
  }

  share(){
    if (navigator.share) {
      navigator.share({
        title: 'Covid Knight',
        text: this.shareMessage,
        url: 'https://vaccine.india-covid.info',
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }else{
      window.open(this.shareMessageEncoded);
    }
  }
  ngAfterViewInit(){
    // this.addToHomeScreenInit();
  }

  deferredPrompt: any;
  showButton = false;

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e:any) {
    console.log(e);
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    this.deferredPrompt = e;
    this.showButton = true;
  }

  addToHomeScreen() {
    // hide our user interface that shows our A2HS button
    this.showButton = false;
    // Show the prompt
    this.deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    this.deferredPrompt.userChoice
      .then((choiceResult:any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
      });
  }

}
