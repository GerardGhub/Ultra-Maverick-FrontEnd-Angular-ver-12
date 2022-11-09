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

}
