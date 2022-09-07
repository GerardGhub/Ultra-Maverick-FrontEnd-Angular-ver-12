import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DispatchingService {
  constructor(private httpClient: HttpClient) {}

  getDispatchOrder(): Observable<any> {
    return this.httpClient.get(
      '/api/dry_wh_orders_distinct_store_dispatching',
      {
        responseType: 'json',
      }
    );
  }

  searchItems(id: number): Observable<any> {
    return this.httpClient.get('/api/store_orders/search/' + id, {
      responseType: 'json',
    });
  }
}
