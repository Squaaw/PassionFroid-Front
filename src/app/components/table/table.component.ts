import { Component, OnInit, Input } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  images: string[];

  constructor(private imageService: ImageService) {
    this.images = this.imageService.get();
  }

  ngOnInit(): void {
  }

}
