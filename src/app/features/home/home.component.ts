import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ThemeService } from '../../core/services/theme.service';
import {Subscription} from 'rxjs';
import {FooterComponent} from '../../shared/components/footer/footer.component';



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


  categories: Category[] = [
    {
      id: '1',
      name: 'Scarlet & Violet',
      image: 'https://images.unsplash.com/photo-1613771404721-1f92d799e49f?w=400&h=300&fit=crop',
      cardCount: 245
    },
    {
      id: '2',
      name: 'Crown Zenith',
      image: 'https://images.unsplash.com/photo-1606166325683-7e92e3d0c4f8?w=400&h=300&fit=crop',
      cardCount: 159
    },
    {
      id: '3',
      name: 'Lost Origin',
      image: 'https://images.unsplash.com/photo-1611118303126-f316c77d5793?w=400&h=300&fit=crop',
      cardCount: 196
    },
    {
      id: '4',
      name: 'Silver Tempest',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
      cardCount: 215
    }
  ];


  featuredCards: Card[] = [
    {
      id: '1',
      name: 'Charizard ex',
      set: 'Obsidian Flames',
      image: 'https://images.unsplash.com/photo-1606166325683-7e92e3d0c4f8?w=300&h=420&fit=crop',
      price: 89.99,
      rarity: 'ultra-rare',
      condition : 'near-mint',
      inStock: true
    },
    {
      id: '2',
      name: 'Pikachu VMAX',
      set: 'Vivid Voltage',
      image: 'https://images.unsplash.com/photo-1611118303126-f316c77d5793?w=300&h=420&fit=crop',
      price: 45.50,
      rarity: 'secret',
      condition : 'mint',
      inStock: true
    },
    {
      id: '3',
      name: 'Mewtwo V',
      set: 'Pokémon GO',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=420&fit=crop',
      price: 32.99,
      rarity: 'rare',
      condition: 'light-played',
      inStock: false
    },
    {
      id: '4',
      name: 'Rayquaza VMAX',
      set: 'Evolving Skies',
      image: 'https://images.unsplash.com/photo-1613771404721-1f92d799e49f?w=300&h=420&fit=crop',
      price: 125.00,
      rarity: 'ultra-rare',
      condition: 'near-mint',
      inStock: true
    },
    {
      id: '5',
      name: 'Lugia V',
      set: 'Silver Tempest',
      image: 'https://images.unsplash.com/photo-1606166325683-7e92e3d0c4f8?w=300&h=420&fit=crop',
      price: 28.75,
      rarity: 'rare',
      condition: 'moderately played',
      inStock: true
    },
    {
      id: '6',
      name: 'Giratina VSTAR',
      set: 'Lost Origin',
      image: 'https://images.unsplash.com/photo-1611118303126-f316c77d5793?w=300&h=420&fit=crop',
      price: 67.50,
      rarity: 'secret',
      condition : 'mint',
      inStock: true
    },
    {
      id: '7',
      name: 'Umbreon VMAX',
      set: 'Evolving Skies',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=420&fit=crop',
      price: 210.00,
      rarity: 'secret',
      condition: 'near-mint',
      inStock: false
    },
    {
      id: '8',
      name: 'Leafeon V',
      set: 'Evolving Skies',
      image: 'https://images.unsplash.com/photo-1613771404721-1f92d799e49f?w=300&h=420&fit=crop',
      price: 15.99,
      rarity: 'rare',
      condition: 'mint',
      inStock: true
    }
  ];

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeSubscription = this.themeService.isDark$.subscribe(
      isDark => this.isDark = isDark
    );
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  getRarityColor(rarity: string): string {
    const colors: { [key: string]: string } = {
      'common': '#9ca3af',
      'uncommon': '#3b82f6',
      'rare': '#8b5cf6',
      'ultra-rare': '#ec4899',
      'secret': '#fbbf24'
    };
    return colors[rarity] || '#9ca3af';
  }

  addToCart(card: Card): void {
    console.log('Adding to cart:', card);
    // TODO: Implémenter l'ajout au panier
  }
}
