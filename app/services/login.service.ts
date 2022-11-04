import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginViewModel } from '../models/login-view-model';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SignUpViewModel } from '../models/sign-up-view-model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private httpClient: HttpClient;

  constructor(
    private httpBackend: HttpBackend,
    private jwtHelperService: JwtHelperService
  ) {}

  currentUserName: string = null;
  currentUserRole: string = null;
  fullName: string = null;
  Userid: number = 0;
  departmentId: number = 0;
  unitId: number = 0;
  requestorRole: boolean;
  approverRole: boolean;

  //For Solution Earlier
  currentUserRoleSession: string = null;

  public Login(loginViewModel: LoginViewModel): Observable<any> {
    this.httpClient = new HttpClient(this.httpBackend);
    return this.httpClient
      .post<any>('authenticate', loginViewModel, {
        responseType: 'json',
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response) {
            this.currentUserName = response.body.userName;
            this.currentUserRole = response.body.role;
            this.currentUserRoleSession = response.body.userRole;
            sessionStorage.currentUser = JSON.stringify(response.body);
            sessionStorage.XSRFRequestToken =
              response.headers.get('XSRF-REQUEST-TOKEN');
          }
          return response.body;
        })
      );
  }

  public detectIfAlreadyLoggedIn() {
    if (this.jwtHelperService.isTokenExpired() == false) {
      var currentUser = JSON.parse(sessionStorage.currentUser);
      this.fullName = currentUser.firstName + ' ' + currentUser.lastName;
      this.currentUserName = currentUser.userName;
      this.currentUserRole = currentUser.role;
      this.currentUserRoleSession = currentUser.userRole;

      this.Userid = currentUser.user_Identity;
      this.departmentId = currentUser.department_id;
      this.unitId = currentUser.unit_id;

      this.requestorRole = currentUser.requestor;
      this.approverRole = currentUser.approver;
    }
  }

  public Register(signUpViewModel: SignUpViewModel): Observable<any> {
    this.httpClient = new HttpClient(this.httpBackend);
    return this.httpClient
      .post<any>('/register', signUpViewModel, {
        responseType: 'json',
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response) {
            this.currentUserName = response.body.userName;
            this.fullName = response.body.firstName;
            sessionStorage.currentUser = JSON.stringify(response.body);
            sessionStorage.XSRFRequestToken =
              response.headers.get('XSRF-REQUEST-TOKEN');
          }
          return response.body;
        })
      );
  }

  getUserByEmail(Email: string): Observable<any> {
    this.httpClient = new HttpClient(this.httpBackend);
    return this.httpClient.get<any>('/api/getUserByEmail/' + Email, {
      responseType: 'json',
    });
  }

  public Logout() {
   
    sessionStorage.removeItem('currentUser');
    window.location.reload();

  }

  public isAuthenticated(): boolean {
    var token = sessionStorage.getItem('currentUser')
      ? JSON.parse(sessionStorage.getItem('currentUser')).token
      : null;
    if (this.jwtHelperService.isTokenExpired()) {
      return false; //token is not valid
    } else {
      return true; //token is valid
    }
  }

  public getAllEmployes(): Observable<any> {
    this.httpClient = new HttpClient(this.httpBackend);
    return this.httpClient.get<any>('/api/getallemployees', {
      responseType: 'json',
    });
  }
}
