import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { faUpload, faTrash, faClose, faList, faFileArrowUp, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ImageDataAzure } from 'src/app/models/image';

import { ImageService } from 'src/app/services/image/image.service';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {

  @ViewChild('imageInput', { static: false }) imageInput: ElementRef;
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
  urlImage: string = '';
  titleModal = "un fichier local";
  reader: FileReader = new FileReader();
  gallery: boolean = true;
  table: boolean = false;
  selectedOption: string = 'file';
  isDragOver = false;
  droppedImage: any = null;
  characterUrl: any = ""

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
    if (this.selectedOption == "url") {
      this.titleModal = "une url";
    } else {
      this.titleModal = "un fichier local"
    }
  }

  onFileSelected(files: any): void {
    // Parcourir les fichiers uploadés
    if (files) {

      for (let i = 0; i < files.target.files.length; i++) {
        const file: any = files.target.files[i];
        const name = file.name;
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const base64 = event.target.result;

          const imageData = new ImageDataAzure(name, base64, null, null, 1);

          this.selectedImages.push(imageData);

          this.loaded = true;
        };
        reader.readAsDataURL(file);

      }
    }
    this.loaded = false;
  }

  onInputChange(event: any) {
    const enteredCharacter = event.target.value;
    this.characterUrl = enteredCharacter
  }

  onAddUrlImage() {
    let stringBase64 = "";
    let imageName = this.characterUrl.split("/").pop()

    this.urlToB64(this.characterUrl)
      .then((data: any) => {
        const imageData = new ImageDataAzure(imageName, data, null, null, 1);
        this.selectedImages.push(imageData)
      })
  }

  async urlToB64(url: string) {
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

    for (let image of this.selectedImages) {
      stringBase64 = image.base64.split(",")[1]
      this.imageService.add(image.name, image.base64).catch((err) => { console.log(err, "err"); })
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
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imageData = new ImageDataAzure(imageFile.name, e.target.result, null, null, 1);
          this.droppedImage = e.target.result;
          this.selectedImages.push(imageData)
        };
        reader.readAsDataURL(imageFile);
      }
    }
    this.isDragOver = false;
  }


  clearImg(index: number) {
    this.imageService.deleteImage(index)

    if (this.imageInput && this.imageInput.nativeElement) {
      this.imageInput.nativeElement.value = '';
    }

    if (this.selectedImages.length <= 0) {
      this.loaded = false;
    }
  }

  clearImgUploaded(index: number) {
   this.selectedImages.splice(index, 1)

    if (this.imageInput && this.imageInput.nativeElement) {
      this.imageInput.nativeElement.value = '';
    }

    if (this.selectedImages.length <= 0) {
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
