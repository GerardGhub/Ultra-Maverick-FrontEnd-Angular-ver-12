import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotifService {
  constructor(private HttpClient: HttpClient) {}

  // PREPARATION (Store Oders)
  totalStoreOrders: number;

  getStoreOrders(): Observable<any> {
    return this.HttpClient.get('/api/store_orders', { responseType: 'json' });
  }
}
