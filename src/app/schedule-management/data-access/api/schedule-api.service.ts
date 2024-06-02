import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Paging } from 'src/app/share/data-access/model/paging.type';
import { SchedulePagingApi } from '../model/schedule-api.model';

@Injectable({
  providedIn: 'root',
})
export class ScheduleApiService {
  constructor(private _http: HttpClient) {}
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token$'),
    }),
  };

  private REST_API_SERVER = 'http://localhost:8080';

  fakeData = {
    totalElements: 0,
    totalPages: 1,
    pageSize: 10,
    current: 0,
    content: [
      {
        name: 'quan',
        phone: '0387824877',
        schedules: { mon: 1, tue: 1, web: 1, thurs: 1, fri: 1, sat: 1, sun: 1 },
      },
      {
        name: 'Quang',
        phone: '1234512345',
        schedules: { mon: 2, tue: 2, web: 2, thurs: 2, fri: 2, sat: 2, sun: 2 },
      },
      {
        name: 'Tuan',
        phone: '1231231231',
        schedules: { mon: 1, tue: 1, web: 1, thurs: 1, fri: 1, sat: 1, sun: 1 },
      },
      {
        name: 'minh',
        phone: '1234123412',
        schedules: { mon: 2, tue: 2, web: 2, thurs: 2, fri: 2, sat: 2, sun: 2 },
      },
    ],
  };

  public paging(model: SchedulePagingApi.Request) {
    // const url = `${this.REST_API_SERVER}/v1/services?current=${model.current}&sorter=${model.sorter}&pageSize=${model.pageSize}`;
    // return this._http
    //   .get<Paging<ServicePagingApi.Response>>(url, this.httpOptions)
    //   .pipe(catchError(this.handleError));
    return this.fakeData
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
    return throwError(error.error['message']);
  }
}
