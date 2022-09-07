import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LabtestRecords } from '../models/labtest-records';

@Injectable({
  providedIn: 'root'
})
export class LabtestRecordsService {

  constructor(private httpClient : HttpClient) { }

  getForLabtestDetails(): Observable<LabtestRecords[]>
  {
    return this.httpClient.get<LabtestRecords[]>("/api/DryWareHouseReceivingForLabTest/LabResult", { responseType: "json" });
  }
}
