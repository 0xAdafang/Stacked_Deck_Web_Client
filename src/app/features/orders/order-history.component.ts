import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { OrderService, Order } from '../../core/services/order.service';
import {Router, RouterModule} from '@angular/router';
import {HeaderComponent} from '../../shared/components/header/header.component';
import {FooterComponent} from '../../shared/components/footer/footer.component';
import {ThemeService} from '../../core/services/theme.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: 'order-history.component.html',
  styleUrls: ['order-history.component.scss']
})

export class OrderHistoryComponent implements OnInit {
  isDark = true;
  orders: Order[] = [];
  loading = true;
  private themeSubscription?: Subscription;

  constructor(
    private orderService: OrderService,
    private themeService: ThemeService
  ) {}



  ngOnInit(): void {

    this.themeSubscription = this.themeService.isDark$.subscribe(d => {
      this.isDark = d;
    });

    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
      switch (status) {
        case 'PAID': return 'status-paid';
        case 'SHIPPED': return 'status-shipped';
        case 'CANCELLED': return 'status-cancelled';
        default: return 'status-pending';
      }
  }
}

