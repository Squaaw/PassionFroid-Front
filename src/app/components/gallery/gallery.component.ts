import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ImageDataAzure } from 'src/app/models/image';
import { ImageService } from 'src/app/services/image/image.service';
import { faClose, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  @Input() isMultipleSelectionImages: any;
  selectedFormat: string = "";
  initialImages: ImageDataAzure[] = [];
  imagesVertical: ImageDataAzure[] = [];
  imagesHorizontal: ImageDataAzure[] = [];
  images: ImageDataAzure[] = [];
  renderView: any[] = [];
  imagesSubject: any;
  item: any = {}
  faClose = faClose
  faDownload = faDownload
  faTrash = faTrash
  displayModal: boolean = false;
  isChecked: boolean = false;
  selectedImage: any[] = []

  constructor(private imageService: ImageService, private ref: ChangeDetectorRef) {
  }
  
  ngOnInit(): void {
    this.imageService.images$.subscribe((value) => this.renderView = value)
  }

  downloadFile(){
    for(let image of this.selectedImage){
      const src = image.source;
      const link = document.createElement("a")
      link.href = src
      link.download = image.name
      link.click()
      
      link.remove()
    }
  }

  deleteMultipleImages(){
    this.imageService.deleteMultipleImages(this.selectedImage)
    this.selectedImage = []
  }

  onselectedImageChanged(checked: boolean, item: any){
    if(checked){
      this.isChecked = true
      this.selectedImage.push(item)
    } else {
      let itemIndex = this.selectedImage.indexOf(item)
      this.selectedImage.splice(itemIndex, 1)
    }
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


  hideModal(){
    this.displayModal = false
  }

  showModal(event: any = undefined){
    this.item = event
    this.displayModal = true
  }
}
