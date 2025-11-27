import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  id: string;
  name: string;
  sku: string;
  slug: string;
  image: string;
  images?: string[];
  description?: string;
  price: number;
  currency: string;
  rarity?: string;
  type: 'SINGLE' | 'BOOSTER_PACK' | 'ETB' | 'BOOSTER_BOX' | 'BUNDLE';
  categoryName?: string;
  set?: string;
  inStock?: boolean;
}

export interface PageResponse<T> {
  content: T[];
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api/catalog/products`;

  constructor(private http: HttpClient) {}

  getProducts(filters: any): Observable<{ content: any[]; page: any }> {
    let params = new HttpParams()
      .set('page', filters.page || 0)
      .set('size', filters.size || 12);


    if (filters.type) {
      params = params.set('type', filters.type);
    }

    if (filters.sort) {

      const [field, direction] = filters.sort.split('_');
      if (field && direction) {
        params = params.set('sort', `${field},${direction}`);
      }
    }

    if (filters.minPrice && !isNaN(filters.minPrice)) {
      params = params.set('minPrice', filters.minPrice * 100);
    }
    if (filters.maxPrice && !isNaN(filters.maxPrice)) {
      params = params.set('maxPrice', filters.maxPrice * 100);
    }

    if (filters.search) {
      params = params.set('q', filters.search);
    }

    return this.http.get<PageResponse<any>>(this.apiUrl, { params }).pipe(
      map(response => {


        return {

          content: (response.content || []).map((dto: any) => ({
            ...dto,
            price: dto.price ? dto.price / 100 : 0,
            set: dto.categoryName,
            inStock: dto.active
          })),
          page: response.page || {}
        };
      })
    );
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/${slug}`).pipe(
      map(dto => ({
        ...dto,
        price: dto.price ? dto.price / 100 : 0,
        set: dto.categoryName
      }))
    );
  }
}
