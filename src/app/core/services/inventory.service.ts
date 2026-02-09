import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface InventoryStatus {
  sku: string;
  quantityAvailable: number;
  inStock: boolean;
  lowStock: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class InventoryService {
  private apiUrl =`${environment.apiUrl}/api/inventory`;

  constructor(private http: HttpClient) { }

  getStatus(sku: string): Observable<InventoryStatus> {
    return this.http.get<InventoryStatus>(`${this.apiUrl}/${sku}`);
  }
}
