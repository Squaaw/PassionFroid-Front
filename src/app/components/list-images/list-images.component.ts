import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { faSearch, faChevronDown, faList, faAdd } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ModalUploadComponent } from 'src/app/components/modal-upload/modal-upload.component';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { ImageService } from 'src/app/services/image/image.service';
import { ImageDataAzure } from 'src/app/models/image';
import { SearchFilterService } from 'src/app/services/search-filter/search-filter.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TagsService } from 'src/app/services/tags/tags.service';

@Component({
  selector: 'app-list-images',
  templateUrl: './list-images.component.html',
  styleUrls: ['./list-images.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0)',
      })),
      state('out', style({
        transform: 'translateX(100%)',
      })),
      transition('in => out', animate('800ms ease-out')),
      transition('out => in', animate('800ms ease-in')),
    ]),
  ],
})
export class ListImagesComponent implements OnInit, OnDestroy {

  images: ImageDataAzure[] = [];
  imagesFiltered: ImageDataAzure[] = [];
  faSearch = faSearch;
  faChevronDown = faChevronDown;
  faList = faList;
  faAdd = faAdd;
  gallery: boolean = true;
  table: boolean = false;
  scrollTarget: ElementRef;
  isFiltresVisible: boolean = true;
  isMultipleSelectionImages: boolean = false;

  constructor(
    public dialog: MatDialog, 
    scrollTarget: ElementRef, 
    private imageService: ImageService, 
    private searchFilterService: SearchFilterService,
    private tagsService: TagsService
    ) {
    this.scrollTarget = scrollTarget
  }

  toggleFiltres(): void {
    this.isFiltresVisible = !this.isFiltresVisible;
    this.searchFilterService.setFiltresVisible(this.isFiltresVisible)
  }

  ngOnInit(): void {
    this.searchFilterService.isFiltresVisible$.subscribe((value) => this.isFiltresVisible = value)
    this.searchFilterService.imagesFiltered$.subscribe((value) => this.imagesFiltered = value)
    this.imageService.isMultipleSelectionImages$.subscribe((value) => this.isMultipleSelectionImages = value)
  }

  disableScroll() {
    disableBodyScroll(this.scrollTarget.nativeElement);
  }

  enableScroll() {
    enableBodyScroll(this.scrollTarget.nativeElement);
  }

  ngOnDestroy() {
    clearAllBodyScrollLocks();
  }

  openDialog() {
    this.disableScroll();

    const dialogRef = this.dialog.open(ModalUploadComponent, {
      width: '250px',
      height: '250px',
      disableClose: true,
      data: { name: "upload" },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      clearAllBodyScrollLocks();
    });
  }

  toggleViewImages(component: string) {
    if (component === 'gallery') {
      this.gallery = true;
      this.table = false;
    } else if (component === 'table') {
      this.gallery = false;
      this.table = true;
    }
  }
  
  handleMultipleSelection(){
    this.isMultipleSelectionImages = !this.isMultipleSelectionImages;
  }
}
