import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { faSearch, faChevronDown, faFilter } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ImageService } from 'src/app/services/image/image.service';
import { ImageDataAzure } from 'src/app/models/image';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TagsService } from 'src/app/services/tags/tags.service';
import { SearchFilterService } from 'src/app/services/search-filter/search-filter.service';
import { VoiceRecognitionService } from 'src/app/services/voice-recognition/voice-recognition.service';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit, OnDestroy {
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
  searchValue: string = "";
  searchByText: boolean = false;
  svgColor = '#b473c9';
  isFiltresVisible: boolean = false;
  isButtonDisabled = true;
  isStoppedSpeechRecognize = false;

  textRecognitionValue: string = ""
  isStarted = false;
  isStoppedAutomatically = true;

  
  constructor(
    private imageService: ImageService, 
    private tagsService: TagsService,
    private searchFilterService: SearchFilterService,
    public dialog: MatDialog, 
    scrollTarget: ElementRef, 
    public fb: FormBuilder,
    public service: VoiceRecognitionService, 
    private http: HttpClient
  ) {
    this.scrollTarget = scrollTarget
    this.form = this.fb.group({
      searchRadio: ['byTags']
    });


    
  }

  ngOnInit(): void {
    this.imageService.images$.subscribe((value) => this.images = value)

    this.searchFilterService.isFiltresVisible$.subscribe((value) => this.isFiltresVisible = value)
    this.searchFilterService.imagesSearchInput$.subscribe((value) => this.imagesSearchByInput = value)
    //this.service.isSpeechEnd$.subscribe((value) => this.isSpeechEnd = value)
    this.service.textRecognitionValue$.subscribe((value) => this.textRecognitionValue = value)
    this.service.isStoppedSpeechRecognize$.subscribe((value) => this.isStoppedSpeechRecognize = value)

    
    this.service.init();
    this.form = this.fb.group({searchRadio: ['byText']})
  }

  ngOnDestroy(): void {
      this.service.textRecognitionValueSubject.unsubscribe();
      this.service.isStoppedSpeechRecognizeSubject.unsubscribe();
  }

  changeSearchHandler(e: any) {
    this.searchByTags = !this.searchByTags
  }

  onOptionChangeSortDate(){
    console.log(this.sortedCreatedAt);
    
    this.searchFilterService.sortedCreatedAtSubject.next(this.sortedCreatedAt)
    this.searchFilterService.optionChangeSortDate()
  }

  handleSearchCognitiveService(event: any){
    this.searchValue = event.target.value;

    if(event.key !== "Enter"){
      return
    }

    this.handleSearchImageText();
  }
  

  handleFilterImages(){
    this.svgColor = "#7905a4"
    this.searchFilterService.handleFilterImages();
  }

  handleSearchImageText(){
    console.log(this.searchValue, "searchValue");
    
    this.imageService.getImagesByCognitiveSearch(this.searchValue).subscribe((data: any) => {
      this.imagesSearchByInput = data
   
      
      this.searchFilterService.imagesSearchInputSubject.next(this.imagesSearchByInput)
      this.handleFilterImages()
      this.imageService.imagesSubject.next(this.imagesSearchByInput)
    })
  }

  startService() {
    this.service.start();
    this.handleFilterImages();

    if(this.isStoppedSpeechRecognize == false){
    
      this.service.textRecognitionValueSubject.next("")
    }
  }

  onOptionChangeAccuracy(){
    this.searchFilterService.filterSimilaritySubject.next(this.filter)
    this.searchFilterService.optionChangeAccuracyHandler()
  }


  onOptionChangeOrientation() {
    this.searchFilterService.selectedOptionSubject.next(this.selectedOption)
    this.searchFilterService.orientationImageHandler()
  }
  
  clearAllFilter(){
    this.tagsService.setSelectedTags([])
    this.imageService.imagesSubject.next(this.imageService.imagesInitialSubject.getValue())
    this.searchFilterService.filterSimilaritySubject.next("")
    this.searchFilterService.sortedCreatedAtSubject.next("")
    this.searchFilterService.selectedOptionSubject.next("")
    this.isButtonDisabled = this.searchFilterService.handleFilterImages();
  }



}
