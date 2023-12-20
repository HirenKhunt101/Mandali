import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import CryptoJS from "crypto-js";
import Cryptr from 'cryptr';

@Injectable({
  providedIn: 'root',
})

export class AuthModuleService {
  constructor(private _http: HttpClient) { }
  BaseURL: string = environment.backendurl;
  apiHelth(): any {
    return this._http.get(this.BaseURL);
  }
  httpOptions = {
    // headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
    observe: 'body' as 'response',
  };

  encrypt = (text: any) => {
    const secrateKey = environment.DECRYPT;
    const cryptr = new Cryptr(secrateKey);
    const encryptedString = cryptr.encrypt(text);
    return encryptedString;
  }; 
  
  // encrypt = (text: any) => {
  //   const secrateKey = environment.DECRYPT;
  //   return CryptoJS.AES.encrypt(JSON.stringify(text), secrateKey).toString();   
  // };

  userLogin(data: any) {
    // if (data.Password) {
    //   data.Password = this.encrypt(data.Password);
    //   console.log(data.Password)
    // }
    return this._http
      .post(this.BaseURL + 'user/user_login', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  userSignup(data: any) {
    return this._http
      .post(this.BaseURL + 'user/user_signup', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  logout() {
    return this._http
      .get(this.BaseURL + 'user/logout', this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    if (
      error.error.statusMessage ==
      'Authentication token expired, please login again'
    ) {
      localStorage.clear();

      window.location.href = environment.url + '/login';
      return throwError(error.error);
    } else {
      return throwError(error.error);
    }
  }
}
