import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
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
 
  imagesInitial$ = this.imagesInitialSubject.asObservable();
  images$ = this.imagesSubject.asObservable();

  isMultipleSelectionImagesSubject = new BehaviorSubject<boolean>(false);
  isMultipleSelectionImages$ = this.isMultipleSelectionImagesSubject.asObservable();

  
  constructor(private httpClient: HttpClient) { }
  
  add(name: string, source: string, width: number, height: number): Observable<Object> {
    return this.httpClient.post(this.basePathApi + '/images', { name: name, source: source, width: width, height: height }, this.headers)
  }

  getImagesByCognitiveSearch(text: string, filter:string = "") {
    return this.httpClient.post(filter == "" ? this.basePathApi + '/images/search/' : this.basePathApi + '/images/search/' + filter, { search: text }, this.headers).pipe(catchError((error: HttpErrorResponse) => {
      if (error.status === 500) {
        // Handle the error here (e.g., show a notification, redirect, etc.)
        console.error('Internal Server Error (500):', error.message);
      }

      // Rethrow the error so it can be handled by the component as well
      return throwError(error);
    }))
  }
  
  getHttpImages(): Observable<any> {
    return this.httpClient.get(this.basePathApi + '/images', this.headers);
  }

  getMaxImageIdNextIncrement(): Observable<any> {
    return this.httpClient.get(this.basePathApi + '/images/max_id/', this.headers);
  }
  
  setImagesInitial(images: ImageDataAzure[]) { this.imagesInitialSubject.next(images); }

  setImages(images: ImageDataAzure[]) { this.imagesSubject.next(images); }

  setIsMultipleSelectionImages(value: boolean) { this.isMultipleSelectionImagesSubject.next(value); }

  updateImagesSubject(newItem: any) {
    const currentValue = this.imagesSubject.getValue();
    const updatedValue = [...currentValue, newItem];
    this.imagesSubject.next(updatedValue)
  }

  updateImageName(id: number, title: string){
    return this.httpClient.put(this.basePathApi + '/images/' + id + '/update', { name: title }, this.headers)
  }

  deleteMultipleImages(images: any[]){
    let imagesFiltered = this.imagesSubject.getValue().filter((data) => !images.includes(data))
    
    for(let img of images){
      this.httpClient.delete(this.basePathApi + '/images/' + img.id + '/delete')
      .subscribe({
        next: () => {
          this.setImages(imagesFiltered);
          this.setImagesInitial(imagesFiltered)
          },
          error: (e) => console.error(e),
          complete: () => console.info('Http request complete')
        });
    }
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

  urlToB64(url: string) {
    return fetch(url)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));
  }
}
