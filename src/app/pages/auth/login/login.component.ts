import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public user: any;
  errors: string[] | null = null;
  constructor(private router: Router, private _loginService: LoginService) { }

  ngOnInit(): void {
      this.user = {
          username: '',
          password: ''
      };
  }

  loginCheck(f: NgForm) {
      this._loginService.login({ 'username': f.controls["email"].value, 'password': f.controls["password"].value }).subscribe(
          {
              next: (v) => {
                this._loginService.updateData(v['access'])
                this._loginService.isConnected.next(true);
              },
              error: (e) => this.errors = e,
              complete: () => this.router.navigate(['/home'])
          })
      //   (data: any) => {

      //   this._loginService.updateData(data['access']);
      //   this.router.navigate(['/list-images'])
      // }, (err: any) => {
      //     this.errors = err
      // })
  }

  refreshToken() {
      this._loginService.refreshToken();
  }

  logout() {
      this._loginService.logout();
  }

}
