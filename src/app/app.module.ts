import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { CardComponent } from './components/card/card.component';
import { Home } from './pages/home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditComponent } from './components/edit/edit.component';
import { TableComponent } from './components/table/table.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalUploadComponent } from './components/modal-upload/modal-upload.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ImageService } from './services/image/image.service';
import { LoaderInterceptor } from './interceptors/http/loader/loader.interceptor';
import { LoginComponent } from './pages/auth/login/login.component';
import { UploadFormComponent } from './components/form/upload-form/upload-form.component';
import { LoaderComponent } from './components/loader/loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ErrorInterceptor } from './interceptors/http/error/error.interceptor';
import { ListImagesComponent } from './components/list-images/list-images.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { TagInputModule } from 'ngx-chips';
import { TagsComponent } from './components/search-filter/tags/tags.component';

registerLocaleData(localeFr, 'fr');
@NgModule({
  declarations: [
    AppComponent,
    SearchFilterComponent,
    ListImagesComponent,
    CardComponent,
    Home,
    EditComponent,
    TableComponent,
    GalleryComponent,
    ModalUploadComponent,
    LoginComponent,
    UploadFormComponent,
    LoaderComponent,
    TagsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NoopAnimationsModule,
    FontAwesomeModule,
    MatDialogModule,
    MatRadioModule,
    FormsModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    DragDropModule,
    MatProgressSpinnerModule,
    TagInputModule
  ],
  providers: [ImageService, {
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptor,
    multi: true,
  },{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
