import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ImageDataAzure } from 'src/app/models/image';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private imagesSubject = new BehaviorSubject<any[]>([]);
  basePathApi = environment.api_host + "/api";

  images: string[] = ["assets/img/food.jpg", "assets/img/chicken-tika.jpg", "assets/img/food.jpg",
    "assets/img/chicken-tika.jpg", "assets/img/food.jpg", "assets/img/chicken-tika.jpg",
    "assets/img/chicken-tika.jpg", "assets/img/food.jpg", "assets/img/tomatoes.jpg"];

  constructor(private httpClient: HttpClient) { }

  getImages(): Observable<ImageDataAzure[]> {
    let userToken = JSON.parse(localStorage.getItem("user") || '{}')
    this.httpClient.get(this.basePathApi + '/images', { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${userToken}` } })
      .subscribe((images: any) => {
        this.imagesSubject.next(images);
      }
      )
    return this.imagesSubject.asObservable();
  }

  add(name: string, base64: string) {
    let userToken = JSON.parse(localStorage.getItem("user") || '{}')
    
    return new Promise((resolve, rejects) => {
      this.httpClient.post(this.basePathApi + '/images', { name: name, base64: base64 }, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${userToken}` } }).subscribe((data: any) => {
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

  get() {
    return this.images;
  }

  deleteImage(id: number) {
    let userToken = JSON.parse(localStorage.getItem("user") || '{}')

    const currentImages = this.imagesSubject.getValue();

    const updatedImages = currentImages.filter(image => image.id !== id);

    this.httpClient.delete(this.basePathApi + '/image/' + id, { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${userToken}` } })
      .subscribe({
        next: () => this.imagesSubject.next(updatedImages),
        error: (e) => console.error(e),
        complete: () => console.info('Http request complete')
      });
  }
}
