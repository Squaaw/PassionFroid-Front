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
    return this.imageService.getHttpImages().subscribe({
      next: (v) => {
        this.images = v
        this.imageService.imagesSubject.next(v)
        this.imageService.imagesInitialSubject.next(v)
        
      },
      error: (e) => console.log(e),
      complete: () => {}
    })

  }
}
