import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environments';

const URL_CALENDARS = '/api/v1/calendar';
const URL_CLIENTS = '/api/v1/client';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  
  constructor(private http: HttpClient){

  }

  getCalendarView(startDate: string, endDate: string): Observable<any>{
    return this.http.get(`${environment.URL_API}${URL_CALENDARS}/view?startDate=${startDate}&endDate=${endDate}`)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

  getClients(ativo: boolean, search: string): Observable<any[]> {
    return this.http.get(`${environment.URL_API}${URL_CLIENTS}/?ativo=${ativo}&search=${search}`)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

  

//   save(calendar: Calendar): Observable<Calendar>{
//     return this.http.post(`${environment.URL_API}${URL_CALENDARS}`,calendar)
//     .pipe(map((resp: Calendar) => {
//       return resp;
//     }));
//   }

//   update(calendar: Calendar): Observable<Calendar>{
//     return this.http.put(`${environment.URL_API}${URL_CALENDARS}/${calendar.id}`,calendar)
//     .pipe(map((resp: Calendar) => {
//       return resp;
//     }));
//   }

  
}


