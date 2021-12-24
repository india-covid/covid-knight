
import { AlertService } from './../../services/alert.service';
import { User } from './../../../core/models/user.model';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { VaccineRestService } from '../../services/vaccine-rest.service';
import { transition, trigger, useAnimation } from '@angular/animations';
import { enterAnimationLeft, enterAnimationRight } from 'src/app/core/animations/pageAnimation';
import { switchMap, take } from 'rxjs/operators';
import { LocalStorageService } from '../../../core/localstorage.service';

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
  @ViewChild('infoWrapper') infoWrapper:ElementRef|null=null;
  @ViewChild('homepage') homepage:ElementRef|null=null;

  showScrollToTop:boolean=false;
  _phoneNumber:string|undefined=undefined;
  user:User|null=null;

  private get _ping$() {
    return this.authService
      .ping({ phoneNumber: this._phoneNumber, centers: [] }, 'register')
  }
  constructor(
    private authService: AuthService,
    private vaccineRestService: VaccineRestService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private renderer:Renderer2,
    private alertService:AlertService,
    private storageService:LocalStorageService
    ) {
      this.authService.user$.pipe(take(1)).subscribe((user) => {
        this.user = user;
      });
  //   this.user = this.authService.user$.subscribe((user) => {
  //     if (user && user.phoneNumber) {
  //       this.router.navigate(["/home"])
  //     }
  //     this.spinner.hide();
  //   });
  }


  wizardDone() {
    this.router.navigate(['subscription']);
  }

  ngOnDestroy() {
    // this.user.unsubscribe();
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

async authenticate() {
  if(!this.user?.phoneNumber){
    let result = await this.alertService.enterPhone();
    if(!result.value) {
      return;
    }
    this._phoneNumber = result.value;
    this.registerUser();
    return;
  }

}
registerUser() {
  this.spinner.show();
  // this.subscribing = true;
  this._ping$.pipe(switchMap((p) => this.authService.requestOtp(this._phoneNumber?.toString())), take(1)).subscribe(results => {
    this.saveCurrentResults(this._phoneNumber,{});
  });
}

private saveCurrentResults(phoneNumber: string = '', naviagationExtras: NavigationExtras) {
  this.storageService.set('subscription', {time: new Date().getTime() / 1000, phoneNumber,  centers: []});
  this.spinner.hide();
  this.router.navigate(['/subscription'], {queryParams:naviagationExtras});
}


}
