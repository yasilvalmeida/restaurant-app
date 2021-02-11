import {Injectable} from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  _apiURL = environment.apiURL;
  _sessionSecret = environment.sessionSecret;
  _errorMessage: string = '';
  /*
  * @param {HttpClient} _http
  */
  constructor
  (
    private _http: HttpClient
  ) 
  {
  }
  // Get token
  public getToken(): string {
    //const encryptInit = new SimpleCrypto(this._sessionSecret);
        
    //let encryptedToken = localStorage.getItem('token');
    /* if (encryptedToken != null) {
      let token = encryptInit.decrypt(encryptedToken);
      return token.toString();
    } */
    let token = localStorage.getItem('token');
    if (token != null) {
      return token;
    }
    else {
      return null;
    }
  }
  // Handle errors
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      this._errorMessage = error.error.message;
      //console.error(errorMessage);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      if (error.status == 401) { // Not authorized
        localStorage.removeItem('_id');
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
    // Return an observable with a user-facing error message
    return throwError(this._errorMessage);
  }
  // Register a user
  register(data: any): Observable<any> {
    return this._http
      .post(`${this._apiURL}/register`, data)
      .pipe(
        catchError(this.handleError)
      );
  }
  // Verify email
  verifyEmail(data: any): Observable<any> {
    return this._http
      .get(`${this._apiURL}/verify-email/${data.token}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  // Forgot password
  forgotPassword(data: any): Observable<any> {
    return this._http
      .post(`${this._apiURL}/forgot-password`, data)
      .pipe(
        catchError(this.handleError)
      );
  }
  // Reset password
  resetPassword(data: any): Observable<any> {
    return this._http
      .post(`${this._apiURL}/reset-password/${data.token}`, {password: data.password})
      .pipe(
        catchError(this.handleError)
      );
  }
  // Login
  login(data: any): Observable<any> {
    //console.log(data)
    return this._http
      .post(`${this._apiURL}/login`, data)
      .pipe(
        catchError(this.handleError)
      );
  }
  // Logout
  logout(): void {
    localStorage.removeItem('_id');
    localStorage.removeItem('token');
    localStorage.removeItem('fullname');
    localStorage.removeItem('email');
    localStorage.removeItem('avatar');
    localStorage.removeItem('role');
    window.location.href = "/dashboard";
  }
  // Google Sign In
  googleSignIn(data: any): Observable<any> {
    return this._http
      .post(`${this._apiURL}/google-sign`, data)
      .pipe(
        catchError(this.handleError)
      );
  }
  // Load profile
  loadProfile(): Observable<any> {
    return this._http
      .get(`${this._apiURL}/profile`)
      .pipe(
        catchError(this.handleError)
      );
  }
  // Update profile
  updateProfile(data): Observable<any> {
    return this._http
      .post(`${this._apiURL}/profile`, data)
      .pipe(
        catchError(this.handleError)
      );
  }
}
