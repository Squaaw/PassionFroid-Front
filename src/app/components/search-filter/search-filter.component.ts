import { Component, ElementRef, OnInit } from '@angular/core';
import { faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ImageService } from 'src/app/services/image/image.service';
import { ImageDataAzure } from 'src/app/models/image';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {
  imagesVertical: ImageDataAzure[] = [];
  imagesHorizontal: ImageDataAzure[] = [];
  images: ImageDataAzure[] = [];
  initialImage: ImageDataAzure[] = [];
  selectedOption: string = '';
  searchText: string = '';

  faSearch = faSearch;
  faChevronDown = faChevronDown;

  scrollTarget: ElementRef;

  constructor(public dialog: MatDialog, scrollTarget: ElementRef, private imageService: ImageService) {
    this.scrollTarget = scrollTarget
  }

  ngOnInit(): void {
   this.imageService.selectedFormat$.subscribe((value:any) =>{
    this.selectedOption = value
   })

   
  }

  handleSearchImageText(event: any){
    if(event.key !== "Enter")
      return
    
    const searchValue = event.target.value;
    this.imageService.getImagesByCognitiveSearch(searchValue).subscribe((data: any) => {
      this.imageService.imagesSubject.next(data)
      
    })
  }

  onOptionChange() {
    if(this.selectedOption == "Vertical"){
       this.imageService.setSelectedFormat(this.selectedOption)
      } else if(this.selectedOption == "Horizontal"){
        this.imageService.setSelectedFormat(this.selectedOption)
    } else {
      this.imageService.setSelectedFormat("")
    }
  }
  
  clearAllFilter(){
    this.selectedOption = ""
    this.imageService.setSelectedFormat(this.selectedOption)
  }

}
