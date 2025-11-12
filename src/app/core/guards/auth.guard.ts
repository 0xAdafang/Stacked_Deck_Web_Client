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
    const cleanUrl = state.url.split('?')[0];

    console.log('🔍 Guard - URL demandée:', state.url);
    console.log('🔍 Guard - Clean URL:', cleanUrl);
    console.log('🔍 Guard - isAuthenticated:', this.auth.isAuthenticated());


    const publicRoutePrefixes = [
      '/auth/login',
      '/auth/register',
      '/auth/verify-email',
      '/auth/reset-password',
      '/auth/forgot-password',
      '/auth/resend-verification',
      '/auth/verify'
    ];
    if (publicRoutePrefixes.some(p => cleanUrl.startsWith(p))) {
      return true;
    }


    if (this.auth.isAuthenticated()) {
      return true;
    }


    return this.router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
  }
}
