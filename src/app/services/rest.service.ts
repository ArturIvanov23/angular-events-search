import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) {
  }

  public getEvents(): Observable<any> {
    return this.http.get(`${environment.url}/searchTheme`);
  }

  public sendEvent(event): Observable<any> {
    return this.http.post(`${environment.url}/sendEvent`, event);
  }
}
