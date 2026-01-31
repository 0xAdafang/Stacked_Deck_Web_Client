import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order } from './order.service';
import {Product} from './product.service';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  lowStockProducts: number;
}

export interface ProductRequest {
  sku: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  image: string;
  active: boolean;
  featured: boolean;
  type: string;
  rarity?: string;
  condition?: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  code?: string;
  slug: string;
  image?: string;
  parentId?: string;
  position?: number;
  cardCount?: number;
}

@Injectable({
  providedIn: 'root'
})


export class AdminService {
  private apiUrl = `${environment.apiUrl}/api/admin`;
  private catalogApiUrl = `${environment.apiUrl}/api/catalog`;

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

    createProduct(product: ProductRequest): Observable<Product> {
      return this.http.post<Product>(`${this.apiUrl}/catalog/products`, product);
    }

    updateProduct(id: string, product: ProductRequest): Observable<Product> {
      return this.http.put<Product>(`${this.apiUrl}/catalog/products/${id}`, product);
    }

    deleteProduct(id: string): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/catalog/products/${id}`);
    }

    getCategories(): Observable<CategoryDto[]> {
      return this.http.get<CategoryDto[]>(`${this.catalogApiUrl}/categories`);
    }

}
