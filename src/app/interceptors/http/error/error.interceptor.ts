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

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {



  constructor(private router: Router, private imageService: ImageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   

    return next.handle(request).pipe( tap(() => {},
      (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status == 400) {
          this.imageService.errorHttpMessageSubject.next("Une erreur de réseau est survenue, "+ "\n" +" recommencez dans quelques instants.")
        }
        if (err.status !== 403) {
         return;
        }
        this.router.navigate(['']);
      }
    }));
  }
}
