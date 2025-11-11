import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { UserService } from './user.service';
import { User } from '../models/user.model';

interface LoginPayload {
  identifier: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = '/api/auth';
  private readonly TOKEN_KEY = 'access_token';

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}


  login(payload: LoginPayload) {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload, {
      withCredentials: true
    }).pipe(
      tap(res => {
        this.saveToken(res.accessToken);
        this.userService.setCurrentUser(res.user);
      })
    );
  }


  register(payload: any) {
    return this.http.post<void>(`${this.baseUrl}/register`, payload, {
      withCredentials: true
    });
  }


  forgotPassword(email: string) {
    const params = new HttpParams().set('email', email);
    return this.http.post<void>(`${this.baseUrl}/forgot-password`, null, {
      params,
      withCredentials: true
    });
  }

  resetPassword(token: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/reset-password`, {
      token,
      password
    });
  }


  resendVerification(email: string) {
    return this.http.post<void>(`${this.baseUrl}/resend-verification`, { email }, {
      withCredentials: true
    });
  }

  verifyEmail(token: string) {
    const params = new HttpParams().set('token', token);
    return this.http.get<void>(`${this.baseUrl}/verify`, {
      params,
      withCredentials: true
    });
  }


  refresh(): Observable<string | null> {

    return this.http.post<{ accessToken: string }>(`${this.baseUrl}/refresh`, {}, {
      withCredentials: true
    }).pipe(
      map(res => {
        this.saveToken(res.accessToken);
        return res.accessToken;
      }),
      catchError(() => of(null))
    );

  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.userService.clear();

  }


  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }


  bootstrapFromStorage(): Observable<User | null> {
    const token = this.getToken();
    if (!token) {
      return of(null);
    }

    return of(null);
  }
}
