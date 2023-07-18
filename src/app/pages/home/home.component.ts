import { Component, OnInit, Output } from '@angular/core';
import { ImageDataAzure } from 'src/app/models/image';
import { ImageService } from 'src/app/services/image/image.service';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class Home implements OnInit {
  //@Output() horizontalImagesLoaded = new EventEmitter();
  images: ImageDataAzure[] = [];
  imagesVertical: ImageDataAzure[] = [];
  imagesHorizontal: ImageDataAzure[] = [];
  constructor(private imageService: ImageService) {
    
      
  }

  ngOnInit(): void {
    this.loadImages()
  }
  
  private loadImages(){
    return this.imageService.getHttpImages().subscribe((images: ImageDataAzure[]) =>{
      this.images = images
      
      for(let image of images){
       // this.imageService.setFormatImage(image)
       this.imageService.setOrientationImages(image, image.width, image.height)
      }

      this.imageService.imagesSubject.next(images)
      this.imageService.imagesInitialSubject.next(images)


    })

  }
}
