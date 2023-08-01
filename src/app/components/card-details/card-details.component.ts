import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageService } from 'src/app/services/image/image.service';
import { TagsService } from 'src/app/services/tags/tags.service';



@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss'],
})
export class CardDetailsComponent implements OnInit {

  @Input() item: any;
  @Output() displayModalEvent = new EventEmitter<boolean>();


  constructor(private tagsService: TagsService, private imagesService: ImageService) { }

  ngOnInit(): void {
    
    
  }

  byteLength(base64: string){
    if(!base64)
      return
    var src = base64;
    var base64str = src.substring(src.indexOf(',') + 1)
    var decoded = atob(base64str);

    return decoded.length
  }

  formatBytes(bytes: any, decimals = 2) {
    if (!+bytes) return '0 Octet'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  getImgSize(base64: string){
    if(!base64)
      return

    var img = new Image();
    img.src = base64;

    return `${img.width} x ${img.height}`
  }

  getImagesByTag(tag: string){
    
    const tagArray = [tag]
    this.tagsService.getImagesByTag(tagArray).subscribe({
      next: (value: any) => {

        this.imagesService.setImages(value)
        this.displayModalEvent.emit(false);
      },
      error: (e) => console.error(e),
      complete: () => console.info('Http request complete')
    })
  }

  shareDisplayMode(event: any = undefined){
    this.displayModalEvent.emit(event)
  }

}
