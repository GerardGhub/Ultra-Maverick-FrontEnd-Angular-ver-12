import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";



@Injectable({
  providedIn: 'root'
})

export class PartialPoService {
  constructor(
    private httpClient: HttpClient
  ){}

  getPartialPOChecklist(): Observable<any>{
    return this.httpClient.get("/api/parent_dynamic_checklist_per_identity", {responseType: 'json'});
  }

  viewPartialPoChecklist(projectID: number): Observable<any>{
    return this.httpClient.get("/api/parent_dynamic_checklist_per_identity/" + projectID, {responseType: "json"})
  }
}
