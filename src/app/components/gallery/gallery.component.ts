import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImageDataAzure } from 'src/app/models/image';
import { ImageService } from 'src/app/services/image/image.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnChanges, AfterViewInit {
  selectedFormat: string = "";
  initialImages: ImageDataAzure[] = [];
  imagesVertical: ImageDataAzure[] = [];
  imagesHorizontal: ImageDataAzure[] = [];
  images: ImageDataAzure[] = [];
  renderView: ImageDataAzure[] = [];
  imagesSubject: any;

  constructor(private imageService: ImageService) {
  }
  
  ngOnInit(): void {
    

    //this.imageService.imagesHorizontal$.subscribe((value) => this.imagesHorizontal = value)
    //this.imageService.imagesVertical$.subscribe((value) => this.imagesVertical = value)

    this.imageService.selectedFormat$.subscribe((value) => {
      if (value === "Vertical") {
        this.imageService.imagesVertical$.subscribe((value) => {
          this.renderView = value;
        });
      } else if (value === "Horizontal") {
        this.imageService.imagesHorizontal$.subscribe((value) => {
          this.renderView = value;
        });
      } else {
        
        this.imageService.images$.subscribe((value) => {
          this.renderView = value;
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.imageService.selectedFormat$.subscribe((value) => {
      if (value === "Vertical") {
        this.imageService.imagesVertical$.subscribe((value) => {
          this.renderView = value;
        });
      } else if (value === "Horizontal") {
        this.imageService.imagesHorizontal$.subscribe((value) => {
          this.renderView = value;
        });
      } else {
        
        
        this.imageService.images$.subscribe((value) => {
          this.renderView = value;
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.imageService.selectedFormat$.subscribe((value) => this.selectedFormat = value)

    
  }

}
