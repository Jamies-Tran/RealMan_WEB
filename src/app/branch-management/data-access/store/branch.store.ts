import { Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import {
  BranchActiveApi,
  BranchApi,
  BranchPagingApi,
} from '../model/branch-api.model';
import { Paging } from 'src/app/share/data-access/model/paging.type';
import { BranchApiService } from '../api/branch.service';
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
import { trimRequired } from 'src/app/share/form-validator/trim-required.validator';
import { ServiceDataApi, ServicePagingApi } from 'src/app/service-management/data-access/model/service-api.model';
import { getStorage, ref, uploadString } from 'firebase/storage';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { AccountPagingApi } from 'src/app/account-management/data-access/model/account-api.model';
import { AccountApiService } from 'src/app/account-management/data-access/api/account.service';
import { RoleType } from 'src/app/share/data-access/api/enum/role.enum';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ServiceApiService } from 'src/app/service-management/data-access/api/service-api.service';

export interface BranchState {
  branchPaging: Paging<BranchPagingApi.Response>;
  acountPaging: Paging<AccountPagingApi.Response>;
  servicePaging: Paging<ServicePagingApi.Response>;
  loadingCount: number;
  addressData: string[];
  serviceData: ServiceDataApi.Response;
}

const initialState: BranchState = {
  branchPaging: {
    content: [],
    currentPage: 1,
    pageSize: 10,
    totalElement: 0,
    totalPage: 0,
  },
  loadingCount: 0,
  addressData: [],
  serviceData: { values: [] },
  acountPaging: {
    content: [],
    currentPage: 1,
    pageSize: 10,
    totalElement: 0,
    totalPage: 0,
  },
  servicePaging: {
    content: [],
    currentPage: 1,
    pageSize: 10,
    totalElement: 0,
    totalPage: 0,
  },
};

@Injectable()
export class BranchStore
  extends ComponentStore<BranchState>
  implements OnStoreInit
{
  constructor(
    private _bApiSvc: BranchApiService,
    private _cApiSvc: CommonApiService,
    private _fb: NonNullableFormBuilder,
    private _nzMessageService: NzMessageService,
    private _aApiSvc: AccountApiService,
    private _sApiSvc: ServiceApiService,
  ) {
    super(initialState);
  }
  ngrxOnStoreInit() {
    this.#getService();
  }

  fileList: NzUploadFile[] = [];
  fileListTmp: NzUploadFile[] = [];
  storage = getStorage();
  storageRef = ref(this.storage, '/booking');
  metadata = {
    contentType: 'image/jpeg',
  };

  pagingRequest: BranchPagingApi.Request = {
    current: 1,
    pageSize: pagingSizeOptionsDefault[0],
    search: '',
    sorter: '',
    orderDescending: false,
  };

  pagingAccountRequest: AccountPagingApi.Request = {
    current: 1,
    pageSize: pagingSizeOptionsDefault[0],
    search: '',
    sorter: '',
    orderDescending: false,
    role: RoleType.STAFF,
    branchId:
      localStorage.getItem('branchId$')! === null
        ? ''
        : localStorage.getItem('branchId$')!,
  };

  pagingServiceRequest: ServicePagingApi.Request = {
    current: 1,
    pageSize: pagingSizeOptionsDefault[0],
    search: '',
    sorter: '',
    orderDescending: false,
  };

  form = this._fb.group<BranchApi.RequestFormGroup>({
    shopOwnerId: this._fb.control(localStorage.getItem('accountId$')!),
    branchName: this._fb.control('', trimRequired),
    branchHotline: this._fb.control('', [
      Validators.minLength(10),
      Validators.maxLength(10),
      trimRequired,
    ]),
    branchAddress: this._fb.control('', trimRequired),
    open: this._fb.control(null, Validators.required),
    close: this._fb.control(null, Validators.required),
    branchDisplays: this._fb.control([]),
    branchThumbnail: this._fb.control('123', trimRequired),
  });

  readonly getBranchPaging = this.effect<never>(
    pipe(
      tap(() => this.updateLoading(true)),
      switchMap(() =>
        this._bApiSvc.paging(this.pagingRequest).pipe(
          tap({
            next: (resp) => {
              if (resp.content) this.patchState({ branchPaging: resp });
            },
            finalize: () => this.updateLoading(false),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly getAccountPaging = this.effect<never>(
    pipe(
      tap(() => this.updateLoading(true)),
      switchMap(() =>
        this._aApiSvc.pagingAccountPending(this.pagingAccountRequest).pipe(
          tap({
            next: (resp) => {
              if (resp.content) this.patchState({ acountPaging: resp });
            },
            finalize: () => this.updateLoading(false),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly getServicePaging = this.effect<never>(
    pipe(
      tap(() => this.updateLoading(true)),
      switchMap(() =>
        this._sApiSvc.paging(this.pagingRequest).pipe(
          tap({
            next: (resp) => {
              if (resp.content) this.patchState({ servicePaging: resp });
              console.log(resp);

            },
            finalize: () => this.updateLoading(false),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly getAddress = this.effect<string>(($params) =>
    $params.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((keyword: string) => {
        return this._cApiSvc.autocomplete(keyword).pipe(
          tap({
            next: (resp) => {
              this.patchState({ addressData: resp.values });
              console.log(resp.values);
            },
            finalize: () => {},
          })
        );
      })
    )
  );

  readonly activeBranch = this.effect<{id: number; model: BranchActiveApi.Request; modalRef: NzModalRef}>(($params) =>
    $params.pipe(
      tap(() => this.updateLoading(true)),
      switchMap(({ id, model, modalRef }) =>
        this._bApiSvc.activeBranch(id, model).pipe(
          tap({
            next: (resp) => {
              this._nzMessageService.success('Kích hoạt chi nhánh thành công');
              modalRef.close()
              this.getBranchPaging()
            },
            error: () =>
              this._nzMessageService.error('Kích hoạt chi nhánh thất bại.'),
            finalize: () => this.updateLoading(false),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly addBranch = this.effect<{ model: BranchApi.Request }>(($params) =>
    $params.pipe(
      tap(() => this.updateLoading(true)),
      switchMap(({ model }) =>
        this._bApiSvc.addBranch(model).pipe(
          tap({
            next: (resp) => {
              this.fileList.forEach((file) => {
                this.storageRef = ref(this.storage, 'branch/' + file.name);
                uploadString(
                  this.storageRef,
                  file.url!,
                  'base64',
                  this.metadata
                ).then((snapshot) => {
                  console.log('Uploaded a ' + file.name + ' string!');
                });
              });
              this.form.reset();
              this.fileList = [];
              this._nzMessageService.success('Đăng ký chi nhánh thành công');
            },
            error: (error) =>
              this._nzMessageService.error(error),
            finalize: () => this.updateLoading(false),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly #getService = this.effect<never>(
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

  readonly updateLoading = this.updater((s, isAdd: boolean) => ({
    ...s,
    loadingCount: s.loadingCount + (isAdd ? 1 : -1),
  }));
}
