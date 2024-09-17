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
} from 'rxjs';
import { AutocompleteApi } from 'src/app/share/data-access/model/autocomplete-api.model';
import { CommonApiService } from 'src/app/share/data-access/api/common.service';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ScheduleApiService } from '../api/schedule-api.service';
import { PlanCreateApi, PlanPagingApi } from '../model/schedule-api.model';
import { ActivatedRoute } from '@angular/router';
import { PlanDailyApi } from '../model/plan-daily-api.model';

export interface ScheduleState {
  loadingCount: number;
  planDaily: PlanDailyApi.Response;
}

const initialState: ScheduleState = {
  planDaily: { value: {
    weeklyPlanId: '',
      dailyPlanId: '',
      date: '',
      dayInWeekCode: '',
      dayInWeekName: '',
      dailyPlanStatusCode: '',
      dailyPlanStatusName: '',
      dailyPlans: []
  } },
  loadingCount: 0,
};

@Injectable()
export class PlanDailyStore extends ComponentStore<ScheduleState> implements OnStoreInit {
  constructor(
    private _sApiSvc: ScheduleApiService,
    private _cApiSvc: CommonApiService,
    private _fb: NonNullableFormBuilder,
    private _nzMessageService: NzMessageService,
    private _activatedRoute: ActivatedRoute
  ) {
    super(initialState);
  }

  pagingRequest: PlanPagingApi.Request = {
    current: 1,
    pageSize: pagingSizeOptionsDefault[0],
    search: '',
    sorter: '',
    orderDescending: false,
  };

  addressData!: AutocompleteApi.Response;
  options: string[] = [];
  id = Number(this._activatedRoute.snapshot.paramMap.get('id'));

  ngrxOnStoreInit(){
    this.getPlanDailyPaging()
  }

  readonly getPlanDailyPaging = this.effect<never>(
    pipe(
      tap(() => this.updateLoading(true)),
      switchMap(() =>
        this._sApiSvc.getPlanDaily(this.id).pipe(
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

  readonly updateLoading = this.updater((s, isAdd: boolean) => ({
    ...s,
    loadingCount: s.loadingCount + (isAdd ? 1 : -1),
  }));
}
