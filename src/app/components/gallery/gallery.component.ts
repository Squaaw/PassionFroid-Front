import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';
import { ImageDataAzure } from 'src/app/models/image';
import { ImageService } from 'src/app/services/image/image.service';
import { faClose, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit, OnChanges {
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

  ngOnChanges(changes: SimpleChanges){
    
    if(this.isMultipleSelectionImages == false){
      this.isChecked = false;
      this.selectedImage = []
    }
    
  }

  downloadFile(){
    let time = 0
    for(let image of this.selectedImage){
      setTimeout(() => {
        const src = image.source;
        const link = document.createElement("a")
        link.href = src
        link.download = image.name
        link.click()
        link.remove()
      }, time+=100)
    }
    this.isChecked = false
    this.imageService.setIsMultipleSelectionImages(false)
  }

  deleteMultipleImages(){
    this.imageService.deleteMultipleImages(this.selectedImage)
    this.selectedImage = []
    this.isChecked = false
    this.imageService.setIsMultipleSelectionImages(false)
  }

  onselectedImageChanged(checked: boolean, item: any){
    if(checked){
      this.isChecked = true
      this.selectedImage.push(item)
    } else {
      let itemIndex = this.selectedImage.indexOf(item)
      this.selectedImage.splice(itemIndex, 1)
      this.isChecked = this.selectedImage.length !== 0
      this.imageService.setIsMultipleSelectionImages(this.selectedImage.length !== 0)
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
