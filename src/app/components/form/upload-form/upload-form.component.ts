import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { clearAllBodyScrollLocks } from 'body-scroll-lock';
import { faTrash, faClose, faList, faFileArrowUp, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ImageDataAzure } from 'src/app/models/image';

import { ImageService } from 'src/app/services/image/image.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit, OnChanges {

  @ViewChild('imageInput', { static: false }) imageInput!: ElementRef;
  selectedImages: ImageDataAzure[] = [];
  images: ImageDataAzure[] = [];
  imagesInitial: ImageDataAzure[] = [];
  allFileNames: string[] = [];
  fileName = '';
  loaded = false;
  imageLoaded = false;
  imageSrc: any = null;
  faUpload = faFileArrowUp;
  faTrash = faTrash;
  faClose = faClose;
  faList = faList;
  faPlus = faPlus;
  urlImage = '';
  titleModal = "un fichier local";
  reader: FileReader = new FileReader();
  gallery = true;
  table = false;
  selectedOption = 'file';
  isDragOver = false;
  droppedImage: any = null;
  characterUrl: any = "";
  height = 0;
  width = 0;
  maxIDImage = 0;
  httpMessageSuccess: string = ""

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.images = this.imageService.imagesSubject.getValue();
    this.imagesInitial = this.imageService.imagesInitialSubject.getValue();
  }
  
  ngOnChanges(changes: SimpleChanges){
    if (changes['imagesVertical']) {
      
    }
  }

  onSelectedRadioButtonImage(e: any): void {
    this.selectedOption = e.target.value;
    this.titleModal = this.selectedOption === "url" ? "une url" : "un fichier local";
  }

  handleFileUpload(files: any): void {
    if (files) {
      this.imageService.getMaxImageIdNextIncrement().toPromise()
        .then((data) => {
          this.maxIDImage = data.max_id;
          this.processFiles(files, this.maxIDImage);
        })
        .catch((error) => {
          console.error("Une erreur s'est produite lors de la récupération de l'ID d'image maximum :", error);
          // Gérer l'erreur
        });
    }
    this.loaded = false;
  }
  
  processFiles(files: any, maxId: number): void {
    let lastImageId = maxId - 1;
  
    for (let i = 0; i < files.target.files.length; i++) {
      const file: any = files.target.files[i];
      const name = file.name;
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const base64 = event.target.result;
        const imageData = new ImageDataAzure(
          lastImageId && lastImageId + 1,
          name,
          base64
        );
  
        this.selectedImages.push(imageData);
  
        this.table = true;
        this.gallery = false;
        this.loaded = true;
        if (this.selectedImages.length > 0 && this.selectedImages[this.selectedImages.length - 1].id !== null) {
          lastImageId = this.selectedImages[this.selectedImages.length - 1].id!;
        } else {
          lastImageId = 0;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onUrlInputChange(event: any) {
    const enteredCharacter = event.target.value;
    this.characterUrl = enteredCharacter;
  }

  onAddUrlImage() {
    const imageName = this.characterUrl.split("/").pop();
    if (imageName.length) {
      this.imageService.getMaxImageIdNextIncrement().toPromise()
      .then((maxId) => {
        let maxIdd = maxId.max_id;
        if (this.selectedImages.length >= 1) {
          maxIdd = this.selectedImages.reduce((max: any, imageData: any) => {
            return imageData.id > max ? imageData.id + 1 : max;
          }, 0);
        }
        this.urlToB64(this.characterUrl)
        .then((data: any) => {
            const imageData = new ImageDataAzure(maxIdd, imageName, data);
            this.selectedImages.push(imageData);
            this.urlImage = "";
        });
      });
    }
  }

  urlToB64(url: string) {
    return fetch(this.urlImage)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));
  }

  async onFormSubmit(form: NgForm) {
    let imageLoadPromise
    for (let image of this.selectedImages) {
      try {
        imageLoadPromise = new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = image.base64;
          img.addEventListener('load', () => {
            this.width = img.width;
            this.height = img.height;
            resolve(); // Resolve the Promise when the image is loaded
          });
          img.addEventListener('error', () => {
            reject(new Error('Failed to load image')); // Reject the Promise if image loading fails
          });
        });
      } catch (err) {
        console.log(err, "err");
      }
        // Wait for the image loading Promise to resolve
        await imageLoadPromise;
        
        this.imageService.add(image.name, image.base64, this.width, this.height).subscribe(
          {
            next: (data: any) => {
              console.log(data, "data");
              this.httpMessageSuccess = "Les"
              this.imageService.getHttpImages().subscribe(
               {
                 next: (images: ImageDataAzure[]) => {
                   this.imageService.imagesInitialSubject.next(images)
                   this.imageService.imagesSubject.next(images)
                   this.closeModal();
                 },
                 error: (e) => {
                  
                 },
                 complete: () => {}
                }
              )
            },
            error: (e) => console.log(e),
            complete: () => {}
          
         })
        
      
    }
   
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    
    this.imageService.getMaxImageIdNextIncrement().subscribe(maxId => {
      let nextId = maxId.max_id;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const imageFile = files[i];
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const imageData = new ImageDataAzure(nextId, imageFile.name, e.target.result);
            this.droppedImage = e.target.result;
            this.selectedImages.push(imageData);
            nextId++;
          };
          reader.readAsDataURL(imageFile);
        }
      }
    });
    this.isDragOver = false;
  }
  
  deleteImage(index: number) {
    this.imageService.deleteImage(index);

    if (this.imageInput && this.imageInput.nativeElement)
      this.imageInput.nativeElement.value = '';

    if (this.selectedImages.length <= 0)
      this.loaded = false;
  }

  deleteImageUploaded(index: number) {
    this.selectedImages.splice(index, 1);

    if(this.imageInput && this.imageInput.nativeElement)
      this.imageInput.nativeElement.value = '';
    
    if(this.selectedImages.length <= 0) 
      this.loaded = false;
  }

  toggleViewImages(component: string) {
    this.gallery = component === 'gallery';
    this.table = component === 'table';
  }

  closeModal(): void {
    clearAllBodyScrollLocks();
    this.dialog.closeAll();
  }
}