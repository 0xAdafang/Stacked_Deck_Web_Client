import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CheckoutSummary {
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  total: number;
  shippingMethodLabel:  string;
  discount?: number; // Ajouté : propriété optionnelle utilisée par le template
}

@Injectable({
  providedIn: 'root'
})

export class CheckoutService {
  private apiUrl = `${environment.apiUrl}/api/checkout`;

  constructor(private http: HttpClient) {}

    getSummary(shippingType: string, country: string): Observable<CheckoutSummary> {
      const params = new HttpParams()
        .set('shippingType', shippingType)
        .set('country', country);

      return this.http.get<CheckoutSummary>(`${this.apiUrl}/summary`, { params });

    }

}
