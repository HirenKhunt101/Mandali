import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class AdminModuleService {
  constructor(private _http: HttpClient) { }
  BaseURL: string = environment.backendurl;
  apiHelth(): any {
    return this._http.get(this.BaseURL);
  }
  httpOptions = {
    withCredentials: true,
    observe: 'body' as 'response',
  };


  addUser(data: any) {
    return this._http
      .post(this.BaseURL + 'admin/add_user', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  readUser(data: any) {
    return this._http
      .post(this.BaseURL + 'admin/read_user', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  createInstallment(data: any) {
    return this._http
      .post(this.BaseURL + 'installment/create_installment', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  
  readInstallment(data: any) {
    return this._http
      .post(this.BaseURL + 'installment/read_installment', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  approveDeletePendingRequest(data: any) {
    return this._http
      .post(this.BaseURL + 'installment/approve_delete_pending_request', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  buyStock(data: any) {
    return this._http
      .post(this.BaseURL + 'holding/buy_stock', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  readStocks(data: any) {
    return this._http
      .post(this.BaseURL + 'holding/read_stock', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  sellStock(data: any) {
    return this._http
      .post(this.BaseURL + 'holding/sell_stock', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  readRealized(data: any) {
    return this._http
      .post(this.BaseURL + 'realized/read_realized', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  createAnalysis(data: any) {
    return this._http
      .post(this.BaseURL + 'suggestion/create_analysis', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  
  readAnalysis(data: any) {
    return this._http
      .post(this.BaseURL + 'suggestion/read_analysis', data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  readActivity(data: any) {
    return this._http
      .post(this.BaseURL + 'activity/read_activity', data, this.httpOptions)
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
