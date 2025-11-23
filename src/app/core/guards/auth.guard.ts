import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  private readonly PUBLIC_ROUTES = [
    '/home',
    '/products',
    '/auth/login',
    '/auth/register',
    '/auth/verify-email',
    '/auth/reset-password',
    '/auth/forgot-password',
    '/auth/resend-verification',
    '/auth/verify'
  ];

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const cleanUrl = state.url.split('?')[0];

    console.log('🔍 Guard - URL demandée:', state.url);
    console.log('🔍 Guard - Clean URL:', cleanUrl);
    console.log('🔍 Guard - isAuthenticated:', this.auth.isAuthenticated());


    if (this.isPublicRoute(cleanUrl)) {
      console.log('✅ Route publique, accès autorisé');
      return true;
    }


    if (this.auth.isAuthenticated()) {
      console.log('✅ Utilisateur authentifié, accès autorisé');
      return true;
    }


    console.log('❌ Non authentifié, redirection vers login');
    return this.router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
  }


  private isPublicRoute(url: string): boolean {
    return this.PUBLIC_ROUTES.some(route => url.startsWith(route));
  }
}
