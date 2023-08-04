import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ImageDataAzure } from 'src/app/models/image';
import { ImageService } from 'src/app/services/image/image.service';
import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

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

}
