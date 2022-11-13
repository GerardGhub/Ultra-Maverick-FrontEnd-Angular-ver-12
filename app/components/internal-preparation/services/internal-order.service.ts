import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class OnlineOrderService {

  constructor(
    private httpClient : HttpClient
  ){}


  getOrderList(): Observable<any>{
    return this.httpClient.get('/api/material_request_master/mrs_orders', {responseType: "json"})
  }

  getPreparedDistinctOrder(): Observable<any> {
    return this.httpClient.get('api/material_request_master/distinct_mrs_orders', {responseType: "json"});
  }

  approveOrder(item: any): Observable<any> {
    return this.httpClient.put('api/store_orders', item, {
      responseType: 'json',
    });
  }

  cancelOrderItem(item: any): Observable<any> {
    return this.httpClient.put(
      '/api/material_request_logs_deactivate',
      item,
      { responseType: 'json' }
    );
  }

  searchItems(id: number): Observable<any> {
    return this.httpClient.get('/api/material_request_master/search/' + id, {
      responseType: 'json',
    });
  }
  

}
