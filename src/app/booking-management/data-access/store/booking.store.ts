import { Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { Paging } from 'src/app/share/data-access/model/paging.type';
import { pagingSizeOptionsDefault } from 'src/app/share/data-access/const/paging-size-options-default.const';
import { pipe, tap, switchMap, catchError, EMPTY } from 'rxjs';
import { AutocompleteApi } from 'src/app/share/data-access/model/autocomplete-api.model';
import { CommonApiService } from 'src/app/share/data-access/api/common.service';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { trimRequired } from 'src/app/share/form-validator/trim-required.validator';
import { ActivatedRoute } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import {
  BookingAddApi,
  BookingChosenStylistApi,
  BookingPagingApi,
  BookingStaffGetApi,
} from '../model/booking-api.model';
import { BookingApiService } from '../api/booking-api.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ServiceDataApi } from 'src/app/service-management/data-access/model/service-api.model';

export interface BookingState {
  bookingPaging: Paging<BookingPagingApi.Response>;
  staffFreeData: BookingStaffGetApi.Response;
  loadingCount: number;
  serviceData: ServiceDataApi.Response;
}

const initialState: BookingState = {
  bookingPaging: {
    content: [],
    current: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  },
  loadingCount: 0,
  staffFreeData: { content: [] },
  serviceData: {values: []}
};

@Injectable()
export class BookingStore
  extends ComponentStore<BookingState>
  implements OnStoreInit
{
  constructor(
    private _bApiSvc: BookingApiService,
    private _fb: NonNullableFormBuilder,
    private _nzMessageService: NzMessageService,
    private _activatedRoute: ActivatedRoute
  ) {
    super(initialState);
  }
  ngrxOnStoreInit() {
  }

  id = Number(this._activatedRoute.snapshot.paramMap.get('serviceId'));

  pagingRequest: BookingPagingApi.Request = {
    current: 1,
    pageSize: pagingSizeOptionsDefault[0],
    search: '',
    sorter: '',
    bookingServiceType: 'PICKUP_STYLIST',
    bookingServiceStatus: '',
    orderDescending: false,
  };

  form = this._fb.group<BookingAddApi.RequestFormGroup>({
    firstName: this._fb.control('', trimRequired),
    lastName: this._fb.control('', trimRequired),
    phone: this._fb.control('', [
      trimRequired,
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    appointmentDateV2: this._fb.control(null, Validators.required),
    bookingServices: this._fb.control([]),
    serviceArray: this._fb.control([], Validators.required),
    startAppointment: this._fb.control(null, Validators.required)
  });

  readonly getBookingPaging = this.effect<never>(
    pipe(
      tap(() => this.updateLoading(true)),
      switchMap(() =>
        this._bApiSvc.paging(this.pagingRequest).pipe(
          tap({
            next: (resp) => {
              if (resp.content) this.patchState({ bookingPaging: resp });
            },
            finalize: () => this.updateLoading(false),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly getstaffFree = this.effect<{ model: BookingStaffGetApi.Request }>(
    pipe(
      tap(() => this.updateLoading(true)),
      switchMap(({model}) =>
        this._bApiSvc.getStaffFree(model).pipe(
          tap({
            next: (resp) => {
              if (resp.content) this.patchState({ staffFreeData: resp });
            },
            finalize: () => this.updateLoading(false),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly addBooking = this.effect<{
    model: BookingAddApi.Request;
  }>(($params) =>
    $params.pipe(
      tap(() => this.updateLoading(true)),
      switchMap(({ model }) =>
        this._bApiSvc.addBooking(model).pipe(
          tap({
            next: (resp) => {
              this._nzMessageService.success('Tạo booking thành công');
            },
            error: () => this._nzMessageService.error('Tạo booking thất bại.'),
            finalize: () => this.updateLoading(false),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly getService = this.effect<never>(
    pipe(
      tap(() => this.updateLoading(true)),
      switchMap(() =>
        this._bApiSvc.serviceDataGet().pipe(
          tap({
            next: (resp) => {
              this.patchState({ serviceData: resp });
            },
            finalize: () => this.updateLoading(false),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  // readonly addService = this.effect<{ model: ServiceAddApi.Request }>(
  //   ($params) =>
  //     $params.pipe(
  //       tap(() => this.updateLoading(true)),
  //       switchMap(({ model }) =>
  //         this.bApiSvc.addService(model).pipe(
  //           tap({
  //             next: (resp) => {
  //               this.form.reset();
  //               this._nzMessageService.success('Tạo dịch vụ thành công');
  //             },
  //             error: () => this._nzMessageService.error('Tạo dịch vụ thất bại'),
  //             finalize: () => this.updateLoading(false),
  //           }),
  //           catchError(() => EMPTY)
  //         )
  //       )
  //     )
  // );

  // readonly getServiceData = this.effect<never>(
  //   pipe(
  //     tap(() => [this.updateLoading(true)]),
  //     switchMap(() =>
  //       this.bApiSvc.getService(this.id).pipe(
  //         tap({
  //           next: (resp) => {
  //             this.form.patchValue(resp.value)
  //           },
  //           finalize: () => this.updateLoading(false),
  //         }),
  //         catchError(() => EMPTY)
  //       )
  //     )
  //   )
  // );

  readonly chosenStylist = this.effect<{
    model: BookingChosenStylistApi.Request;
    modalRef: NzModalRef;
  }>(($params) =>
    $params.pipe(
      tap(() => this.updateLoading(true)),
      switchMap(({ model, modalRef }) =>
        this._bApiSvc.chosenStylist(model).pipe(
          tap({
            next: (resp) => {
              this.getBookingPaging()
              modalRef.destroy();
              this._nzMessageService.success('Cập nhật thợ thành công');
            },
            error: () => this._nzMessageService.error('Cập nhật thợ thất bại.'),
            finalize: () => this.updateLoading(false),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly confirmCompleteBooking = this.effect<{
    bookingId: number
  }>(($params) =>
    $params.pipe(
      tap(() => this.updateLoading(true)),
      switchMap(({ bookingId }) =>
        this._bApiSvc.confirmCompleteBooking(bookingId).pipe(
          tap({
            next: (resp) => {
              this._nzMessageService.success('Xác nhận thanh toán thành công');
            },
            error: () => this._nzMessageService.error('Xác nhận thanh toán thất bại.'),
            finalize: () => this.updateLoading(false),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly updateLoading = this.updater((s, isAdd: boolean) => ({
    ...s,
    loadingCount: s.loadingCount + (isAdd ? 1 : -1),
  }));
}
