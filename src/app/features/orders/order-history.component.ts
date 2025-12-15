import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { OrderService, Order } from '../../core/services/order.service';
import {Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'order-history.component.html',
  styleUrls: ['order-history.component.css']
})

export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
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

