import { Injectable, OnInit } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import {
  BranchApi,
  BranchPagingApi,
  BranchUpdateApi,
} from '../model/branch-api.model';
import { Paging } from 'src/app/share/data-access/model/paging.type';
import { BranchApiService } from '../api/branch.service';
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
import { ActivatedRoute } from '@angular/router';
import { ServiceDataApi } from 'src/app/service-management/data-access/model/service-api.model';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from 'firebase/storage';

export interface BranchUpdateState {
  loadingCount: number;
  addressData: string[];
  serviceData: ServiceDataApi.Response;
}

const initialState: BranchUpdateState = {
  loadingCount: 0,
  addressData: [],
  serviceData: { values: [] },
};

@Injectable()
export class BranchUpdateStore
  extends ComponentStore<BranchUpdateState>
  implements OnStoreInit
{
  constructor(
    private _bApiSvc: BranchApiService,
    private _cApiSvc: CommonApiService,
    private _fb: NonNullableFormBuilder,
    private _nzMessageService: NzMessageService,
    private _activatedRoute: ActivatedRoute
  ) {
    super(initialState);
  }
  ngrxOnStoreInit() {
    this.#getService();
    this.getBranchData();
  }

  id = Number(this._activatedRoute.snapshot.paramMap.get('id'));
  addressData!: AutocompleteApi.Response;
  options: string[] = [];
  fileList: NzUploadFile[] = [];
  fileListTmp: NzUploadFile[] = [];
  storage = getStorage();
  storageRef = ref(this.storage, '/booking');
  metadata = {
    contentType: 'image/jpeg',
  };

  form = this._fb.group<BranchUpdateApi.RequestFormGroup>({
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
    branchId: this._fb.control(-1),
    thumbnailUrl: this._fb.control('123'),
    serviceArray: this._fb.control([]),
  });

  readonly getBranchData = this.effect<never>(
    pipe(
      tap(() => [this.updateLoading(true)]),
      switchMap(() =>
        this._bApiSvc.getBranch(this.id).pipe(
          tap({
            next: (resp) => {
              this.fileList = [];
              this.form.controls.address.setValue(resp.value.address);
              this.form.controls.branchName.setValue(resp.value.branchName);
              this.form.controls.numberStaffs.setValue(resp.value.numberStaffs);
              this.form.controls.branchDisplayList.setValue(
                resp.value.branchDisplayList
              );
              this.form.controls.branchServiceList.setValue(
                resp.value.branchServiceList
              );
              this.form.controls.phone.setValue(resp.value.phone);
              this.form.controls.status.setValue(resp.value.status);
              this.form.controls.open.setValue(resp.value.open);
              this.form.controls.close.setValue(resp.value.close);
              this.form.controls.branchId.setValue(resp.value.branchId);
              resp.value.branchServiceList.forEach((data) => {
                this.form.controls.serviceArray.value.push(data.serviceId+'-'+data.price);
              });
              const storage = getStorage();
              resp.value.branchDisplayList.forEach((file) => {
                getDownloadURL(ref(storage, file.url))
                  .then((url) => {
                    this.fileListTmp.push({
                      uid: file.url.split('branch/', 2)[1],
                      name: file.url.split('branch/', 2)[1],
                      status: 'done',
                      thumbUrl: url,
                      url: url,
                    });
                  })
                  .catch((error) => {});
              });
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

  readonly updateBranch = this.effect<{
    id: number;
    model: BranchUpdateApi.Request;
  }>(($params) =>
    $params.pipe(
      tap(() => this.updateLoading(true)),
      switchMap(({ id, model }) =>
        this._bApiSvc.updateBranch(id, model).pipe(
          tap({
            next: (resp) => {
              this.fileList.forEach((file) => {
                console.log(file.thumbUrl!.toString().split('/png;base64,')[0]);
                if (
                  file
                    .thumbUrl!.toString()
                    .split(';base64,')[0]
                    .includes('data:image')
                ) {
                  this.storageRef = ref(this.storage, 'branch/' + file.name);
                  uploadString(
                    this.storageRef,
                    file.url!,
                    'base64',
                    this.metadata
                  ).then((snapshot) => {
                    console.log('Uploaded a ' + file.name + ' string!');
                  });
                }
              });
              this._nzMessageService.success('Cập nhật chi nhánh thành công');
            },
            error: () =>
              this._nzMessageService.error('Cập nhật chi nhánh thất bại.'),
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
