import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

    public isConnected = new BehaviorSubject<boolean>(false);
    // http options used for making API calls
    private httpOptions: any;

    // the actual JWT token
    public token: string | null = null;

    // the token expiration date
    public token_expires: Date | null = null;

    // the username of the logged in user
    public username: string | null = null;

    // error messages received from the login attempt
    private errors: any = [];

    constructor(private http: HttpClient) {
        this.httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };


    }


    public login(user: any): Observable<any> {


        this.errors = []
        return this.http.post(environment.api_host + '/api/token/', JSON.stringify(user), this.httpOptions).pipe(
            catchError(error => {
                Object.keys(error.error).forEach(key => {
                    if (typeof (error.error[key]) == "string") {
                        this.errors.push(error.error[key])
                    } else {
                        this.errors.push(error.error[key][0])
                    }
                })
                return throwError(() => this.errors);
            })
        )
    }

    // Refreshes the JWT token, to extend the time the user is logged in
    public refreshToken() {
        this.http.post('/api-token-refresh/', JSON.stringify({ token: this.token }), this.httpOptions).subscribe(
            (data: any) => {
                this.updateData(data['token']);
            },
            (err: any) => {
                this.errors = err['error'];
            }
        );
    }

    public logout() {
        this.token = null;
        this.token_expires = null;
        this.username = null;
    }

    public updateData(token: string) {
        this.token = token;
        this.errors = {};
        // decode the token to read the username and expiration timestamp
        const token_parts = this.token.split(/\./);
        const token_decoded = JSON.parse(window.atob(token_parts[1]));
        this.token_expires = new Date(token_decoded.exp * 1000);
        this.username = token_decoded.username;
        localStorage.setItem("user", JSON.stringify(token))
    }
}
