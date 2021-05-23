import { Component } from '@angular/core';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'covid-frontend';

  constructor(private authService: AuthService) {

  }

  dummyLogin() {
    const authInfo = {phoneNumber: '9620032593', otp: '1111'}
    this.authService.vaccineLoginOrSignup(authInfo).subscribe(console.log)
  }

  dummyGetStatus() {
    this.authService.getStatus().subscribe(console.log);
  }

  dummyLogout() {
    this.authService.logout().subscribe(console.log);
  }


}
