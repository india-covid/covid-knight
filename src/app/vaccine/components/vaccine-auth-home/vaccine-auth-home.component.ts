import { AuthService } from 'src/app/core/auth.service';
import { Component, OnInit, } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { User } from 'src/app/core/models/user.model';
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
  constructor(private authService:AuthService) {
    this.user = this.authService.getCurrentUser();
   }
  ngOnInit() {
  }

  logout(){
    this.authService.logout().subscribe(console.log);
    console.log("LOGOUT");
  }

}
