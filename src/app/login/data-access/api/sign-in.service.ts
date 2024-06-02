import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { SignInApi } from '../model/sign-in-api.model';

@Injectable({
  providedIn: 'root',
})
export class SignInApiService {
  constructor(private _http: HttpClient) {}
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      //'Authorization': 'my-auth-token'

    })
  };

  public model:any = {};
  private REST_API_SERVER = 'http://localhost:8080';

  public login(model: SignInApi.Request) {
    const url =`${this.REST_API_SERVER}/web/auth`;
    return this._http
    .post<any>(url,model ,this.httpOptions)
    .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(
      error.error["message"]);
  };
}
