import { ErrorHandlerService } from './../generalServices/error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, catchError, retry } from 'rxjs';
import { IEvent } from './ievent';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  domainName: string = "http://localhost:5050";
  
  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService
  ) { }
  getEvents(): Observable<IEvent[]>{
    return this.http.get<IEvent[]>(`${this.domainName}/Event`).pipe(
      retry(2),
      catchError(this.errorHandlerService.handleError)
    );
  }
  
}
