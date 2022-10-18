import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAccount } from '../models/user-account';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserAccountService {
  constructor(private httpClient: HttpClient) {}

  getUserList(): Observable<UserAccount[]> {
    return this.httpClient.get<UserAccount[]>('/api/umwebusers', {
      responseType: 'json',
    });
  }

  registerUser(registration: UserAccount): Observable<UserAccount> {
    return this.httpClient.post<UserAccount>('/register', registration, {
      responseType: 'json',
    });
  }

  updateUser(updateDetails: UserAccount): Observable<UserAccount> {
    return this.httpClient.put<UserAccount>(
      '/api/umwebusers_update',
      updateDetails,
      { responseType: 'json' }
    );
  }

  deactivateUser(deactivateDetails: UserAccount): Observable<UserAccount> {
    return this.httpClient.put<UserAccount>(
      '/api/umwebusers_deactivate',
      deactivateDetails,
      { responseType: 'json' }
    );
  }

  getEmployee(): Observable<any> {
    return this.httpClient.get('api/employees');
  }

  getApprover(): Observable<any> {
    return this.httpClient.get('api/umwebusers_mrs_approver');
  }
}
