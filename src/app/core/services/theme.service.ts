import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkSubject = new BehaviorSubject<boolean>(true);
  isDark$ = this.isDarkSubject.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkSubject.next(savedTheme !== 'light');
  }

  toggleTheme(): void {
    const newTheme = !this.isDarkSubject.value;
    this.isDarkSubject.next(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  }

  get isDark(): boolean {
    return this.isDarkSubject.value;
  }
}
