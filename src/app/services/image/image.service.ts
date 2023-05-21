import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  images: string[] = ["assets/img/food.jpg", "assets/img/chicken-tika.jpg", "assets/img/food.jpg", 
  "assets/img/chicken-tika.jpg", "assets/img/food.jpg", "assets/img/chicken-tika.jpg",
  "assets/img/chicken-tika.jpg", "assets/img/food.jpg", "assets/img/tomatoes.jpg"];

  constructor(private httpClient: HttpClient) { }

  add(name: string, base64: string){
    return new Promise((resolve, rejects) => {
      this.httpClient.post(environment.api_host + '/images/create', { name: name, base64: base64 }).subscribe((data: any) => {
        if(data){
          resolve(data);
        }
      }, (err) =>{
        if(err){
          rejects(err);
        }
    });
    });
  }

  get(){
    return this.images;
  }
}
