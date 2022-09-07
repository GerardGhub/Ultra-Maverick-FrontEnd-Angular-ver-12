import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DetailsClass } from "../models/details.model";

@Injectable({
  providedIn: 'root'
})

export class DetailsService {
  constructor( private httpClient: HttpClient){}

  getList(): Observable<any>{
    return this.httpClient.get("/api/child_checklist", {responseType: "json"})
  }

  addDetails(newList: DetailsClass): Observable<DetailsClass>{
    return this.httpClient.post<DetailsClass>("/api/child_checklist",newList, {responseType: "json"})
  }

  updateDetails(updateList: DetailsClass): Observable<DetailsClass>{
    return this.httpClient.put<DetailsClass>("/api/child_checklist", updateList, {responseType: "json"})
  }

  deactivate(deactivateList: DetailsClass): Observable<DetailsClass>{
    return this.httpClient.put<DetailsClass>("/api/child_checklist/deactivate",deactivateList, { responseType: "json" })
  }

  activate(activateList: DetailsClass): Observable<DetailsClass>{
    return this.httpClient.put<DetailsClass>("/api/child_checklist/activate",activateList, { responseType: "json" })
  }
}
