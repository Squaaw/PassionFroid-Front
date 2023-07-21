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
import { HttpErrorsService } from 'src/app/services/errors/http-errors.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {



  constructor(private router: Router, private httpErrorService: HttpErrorsService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   

    return next.handle(request).pipe( tap(() => {},
      (err: any) => {
        console.log(err);
        
      if (err instanceof HttpErrorResponse) {
        this.httpErrorService.sethttpMessageRequest(err.error.msg, err.status)
      }
    }));
  }
}
