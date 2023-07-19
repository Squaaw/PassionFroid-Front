import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ImageService } from 'src/app/services/image/image.service';
import { ImageDataAzure } from 'src/app/models/image';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {
  images: ImageDataAzure[] = [];
  imagesFiltered: ImageDataAzure[] = [];
  imagesSearch: ImageDataAzure[] = [];
  initialImages: ImageDataAzure[] = [];
  selectedOption: string = '';
  searchText: string = '';
  filter: string = "";
  faSearch = faSearch;
  faChevronDown = faChevronDown;

  scrollTarget: ElementRef;

  constructor(public dialog: MatDialog, scrollTarget: ElementRef, private imageService: ImageService) {
    this.scrollTarget = scrollTarget
  }

  ngOnInit(): void {
   this.imageService.images$.subscribe((value) => this.images = value)
   this.imageService.imagesInitial$.subscribe((value) => this.initialImages = value) 
  }


  onSubmit(form: NgForm) {

  }

  handleFilterImages(){
    let imagesArray = []
    if(this.imagesSearch.length > 0){
      imagesArray = this.imagesSearch
    } else {
      imagesArray = this.initialImages
    }

    this.imagesFiltered = imagesArray.filter((image) => {
      if(image.width && image.height){
        if(this.selectedOption == "Vertical")
          return image.width < image.height
        else
          return image.width > image.height
      }
       return image
    })

    this.imagesFiltered = this.imagesFiltered.filter((image) => {
      if(image.similarity && this.filter !== ""){
        if(this.filter == "high"){
          return image.similarity >= 30
        } 
      }
      return image
    })
  }

  handleSearchImageText(event: any){
    if(event.key !== "Enter")
      return
    
    const searchValue = event.target.value;
    
    this.imageService.getImagesByCognitiveSearch(searchValue).subscribe((data: any) => {
      this.imagesSearch = data
      this.handleFilterImages()
      this.imageService.imagesSubject.next(this.imagesFiltered)
    })
  }

  onOptionChangeAccuracy(){
    if(this.imagesSearch.length > 0)
      if(this.filter == "high"){
        this.imagesFiltered = this.imagesSearch.filter((imageData: any) => {
            return imageData.similarity >= 30
          });
          this.imageService.imagesSubject.next(this.imagesFiltered)
      } else {
        this.imageService.imagesSubject.next(this.imagesSearch)
      }
  }

  onOptionChangeOrientation() {
    this.handleFilterImages()
    this.imageService.imagesSubject.next(this.imagesFiltered)
  }
  
  clearAllFilter(){
    //this.selectedOption = ""
    
    this.imageService.imagesSubject.next(this.imageService.imagesInitialSubject.getValue())
    
    
  }

}
