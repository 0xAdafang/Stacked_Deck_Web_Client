import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  isDark = true;
  newsletterEmail = '';
  currentYear = new Date().getFullYear();

  private themeSubscription?: Subscription;

  navigationLinks = [
    { label: 'Home', route: '/' },
    { label: 'Pokémon Cards', route: '/products' },
    { label: 'New Releases', route: '/new-releases' },
    { label: 'Best Sellers', route: '/best-sellers' },
    { label: 'Graded Cards', route: '/graded' }
  ];

  helpLinks = [
    { label: 'Contact Us', route: '/contact' },
    { label: 'Shipping Info', route: '/shipping' },
    { label: 'Returns & Refunds', route: '/returns' },
    { label: 'FAQ', route: '/faq' },
    { label: 'Card Grading', route: '/grading' }
  ];

  legalLinks = [
    { label: 'Privacy Policy', route: '/privacy' },
    { label: 'Terms of Service', route: '/terms' },
    { label: 'Cookie Policy', route: '/cookies' }
  ];

  socialLinks = [
    {
      name: 'Discord',
      url: 'https://discord.com',
      icon: 'discord'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com',
      icon: 'twitter'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      icon: 'instagram'
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com',
      icon: 'youtube'
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

  onNewsletterSubmit(): void {
    if (this.newsletterEmail.trim()) {
      console.log('Newsletter subscription:', this.newsletterEmail);
      // TODO: Implémenter l'inscription à la newsletter
      this.newsletterEmail = '';
    }
  }
}
