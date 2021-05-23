// import { Injectable } from '@angular/core';
// import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor(
//     private router: Router,
//   ) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//   ): Observable<boolean> | Promise<boolean> | boolean {
//     // return this.authFacade.sessionIsSet$.pipe(
//     //   filter(Boolean),
//     //   first(),
//     //   withLatestFrom(this.authFacade.isLoggedIn$),
//     //   map(([sessionIsSet, isAuthenticated]) => {
//     //     if (!isAuthenticated) {
//     //       this.router.navigate(['/auth/login']);
//     //       return false;
//     //     }
//     //     return true;
//     //   }),
//     // );
//   }
// }
