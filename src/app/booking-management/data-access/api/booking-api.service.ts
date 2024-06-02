import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Paging } from 'src/app/share/data-access/model/paging.type';
import { ServiceDataApi } from 'src/app/service-management/data-access/model/service-api.model';
import { BookingAddApi, BookingChosenStylistApi, BookingPagingApi, BookingStaffGetApi } from '../model/booking-api.model';

@Injectable({
  providedIn: 'root',
})
export class BookingApiService {
  constructor(private _http: HttpClient) {}
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token$'),
    }),
  };

  private REST_API_SERVER = 'http://localhost:8080';



  public paging(model: BookingPagingApi.Request) {
    const url = `${this.REST_API_SERVER}/v1/booking-service/all?search=${model.search}&branchId=${localStorage.getItem('branchId$')}&bookingServiceStatus=${model.bookingServiceStatus}&bookingServiceType=${model.bookingServiceType}&sorter=bookingServiceId&current=${model.current}&pageSize=${model.pageSize}`;
    return this._http
      .get<Paging<BookingPagingApi.Response>>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public getStaffFree(model: BookingStaffGetApi.Request) {
    const url = `${this.REST_API_SERVER}/v1/auth/accounts/suitable?branchId=${model.branchId}&appointmentDate=${model.appointmentDate}&startAppointment=${model.startAppointment}&endAppointment=${model.endAppointment}`;
    return this._http
      .get<BookingStaffGetApi.Response>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // public getBranch(id: number) {
  //   const url = `${this.REST_API_SERVER}/v1/branch/${id}`;
  //   return this._http
  //     .get<BranchUpdateApi.BranchDataResponse>(url, this.httpOptions)
  //     .pipe(catchError(this.handleError));
  // }

  public chosenStylist(model: BookingChosenStylistApi.Request) {
    const url = `${this.REST_API_SERVER}/v1/booking-service/${model.bookingServiceId}/choose-stylist?staffId=${model.staffId}`;
    return this._http
      .put<any>(url, model, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

   public addBooking(model: BookingAddApi.Request) {
    const url = `${this.REST_API_SERVER}/v2/booking/receptionist`;
    return this._http
      .post<any>(url, model, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public serviceDataGet() {
    const url = `${this.REST_API_SERVER}/v1/services/field?branchId=${localStorage.getItem('branchId$')}`;
    return this._http
      .get<ServiceDataApi.Response>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  public confirmCompleteBooking(bookingId: number) {
    const url = `${this.REST_API_SERVER}/v1/booking/${bookingId}/end`;
    return this._http
      .put<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  // public serviceDataGet() {
  //   const url = `${this.REST_API_SERVER}/v1/services/field`;
  //   return this._http
  //     .get<ServiceDataApi.Response>(url, this.httpOptions)
  //     .pipe(catchError(this.handleError));
  // }

  private handleError(error: HttpErrorResponse) {
    return throwError(error.error['message']);
  }
}
