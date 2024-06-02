import { Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { BranchApi, BranchPagingApi } from '../model/branch-api.model';
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
import { ServiceDataApi } from 'src/app/service-management/data-access/model/service-api.model';
import {
  getStorage,
  ref,
  uploadString,
} from 'firebase/storage';
import { NzUploadFile } from 'ng-zorro-antd/upload';

export interface BranchState {
  branchPaging: Paging<BranchPagingApi.Response>;
  loadingCount: number;
  addressData: string[];
  serviceData: ServiceDataApi.Response;
}

const initialState: BranchState = {
  branchPaging: {
    content: [],
    current: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
  },
  loadingCount: 0,
  addressData: [],
  serviceData: { values: [] },
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
    private _nzMessageService: NzMessageService
  ) {
    super(initialState);
  }
  ngrxOnStoreInit() {
    this.#getService();
  }

  addressData!: AutocompleteApi.Response;
  options: string[] = [];
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

  form = this._fb.group<BranchApi.RequestFormGroup>({
    shopOwnerId: this._fb.control(localStorage.getItem('accountId$')!),
    branchName: this._fb.control('', trimRequired),
    phone: this._fb.control('', [
      Validators.minLength(10),
      Validators.maxLength(10),
      trimRequired,
    ]),
    address: this._fb.control('', trimRequired),
    status: this._fb.control('OPEN'),
    numberStaffs: this._fb.control(0, [Validators.min(1), Validators.max(100)]),
    open: this._fb.control(null, Validators.required),
    close: this._fb.control(null, Validators.required),
    branchDisplayList: this._fb.control([]),
    branchServiceList: this._fb.control([]),
    thumbnailUrl: this._fb.control('123', trimRequired),
    serviceArray: this._fb.control([]),
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

  readonly getAddress = this.effect<string>(($params) =>
    $params.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((keyword: string) => {
        return this._cApiSvc.autocomplete(keyword).pipe(
          tap({
            next: (resp) => {
              this.options = [];
              if (resp.value.predictions !== null) {
                resp.value.predictions.forEach((address) => {
                  this.options.push(address.description);
                });
                this.patchState({ addressData: this.options });
              }
            },
            finalize: () => {},
          })
        );
      })
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
              this.fileList = []
              this._nzMessageService.success('Đăng ký chi nhánh thành công');
            },
            error: () =>
              this._nzMessageService.error('Đăng ký chi nhánh thất bại.'),
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
