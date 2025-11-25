import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDark = true;
  mobileMenuOpen = false;
  cartCount = 0;
  searchQuery = '';

  private themeSubscription?: Subscription;

  navItems = [
    { label: 'Home', route: '/', exact: true },
    {
      label: 'Single Cards',
      route: '/products',
      queryParams: { type: 'SINGLE' }
    },
    {
      label: 'Booster Packs',
      route: '/products',
      queryParams: { type: 'BOOSTER_PACK' }
    },
    {
      label: 'Elite Trainer Boxes',
      route: '/products',
      queryParams: { type: 'ETB' }
    },
    {
      label: 'Boxes & Bundles',
      route: '/products',
      queryParams: { type: 'BOOSTER_BOX' }
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

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
      // TODO: Redirection vers la page recherche
    }
  }
}
