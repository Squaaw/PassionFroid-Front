import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpRequestMessage } from './http-request-message.interface';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestMessageService {

  httpMessageRequestRequestSubject = new BehaviorSubject<HttpRequestMessage>({msg: "", status: 0});
  httpMessageRequest$ = this.httpMessageRequestRequestSubject.asObservable();

  constructor() { }

  sethttpMessageRequest(msg: string, status: Number) { 
    let httpMessage = <HttpRequestMessage>({msg: msg, status: status});
    this.httpMessageRequestRequestSubject.next(httpMessage);
  }
}
