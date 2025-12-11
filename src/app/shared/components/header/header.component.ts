import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';
import { CartService} from '../../../core/services/cart.service';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import {User} from '../../../core/models/user.model';

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
  userMenuOpen = false;

  cartCount = 0;
  searchQuery = '';
  currentUser: User | null = null;

  private themeSubscription?: Subscription;
  private cartSubscription?: Subscription;
  private userSubscription?: Subscription;

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

  constructor(
    private themeService: ThemeService,
    private cartService: CartService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {

    this.themeSubscription = this.themeService.isDark$.subscribe(
      isDark => this.isDark = isDark
    );

    this.cartSubscription = this.cartService.cartCount$.subscribe(
      count => this.cartCount = count
    );

    this.userSubscription = this.userService.getCurrentUser().subscribe(
      user => this.currentUser = user
    );
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
    this.cartSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.userMenuOpen = false;
    this.mobileMenuOpen = false;
    this.router.navigate(['/home']);
  }

  closeUserMenu(): void {
    this.userMenuOpen = false;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {

      this.mobileMenuOpen = false;

      console.log('Searching for:', this.searchQuery);


      this.router.navigate(['/products'], {
        queryParams: { q: this.searchQuery }
      });


    }
  }
}

