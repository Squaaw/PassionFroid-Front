import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { faSearch, faChevronDown, faList, faAdd } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ModalUploadComponent } from 'src/app/components/modal-upload/modal-upload.component';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { ImageService } from 'src/app/services/image/image.service';
import { ImageDataAzure } from 'src/app/models/image';

@Component({
  selector: 'app-list-images',
  templateUrl: './list-images.component.html',
  styleUrls: ['./list-images.component.scss']
})
export class ListImagesComponent implements OnInit, OnDestroy {

  imagesVertical: ImageDataAzure[] = [];
  imagesHorizontal: ImageDataAzure[] = [];
  images: ImageDataAzure[] = [];

  faSearch = faSearch;
  faChevronDown = faChevronDown;
  faList = faList;
  faAdd = faAdd;
  gallery: boolean = true;
  table: boolean = false;
  scrollTarget: ElementRef;

  constructor(public dialog: MatDialog, scrollTarget: ElementRef, private imageService: ImageService) {
    this.scrollTarget = scrollTarget
  }

  ngOnInit(): void {
   // this.imageService.images$.subscribe((value) => this.images = value)
   // this.imageService.imagesHorizontal$.subscribe((value) => this.imagesHorizontal = value)
    //this.imageService.imagesVertical$.subscribe((value) => this.imagesVertical = value) 
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

}
