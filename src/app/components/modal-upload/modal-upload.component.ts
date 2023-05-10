import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { MatRadioButton, MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { FormControl, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { ImageService } from 'src/app/services/image.service';
import { faUpload, faTrash, faClose, faList, faFileArrowUp } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-modal-upload',
    templateUrl: './modal-upload.component.html',
    styleUrls: ['./modal-upload.component.scss'],
    styles: [
        
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

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any, 
        private http: HttpClient, 
        private sanitizer: DomSanitizer,
        private imageService: ImageService
    ) {
        this.imageInput = new ElementRef(null);
    }

    ngOnInit(): void {
    }

    onSelected(e: any): void {
        this.selectedOption = e.target.value;
        if(this.selectedOption == "url"){
            this.titleModal = "une url";
        } else {
            this.titleModal = "un fichier local"
        }
    }

    
    
    toDataURL(url: string){
      
    }  


    
}
