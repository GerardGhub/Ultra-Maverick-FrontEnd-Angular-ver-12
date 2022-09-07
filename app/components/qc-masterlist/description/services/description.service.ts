import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DescriptionService {
  constructor(private httpClient: HttpClient) {}

  gc_id: string = '';

  getList(): Observable<any> {
    return this.httpClient.get('/api/grandchild_checklist', {
      responseType: 'json',
    });
  }

  addDetails(newList: any): Observable<any> {
    return this.httpClient
      .post<any>('/api/grandchild_checklist', newList, { responseType: 'json' })
      .pipe(
        map((response) => {
          this.gc_id = response.gc_id;
        })
      );
  }

  updateDescription(updateList: any): Observable<any> {
    return this.httpClient
      .put<any>('/api/grandchild_checklist', updateList, {
        responseType: 'json',
      })
      .pipe(
        map((response) => {
          this.gc_id = response.gc_id;
        })
      );
  }

  deactivate(deactivateList: any): Observable<any> {
    return this.httpClient.put<any>(
      '/api/grandchild_checklist/deactivate',
      deactivateList,
      { responseType: 'json' }
    );
  }

  activate(activateList: any): Observable<any> {
    return this.httpClient.put<any>(
      '/api/grandchild_checklist/activate',
      activateList,
      { responseType: 'json' }
    );
  }
}
