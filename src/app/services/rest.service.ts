import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
    return this.http.post('http://localhost:3000/sendEvent', event);
  }
}
