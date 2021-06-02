import { environment } from './../../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { SubscribedCenter } from './../../models/subscribedCenter';
import { SubscriptionService } from './../../services/subscription.service';
import { AuthService } from 'src/app/core/auth.service';
import { Component, OnInit,Renderer2 ,ViewChild,ElementRef,TemplateRef} from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { User } from 'src/app/core/models/user.model';
import { take } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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
  isSubscriptionLoaded:boolean = false;
  readonly MAXSUBSCRIPTION= environment.maxSubscription;
  @ViewChild('authHomeBody') authHomeBody:ElementRef|null=null;
  @ViewChild('limitReachedTemplate') limitReachedTemplate!:TemplateRef<any>;


  modalRef!: BsModalRef;
  modalConfig = {
    backdrop: true,
    ignoreBackdropClick: false
  };
  constructor(private authService: AuthService,
    private router: Router,
    private modalService: BsModalService,
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
      this.isSubscriptionLoaded=true;
      this.subscribedCenters = data;
    });
  }

  addCenter(){
    if(!this.isSubscriptionLoaded){
      return ;
    }
    if(this.MAXSUBSCRIPTION === this.subscribedCenters.length){
      this.openLimitReachedModal(this.limitReachedTemplate);
      return;
    }
    this.router.navigate(['/add-subscription']);
  }
  openLimitReachedModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template,Object.assign({}, { class: 'limitReachedModal' }));
  }


   //set height dynamically

  //  setHeight(){
  //   this.renderer.setStyle(this.authHomeBody?.nativeElement, 'height', (window.innerHeight-50)+"px");
  // }

  // ngAfterViewInit() {
  //  this.setHeight();
  // }
}
