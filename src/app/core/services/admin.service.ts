import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order } from './order.service';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  lowStockProducts: number;
}

@Injectable({
  providedIn: 'root'
})


export class AdminService {
  private apiUrl = `${environment.apiUrl}/api/admin`;

  constructor(private http: HttpClient) {}

    getStats(): Observable<DashboardStats> {
      return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`);
    }

    getAllOrders(): Observable<Order[]> {
      return this.http.get<Order[]>(`${this.apiUrl}/orders`);
    }

    updateOrderStatus(orderId: string, status: string): Observable<Order> {
      return this.http.put<Order>(`${this.apiUrl}/orders/${orderId}/status`, { status });
    }
}
