import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  private currentUser$ = new BehaviorSubject<User | null>(null);

  setCurrentUser(user: User): void {
    this.currentUser$.next(user);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  getCurrentUserSnapshot(): User | null {
    return this.currentUser$.value;
  }

  clear(): void {
    this.currentUser$.next(null);
  }
}
