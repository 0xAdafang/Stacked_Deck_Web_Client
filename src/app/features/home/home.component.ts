import {Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ThemeService } from '../../core/services/theme.service';
import { Subscription } from 'rxjs';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { register } from 'swiper/element/bundle';

register();

interface ProductType {
  label: string;
  image: string;
  typeCode: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent implements OnInit, OnDestroy {
  isDark = true;
  private themeSubscription?: Subscription;
  base = environment.apiUrl;

  featuredCards: any[] = [];

  productTypes: ProductType[] = [
    {
      label: 'Single Cards',
      image: '/assets/categories/single.jpg',
      typeCode: 'SINGLE',
      description: 'Chase cards, Vintage & Modern hits'
    },
    {
      label: 'Booster Packs',
      image: '/assets/categories/booster.jpg',
      typeCode: 'BOOSTER_PACK',
      description: 'Loose packs & sleeved boosters'
    },
    {
      label: 'Elite Trainer Boxes',
      image: '/assets/categories/etb.jpg',
      typeCode: 'ETB',
      description: 'Sealed boxes for players & collectors'
    },
    {
      label: 'Booster Boxes & Bundles',
      image: '/assets/categories/bundle.jpg',
      typeCode: 'BOOSTER_BOX',
      description: 'Displays, Bundles & Special Sets'
    }
  ];

  constructor(
    private themeService: ThemeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.themeSubscription = this.themeService.isDark$.subscribe(
      isDark => this.isDark = isDark
    );
    this.loadFeaturedCards();
  }

  private loadFeaturedCards(): void {

    this.http.get<any>(`${this.base}/api/public/featured-products?size=24`).subscribe({
      next: (response) => {
        let content = response.content || [];

        if (content.length > 0 && content.length < 12) {

          content = [...content, ...content];
        }

        if (content.length > 0 && content.length < 10) {
          content = [...content, ...content];
        }

        this.featuredCards = content;
      },
      error: (err) => console.error('Error loading featured cards', err)
    });
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
    return colors[rarity] || '#9ca3af';
  }

  addToCart(card: any): void {
    console.log('Adding to cart:', card);
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }
}
