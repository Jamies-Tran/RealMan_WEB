import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Paging } from 'src/app/share/data-access/model/paging.type';
import { CategoryAddApi, CategoryDataGet, ServiceAddApi, ServiceGetApi, ServicePagingApi, ServiceUpdateApi } from '../model/service-api.model';

@Injectable({
  providedIn: 'root',
})
export class ServiceApiService {
  constructor(private _http: HttpClient) {}
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token$'),
    }),
  };

  private REST_API_SERVER = 'http://localhost:8080';

  // public addCategory(model: CategoryAddApi.Request) {
  //   const url = `${this.REST_API_SERVER}/v1/category`;
  //   return this._http
  //     .post<any>(url, model, this.httpOptions)
  //     .pipe(catchError(this.handleError));
  // }

  public CategoryDataGet() {
    const url = `${this.REST_API_SERVER}/v1/category`;
    return this._http
      .get<CategoryDataGet.Response>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public addService(model: ServiceAddApi.Request) {
    const url = `${this.REST_API_SERVER}/web/shop-service`;
    return this._http
      .post<any>(url, model, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public paging(model: ServicePagingApi.Request) {
    const url = `${this.REST_API_SERVER}/web/shop-service?branchId=${localStorage.getItem('branchId$')! === null ? '' : localStorage.getItem('branchId$')!}&current=${model.current}&sorter=${model.sorter}&pageSize=${model.pageSize}`;
    return this._http
      .get<Paging<ServicePagingApi.Response>>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public getService(id: number) {
    const url = `${this.REST_API_SERVER}/v1/service/${id}`;
    return this._http
      .get<ServiceGetApi.Response>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public updateService(id: number, model: ServiceUpdateApi.Request) {
    const url = `${this.REST_API_SERVER}/web/shop-service/${id}`;
    return this._http
      .put<any>(url, model, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  // public getBranch(id: number) {
  //   const url = `${this.REST_API_SERVER}/v1/branch/${id}`;
  //   return this._http
  //     .get<BranchUpdateApi.BranchDataResponse>(url, this.httpOptions)
  //     .pipe(catchError(this.handleError));
  // }

  // public updateBranch(id: number, model: BranchUpdateApi.Request) {
  //   const url = `${this.REST_API_SERVER}/v1/branch/${id}`;
  //   return this._http
  //     .put<any>(url, model, this.httpOptions)
  //     .pipe(catchError(this.handleError));
  // }

  private handleError(error: HttpErrorResponse) {
    return throwError(error.error['errorMsg']);
  }
}
