import { Component, OnInit, Input } from '@angular/core';
import { ImageService } from 'src/app/services/image/image.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  @Input() images: any;

  constructor() {
    
    
  }

  ngOnInit(): void {
    console.log(this.images, "images");
    
  }

}
