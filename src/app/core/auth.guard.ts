import { AuthService } from 'src/app/core/auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs'
import { map, tap, takeLast, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.user$.pipe(map(user => {
      if(!user || !user.phoneNumber) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }));
  }
}
