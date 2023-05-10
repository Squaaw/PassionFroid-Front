import { Component, OnInit, Input } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  images: string[];

  constructor(private imageService: ImageService) {
    this.images = this.imageService.get();
  }

  ngOnInit(): void {
   
    
  }

}
