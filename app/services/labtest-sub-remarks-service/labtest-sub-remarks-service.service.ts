import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LabtestSubRemarks } from 'src/app/models/labtest-sub-remarks/labtest-sub-remarks';

@Injectable({
  providedIn: 'root'
})
export class LabtestSubRemarksService {

  constructor(private httpClient : HttpClient) { }

  getListOfStatusOfData(): Observable<LabtestSubRemarks[]>
  {
    return this.httpClient.get<LabtestSubRemarks[]>("/api/LaboratorySubRemark", { responseType: "json" });
  }

  insertDataStatus(newDataStatus: LabtestSubRemarks): Observable<LabtestSubRemarks>
  {
    return this.httpClient.post<LabtestSubRemarks>("/api/LaboratorySubRemark", newDataStatus, { responseType: "json" });
  }

  updateDataStatus(existingDataStatus: LabtestSubRemarks): Observable<LabtestSubRemarks>
  {
    return this.httpClient.put<LabtestSubRemarks>("/api/LaboratorySubRemark", existingDataStatus, { responseType: "json" });
  }

  deleteDataStatus(id: number): Observable<string>
  {
    return this.httpClient.delete<string>("/api/LaboratorySubRemark?id=" + id);
  }
}
