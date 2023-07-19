import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ImageDataAzure } from 'src/app/models/image';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  
  basePathApi = environment.api_host + "/api";
  userToken = JSON.parse(localStorage.getItem("user") || '{}')
  headers = { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${this.userToken}` } }
  
  imagesInitialSubject = new BehaviorSubject<ImageDataAzure[]>([]);
  imagesSubject = new BehaviorSubject<ImageDataAzure[]>([]);
  errorHttpMessageSubject = new BehaviorSubject<string>("");
  errorHttpMessage$ = this.errorHttpMessageSubject.asObservable();
 
  imagesInitial$ = this.imagesInitialSubject.asObservable();
  images$ = this.imagesSubject.asObservable();
  
  constructor(private httpClient: HttpClient) { }
  
  add(name: string, base64: string, width: number, height: number): Observable<Object> {
    return this.httpClient.post(this.basePathApi + '/images', { name: name, base64: base64, width: width, height: height }, this.headers)
  }

  getImagesByCognitiveSearch(text: string, filter:string = "") {
    console.log(text, "Text");
    
    return this.httpClient.post(filter == "" ? this.basePathApi + '/images/search/' : this.basePathApi + '/images/search/' + filter, { search: text }, this.headers)
  }
  
  getHttpImages(): Observable<any> {
    return this.httpClient.get(this.basePathApi + '/images', this.headers);
  }

  getMaxImageIdNextIncrement(): Observable<any> {
    return this.httpClient.get(this.basePathApi + '/images/max_id/', this.headers);
  }
  
  setImagesInitial(images: ImageDataAzure[]) { this.imagesInitialSubject.next(images); }

  setImages(images: ImageDataAzure[]) { this.imagesSubject.next(images); }

  updateImagesSubject(newItem: any) {
    const currentValue = this.imagesSubject.getValue();
    const updatedValue = [...currentValue, newItem];
    this.imagesSubject.next(updatedValue)
  }

  deleteImage(id: number) {
    const currentImagesInitial = this.imagesInitialSubject.getValue();
    const currentImages = this.imagesSubject.getValue();

    
    const updatedImagesInitial = currentImagesInitial.filter(image => image.id !== id);
    const updatedImages = currentImages.filter(image => image.id !== id);


    this.httpClient.delete(this.basePathApi + '/images/' + id + '/delete', )
    .subscribe({
      next: () => {
        this.setImages(updatedImages);
        this.setImagesInitial(updatedImagesInitial)
        },
        error: (e) => console.error(e),
        complete: () => console.info('Http request complete')
      });
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
