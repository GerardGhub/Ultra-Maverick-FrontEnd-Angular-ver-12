import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LabTestRemarks } from 'src/app/models/labtest-remarks/lab-test-remarks';

@Injectable({
  providedIn: 'root'
})
export class LabtestRemarksService {

  constructor(private httpClient : HttpClient) { }

  getListOfStatusOfData(): Observable<LabTestRemarks[]>
  {
    return this.httpClient.get<LabTestRemarks[]>("/api/LabTestRemarks", { responseType: "json" });
  }

  insertDataStatus(newDataStatus: LabTestRemarks): Observable<LabTestRemarks>
  {
    return this.httpClient.post<LabTestRemarks>("/api/LabTestRemarks", newDataStatus, { responseType: "json" });
  }

  updateDataStatus(existingDataStatus: LabTestRemarks): Observable<LabTestRemarks>
  {
    return this.httpClient.put<LabTestRemarks>("/api/LabTestRemarks", existingDataStatus, { responseType: "json" });
  }

  deleteDataStatus(id: number): Observable<string>
  {
    return this.httpClient.delete<string>("/api/LabTestRemarks?id=" + id);
  }
}
