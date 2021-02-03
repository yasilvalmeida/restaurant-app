import {Injectable} from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  _apiURL = environment.apiURL;
  _sessionSecret = environment.sessionSecret;
  _errorMessage: string = '';
  /*
  * @param {HttpClient} _http
  */
  constructor
  (
    private _http: HttpClient
  ) { }
  // Handle errors
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      this._errorMessage = error.error.message;
      //console.error(errorMessage);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.log(error);
      if (error.status == 401) { // Not authorized
        localStorage.removeItem('token');
        localStorage.removeItem('fullname');
        localStorage.removeItem('email');
        localStorage.removeItem('avatar');
        localStorage.removeItem('role');
        window.location.href = "/dashboard";
      }
      
      if (error.error.message != undefined) {
        this._errorMessage = error.error.message;
      }
      else if (error.error.error.details != undefined &&
        error.error.error.details.length > 0)
        this._errorMessage = error.error.error.details[0].message;
    }
    console.log(error);
    // Return an observable with a user-facing error message.
    return throwError(this._errorMessage);
  }
  // Fetch settings
  fetch(): Observable<any> {
    return this._http
      .get(`${this._apiURL}/settings`)
      .pipe(
        catchError(this.handleError)
      );
  }
  // Update settings
  update(data: any): Observable<any> {
    return this._http
      .put(`${this._apiURL}/settings`, data)
      .pipe(
        catchError(this.handleError)
      );
  }
}
