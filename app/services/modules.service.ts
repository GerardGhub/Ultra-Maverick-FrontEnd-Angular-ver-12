import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Modules } from '../models/modules';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {

  constructor(private httpClient : HttpClient) { }

  getModules(): Observable<Modules[]>
  {
    return this.httpClient.get<Modules[]> ("/api/Modules", {responseType: "json"});
  }
}
