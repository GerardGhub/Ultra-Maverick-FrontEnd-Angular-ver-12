import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MainMenus } from '../models/main-menus';

@Injectable({
  providedIn: 'root'
})
export class MainMenusService {

  constructor(private httpClient : HttpClient) { }

  getMainMenus(): Observable<MainMenus[]>
  {
    return this.httpClient.get<MainMenus[]> ("/api/MainMenus", { responseType: "json"});
  }

  insertNewData(newDataStatus: MainMenus): Observable<MainMenus>
  {
    return this.httpClient.post<MainMenus>("/api/MainMenus", newDataStatus, { responseType: "json" });
  }

  
  updateData(existingDataStatus: MainMenus): Observable<MainMenus>
  {
    return this.httpClient.put<MainMenus>("/api/MainMenus", existingDataStatus, { responseType: "json" });
  }



}
