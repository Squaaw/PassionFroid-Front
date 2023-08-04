import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tags } from '@azure/storage-blob';
import { ImageDataAzure } from 'src/app/models/image';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  basePathApi = environment.api_host + "/api";
  userToken = JSON.parse(localStorage.getItem("user") || '{}')
  headers = { headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${this.userToken}` } }

  tagsArraySubject = new BehaviorSubject<Tags[]>([]);
  tagsArray$ = this.tagsArraySubject.asObservable();
  selectedTagSubject = new BehaviorSubject<Tags[]>([]);
  selectedTag$ = this.selectedTagSubject.asObservable();
  imagesByTagsSubject = new BehaviorSubject<ImageDataAzure[]>([]);
  imagesByTags$ = this.imagesByTagsSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  getHttpTags(): Observable<any> {
    return this.httpClient.get(this.basePathApi + '/tags/', this.headers);
  }

  getImagesByTag(tags: string[]): Observable<Object> {
    return this.httpClient.post(this.basePathApi + '/images-by-tags/', { tags: tags }, this.headers)
  }

  removeTags(image_id: number, tags: string[]): Observable<any> {
    return this.httpClient.post(this.basePathApi + '/tags-remove-by-name/', { image_id: image_id, tags: tags }, this.headers);
  }

  setTagsArray(tags: Tags[]) { this.tagsArraySubject.next(tags); }

  setImagesByTags(images: ImageDataAzure[]) { this.imagesByTagsSubject.next(images); }

  setSelectedTags(tags: Tags[]) { this.selectedTagSubject.next(tags); }
}
