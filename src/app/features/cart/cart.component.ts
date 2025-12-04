import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, Cart, CartItem } from '../../core/services/cart.service';
import { ThemeService } from '../../core/services/theme.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Subscription } from 'rxjs';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  isDark = true;
  private themeSub?: Subscription;


  cart?: Cart;
  activeItems: CartItem[] = [];
  savedItems: CartItem[] = [];
  promoCodeInput = '';
  promoError = '';
  loading = true;

  constructor(
    private cartService: CartService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.themeSub = this.themeService.isDark$.subscribe(d => this.isDark = d);
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;

        this.activeItems = cart.items
          .filter(i => !i.savedForLater)
          .sort((a, b) => a.product.name.localeCompare(b.product.name));

        this.savedItems = cart.items
          .filter(i => i.savedForLater)
          .sort((a, b) => a.product.name.localeCompare(b.product.name));
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  updateQty(item: CartItem, delta: number): void {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    const stock = item.product.stockQuantity !== undefined ? item.product.stockQuantity : 100;

    if (newQty > stock) {
      alert(`Max quantity available is ${stock}`);

      return;
    }

    this.cartService.updateQuantity(item.id, newQty).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (err) => console.error('Error : update stock', err)
    });
  }

  applyPromo(): void {
    this.promoError = '';
    if (!this.promoCodeInput.trim()) return;

    this.cartService.applyPromo(this.promoCodeInput).subscribe({
      next:() => {
        this.promoCodeInput = '';
      },
      error: (err) => {
        this.promoError = 'Invalid or expired promo code.';
      }
    })
  }

  removeItem(item: CartItem): void {
    if(confirm('Are you sure you want to remove this item?')) {
      this.cartService.removeItem(item.id).subscribe(() => this.loadCart());
    }
  }

  toggleSave(item: CartItem): void {
    this.cartService.toggleSavedForLater(item.id).subscribe(() => this.loadCart());
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }
}
