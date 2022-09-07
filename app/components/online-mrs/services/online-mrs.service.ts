import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class OnlineMrsService {
  constructor(
    private httpClient : HttpClient
  ){}


  // PARENT
  getParentList(id: number): Observable<any>{
    return this.httpClient.get("/api/material_request_master/"+ id ,  { responseType: "json" });
  }

  saveParentList(data: any): Observable<any>{
    return this.httpClient.post("/api/material_request_master", data, {responseType: "json"});
  }

  updateParentList(data: any): Observable<any>{
    return this.httpClient.put("/api/material_request_master", data, {responseType: "json"});
  }

  approvedOrderRequest(data: any): Observable<any>{
    return this.httpClient.put("/api/material_request_master/approve", data, {responseType: "json"})
  }

  getApprovedOrderRequest(id: number): Observable<any>{
    return this.httpClient.get("/api/material_request_master/approved/"+ id, {responseType: "json"})
  }

  cancelOrderRequest(data: any): Observable<any>{
    return this.httpClient.put("/api/material_request_master/dis-approve", data, {responseType: "json"})
  }

  cancelledOrderList(id: number): Observable<any>{
    return this.httpClient.get("/api/material_request_master/cancelled/" + id, {responseType: "json"})
  }

  returnCancelledOrderList(id: number): Observable<any>{
    return this.httpClient.put("/api/material_request_master/activate", id, {responseType: "json"})
  }

  cancelOrderReasonList(): Observable<any>{
    return this.httpClient.get("/api/internal_mrs_cancelled_reason", {responseType: "json"})
  }

  returnOrderReasonList(): Observable<any>{
    return this.httpClient.get("/api/internal_mrs_returned_reason", {responseType: "json"})
  }



  // ITEMS
  getItemList(): Observable<any> {
    return this.httpClient.get("/api/rawmaterials", {responseType: "json"});
  }

  editItemFromList(data: any): Observable<any>{
    return this.httpClient.put("/api/material_request_logs_update", data, {responseType: "json"})
  }

  removeItemFromList(id: any): Observable<any>{
    return this.httpClient.delete("/api/material_request_logs/" + id, {responseType: "json"})
  }



  //INSERT ORDERS
  saveOrders(data: any): Observable<any>{
    return this.httpClient.post("/api/material_request_logs_insert", data, {responseType: "json"})
  }

  viewOrders(mrs_transact_no: number): Observable<any>{
    return this.httpClient.get("/api/material_request_logs/search/" + mrs_transact_no , {responseType: "json"})
  }


}
