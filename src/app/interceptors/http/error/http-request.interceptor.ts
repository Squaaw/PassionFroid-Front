import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/services/image/image.service';
import { HttpRequestMessageService } from 'src/app/services/http-request-message/http-request-message.service';


@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {



  constructor(private router: Router, private httpRequestMessageService: HttpRequestMessageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   

    return next.handle(request).pipe( tap(() => {},
      (err: any) => {
        console.log(err, "err dans interceptor");
        
      if (err instanceof HttpErrorResponse) {
        this.httpRequestMessageService.sethttpMessageRequest(err.error.msg, err.status)
      }
    }));
  }
}
