import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) {
  }

  public getEvents(): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([]);
      }, 1000);
    });
  }

  public sendEvent(event): any {
    return this.http.post('http://localhost:3000/sendEvent', event);
  }
}
