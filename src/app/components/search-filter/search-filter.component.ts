import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { faSearch, faChevronDown, faList, faAdd } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ModalUploadComponent } from 'src/app/components/modal-upload/modal-upload.component';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks} from 'body-scroll-lock';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit, OnDestroy {

  faSearch = faSearch;
  faChevronDown = faChevronDown;
  faList = faList;
  faAdd = faAdd;
  gallery: boolean = true;
  table: boolean = false;
  images: string[];
  

  scrollTarget: ElementRef;

  constructor(public dialog: MatDialog, scrollTarget: ElementRef, private imageService: ImageService) {
    this.scrollTarget = scrollTarget
    this.images = this.imageService.get();
  }

  ngOnInit(): void {
    
  }

  disableScroll() {
    // 3. Disable body scroll
    disableBodyScroll(this.scrollTarget.nativeElement);
  }

  enableScroll() {
    // 4. Re-enable body scroll
    enableBodyScroll(this.scrollTarget.nativeElement);
  }

  ngOnDestroy() {
    // 5. Useful if we have called disableBodyScroll for multiple target elements,
    // and we just want a kill-switch to undo all that.
    // OR useful for if the `hideTargetElement()` function got circumvented eg. visitor
    // clicks a link which takes him/her to a different page within the app.
    clearAllBodyScrollLocks();
  }

  openDialog() {
    this.disableScroll();

    const dialogRef = this.dialog.open(ModalUploadComponent, {
      width: '250px',
      height: '250px',
      disableClose: true,
      data: {name: "upload"},
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      clearAllBodyScrollLocks();
    });
  }

  toggleComponents(component: string) {
    if (component === 'gallery') {
      this.gallery = true;
      this.table = false;
    } else if (component === 'table') {
      this.gallery = false;
      this.table = true;
    }
  }



  

}
