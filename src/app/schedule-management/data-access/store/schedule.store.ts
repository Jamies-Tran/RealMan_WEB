import { Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { Paging } from 'src/app/share/data-access/model/paging.type';
import { pagingSizeOptionsDefault } from 'src/app/share/data-access/const/paging-size-options-default.const';
import {
  pipe,
  tap,
  switchMap,
  catchError,
  EMPTY,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';
import { AutocompleteApi } from 'src/app/share/data-access/model/autocomplete-api.model';
import { CommonApiService } from 'src/app/share/data-access/api/common.service';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SchedulePagingApi } from '../model/schedule-api.model';
import { ScheduleApiService } from '../api/schedule-api.service';

export interface ScheduleState {
  schedulePaging: Paging<SchedulePagingApi.Response>;
  loadingCount: number;
}

const initialState: ScheduleState = {
  schedulePaging: {
    content: [],
    current: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  },
  loadingCount: 0,
};

@Injectable()
export class ScheduleStore extends ComponentStore<ScheduleState> {
  constructor(
    private _sApiSvc: ScheduleApiService,
    private _cApiSvc: CommonApiService,
    private _fb: NonNullableFormBuilder,
    private _nzMessageService: NzMessageService
  ) {
    super(initialState);
  }

  addressData!: AutocompleteApi.Response;
  options: string[] = [];

  pagingRequest: SchedulePagingApi.Request = {
    current: 1,
    pageSize: pagingSizeOptionsDefault[0],
    search: '',
    sorter: '',
    orderDescending: false,
  };

  // readonly getServicePaging = this.effect<never>(
  //   pipe(
  //     tap(() => this.updateLoading(true)),
  //     switchMap(() =>
  //       this._sApiSvc.paging(this.pagingRequest).pipe(
  //         tap({
  //           next: (resp) => {
  //             if (resp.content) this.patchState({ schedulePaging: resp });
  //           },
  //           finalize: () => this.updateLoading(false),
  //         }),
  //         catchError(() => EMPTY)
  //       )
  //     )
  //   )
  // );

  readonly updateLoading = this.updater((s, isAdd: boolean) => ({
    ...s,
    loadingCount: s.loadingCount + (isAdd ? 1 : -1),
  }));
}
