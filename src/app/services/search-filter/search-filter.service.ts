import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImageDataAzure } from 'src/app/models/image';
import { ImageService } from '../image/image.service';

@Injectable({
  providedIn: 'root'
})
export class SearchFilterService {

  isFiltresVisibleSubject = new BehaviorSubject<boolean>(false);
  isFiltresVisible$ = this.isFiltresVisibleSubject.asObservable();

  imagesFilteredSubject = new BehaviorSubject<ImageDataAzure[]>([]);
  imagesFiltered$ = this.imagesFilteredSubject.asObservable();

  imagesSearchInputSubject = new BehaviorSubject<ImageDataAzure[]>([]);
  imagesSearchInput$ = this.imagesSearchInputSubject.asObservable();

  filterSimilaritySubject = new BehaviorSubject<string>("");
  filterSimilarity$ = this.filterSimilaritySubject.asObservable();

  selectedOptionSubject = new BehaviorSubject<string>("");
  selectedOption$ = this.selectedOptionSubject.asObservable();

  sortedCreatedAtSubject = new BehaviorSubject<string>("");
  sortedCreatedAt$ = this.sortedCreatedAtSubject.asObservable();

  initialImages: ImageDataAzure[] = [];

  isActiveFilter: boolean = false;


  constructor(private imageService: ImageService) { 
    this.imageService.imagesInitial$.subscribe((value) => this.initialImages = value)
  }

  setFiltresVisible(isVisible: boolean) { this.isFiltresVisibleSubject.next(isVisible); }
  setImageSearchInput(images: ImageDataAzure[]) { this.imagesSearchInputSubject.next(images); }
  setImagesFiltered(images: ImageDataAzure[]) { this.imagesFilteredSubject.next(images); }

  handleFilterImages(){
    
    this.isActiveFilter = true;
    let imagesArray = []
    
    if(this.imagesSearchInputSubject.getValue().length > 0){
      imagesArray = this.imagesSearchInputSubject.getValue()
    } else {
      imagesArray = this.initialImages
    }

    this.imagesFilteredSubject.next(imagesArray.filter((image: any) => {
      if(image.width && image.height){
        if(this.selectedOptionSubject.getValue() == "Vertical")
          return image.width < image.height
        else
          return image.width > image.height
      }
      return image
    }))
    
    this.imagesFilteredSubject.next(this.imagesFilteredSubject.getValue().sort((a: any, b) => {
      const dateA = a.created_at && new Date(a.created_at).getTime()
      const dateB = b.created_at && new Date(b.created_at).getTime();
  
      if (this.sortedCreatedAtSubject.getValue() === "recent") {
        return dateB && dateA && dateB - dateA;
      } else {
        return dateA && dateB && dateA - dateB;
      }
    }));
    
    this.imagesFilteredSubject.next(this.imagesFilteredSubject.getValue().filter((image) => {
      if(image.similarity && this.filterSimilaritySubject.getValue() !== ""){
        if(this.filterSimilaritySubject.getValue() == "high"){
          return image.similarity >= 30
        } 
      }
      return image
    }))

    return this.isActiveFilter;
  }

  orientationImageHandler(){
    this.handleFilterImages()
    this.imageService.imagesSubject.next(this.imagesFilteredSubject.getValue())
  }

  optionChangeSortDate(){
    this.handleFilterImages()
    this.imageService.imagesSubject.next(this.imagesFilteredSubject.getValue())
  }

  optionChangeAccuracyHandler(){
    if(this.filterSimilaritySubject.getValue() == "high"){
      this.imagesFilteredSubject.next(this.imagesSearchInputSubject.getValue().filter((imageData: any) => {
          return imageData.similarity >= 30
        }));
        this.imageService.imagesSubject.next(this.imagesFilteredSubject.getValue())
      } else {
        this.imagesFilteredSubject.next(this.imagesSearchInputSubject.getValue().filter((imageData: any) => {
          return imageData.similarity < 30
        }));
        this.imageService.imagesSubject.next(this.imagesSearchInputSubject.getValue())
      }
  }

}
