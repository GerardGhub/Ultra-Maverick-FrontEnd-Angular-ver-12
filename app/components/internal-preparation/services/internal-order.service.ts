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
  getOrderForDispatchingList(): Observable<any> {
    return this.httpClient.get('/api/material_request_master/dispatching', { responseType: "json"})
  }

  getCancelOrderParent(): Observable<any> {
    return this.httpClient.get('/api/material_request_master/mrs_orders/cancelled', {responseType: "json"});
  }


  getPreparedDistinctOrder(): Observable<any> {
    return this.httpClient.get('api/material_request_master/distinct_mrs_orders', {responseType: "json"});
  }

  approveOrder(item: any): Observable<any> {
    return this.httpClient.put('api/material_request_master/approve', item, {
      responseType: 'json',
    });
  }

  cancelParentPreparationOrder(item: any): Observable<any> {
    return this.httpClient.put('api/material_request_master/wh_checker_cancel', item, {
      responseType: 'json',
    });
  }

  returnParentPreparationOrder(item: any) :Observable<any> {
    return this.httpClient.put('api/material_request_master/wh_checker_cancel/return', item, {
      responseType: 'json',
    });
  }

  approvePreparationOrder(item: any): Observable<any> {
    return this.httpClient.put('api/material_request_master/wh_checker_approval', item, {
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

  returnOrderItem(item: any): Observable<any> {
    return this.httpClient.put('/api/material_request_logs_activate', item, { responseType: 'json'});
  }



  searchItems(id: number): Observable<any> {
    return this.httpClient.get('/api/material_request_master/search/' + id, {
      responseType: 'json'});
  }

  searchItemsInactive(id: number): Observable<any> {
    return this.httpClient.get('/api/material_request_logs/search/partial_inactive/' + id, {responseType: 'json'});
  }
  

}
