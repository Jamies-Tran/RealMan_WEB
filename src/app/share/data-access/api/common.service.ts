import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AutocompleteApi } from '../model/autocomplete-api.model';
import { BranchNameApi } from '../model/branch-name.model';
import { BranchAddressApi } from '../model/branch-address-api.model';

@Injectable({
  providedIn: 'root',
})
export class CommonApiService {
  constructor(private _http: HttpClient) {}
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token$'),
    }),
  };

  private REST_API_SERVER = 'http://localhost:8080';

  public autocomplete(address: string) {
    const url = `${this.REST_API_SERVER}/collection/location?input=${address}`;
    return this._http
      .get<AutocompleteApi.Response>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public getBranchName(branchName: string) {
    const url = `${this.REST_API_SERVER}/v1/branches/branch-for-account/list?branchName=${branchName}`;
    return this._http
      .get<BranchNameApi.Response>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public getBranchAddress(BranchId: number) {
    const url = `${this.REST_API_SERVER}/v1/branch/${BranchId}/branch-for-account`;
    return this._http
      .get<BranchAddressApi.Response>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error.error['errorMsg']);
  }
}
