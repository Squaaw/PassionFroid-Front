import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { faEdit, faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';
import { ImageService } from 'src/app/services/image/image.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Input() isModal: boolean = false;
  faEdit = faEdit;
  faTrash = faTrash;
  faDownload = faDownload;
  @Input() item: any;
  @Output() displayModalEditEvent = new EventEmitter<boolean>();

  constructor(public dialog: MatDialog, private imageService: ImageService) { }

  ngOnInit(): void {
  }


  deleteImage(index: number) {
    if (index !== -1) {
      this.imageService.deleteImage(index)
    }
    this.displayModalEditEvent.emit(false)
  }

  downloadFile(base64:string,fileName:string){
    const src = base64;
    const link = document.createElement("a")
    link.href = src
    link.download = fileName
    link.click()
    link.remove()
  }

}
