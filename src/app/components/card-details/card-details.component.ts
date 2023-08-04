import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ImageService } from 'src/app/services/image/image.service';
import { TagsService } from 'src/app/services/tags/tags.service';
import { faPen, faCheck, faClose } from '@fortawesome/free-solid-svg-icons';
import { HttpRequestMessageService } from 'src/app/services/http-request-message/http-request-message.service';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss'],
})
export class CardDetailsComponent implements OnInit {

  @Input() item: any;
  @Output() displayModalEvent = new EventEmitter<boolean>();

  faPen = faPen
  faCheck = faCheck
  faClose = faClose
  editDisplay = false
  editTags = false
  editableItemName: string = "test";
  httpRequestMessage = {msg : "", status: 0}
  showAlert = true;
  selectedTags: string[] = []
  urlToBase64: string = ""

  clear(){
    this.editableItemName = this.item.name;
    this.editDisplay = false;
  }

  clearTags(){
    this.selectedTags = []
    this.editTags = false;
  }

  constructor(
    private tagsService: TagsService, 
    private imagesService: ImageService, 
    private httpRequestMessageService: HttpRequestMessageService
  ) {}
  
  ngOnInit(): void {
    this.editableItemName = this.item.name;
  }

  shareDisplayMode(event: any = undefined){
    this.displayModalEvent.emit(event)
  }

  byteLength(source: string){
    if(!source)
      return

      this.imagesService.urlToB64(source).then((data: any) => {
        this.urlToBase64 = data
    }).then(()=> {

      var src = this.urlToBase64;
      var base64str = src.substring(src.indexOf(',') + 1)
      var decoded = atob(base64str);
  
      return decoded.length
    })
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

  onClickTags(tag: string){
    if(this.editTags){
      this.addTagsToRemove(tag)
    } else {
      this.getImagesByTag(tag)
    }
  }

  editTag(){
    this.editTags = true;
  }

  addTagsToRemove(tag: string){
    if(this.selectedTags.includes(tag)){
      let tagIndex = this.selectedTags.indexOf(tag)

      this.selectedTags.splice(tagIndex, 1)
    } else {
      this.selectedTags.push(tag)
    }
  }

  removeTags(){
    this.tagsService.removeTags(this.item.id, this.selectedTags).subscribe({
      next: (value: any) => {
        
        for(let tag of this.selectedTags){
          if(this.item.tags.includes(tag)){
            let tagIndex = this.item.tags.indexOf(tag)
            this.item.tags.splice(tagIndex, 1)
          }
        }
        this.selectedTags = []
        this.editTags = false
      },
      error: (e) => console.error(e),
      complete: () => console.info('Http request complete')
    })
  }

  getImagesByTag(tag: string){
    const tagArray = [tag]

    this.tagsService.getImagesByTag(tagArray).subscribe({
      next: (value: any) => {
        this.imagesService.setImages(value)
        this.displayModalEvent.emit(false);
      },
      error: (e) => console.error(e)
    })
  }

  onEditName() {
    this.editDisplay = true;
  }

  onValidName(id: number) {
    this.editDisplay = false;

    this.imagesService.updateImageName(id, this.editableItemName).subscribe({

      next: (value: any) => {
        console.log(value.msg, "good");
        this.httpRequestMessageService.sethttpMessageRequest(value.msg, 200)
        this.httpRequestMessage = value
        if(this.httpRequestMessage.msg.length > 0){
    
          setTimeout(() => {
            this.showAlert = false;
          }, 3000);
        }
      },
      error: (e) => console.error(e),
      complete: () => console.info('Http request complete')
    })
    
  }

}
