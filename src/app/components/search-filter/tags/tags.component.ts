import { Component, OnInit, OnChanges, SimpleChanges, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ImageDataAzure } from 'src/app/models/image';
import { TagsService } from 'src/app/services/tags/tags.service';
import { SearchFilterComponent } from '../search-filter.component';
import { ImageService } from 'src/app/services/image/image.service';
import { SearchFilterService } from 'src/app/services/search-filter/search-filter.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit, OnChanges, AfterViewChecked {
  form: FormGroup;
  selectedTag: any[] = []
  imagesSearchByInput: any[] = []
  autocompleteItemsAsObjects = [
   
  ];

  constructor(
    private tagsService: TagsService, 
    private readonly changeDetectorRef: ChangeDetectorRef, 
    private searchComp: SearchFilterComponent,
    private imagesService: ImageService,
    private searchFilterService: SearchFilterService
    ) { 
    
    this.form = new FormBuilder().group({
      chips: [['chip'], []]
  });
  }

  ngOnInit(): void {
    this.tagsService.tagsArray$.subscribe((data:any) => {
      this.autocompleteItemsAsObjects = data
    })

    this.searchFilterService.imageSearchInput$.subscribe((value) => this.imagesSearchByInput = value)

  }

  ngOnChanges(changes: SimpleChanges){
    console.log(changes);
    
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  handleSearchImageTags(event: any){
    if(event.key !== "Enter")
      return

      const arr = []
      if(this.selectedTag.length > 0){
        for(let tag of this.selectedTag){
          arr.push(tag.value)
        }
      }
      
      
      this.tagsService.getImagesByTag(arr).subscribe({
        next: (value: any) => {
          this.searchComp.handleFilterImages()
          console.log(value, "value tags");
          
          this.tagsService.setImagesByTags(value)
          this.searchFilterService.setImagesFiltered(value)
          this.searchFilterService.setImageSearchInput(value)
          this.imagesService.setImages(value)
        },
        error: (e) => console.error(e),
        complete: () => console.info('Http request complete')
      })
  }
}
