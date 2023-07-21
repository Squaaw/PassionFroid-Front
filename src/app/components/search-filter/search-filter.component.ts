import { Component, ElementRef, OnInit } from '@angular/core';
import { faSearch, faChevronDown, faFilter } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ImageService } from 'src/app/services/image/image.service';
import { ImageDataAzure } from 'src/app/models/image';
import { NgForm, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { TagsService } from 'src/app/services/tags/tags.service';
import { SearchFilterService } from 'src/app/services/search-filter/search-filter.service';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {
  images: any[] = [];
  imagesFiltered: ImageDataAzure[] = [];
  imagesSearchByInput: ImageDataAzure[] = [];
  initialImages: ImageDataAzure[] = [];
  imagesByTags: ImageDataAzure[] = [];
  selectedOption: string = '';
  searchText: string = '';
  filter: string = "";
  sortedCreatedAt: string = "";
  faSearch = faSearch;
  faChevronDown = faChevronDown;
  faFilter = faFilter;
  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  cities: Array<any> = [];
  selectedItems: Array<any> = [];
  dropdownSettings: any = {};
  scrollTarget: ElementRef;
  form: FormGroup;
  searchByTags: boolean = false;

  isFiltresVisible: boolean = false;


  
  
  constructor(
    private imageService: ImageService, 
    private tagsService: TagsService,
    private searchFilterService: SearchFilterService,
    public dialog: MatDialog, 
    scrollTarget: ElementRef, 
    public fb: FormBuilder,
  ) {
    this.scrollTarget = scrollTarget
    this.form = this.fb.group({
      searchRadio: ['byTags']
    });


  }

  ngOnInit(): void {
   this.imageService.images$.subscribe((value) => this.images = value)
   this.imageService.imagesInitial$.subscribe((value) => this.initialImages = value)
   this.searchFilterService.isFiltresVisible$.subscribe((value) => this.isFiltresVisible = value)
   this.searchFilterService.imageSearchInput$.subscribe((value) => this.imagesSearchByInput = value)
   
   this.form = this.fb.group({searchRadio: ['byText']})
  }

  changeSearchHandler(e: any) {
    console.log(this.form.value, "imagesSearchByInput");
    this.searchByTags = !this.searchByTags
  }

  onOptionChangeSortDate(){
    this.handleFilterImages()
    this.imageService.imagesSubject.next(this.imagesFiltered)
  }


  onSubmit($event: Event) {
    console.log($event.target, "toto");
    
  }

  submit(){

  }

  

  public handleFilterImages(){
    let imagesArray = []
    console.log("je passe ici", this.imagesSearchByInput);
    
    if(this.imagesSearchByInput.length > 0){
      console.log("toto");
      
      imagesArray = this.imagesSearchByInput
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
    
    this.imagesFiltered = this.imagesFiltered.sort((a: any, b) => {
      const dateA = a.created_at && new Date(a.created_at).getTime()
      const dateB = b.created_at && new Date(b.created_at).getTime();
  
      if (this.sortedCreatedAt === "recent") {
        return dateB && dateA && dateB - dateA;
      } else {
        return dateA && dateB && dateA - dateB;
      }
    });
    
    this.imagesFiltered = this.imagesFiltered.filter((image) => {
      if(image.similarity && this.filter !== ""){
        if(this.filter == "high"){
          return image.similarity >= 30
        } 
      }
      return image
    })

    //this.searchFilterService.setImagesFiltered(this.imagesFiltered)
  }

  handleSearchImageText(event: any){
    if(event.key !== "Enter")
      return
    
    const searchValue = event.target.value;
    
    this.imageService.getImagesByCognitiveSearch(searchValue).subscribe((data: any) => {
      this.imagesSearchByInput = data
      this.handleFilterImages()
      this.imageService.imagesSubject.next(this.imagesFiltered)
    })
  }

  onOptionChangeAccuracy(){
    if(this.imagesSearchByInput.length > 0)
      if(this.filter == "high"){
        this.imagesFiltered = this.imagesSearchByInput.filter((imageData: any) => {
            return imageData.similarity >= 30
          });
          this.imageService.imagesSubject.next(this.imagesFiltered)
      } else {
        this.imageService.imagesSubject.next(this.imagesSearchByInput)
      }
  }

  

  onOptionChangeOrientation() {
    this.handleFilterImages()
    this.imageService.imagesSubject.next(this.imagesFiltered)
  }
  
  clearAllFilter(){
    console.log(this.filter, "filter");
    
    this.imageService.imagesSubject.next(this.imageService.imagesInitialSubject.getValue())
    this.filter = ""
    this.sortedCreatedAt = ""
    this.selectedOption = ""
  }
}
