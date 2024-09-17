import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Paging } from 'src/app/share/data-access/model/paging.type';
import { PlanCreateApi, PlanPagingApi, PlanWeeklyDetailApi } from '../model/schedule-api.model';
import { PlanDailyApi } from '../model/plan-daily-api.model';

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

  today = new Date();
  date = this.today.getFullYear()+'-'+(this.today.getMonth()+1)+'-'+this.today.getDate();

  private REST_API_SERVER = 'http://localhost:8080';


  public paging(model: PlanPagingApi.Request) {
    const url = `${this.REST_API_SERVER}/web/weekly-plan?current=${model.current}&sorter=${model.sorter}&pageSize=${model.pageSize}`;
    return this._http
      .get<Paging<PlanPagingApi.Response>>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public createPlan(model: PlanCreateApi.Request) {
    const url = `${this.REST_API_SERVER}/web/weekly-plan`;
    return this._http
      .post<any>(url, model, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public getPlanDaily(id: number) {
    const url = `${this.REST_API_SERVER}/web/weekly-plan/${id}`;
    return this._http
      .get<PlanWeeklyDetailApi.Response>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public activeWeeklyPlan(id: number) {
    const url = `${this.REST_API_SERVER}/web/weekly-plan/${id}`;
    return this._http
      .put<any>(url,null ,this.httpOptions)
      .pipe(catchError(this.handleError));
  }

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
