import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;


  private readonly PUBLIC_ENDPOINTS = [
    '/api/public/',
    '/api/auth/',
    '/api/catalog/'
  ];

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('🔧 Interceptor - URL:', req.url);


    if (this.isPublicEndpoint(req.url)) {
      return next.handle(req);
    }


    const token = this.auth.getToken();


    if (token) {
      console.log('🔑 Token TROUVÉ. Injection dans le header Authorization.');
    } else {
      console.warn('cX ALERTE ROUGE : Route privée demandée MAIS aucun token trouvé dans le stockage !');
    }


    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('❌ Erreur HTTP retournée par le backend:', err.status);
        if (err.status === 401 && !this.isRefreshing && !this.isPublicEndpoint(req.url)) {
          this.isRefreshing = true;

          return this.auth.refresh().pipe(
            switchMap((newToken) => {
              this.isRefreshing = false;

              if (!newToken) {
                this.auth.logout();
                return throwError(() => err);
              }

              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });

              return next.handle(retryReq);
            }),
            catchError((refreshError) => {
              this.isRefreshing = false;
              this.auth.logout();
              return throwError(() => refreshError);
            })
          );
        }

        return throwError(() => err);
      })
    );
  }

  private isPublicEndpoint(url: string): boolean {
    return this.PUBLIC_ENDPOINTS.some(endpoint => url.includes(endpoint));
  }
}
