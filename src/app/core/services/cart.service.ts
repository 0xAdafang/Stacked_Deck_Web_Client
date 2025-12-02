import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';


export interface CartItem {
  id: string;
  product: any;
  quantity: number;
  subtotal: number;
  savedForLater: boolean;
}

export interface Cart {
  id: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: string;
}

@Injectable ({
  providedIn : 'root'
})

export class CartService {
  private apiUrl = `${environment.apiUrl}/api/cart`;

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor (private http: HttpClient, private auth: AuthService) {
    this.refreshCart();
  }


  private getUserId(): string {
      // TODO: Connecter au vrai user ID de l'auth
      return 'c1c7c534-e519-431c-9b7d-e69c63a29e19'; // UUID Mock temporaire
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}?userId=${this.getUserId()}`).pipe(
      tap(cart => this.cartCountSubject.next(Number(cart.totalItems)))
    );
  }


  addToCart(sku: string, quantity: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add?userId=${this.getUserId()}`, { sku, quantity }).pipe(
      tap(() => this.refreshCart())
    );
  }

  updateQuantity(itemId: string, quantity: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/item/${itemId}?userId=${this.getUserId()}&quantity=${quantity}`, {}).pipe(
      tap(() => this.refreshCart())
    );
  }

  toggleSavedForLater(itemId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/item/${itemId}/toggle-save?userId=${this.getUserId()}`, {}).pipe(
      tap(() => this.refreshCart())
    );
  }

  removeItem(itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/item/${itemId}?userId=${this.getUserId()}`).pipe(
      tap(() => this.refreshCart())
    );
  }

  refreshCart(): void {
    this.getCart().subscribe();
  }
}
