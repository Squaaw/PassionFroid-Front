import { Component, Input, OnInit } from '@angular/core';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ModalUploadComponent } from '../modal-upload/modal-upload.component';
import { ImageService } from 'src/app/services/image/image.service';
import { BehaviorSubject } from 'rxjs';
import { ImageDataAzure } from 'src/app/models/image';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CardComponent implements OnInit {

  @Input() value: any;
  faEllipsis = faEllipsis;
  showVar: boolean = false;


  toggleEditComponent(){
      this.showVar = !this.showVar;
  }
  
  constructor() {

    
  }
  
  ngOnInit(): void {

  }

 

}
