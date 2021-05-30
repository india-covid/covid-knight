import { AuthService } from 'src/app/core/auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService:AuthService,

  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {

    const user = this.authService.getCurrentUser();
    if(user && user.phoneNumber){
      return true;
    }else{
      console.log("NOT AUTHETICATED, Redirecting to default")
      this.router.navigate(['/']);
      return false;
    }
  }
}
