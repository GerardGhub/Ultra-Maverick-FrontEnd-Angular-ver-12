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
    return this.httpClient.get("", {responseType: "json"})
  }

}
