import { User } from './../../../core/models/user.model';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth.service';
import { VaccineRestService } from '../../services/vaccine-rest.service';
@Component({
  selector: 'app-vaccine-homepage',
  templateUrl: './vaccine-homepage.component.html',
  styleUrls: ['./vaccine-homepage.component.scss']
})
export class VaccineHomepageComponent implements  OnDestroy {

  authSub: Subscription;
  heightVal=0;
  @ViewChild('infoWrapper') infoWrapper:ElementRef|null=null;
  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private renderer:Renderer2) {
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
  resetHeight(){

    this.renderer.setStyle(this.infoWrapper?.nativeElement, 'height', (window.innerHeight-80)+"px");
    console.log(this.infoWrapper?.nativeElement,window.innerHeight);
  }

  ngAfterViewInit() {
    // window.addEventListener("resize", this.resetHeight);
   this.resetHeight();
  }
}
