import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { ImageDataAzure } from 'src/app/models/image';
import { ImageService } from 'src/app/services/image/image.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit, OnChanges {
  selectedFormat: string = "";
  initialImages: ImageDataAzure[] = [];
  imagesVertical: ImageDataAzure[] = [];
  imagesHorizontal: ImageDataAzure[] = [];
  images: ImageDataAzure[] = [];
  renderView: any[] = [];
  imagesSubject: any;


  constructor(private imageService: ImageService) {
  }
  
  ngOnInit(): void {
    this.imageService.images$.subscribe((value) => this.renderView = value)
  }

  

  public splitRenderViewIntoColumns(renderView: any[], columns: number): any[][] {
    const result: any[][] = [];
    const itemsPerColumn = Math.ceil(renderView.length / columns);
    
    for (let i = 0; i < columns; i++) {
      
      
      const start = i * itemsPerColumn;
      const end = start + itemsPerColumn;
      const column = renderView.slice(start, end);
      result.push(column);
    }
  
    return result;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    
    
    
  }

}
