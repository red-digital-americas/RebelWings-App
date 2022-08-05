import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class LoginService {
  // URL to web api
  public apiURL = environment.apiURL;
  // URL api server
  private url: string = environment.apiURL;

  constructor(private http: HttpClient, private route: Router) {}
  getAPI() {
    return this.apiURL;
  }
  getURL() {
    return this.url;
  }

  // metodos para login y mas
  login(parametros): Observable<any> {
    let headers = new HttpHeaders();
    console.log(parametros);
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post(this.apiURL + 'User/Login' + parametros, '');
  }
  forgotPassword(parametros): Observable<any> {
    let headers = new HttpHeaders();
    console.log(parametros);
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.http.put(this.apiURL + 'User/Recovery_password' + parametros, '');
  }

  logout() {
    localStorage.removeItem('token');
    this.route.navigateByUrl('login');
  }
}
