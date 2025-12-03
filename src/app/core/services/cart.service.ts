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
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  appliedCode?: string;
  totalItems: number;
}

@Injectable ({
  providedIn : 'root'
})

export class CartService {
  private apiUrl = `${environment.apiUrl}/api/cart`;

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor (private http: HttpClient, private auth: AuthService) {}



  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl).pipe(
      tap(cart => this.cartCountSubject.next(cart.totalItems || 0))
    );
  }


  addToCart(sku: string, quantity: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/add`, { sku, quantity }).pipe(
      tap(() => this.refreshCart())
    );
  }

  updateQuantity(itemId: string, quantity: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/item/${itemId}`, null, {
      params: { quantity: quantity.toString() }
    }).pipe(
      tap(() => this.refreshCart())
    );
  }

  toggleSavedForLater(itemId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/item/${itemId}/toggle-save`, {}).pipe(
      tap(() => this.refreshCart())
    );
  }

  removeItem(itemId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/item/${itemId}`).pipe(
      tap(() => this.refreshCart())
    );
  }

  applyPromo(code: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/promo`, { code }).pipe(
      tap(() => this.refreshCart())
    );
  }

  refreshCart(): void {
    this.getCart().subscribe({
      error: () => {
        this.cartCountSubject.next(0);
      }
    });
  }
}
