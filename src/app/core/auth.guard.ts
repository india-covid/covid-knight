import { AuthService } from 'src/app/core/auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.user$.pipe(map(user => user && Boolean(user.phoneNumber),
      tap(loggedIn => {
        if (loggedIn) {
          return;
        }
        this.authService.clearCreds();
        this.router.navigate(['/']);
      })));
  }
}
