import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

export interface AuthService {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/api/auth';

  constructor(private http: HttpClient) { }

  login(data: { identifier : string, password: string }):
  Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, data);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  register(payload: { email:string; username:string; password:string; confirmPassword:string }) {
    return this.http.post<void>('/api/auth/register', payload, { withCredentials: true });
  }

  forgotPassword(email: string) {
    const params = new HttpParams().set('email', email);
    return this.http.post<void>('/api/auth.forgot-password', null, { params, withCredentials: true });
  }

  resetPassword(token: string, newPassword: string) {
    const params = new HttpParams()
      .set('token', token)
      .set('newPassword', newPassword);

    return this.http.post<void>(`${this.apiUrl}/reset-password`, null, {
      params,
      withCredentials: true
    });



}
