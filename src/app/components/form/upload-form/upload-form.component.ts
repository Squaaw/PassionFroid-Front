import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { faUpload, faTrash, faClose, faList, faFileArrowUp, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ImageData, ImagesData } from 'src/app/models/image';

import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {

  @ViewChild('imageInput', { static: false }) imageInput: ElementRef;
  image: ImageData = {
    id: 0,
    name: "",
    base64: ""
  };
  imagesData: ImagesData = [];
  selectedImages: any = [];
  allFileNames: any = [];
  fileName = '';
  loaded: boolean = false;
  imageLoaded: boolean = false;
  imageSrc: any = null;
  faUpload = faFileArrowUp;
  faTrash = faTrash;
  faClose = faClose;
  faList = faList;
  faPlus = faPlus;
  containerName = "passionfroid-storage-container";
  urlImage: string = '';
  titleModal = "un fichier local";
  reader: FileReader = new FileReader();
  gallery: boolean = true;
  table: boolean = false;
  selectedOption: string = 'file';
  isDragOver = false;
  droppedImage: any = null;
  characterUrl: any = ""
  imageId: number = 0
  constructor(
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

  handleInputChange(e: any) {
    var parts = e.target.value.split("\\");
    
    var lastPart = parts[parts.length - 1];
    this.fileName = lastPart.split(".")[0]
    
    var files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        var pattern = /image-*/;
        this.image.name = file.name
        //this.images.push(file.name)
        if(file.type != undefined){
            if (!file.type.match(pattern)) {
                alert('invalid format');
                return;
            }
        }

        var reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);
    }
    
    
    this.loaded = false;
}

_handleReaderLoaded(e: any) {
    var reader = e.target;
    this.imageSrc = reader.result;
    this.imagesData.push(this.imageSrc);
    this.loaded = true;
}

onInputChange(event: any){
  console.log(event.target.value, "target");
  
  
  const enteredCharacter = event.target.value; // Retrieve the entered character from the event object
  this.characterUrl = enteredCharacter
  console.log(this.characterUrl, "this.characterUrl");
}

onAddUrlImage(){
  this.imageId = this.imageId+=1
  let stringBase64 = "";
  let imageName = this.characterUrl.split("/").pop()
  
  
  this.urlToB64(this.characterUrl)
        .then((data: any) => {
          console.log(data, "les datas");
          this.imagesData.push(data)
          this.image.id = this.imageId
          this.image.name = imageName
          this.image.base64 = data
          this.selectedImages.push(data)
          this.allFileNames.push(imageName)
          this.imagesData.push(this.image)

          console.log(this.imagesData, "this.image");
        })
  
}

async urlToB64(url: string){
    return fetch(this.urlImage)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        }))
}

onFormSubmit(form: NgForm) {
    let stringBase64 = "";
  

    console.log(this.allFileNames, "Les images");
    for(let image of this.selectedImages){
      stringBase64 = image.split(",")[1]
      //this.imageService.add(this.fileName, stringBase64).catch((err) => {console.log(err, "err");})
    }
    
    
}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
}

onDrop(event: DragEvent): void {
    event.preventDefault();
    
    var files = event.dataTransfer?.files;

    if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const imageFile = files[i];
            this.allFileNames.push(imageFile.name)

            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.droppedImage = e.target.result;
              this.selectedImages.push(this.droppedImage)
            };
            reader.readAsDataURL(imageFile);
        }

      
    }
    this.isDragOver = false;
    
  }


  clearImg(index: number){
        
    this.selectedImages.splice(index, 1)
    this.allFileNames.splice(index, 1)
   
    if(this.imageInput && this.imageInput.nativeElement) {
        this.imageInput.nativeElement.value = '';
    }

    if(this.selectedImages.length <= 0){
        this.loaded = false;
    }
    
  }

  toggleComponents(component: string) {
    console.log(this.gallery, "le composant");
    
    if (component === 'gallery') {
      this.gallery = true;
      this.table = false;
    } else if (component === 'table') {
      this.gallery = false;
      this.table = true;
    }
  }

}
