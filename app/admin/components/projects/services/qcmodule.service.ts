import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class QCService {
  constructor(private httpClient: HttpClient) {}

  getQcChecklist(): Observable<any> {
    return this.httpClient.get('/api/parent_dynamic_checklist', {
      responseType: 'json',
    });
  }

  saveNewCheckList(newChecklist: any): Observable<any> {
    return this.httpClient.post(
      '/api/dynamic_checklist_logger_insert',
      newChecklist,
      { responseType: 'json' }
    );
  }
}
