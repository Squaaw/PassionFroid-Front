import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ImageDataAzure } from 'src/app/models/image';
import { ImageService } from 'src/app/services/image/image.service';
import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {

  @Input() isMultipleSelectionImages: any;
  images: ImageDataAzure[] = [];
  renderView: ImageDataAzure[] = [];
  isChecked: boolean = false;
  selectedImage: any[] = []
  faDownload = faDownload
  faTrash = faTrash

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.imageService.images$.subscribe((value) => {
      this.renderView = value;
    });
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

  ngOnChanges(changes: SimpleChanges){
    
    if(this.isMultipleSelectionImages == false){
      this.isChecked = false;
      this.selectedImage = []
    }
    
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

}
