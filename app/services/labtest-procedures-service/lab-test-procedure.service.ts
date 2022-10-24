import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LabaratoryProcedure } from '../../models/laboratory-procedures/labaratory-procedure';

@Injectable({
  providedIn: 'root'
})
export class LabTestProcedureService {

  constructor(private httpClient : HttpClient) { }

  getListOfStatusOfData(): Observable<LabaratoryProcedure[]>
  {
    return this.httpClient.get<LabaratoryProcedure[]>("/api/LaboratoryProcedure", { responseType: "json" });
  }

  insertDataStatus(newDataStatus: LabaratoryProcedure): Observable<LabaratoryProcedure>
  {
    return this.httpClient.post<LabaratoryProcedure>("/api/LaboratoryProcedure", newDataStatus, { responseType: "json" });
  }

  updateDataStatus(existingDataStatus: LabaratoryProcedure): Observable<LabaratoryProcedure>
  {
    return this.httpClient.put<LabaratoryProcedure>("/api/LaboratoryProcedure", existingDataStatus, { responseType: "json" });
  }

  deleteDataStatus(id: number): Observable<string>
  {
    return this.httpClient.delete<string>("/api/LaboratoryProcedure?id=" + id);
  }

}
