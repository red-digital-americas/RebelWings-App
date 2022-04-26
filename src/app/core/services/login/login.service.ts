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

  ////////////////////////////////////////////////////////////////////////////////////
  // ErrorHandler
  ////////////////////////////////////////////////////////////////////////////////////
  // private handleError(error: HttpErrorResponse) {
  //   console.log(error.error);
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error.message);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     console.error(
  //       `Backend returned code ${error.status}, ` + `body was: ${error.error}`
  //     );
  //   }
  // return an observable with a user-facing error message
  // this.messageError = isUndefined(error.error.detalle)
  //   ? 'Algo ha pasado, por favor intentalo mas tarde.'
  //   : error.error.detalle;
  // return throwError(this.messageError);
}
// }
// function key(key: any, arg1: string) {
//   throw new Error('Function not implemented.');
// }

