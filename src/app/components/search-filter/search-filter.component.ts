import { Component, ElementRef, OnInit } from '@angular/core';
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
  imagesVertical: ImageDataAzure[] = [];
  imagesHorizontal: ImageDataAzure[] = [];
  images: ImageDataAzure[] = [];
  imagesInitial: ImageDataAzure[] = [];
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
   this.imageService.selectedFormat$.subscribe((value:any) =>{
    this.selectedOption = value
   })

   this.imageService.imagesInitial$.subscribe((value) => this.initialImages = value)
   this.imageService.images$.subscribe((value) => this.images = value)
   
   this.imageService.imagesHorizontal$.subscribe((value) => this.imagesHorizontal = value)
   this.imageService.imagesVertical$.subscribe((value) => this.imagesVertical = value) 
   
   
  }

  onSubmit(form: NgForm) {
    console.log(this.filter);
    
    const queryParams = `filter=${this.filter}`;
  }

  handleSearchImageText(event: any){
    if(event.key !== "Enter")
      return
    
    const searchValue = event.target.value;
    
    this.imageService.getImagesByCognitiveSearch(searchValue).subscribe((data: any) => {
      this.imageService.imagesSubject.next(data)
      if(this.filter !== ""){
        if(this.filter == "how"){
          if(data.similarity >= 30){
            this.imageService.imagesSubject.next(data)
          }
        } else {
          this.imageService.imagesSubject.next(data)
        }
      }
      
      this.imageService.setOrientationImages(data, data.width, data.height)
      
      this.imagesSearch = data;
            
      //this.imageService.imagesSubject.next(data)
    })
  }

  onOptionChangeAccuracy(){
 
    // console.log(this.images, 'images');
    
    

      if(this.filter == "high"){
        this.imagesFiltered = this.imagesSearch.filter((imageData: any) => {
            return imageData.similarity >= 30
          });
          this.imageService.imagesSubject.next(this.imagesFiltered)
      } else {
        this.imageService.imagesSubject.next(this.imagesSearch)

      }

      
        
    
    

  }

  onOptionChange() {
    
    if(this.selectedOption == "Vertical"){
      this.imageService.setSelectedFormat(this.selectedOption)
    } else if(this.selectedOption == "Horizontal"){
      this.imageService.setSelectedFormat(this.selectedOption)
    } else {
      this.imageService.setSelectedFormat("")
    }
    console.log(this.selectedOption, "this.selectedOption");
  }
  
  clearAllFilter(){
    console.log(this.imageService.imagesInitialSubject.getValue(), 'initial');
    console.log(this.images, 'images');
    this.selectedOption = ""
    this.imageService.setSelectedFormat(this.selectedOption)
    this.imageService.imagesSubject.next(this.imageService.imagesInitialSubject.getValue())
    
    
  }

}
