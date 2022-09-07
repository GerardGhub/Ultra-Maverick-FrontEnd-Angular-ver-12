import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PreparedOrdersService {
  constructor(private httpClient: HttpClient) {}

  getPreparedOrderList(): Observable<any> {
    return this.httpClient.get('/api/dry_wh_orders_checklist_distinct', {
      responseType: 'json',
    });
  }

  searchItems(id: number): Observable<any> {
    return this.httpClient.get('/api/store_orders/search/' + id, {
      responseType: 'json',
    });
  }

  approveOrder(item: any): Observable<any> {
    return this.httpClient.put('api/store_orders', item, {
      responseType: 'json',
    });
  }

  cancelOrderItem(item: any): Observable<any> {
    return this.httpClient.put(
      '/api/store_orders/cancelindividualitems',
      item,
      { responseType: 'json' }
    );
  }

  cancelledOrder(item: any): Observable<any> {
    return this.httpClient.put(
      '/api/store_orders/CancelParentTransaction',
      item,
      { responseType: 'json' }
    );
  }
}
