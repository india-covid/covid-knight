import { Component } from '@angular/core';
import { AuthService } from './core/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { User } from './core/models/user.model';
import { LocalStorageService } from 'src/app/core/localstorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'covid-frontend';
  constructor(   private storageService: LocalStorageService,private spinner: NgxSpinnerService, private router: Router,private authService: AuthService) {
    this.spinner.show();
    this.getAuthStatus();
  }

  dummyLogin() {
    const authInfo = {phoneNumber: '9620032593', otp: '1111'}
    this.authService.vaccineLoginOrSignup(authInfo).subscribe(console.log)
  }

  dummyGetStatus() {
    this.authService.getStatus().subscribe((data)=>{
      console.log(data);
    });
  }

  dummyLogout() {
    this.authService.logout().subscribe(console.log);
  }
  getAuthStatus() {
      this.authService.getStatus().subscribe((userData:User)=>{
        console.log(userData);
        if(userData && userData.phoneNumber){
          this.storageService.set('user',userData);
          this.spinner.hide();
          this.router.navigate(['/']);
        }else{
          console.log('no user data');
        }
      });

  }


}
