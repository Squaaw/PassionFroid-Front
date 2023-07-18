import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ImageDataAzure } from 'src/app/models/image';
import { ImageService } from 'src/app/services/image/image.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  images: ImageDataAzure[] = [];
  renderView: ImageDataAzure[] = [];

  constructor(private imageService: ImageService) {
   
  }

  ngOnInit(): void {
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


}
