import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChecklistClass } from '../models/checklist-model';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  constructor(private httpClient: HttpClient) {}

  getList(): Observable<any> {
    return this.httpClient.get('/api/parent_checklist', {
      responseType: 'json',
    });
  }

  addList(newList: ChecklistClass): Observable<ChecklistClass> {
    return this.httpClient.post<ChecklistClass>(
      '/api/parent_checklist',
      newList,
      { responseType: 'json' }
    );
  }

  updateList(updateList: ChecklistClass): Observable<ChecklistClass> {
    return this.httpClient.put<ChecklistClass>(
      '/api/parent_checklist',
      updateList,
      { responseType: 'json' }
    );
  }

  deactivate(deactivateList: ChecklistClass): Observable<ChecklistClass> {
    return this.httpClient.put<ChecklistClass>(
      '/api/parent_checklist/deactivate',
      deactivateList,
      { responseType: 'json' }
    );
  }

  activate(activateList: ChecklistClass): Observable<ChecklistClass> {
    return this.httpClient.put<ChecklistClass>(
      '/api/parent_checklist/activate',
      activateList,
      { responseType: 'json' }
    );
  }
}
