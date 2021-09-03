import { AlertService } from './../../services/alert.service';
import { User } from './../../../core/models/user.model';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { VaccineRestService } from '../../services/vaccine-rest.service';
import { transition, trigger, useAnimation } from '@angular/animations';
import { enterAnimationLeft, enterAnimationRight } from 'src/app/core/animations/pageAnimation';

@Component({
  selector: 'app-vaccine-homepage',
  templateUrl: './vaccine-homepage.component.html',
  styleUrls: ['./vaccine-homepage.component.scss'],
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
export class VaccineHomepageComponent implements  OnDestroy {
  authSub: Subscription;
  @ViewChild('infoWrapper') infoWrapper:ElementRef|null=null;
  @ViewChild('homepage') homepage:ElementRef|null=null;

  showScrollToTop:boolean=false;
  constructor(
    private authService: AuthService,
    private vaccineRestService: VaccineRestService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private renderer:Renderer2,
    private alertService:AlertService) {
    this.authSub = this.authService.user$.subscribe((user) => {
      if (user && user.phoneNumber) {
        this.router.navigate(["/home"])
      }
      this.spinner.hide();
    });
  }


  wizardDone() {
    this.router.navigate(['subscription']);
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

  onScroll(e:any): void {
    let topOffset = e.target.scrollTop;
    if(topOffset>550){
      this.showScrollToTop = true;
    }else{
      this.showScrollToTop = false;
    }
}

scrollToTop():void{
  let el = this.homepage?.nativeElement;
  el.scrollTo(0,0);
}
}
