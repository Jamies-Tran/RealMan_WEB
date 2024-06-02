import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import {
  AccountAddApi,
  AccountPagingApi,
  AccountUpdateApi,
  ScheduleGetApi,
} from '../model/account-api.model';
import { Paging } from 'src/app/share/data-access/model/paging.type';

@Injectable({
  providedIn: 'root',
})
export class AccountApiService {
  constructor(private _http: HttpClient) {}
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token$'),
    }),
  };

  private REST_API_SERVER = 'http://localhost:8080';

  public createAccount(model: AccountAddApi.Request) {
    const url =
      model.professional !== 'BRANCH_MANAGER'
        ? `${this.REST_API_SERVER}/v1/auth/accounts/staff?professional=${model.professional}&branchId=${model.branch}`
        : `${this.REST_API_SERVER}/v1/auth/accounts/manager?branchId=${model.branch}`;
    return this._http
      .post<any>(url, model, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public paging(model: AccountPagingApi.Request) {
    console.log(model.branchId);

    const url = `${this.REST_API_SERVER}/v1/auth/accounts?branchId=${model.branchId}&searches=${model.searches}&role=${model.role}&current=${model.current}&pageSize=${model.pageSize}&sorter=${model.sorter}`;
    return this._http
      .get<Paging<AccountPagingApi.Response>>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public getAccount(accountId: string, role: string) {
    const url = `${this.REST_API_SERVER}/v1/auth/account/${accountId}/${
      role === 'STAFF' ? 'staff' : 'manager'
    }`;
    return this._http
      .get<AccountUpdateApi.Response>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public getSchedule(staffId: string) {
    const url = `${this.REST_API_SERVER}/v1/schedule/${staffId}`;
    return this._http
      .get<ScheduleGetApi.Response>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error.error['message']);
  }
}
