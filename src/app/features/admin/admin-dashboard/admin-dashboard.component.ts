import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { AdminService, DashboardStats } from '../../../core/services/admin.service';
import { Order } from '../../../core/services/order.service';
import {HeaderComponent} from '../../../shared/components/header/header.component';
import {FooterComponent} from '../../../shared/components/footer/footer.component';
import { ThemeService } from '../../../core/services/theme.service';
import {Subscription} from 'rxjs';
import {RouterLinkActive, RouterModule} from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, HeaderComponent, FooterComponent, RouterLinkActive, RouterModule],
  templateUrl: 'admin-dashboard.component.html',
  styleUrls: ['admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats?: DashboardStats;
  orders: Order[] = [];
  loading = true;

  isDark = true;
  private themeSub?: Subscription;

  constructor(
    private adminService: AdminService,
    private themeService : ThemeService
  ) {}

  ngOnInit() {
    this.themeSub = this.themeService.isDark$.subscribe(d => this.isDark = d);
    this.loadData();
  }

  ngOnDestroy() {
    this.themeSub?.unsubscribe();
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

