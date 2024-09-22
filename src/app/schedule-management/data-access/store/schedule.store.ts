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
import { ScheduleApiService } from '../api/schedule-api.service';
import { PlanCreateApi, PlanPagingApi, PlanWeeklyDetailApi } from '../model/schedule-api.model';
import { ActivatedRoute } from '@angular/router';
import { PlanDailyApi } from '../model/plan-daily-api.model';

export interface ScheduleState {
  schedulePaging: Paging<PlanPagingApi.Response>;
  loadingCount: number;
  planWeeklyDetail: PlanWeeklyDetailApi.Response;
  planDaily: PlanDailyApi.Response;
}

const initialState: ScheduleState = {
  schedulePaging: {
    content: [],
    currentPage: 1,
    pageSize: 10,
    totalElement: 0,
    totalPage: 0,
  },
  planWeeklyDetail: { value: {
    weeklyPlanId: '',
      dailyPlanId: '',
      date: '',
      dayInWeekCode: '',
      dayInWeekName: '',
      dailyPlanStatusCode: '',
      dailyPlanStatusName: '',
      dailyPlans: []
  } },
  planDaily: { value: {
        weeklyPlanId: '',
          dailyPlanId: '',
          date: '',
          dayInWeekCode: '',
          dayInWeekName: '',
          dailyPlanStatusCode: '',
          dailyPlanStatusName: '',
          dailyPlanAccounts: []
      } },
  loadingCount: 0,
};

@Injectable()
export class ScheduleStore extends ComponentStore<ScheduleState> {
  constructor(
    private _sApiSvc: ScheduleApiService,
    private _cApiSvc: CommonApiService,
    private _fb: NonNullableFormBuilder,
    private _nzMessageService: NzMessageService,
    private _activatedRoute: ActivatedRoute
  ) {
    super(initialState);
  }

  addressData!: AutocompleteApi.Response;
  options: string[] = [];
  id = Number(this._activatedRoute.snapshot.paramMap.get('id'));

  pagingExpand = new Set<number>();
  pagingSubRowExpand = new Set<number>();

  pagingRequest: PlanPagingApi.Request = {
    current: 1,
    pageSize: pagingSizeOptionsDefault[0],
    search: '',
    sorter: '',
    orderDescending: false,
  };

  // pagingRequestPlanDaily: PlanDailyApi.Request = {
  //   current: 1,
  //   pageSize: pagingSizeOptionsDefault[0],
  //   search: '',
  //   sorter: '',
  //   orderDescending: false,
  // };

  readonly getPlanPaging = this.effect<never>(
    pipe(
      tap(() => this.updateLoading(true)),
      switchMap(() =>
        this._sApiSvc.paging(this.pagingRequest).pipe(
          tap({
            next: (resp) => {
              if (resp.content) this.patchState({ schedulePaging: resp });
            },
            finalize: () => this.updateLoading(false),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly getWeeklyPlanDetailPaging = this.effect<number>(
    pipe(
      tap(() => this.updateLoading(true)),
      switchMap((id) =>
        this._sApiSvc.getWeekyPlanDetail(id).pipe(
          tap({
            next: (resp) => {
              if (resp) this.patchState({ planWeeklyDetail: resp });
            },
            finalize: () => this.updateLoading(false),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly getPlanDailyPaging = this.effect<number>(
    pipe(
      tap(() => this.updateLoading(true)),
      switchMap((id) =>
        this._sApiSvc.getDailyPlan(id).pipe(
          tap({
            next: (resp) => {
              if (resp) this.patchState({ planDaily: resp });
            },
            finalize: () => this.updateLoading(false),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly activeWeeklyPlan = this.effect<number>(
    pipe(
      tap(() => this.updateLoading(true)),
      switchMap((id) =>
        this._sApiSvc.activeWeeklyPlan(id).pipe(
          tap({
            next: (resp) => {
              this._nzMessageService.success('Đã kích hoạt.');
              this.getPlanPaging()
            },
            error: () => this._nzMessageService.error('Kích hoạt thất bại.'),
            finalize: () => this.updateLoading(false),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly createPlan = this.effect<{ model: PlanCreateApi.Request }>(
    ($params) =>
      $params.pipe(
        tap(() => this.updateLoading(true)),
        switchMap(({ model }) =>
          this._sApiSvc.createPlan(model).pipe(
            tap({
              next: (resp) => {

                this.getPlanPaging();
                this._nzMessageService.success('Tạo lịch thành công.');
              },
              error: (error) => this._nzMessageService.error(error),
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
