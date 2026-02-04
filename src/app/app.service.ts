import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environments';
import { AppConfigService } from './app-config.service';

const URL_CALENDARS = '/api/v1/calendar';
const URL_CLIENTS = '/api/v1/client';
const URL_EQUIPMENT = '/api/v1/equipaments';
const URL_SPECIFICATIONS = '/api/v1/specifications';



@Injectable({
  providedIn: 'root'
})
export class AppService {
  private apiUrl: string;

  constructor(private http: HttpClient, private appConfig: AppConfigService) {
    // this.apiUrl = appConfig.apiUrl;
    this.apiUrl = 'https://backend.agenda-an-locacoes.site';
  }

  save(calendar: any): Observable<any>{
    return this.http.post(`${this.apiUrl}${URL_CALENDARS}`,calendar)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

  update(calendar: any): Observable<any>{
    return this.http.put(`${this.apiUrl}${URL_CALENDARS}/agendamento/${calendar.id}`,calendar)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

  getCalendarView(startDate: string, endDate: string): Observable<any>{
    return this.http.get(`${this.apiUrl}${URL_CALENDARS}/view-agendamento?startDate=${startDate}&endDate=${endDate}`)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

  loadCalendarById(id: string){
    return this.http.get(`${this.apiUrl}${URL_CALENDARS}/by-id?id=${id}`)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

  getClients(ativo: boolean, search: string): Observable<any[]> {
    return this.http.get(`${this.apiUrl}${URL_CLIENTS}/?ativo=${ativo}&search=${search}`)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

  loadEquipment(ativo: boolean): Observable<any[]> {
    return this.http.get(`${this.apiUrl}${URL_EQUIPMENT}?ativo=${ativo}`)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

  loadSpecifications(): Observable<any[]> {
    return this.http.get(`${this.apiUrl}${URL_SPECIFICATIONS}`)
    .pipe(map((resp: any) => {
      return resp;
    }));
  }

  

//   save(calendar: Calendar): Observable<Calendar>{
//     return this.http.post(`${this.apiUrl}${URL_CALENDARS}`,calendar)
//     .pipe(map((resp: Calendar) => {
//       return resp;
//     }));
//   }

//   update(calendar: Calendar): Observable<Calendar>{
//     return this.http.put(`${this.apiUrl}${URL_CALENDARS}/${calendar.id}`,calendar)
//     .pipe(map((resp: Calendar) => {
//       return resp;
//     }));
//   }

  
}


