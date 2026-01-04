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
  discount?: number;
}

export interface PaymentInitResponse {
  paymentUrl: string;
}


@Injectable({
  providedIn: 'root'
})

export class CheckoutService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

    getSummary(shippingType: string, country: string): Observable<CheckoutSummary> {
      const params = new HttpParams()
        .set('shippingType', shippingType)
        .set('country', country);

      return this.http.get<CheckoutSummary>(`${this.baseUrl}/api/checkout/summary`, { params });

    }

  createStripeSession(amount: number, currency: string, email: string): Observable<PaymentInitResponse> {
    return this.http.post<PaymentInitResponse>(`${this.baseUrl}/api/payment/checkout`, {
      amount,
      currency,
      email
    });
  }
}
