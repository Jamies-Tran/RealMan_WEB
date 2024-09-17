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
import {
  CategoryDataGet,
  ServiceAddApi,
  ServiceGetApi,
  ServicePagingApi,
  ServiceUpdateApi,
} from '../model/service-api.model';
import { ServiceApiService } from '../api/service-api.service';
import { ActivatedRoute } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage';

export interface ServiceState {
  servicePaging: Paging<ServicePagingApi.Response>;
  loadingCount: number;
  categoryData: CategoryDataGet.Response;
}

const initialState: ServiceState = {
  servicePaging: {
    content: [],
    currentPage: 1,
    pageSize: 10,
    totalElement: 0,
    totalPage: 0,
  },
  loadingCount: 0,
  categoryData: { values: [] },
};

@Injectable()
export class ServiceStore
  extends ComponentStore<ServiceState>
  implements OnStoreInit
{
  constructor(
    private _sApiSvc: ServiceApiService,
    private _fb: NonNullableFormBuilder,
    private _nzMessageService: NzMessageService,
    private _activatedRoute: ActivatedRoute
  ) {
    super(initialState);
  }
  ngrxOnStoreInit() {
  }

  id = Number(this._activatedRoute.snapshot.paramMap.get('serviceId'));
  addressData!: AutocompleteApi.Response;
  options: string[] = [];
  fileListTmp: NzUploadFile[] = [];
  storage = getStorage();
  storageRef = ref(this.storage, '/service');
  metadata = {
    contentType: 'image/jpeg',
  };

  pagingRequest: ServicePagingApi.Request = {
    current: 1,
    pageSize: pagingSizeOptionsDefault[0],
    search: '',
    sorter: '',
    orderDescending: false,
  };

  form = this._fb.group<
    ServiceAddApi.RequestFormGroup | ServiceUpdateApi.RequestFormGroup
  >({
    shopServiceName: this._fb.control('', trimRequired),
    shopCategoryId: this._fb.control('', Validators.required),
    serviceDisplays: this._fb.control([]),
    shopServicePrice: this._fb.control(0, trimRequired),
    fileList: this._fb.control([]),
    shopServiceThumbnail: this._fb.control('123')
  });

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

  // readonly addCategory = this.effect<{
  //   model: CategoryAddApi.Request;
  //   modalRef: NzModalRef;
  // }>(($params) =>
  //   $params.pipe(
  //     tap(() => this.updateLoading(true)),
  //     switchMap(({ model, modalRef }) =>
  //       this._sApiSvc.addCategory(model).pipe(
  //         tap({
  //           next: (resp) => {
  //             modalRef.destroy();
  //             this._nzMessageService.success('Thêm loại dịch vụ thành công');
  //           },
  //           error: () =>
  //             this._nzMessageService.error('Thêm loại dịch vụ thất bại.'),
  //           finalize: () => this.updateLoading(false),
  //         }),
  //         catchError(() => EMPTY)
  //       )
  //     )
  //   )
  // );

  // readonly #getCategoryData = this.effect<never>(
  //   pipe(
  //     tap(() => this.updateLoading(true)),
  //     switchMap(() =>
  //       this._sApiSvc.CategoryDataGet().pipe(
  //         tap({
  //           next: (resp) => {
  //             this.patchState({ categoryData: resp });
  //           },
  //           finalize: () => this.updateLoading(false),
  //         }),
  //         catchError(() => EMPTY)
  //       )
  //     )
  //   )
  // );

  readonly addService = this.effect<{ model: ServiceAddApi.Request }>(
    ($params) =>
      $params.pipe(
        tap(() => this.updateLoading(true)),
        switchMap(({ model }) =>
          this._sApiSvc.addService(model).pipe(
            tap({
              next: (resp) => {
                this.form.controls.fileList.value.forEach((file) => {
                  this.storageRef = ref(this.storage, 'service/' + file.name);
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
                this._nzMessageService.success('Tạo dịch vụ thành công');
              },
              error: () => this._nzMessageService.error('Tạo dịch vụ thất bại'),
              finalize: () => this.updateLoading(false),
            }),
            catchError(() => EMPTY)
          )
        )
      )
  );

  readonly getServiceData = this.effect<never>(
    pipe(
      tap(() => [this.updateLoading(true)]),
      switchMap(() =>
        this._sApiSvc.getService(this.id).pipe(
          tap({
            next: (resp) => {
              this.form.patchValue(resp.content)
              if(resp.content.serviceDisplays !== null){
                resp.content.serviceDisplays.forEach((file) => {
                  getDownloadURL(ref(this.storage, file.serviceDisplayContent))
                    .then((url) => {
                      this.fileListTmp.push({
                        uid: file.serviceDisplayContent.split('service/', 2)[1],
                        name: file.serviceDisplayContent.split('service/', 2)[1],
                        status: 'done',
                        thumbUrl: url,
                        url: url,
                      });
                      this.form.controls.fileList.patchValue(this.fileListTmp)
                    })
                    .catch((error) => {});
                });
              } else {
                this.form.controls.serviceDisplays.setValue([])
                this.form.controls.fileList.setValue([])
              }
            },
            finalize: () => this.updateLoading(false),
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly updateService = this.effect<{id: number, model: ServiceUpdateApi.Request }>($params =>
    $params.pipe(
      tap(() => this.updateLoading(true)),
      switchMap(({ id, model }) =>
        this._sApiSvc.updateService(id, model).pipe(
          tap({
            next: resp => {
              this.form.controls.fileList.getRawValue().forEach((file) => {
                console.log(file.thumbUrl!.toString().split('/png;base64,')[0]);
                if (
                  file
                    .thumbUrl!.toString()
                    .split(';base64,')[0]
                    .includes('data:image')
                ) {
                  this.storageRef = ref(this.storage, 'service/' + file.name);
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
              this._nzMessageService.success('Cập nhật dịch vụ thành công');
            },
            error: () => this._nzMessageService.error('Cập nhật dịch vụ thất bại.'),
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
