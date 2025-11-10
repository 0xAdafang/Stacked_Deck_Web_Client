import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const publicRoutes = ['/auth/login', '/auth/register', '/auth/verify'];

    const cleanUrl = state.url.split('?')[0];


    if (publicRoutes.indexOf(cleanUrl) !== -1) {
      return true;
    }

    if (this.auth.isAuthenticated()) {
      return true;
    }

    return this.router.createUrlTree(['/auth/login'], {
      queryParams: {returnUrl: state.url}
    });
  }
}
