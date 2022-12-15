import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LabtestRecords } from '../models/labtest-records';

@Injectable({
  providedIn: 'root'
})
export class LabtestRecordsService {

  constructor(private httpClient: HttpClient) { }

  getForLabtestDetails(): Observable<LabtestRecords[]> {
    return this.httpClient.get<LabtestRecords[]>("/api/DryWareHouseReceivingForLabTest/LabResult", { responseType: "json" });
  }

  getLabTestRecordsWithAccessCode(): Observable<LabtestRecords[]> {
    return this.httpClient.get<LabtestRecords[]>("/api/DryWareHouseReceivingForLabTest/LabResultWithAccessCode", { responseType: "json" });
  }

  SearchtItemsPerAccessCode(AccessCode: number): Observable<LabtestRecords[]> {
    return this.httpClient.get<LabtestRecords[]>("/api/DryWareHouseReceivingForLabTest/SearchLabResultWithAccessCode/" + AccessCode, { responseType: "json" });
  }

  SearchLabtestHistory(ReceiveID: number): Observable<LabtestRecords[]> {
    return this.httpClient.get<LabtestRecords[]>("/api/DryWareHouseReceivingForLabTest/searchreceivedidentity/" + ReceiveID, { responseType: "json" });
  }



}
