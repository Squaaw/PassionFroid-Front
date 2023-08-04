import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageService } from 'src/app/services/image/image.service';
import { faTrash, faClose, faList, faFileArrowUp } from '@fortawesome/free-solid-svg-icons';
import { animate, style, transition, trigger } from '@angular/animations';
import { HttpRequestMessageService } from 'src/app/services/http-request-message/http-request-message.service';
import { HttpRequestMessage } from 'src/app/services/http-request-message/http-request-message.interface';

@Component({
    selector: 'app-modal-upload',
    templateUrl: './modal-upload.component.html',
    styleUrls: ['./modal-upload.component.scss'],
    styles: [
        
    ],
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
export class ModalUploadComponent implements OnInit {

    @ViewChild('imageInput', { static: false }) imageInput: ElementRef;
    
    allFileNames: string[] = []
    fileName = '';
    loaded: boolean = false;
    imageLoaded: boolean = false;
    imageSrc: any = null;
    faUpload = faFileArrowUp;
    faTrash = faTrash;
    faClose = faClose;
    faList = faList;
    containerName = "passionfroid-storage-container";
    urlImage: string = '';
    titleModal = "un fichier local";
    reader: FileReader = new FileReader();
    gallery: boolean = true;
    table: boolean = false;
    selectedOption: string = 'file';
    httpErrorMessage: HttpRequestMessage = {msg : "", status: 0}
    showAlert = true;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any, 
        private http: HttpClient, 
        private sanitizer: DomSanitizer,
        private imageService: ImageService,
        private httpRequestMessageService: HttpRequestMessageService
    ) {
        this.imageInput = new ElementRef(null);
    }

    ngOnInit(): void {
        this.httpRequestMessageService.httpMessageRequest$.subscribe((value: HttpRequestMessage) => {
            this.httpErrorMessage.msg = value.msg
            this.httpErrorMessage.status = value.status
            
            if(this.httpErrorMessage.msg.length > 0){
    
              setTimeout(() => {
                this.showAlert = false;
              }, 3000); // Réglez la durée (en millisecondes) selon vos besoins
            }
          })
    }

    onSelected(e: any): void {
        this.selectedOption = e.target.value;
        if(this.selectedOption == "url"){
            this.titleModal = "une url";
        } else {
            this.titleModal = "un fichier local"
        }
    }

    onDialogClose(value: any): void {
      if(value == false){
        this.httpRequestMessageService.sethttpMessageRequest("", 0)
      }
    }
}
