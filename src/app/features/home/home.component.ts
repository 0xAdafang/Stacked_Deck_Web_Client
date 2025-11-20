import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ThemeService } from '../../core/services/theme.service';
import {Subscription} from 'rxjs';
import {FooterComponent} from '../../shared/components/footer/footer.component';
import {HttpClient} from '@angular/common/http';
import { environment } from '../../../environments/environment';



interface Card {
  id: string;
  name: string;
  set: string;
  image: string;
  price: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'secret';
  condition: 'mint' | 'near-mint' | 'light-played' | 'moderately played' | 'heavily played' | 'damaged';
  inStock: boolean;
}

interface Category {
  id: string;
  name: string;
  image: string;
  cardCount: number;
}

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  isDark = true;
  private themeSubscription?: Subscription;

  base = environment.apiUrl;

  categories: Category[] = [];
  featuredCards: any[] = [];


  constructor(
    private themeService: ThemeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.themeSubscription = this.themeService.isDark$.subscribe(
      isDark => this.isDark = isDark
    );

    this.loadFeaturedCategories();
    this.loadFeaturedCards();
  }

  private loadFeaturedCategories(): void {
    this.http.get<Category[]>(`${this.base}/api/public/featured-categories`).subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Error loading featured categories', err)
    });
  }

  private loadFeaturedCards(): void {
    this.http.get<PageResponse<any>>(`${this.base}/api/public/featured-products?size=8`).subscribe({
      next: (response) => this.featuredCards = response.content,
      error: (err) => console.error('Error loading featured cards', err)
    });
  }


  getRarityColor(rarity: string): string {
    const colors: Record<string, string> = {
      COMMON: '#9ca3af',
      UNCOMMON: '#6b7280',
      RARE: '#8b5cf6',
      RARE_HOLO: '#a78bfa',
      DOUBLE_RARE: '#c084fc',
      TRIPLE_RARE: '#d8b4fe',
      ULTRA_RARE: '#ec4899',
      ILLUSTRATION_RARE: '#f472b6',
      SPECIAL_ILLUSTRATION_RARE: '#f9a8d4',
      HYPER_RARE: '#fbbf24',
      RAINBOW_RARE: '#facc15',
      SECRET_RARE: '#fde047',
      SHINY_RARE: '#86efac',
      SHINY: '#86efac',
      PROMO: '#60a5fa'
    };
    return colors[rarity] || '#9ca3af';
  }

  addToCart(card: Card): void {
    console.log('Adding to cart:', card);
    // TODO: Implémenter l'ajout au panier
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }
}
