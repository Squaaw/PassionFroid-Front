import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Output } from '@angular/core';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { ImageDataAzure } from 'src/app/models/image';
import { HttpErrorsService } from 'src/app/services/errors/http-errors.service';
import { ImageService } from 'src/app/services/image/image.service';
import { TagsService } from 'src/app/services/tags/tags.service';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => active', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 }))
      ]),
      transition('* => void', [
        animate(1000, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class Home implements OnInit {
  faRefresh = faRefresh;
  images: ImageDataAzure[] = [];
  imagesVertical: ImageDataAzure[] = [];
  imagesHorizontal: ImageDataAzure[] = [];
  httpErrorMessage: string = ""
  showAlert = true;
  constructor(private imageService: ImageService, private tagsService: TagsService, private httpErrorService: HttpErrorsService) {
    
      
  }

  ngOnInit(): void {
    this.loadImages()
  }

  onClickReloadData(){
    this.loadImages();
    this.showAlert = false;
  }
  
  private loadImages(){
    this.imageService.getHttpImages().subscribe({
      next: (v) => {
        console.log(v, "v");
        
        this.images = v
        this.imageService.imagesSubject.next(v)
        this.imageService.imagesInitialSubject.next(v)
        this.httpErrorService.sethttpMessageRequest("", 0)
      },
      error: (e) => {
        this.httpErrorService.httpMessageRequest$.subscribe((value) => {
         
          this.httpErrorMessage = value.msg;
          this.showAlert = true;
            
        })
      },
      complete: () => {}
    })

    this.tagsService.getHttpTags().subscribe((tags: any) => {
      this.tagsService.setTagsArray(tags.map((tag: string) => tag[0].toUpperCase() + tag.substring(1)).sort())
   })

  }
}
