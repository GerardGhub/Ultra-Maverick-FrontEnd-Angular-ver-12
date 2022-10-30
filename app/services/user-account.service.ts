import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAccount } from '../models/user-account';
import { HttpClient } from '@angular/common/http';
import { RoleModules } from '../models/rolemodules';

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

  
  activateUser(deactivateDetails: UserAccount): Observable<UserAccount> {
    return this.httpClient.put<UserAccount>(
      '/api/umwebusers_activate',
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

  getUserRoleList(roleid: string): Observable<any>{
    return this.httpClient.get("/api/RoleModules/"+ roleid ,  { responseType: "json" });
  }

  getUserRoleListById(roleid: string, moduleId: number): Observable<any>{
    return this.httpClient.get("/api/RoleModules/RoleId/"+ roleid+"/"+moduleId,  { responseType: "json" });
  }
  
  getUserRoleByAdminId(roleid: string, moduleId: number): Observable<any>{
    return this.httpClient.get("/api/RoleModules/RoleId/Admin/"+ roleid+"/"+moduleId,  { responseType: "json" });
  }

  updateUserRoleListById(deactivateDetails: RoleModules): Observable<RoleModules>{
    return this.httpClient.put<RoleModules>('/api/RoleModules/Deactivate', deactivateDetails,{ responseType: "json" });
  }

  updateUserRoleListByIdActivate(activateDetails: RoleModules): Observable<RoleModules>{
    return this.httpClient.put<RoleModules>('/api/RoleModules', activateDetails,{ responseType: "json" });
  }

}
