import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreOrderService {
  constructor(private httpClient: HttpClient) {}

  getStoreOrderList(): Observable<any> {
    return this.httpClient.get('/api/store_orders', { responseType: 'json' });
  }
}
