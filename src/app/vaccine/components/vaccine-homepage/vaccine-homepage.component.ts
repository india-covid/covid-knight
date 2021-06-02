import { User } from './../../../core/models/user.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private router: Router) {
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
}
