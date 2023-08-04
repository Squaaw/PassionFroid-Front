import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faEllipsis, faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {

  @Input() item: any;
  @Input() isMultipleSelectionImages: any;
  @Output() showModalEvent = new EventEmitter<any>();
  isChecked: boolean = false

  tags = []
  faEllipsis = faEllipsis;
  faClose = faClose
  showVar: boolean = false;
  displayModal: boolean = false;
  
  constructor() {}
  
  ngOnInit(): void {
  }

  toggleEditComponent(){
    this.showVar = !this.showVar;
  }

  getImageClass(width: number, height: number): string {
    if (width > height) {
      return 'horizontal-image';
    } else {
      return 'vertical-image';
    }
  }
 
  showModal(item: any){
    this.showModalEvent.emit(item)
  }
}
