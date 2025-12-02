import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, Cart, CartItem } from '../../core/services/cart.service';
import { ThemeService } from '../../core/services/theme.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  isDark = true;
  private themeSub?: Subscription;

  cart?: Cart;
  activeItems: CartItem[] = [];
  savedItems: CartItem[] = [];
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

        this.activeItems = cart.items.filter(i => !i.savedForLater);
        this.savedItems = cart.items.filter(i => i.savedForLater);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  updateQty(item: CartItem, delta: number): void {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    if (item.product.stockQuantity && newQty > item.product.stockQuantity) {
      alert(`Max quantity available is ${item.product.stockQuantity}`);
      return;
    }
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
