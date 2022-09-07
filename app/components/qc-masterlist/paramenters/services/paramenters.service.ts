import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ParamenterClass } from "../models/parameters.model";

@Injectable({
  providedIn: 'root'
})

export class ParamentersService {
  constructor(
    private httpClient : HttpClient
  ){}

  getList(): Observable<any>{
    return this.httpClient.get("/api/checklist_paramaters", {responseType: "json"})
  }

  addDetails(newList: ParamenterClass): Observable<ParamenterClass>{
    return this.httpClient.post<ParamenterClass>("/api/checklist_paramaters",newList, {responseType: "json"})
  }

  updateDescription(updateList: ParamenterClass): Observable<ParamenterClass>{
    return this.httpClient.put<ParamenterClass>("/api/checklist_paramaters",updateList, {responseType: "json"})
  }

  deactivate(deactivateList: ParamenterClass): Observable<ParamenterClass>{
    return this.httpClient.put<ParamenterClass>("/api/checklist_paramaters/deactivate",deactivateList, { responseType: "json" })
  }

  activate(activateList: ParamenterClass): Observable<ParamenterClass>{
    return this.httpClient.put<ParamenterClass>("/api/checklist_paramaters/activate",activateList, { responseType: "json" })
  }
}
