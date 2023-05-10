import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListImagesComponent } from './pages/list-images/list-images.component';
import { LoginComponent } from './pages/auth/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'list-images',
    component: ListImagesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
