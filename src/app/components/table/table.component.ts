import { Component, OnInit, Input } from '@angular/core';
import { ImageDataAzure } from 'src/app/models/image';
import { ImageService } from 'src/app/services/image/image.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() images: ImageDataAzure[] = [];

  constructor() {
   
  }

  ngOnInit(): void {
  }

}
