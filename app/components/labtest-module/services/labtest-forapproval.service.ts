import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LabtestApproval } from '../models/labtest-approval';

@Injectable({
  providedIn: 'root',
})

export class LabtestForApprovalService {
  constructor(private httpClient: HttpClient) {}

  getApprovalDetails(): Observable<LabtestApproval[]> {
    return this.httpClient.get<LabtestApproval[]>('/api/DryWareHouseReceivingForLabTest/LabResultApproval',{ responseType: 'json' });
  }

  qaVisorApprovalDetails(
    qaApprovalDetails: LabtestApproval
  ): Observable<LabtestApproval> {
    return this.httpClient.put<LabtestApproval>('/api/DryWareHouseReceivingForLabTest/QASupervisorApproval', qaApprovalDetails, {responseType: 'json' });
  }

  qaVisorRejectDetails(item: any): Observable<any> {
    return this.httpClient.put('/api/DryWareHouseReceivingForLabTest/CancelledQASupervisorReleasingLabResult', item, {responseType: 'json' });
  }

  getRejectRemarks(): Observable<any> {
    return this.httpClient.get('/api/CancelledLabTestTransactionStatus', {responseType: 'json'});
  }

  managerApproval(item: any): Observable<any>{
    return this.httpClient.put('/api/DryWareHouseReceivingForLabTest/TSQASupervisorApproval', item, {responseType: 'json'})
  }

  managerReject(item: any): Observable<any>{
    return this.httpClient.put('/api/DryWareHouseReceivingForLabTest/CancelledQASupervisorReleasingLabResult', item, {responseType: 'json'})
  }

  managerQAReject(item: any): Observable<any>{
    return this.httpClient.put('/api/DryWareHouseReceivingForLabTest/CancelledManagerReleasingLabResult', item, {responseType: 'json'})
  }

  setLabAccessCode(item: any): Observable<any> {
    return this.httpClient.put('api/DryWareHouseReceivingForLabTest/SettingLabAccessCode',
    item, {responseType: 'json'})
  }

}
