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
  
  selectedFormatSubject = new BehaviorSubject<string>("");
  imagesInitialSubject = new BehaviorSubject<ImageDataAzure[]>([]);
  imagesSubject = new BehaviorSubject<ImageDataAzure[]>([]);
  imagesHorizontalSubject = new BehaviorSubject<ImageDataAzure[]>([]);
  imagesVerticalSubject = new BehaviorSubject<ImageDataAzure[]>([]);
  selectedFormat$ = this.selectedFormatSubject.asObservable();
  imagesInitial$ = this.imagesInitialSubject.asObservable();
  images$ = this.imagesSubject.asObservable();
  imagesHorizontal$ = this.imagesHorizontalSubject.asObservable();
  imagesVertical$ = this.imagesVerticalSubject.asObservable();
  imagesVertical: any[] = [];
  imagesHorizontal: any[] = [];
  
  constructor(private httpClient: HttpClient) { }
  
  add(name: string, base64: string, width: number, height: number) {
    return new Promise((resolve, rejects) => {
      this.httpClient.post(this.basePathApi + '/images', { name: name, base64: base64, width: width, height: height }, this.headers).subscribe((data: any) => {
        if (data) {
          resolve(data);
        }
      }, (err) => {
        if (err) {
          rejects(err);
        }
      });
    });
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
  
  setImagesInitial(images: ImageDataAzure[]) { 
    this.imagesInitialSubject.next(images); 
  }

  setImages(images: ImageDataAzure[]) { this.imagesSubject.next(images); }

  setImagesHorizontal(images: ImageDataAzure[]) { this.imagesHorizontalSubject.next(images); }

  setImagesVertical(images: ImageDataAzure[]) { this.imagesVerticalSubject.next(images); }

  setSelectedFormat(selected: string){
    this.selectedFormatSubject.next(selected);
  }
  
  updateImagesSubject(newItem: any) {
    const currentValue = this.imagesSubject.getValue();
    const updatedValue = [...currentValue, newItem];
    this.imagesSubject.next(updatedValue)
  }

  deleteImage(id: number) {
    const currentImagesInitial = this.imagesSubject.getValue();
    const currentImages = this.imagesSubject.getValue();
    const currentImagesVertical = this.imagesVerticalSubject.getValue();
    const currentImagesHorizontal = this.imagesHorizontalSubject.getValue();
    
    const updatedImagesInitial = currentImagesInitial.filter(image => image.id !== id);
    const updatedImages = currentImages.filter(image => image.id !== id);
    const updatedImagesVertical = currentImagesVertical.filter(image => image.id !== id);
    const updatedImagesHorizontal = currentImagesHorizontal.filter(image => image.id !== id);

    this.httpClient.delete(this.basePathApi + '/images/' + id + '/delete', )
    .subscribe({
      next: () => {
        this.setImagesVertical(updatedImagesVertical)
        this.setImagesHorizontal(updatedImagesHorizontal)
        this.setImages(updatedImages);
        this.setImagesInitial(updatedImagesInitial)
        this.setSelectedFormat("");
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

  setOrientationImages(image: any, width: number | null, height: number | null): void {
    
    
   
    
    if (width !== null && height !== null) {
      if (width > height) {
        this.imagesVertical.push(image);
        //console.log(this.imagesVertical, "imagesVertical")
      } else if (width < height) {
        this.imagesHorizontal.push(image);
      } else if (width === height) {
        this.imagesVertical.push(image);
      }

    }
   // console.log(this.imagesVertical, "imagesVertical", this.imagesHorizontal, "imagesHorizontal");
    this.setImagesVertical(this.imagesVertical);
    this.setImagesHorizontal(this.imagesHorizontal);
  }


}
