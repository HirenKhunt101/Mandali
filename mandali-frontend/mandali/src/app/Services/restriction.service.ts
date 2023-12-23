import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';

import { catchError, concatMap, map } from 'rxjs/operators';
import { UserData } from '../UserData/userdata';
import { environment } from '../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestrictionService {
  constructor(private _http: HttpClient) { }
  BaseURL: string = environment.backendurl;
  apiHelth(): any {
    return this._http.get(this.BaseURL);
  }
  //////////////////////
  private subject = new Subject<any>();
  changePassword(data: any) {
    return this._http
      .post(this.BaseURL + 'user/change_password', data, {
        withCredentials: true,
        observe: 'body' as 'response',
      })
      .pipe(catchError(this.handleError));
  }

  // handleError
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
