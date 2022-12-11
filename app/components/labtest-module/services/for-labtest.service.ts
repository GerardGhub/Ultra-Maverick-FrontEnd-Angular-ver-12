import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ForLabtest } from '../models/for-labtest';

@Injectable({
  providedIn: 'root'
})
export class ForLabtestService {

  constructor(private httpClient : HttpClient) { }

  getForLabtestDetails(): Observable<ForLabtest[]>
  {
    return this.httpClient.get<ForLabtest[]>("/api/DryWareHouseReceivingForLabTest", { responseType: "json" });
  }

  insertForLabtestDetails(newAllowablePercentage: ForLabtest): Observable<ForLabtest>
  {
    return this.httpClient.post<ForLabtest>("/api/DryWareHouseReceivingForLabTest", newAllowablePercentage, { responseType: "json" });
  }

  updateForLabtestDetails(existingAllowablePercentage: ForLabtest): Observable<ForLabtest>
  {
    return this.httpClient.put<ForLabtest>("/api/DryWareHouseReceivingForLabTest/QAApproval", existingAllowablePercentage, { responseType: "json" });
  }

  proceedApprovedForLabtestDetails(item: any): Observable<any>
  {
    return this.httpClient.put("/api/DryWareHouseReceivingForLabTest/QAReleasingResult", item, { responseType: "json" });
  }

  cancelForLabtestDetails(existingAllowablePercentage: ForLabtest): Observable<ForLabtest>
  {
    return this.httpClient.put<ForLabtest>("/api/DryWareHouseReceivingForLabTest/CancelledQAReleasingResult", existingAllowablePercentage, { responseType: "json" });
  }

  deleteForLabtestDetails(id: number): Observable<string>
  {
     return this.httpClient.delete<string>("/api/DryWareHouseReceivingForLabTest?id=" + id);
  }

   qaVisorRejectDetailsById(qaRejectedByIdDetails: ForLabtest): Observable<ForLabtest>
   {
     return this.httpClient.put<ForLabtest>("/api/DryWareHouseReceivingForLabTest/CancelledQASupervisorReleasingLabResult", qaRejectedByIdDetails, { responseType: "json" });
   }

   

   
}
