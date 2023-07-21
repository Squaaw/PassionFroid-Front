import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImageDataAzure } from 'src/app/models/image';

@Injectable({
  providedIn: 'root'
})
export class SearchFilterService {

  isFiltresVisibleSubject = new BehaviorSubject<boolean>(false);
  isFiltresVisible$ = this.isFiltresVisibleSubject.asObservable();

  imageFilteredSubject = new BehaviorSubject<ImageDataAzure[]>([]);
  imageFiltered$ = this.imageFilteredSubject.asObservable();

  imageSearchInputSubject = new BehaviorSubject<ImageDataAzure[]>([]);
  imageSearchInput$ = this.imageSearchInputSubject.asObservable();

  constructor() { }

  setFiltresVisible(isVisible: boolean) { this.isFiltresVisibleSubject.next(isVisible); }
  setImageSearchInput(images: ImageDataAzure[]) { this.imageSearchInputSubject.next(images); }
  setImagesFiltered(images: ImageDataAzure[]) { this.imageFilteredSubject.next(images); }
}
