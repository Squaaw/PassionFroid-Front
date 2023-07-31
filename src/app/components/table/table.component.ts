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
    
    
    this.imageService.images$.subscribe((value) => {
      this.renderView = value;
    });
  }


}
