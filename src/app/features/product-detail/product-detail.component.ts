import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { ProductService, Product } from '../../core/services/product.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  isDark = true;
  private themeSub?: Subscription;

  product?: Product;
  loading = true;
  error = false;

  selectedImage: string = '';

  quantity: number = 1;
  maxQuantity: number = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.themeSub = this.themeService.isDark$.subscribe(d => this.isDark = d);

    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadProduct(slug);
      }
    });
  }

  loadProduct(slug: string): void {
    this.loading = true;
    this.productService.getProductBySlug(slug).subscribe({
      next: (prod) => {
        this.product = prod;
        this.selectedImage = prod.image;

        if (!prod.inStock) {
          this.quantity = 0;
        } else {
          this.quantity = 1;
        }

        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  changeImage(img: string): void {
  this.selectedImage = img;
  }

  updateQuantity(delta: number): void {
    if (!this.product?.inStock) return;

    const realMax = Math.min(this.maxQuantity, this.product.stockQuantity);

    const newQty = this.quantity + delta;

    if (newQty >= 1 && newQty <= realMax) {
      this.quantity = newQty;
    }
  }

  getConditionLabel(condition: string): string {
    const labels: Record<string, string> = {
      'NEAR_MINT': 'NM (Near Mint)',
      'LIGHTLY_PLAYED': 'LP (Lightly Played)',
      'MODERATELY_PLAYED': 'MP (Moderately Played)',
      'HEAVILY_PLAYED': 'HP (Heavily Played)',
      'DAMAGED': 'DMG (Damaged)'
    };
    return labels[condition] || condition;
  }

  addToCart(): void {
  if (!this.product || !this.product.inStock || this.quantity <= 0) return;

  console.log(`Adding ${this.quantity} x ${this.product.name} to cart.`);

  alert('Added to cart!');
}

  getRarityColor(rarity: string): string {
    const colors: Record<string, string> = {
      COMMON: '#9ca3af', UNCOMMON: '#6b7280', RARE: '#8b5cf6',
      RARE_HOLO: '#a78bfa', DOUBLE_RARE: '#c084fc', TRIPLE_RARE: '#d8b4fe',
      ULTRA_RARE: '#ec4899', ILLUSTRATION_RARE: '#f472b6',
      SPECIAL_ILLUSTRATION_RARE: '#f9a8d4', HYPER_RARE: '#fbbf24',
      RAINBOW_RARE: '#facc15', SECRET_RARE: '#fde047',
      SHINY_RARE: '#86efac', SHINY: '#86efac', PROMO: '#60a5fa'
    };
    return colors[rarity || ''] || '#9ca3af';
  }

  ngOnDestroy(): void {
    this.themeSub?.unsubscribe();
  }
}




