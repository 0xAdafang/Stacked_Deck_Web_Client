import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { AdminService, DashboardStats } from '../../core/services/admin.service';
import { Order } from '../../core/services/order.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe],
  templateUrl: 'admin-dashboard.component.html',
  styleUrls: ['admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats?: DashboardStats;
  orders: Order[] = [];
  loading = true;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.adminService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => this.loading = false,
    });
  }

  markAsShipped(order: Order) {
    if (confirm(`Mark order #${order.id.split('-')[0]} as SHIPPED?`)) {
      this.adminService.updateOrderStatus(order.id, 'SHIPPED').subscribe(() => {

        order.status = 'SHIPPED';

        this.adminService.getStats().subscribe(s => this.stats = s);
      });
    }
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

