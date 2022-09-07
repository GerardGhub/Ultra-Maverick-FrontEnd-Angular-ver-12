import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CancelledOrderService {
  constructor(private httpClient: HttpClient) {}

  getCancelledOrderList(): Observable<any> {
    return this.httpClient.get('/api/getStoreOrderMaterialCancelled', {
      responseType: 'json',
    });
  }

  searchItems(id: any): Observable<any> {
    return this.httpClient.get(
      '/api/store_orders_partial_cancel/search/' + id,
      {
        responseType: 'json',
      }
    );
  }

  getReturnReason(): Observable<any> {
    return this.httpClient.get('/api/ReturnPOTransactionStatus', {
      responseType: 'json',
    });
  }

  returnOrderItem(item: any): Observable<any> {
    return this.httpClient.put(
      '/api/store_orders/cancelreturnitemslogisticstatecount',
      item,
      { responseType: 'json' }
    );
  }
}
