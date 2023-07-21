import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpError } from './http-errors.interface';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorsService {

  httpMessageRequestRequestSubject = new BehaviorSubject<HttpError>({msg: "", status: 0});
  httpMessageRequest$ = this.httpMessageRequestRequestSubject.asObservable();

  constructor() { }

  sethttpMessageRequest(msg: string, status: Number) { 
    let httpError = <HttpError>({msg: msg, status: status});
    this.httpMessageRequestRequestSubject.next(httpError);
  }
}
