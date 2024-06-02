import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadModule, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { ServiceStore } from '../data-access/store/service.store';
import { provideComponentStore } from '@ngrx/component-store';
import { RxLet } from '@rx-angular/template/let';
import { ServiceAddApi } from '../data-access/model/service-api.model';
import { OnlyNumberInputDirective } from 'src/app/share/ui/directive/only-number-input.directive';
import { Observable } from 'rxjs';
import { NzImageModule } from 'ng-zorro-antd/image';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [
    CommonModule,
    NzBreadCrumbModule,
    NzDividerModule,
    NzGridModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzUploadModule,
    RxLet,
    OnlyNumberInputDirective,
    NzImageModule
  ],
  providers: [NzMessageService, provideComponentStore(ServiceStore)],
  template: `
    <nz-breadcrumb>
      <nz-breadcrumb-item>Quản lý dịch vụ</nz-breadcrumb-item>
      <nz-breadcrumb-item>Tạo dịch vụ</nz-breadcrumb-item>
    </nz-breadcrumb>
    <nz-divider></nz-divider>
    <div *rxLet="vm$ as vm">
      <form nz-form [formGroup]="form">
        <div nz-row class="tw-ml-[12%]">
          <!-- Tên dich vu -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Tên dịch vụ</nz-form-label
            >
            <nz-form-control nzErrorTip="Vui lòng nhập tên dịch vụ">
              <input
                class="tw-w-[70%]"
                nz-input
                [formControl]="form.controls.name"
                placeholder="Nhập tên dịch vụ"
              />
            </nz-form-control>
          </nz-form-item>

          <!-- Tien -->

          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Số Tiền</nz-form-label
            >
            <nz-form-control nzErrorTip="Vui lòng nhập số tiền">
              <input
                class="tw-w-[70%]"
                nz-input
                [formControl]="form.controls.price"
                placeholder="Nhập số tiền"
                appOnlyNumber
              />
            </nz-form-control>
          </nz-form-item>

          <!-- loaij dichj vuj -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Loại dịch vụ</nz-form-label
            >
            <nz-form-control nzErrorTip="Vui lòng chọn loại dịch vụ">
              <nz-select
                class="tw-w-[70%]"
                [formControl]="form.controls.categoryId"
              >
                <nz-option
                  *ngFor="let option of vm.categoryData.values"
                  [nzLabel]="option.categoryType"
                  [nzValue]="option.categoryId"
                ></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>

          <!-- thoi gian -->

          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Thời gian dự tính</nz-form-label
            >
            <nz-form-control nzErrorTip="Vui lòng nhập thời gian ước tính">
              <nz-input-group nzCompact>
                <nz-select [formControl]="form.controls.durationTime" class="tw-w-[15%]">
                  <nz-option
                    [nzLabel]="'Minute'"
                    [nzValue]="'MINUTE'"
                  ></nz-option>
                  <nz-option [nzLabel]="'Hour'" [nzValue]="'Hour'"></nz-option>
                </nz-select>
                <input
                  class="tw-w-[55%]"
                  type="text"
                  nz-input
                  [formControl]="form.controls.durationValue"
                  appOnlyNumber
                />
              </nz-input-group>
            </nz-form-control>
          </nz-form-item>

          <!-- mo ta -->

          <nz-form-item nz-col nzSpan="12">
            <nz-form-label class="tw-ml-3">Mô tả dịch vụ</nz-form-label>
            <nz-form-control>
              <textarea
                class="tw-w-[70%]"
                rows="5"
                nz-input
                [formControl]="form.controls.description"
              ></textarea>
            </nz-form-control>
          </nz-form-item>

          <!-- anh -->

          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Ảnh dịch vụ</nz-form-label
            >
            <nz-form-control nzErrorTip="Vui lòng nhập tên" class="tw-w-[70%]">
            <nz-upload
                nzType="drag"
                [nzMultiple]="true"
                [nzCustomRequest]="handleUpload"
                [nzFileList]="form.controls.fileList.getRawValue()"
                [nzShowUploadList]="false"
              >
                <p class="ant-upload-drag-icon">
                  <span nz-icon nzType="inbox"></span>
                </p>
                <p class="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p class="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibit from
                  uploading company data or other band files
                </p>
              </nz-upload>
              <div *ngFor="let file of form.controls.fileList.getRawValue(), index as index" class="tw-relative tw-text-center tw-mt-3">
              <img
                nz-image
                nzSrc="{{ file.thumbUrl }}"
                width="30%"
                height="30%"
                alt="preview-image"
                class="tw-object-contain tw-cursor-pointer" />
              <i
                nz-icon
                nzType="close-circle"
                nzTheme="twotone"
                nzTwotoneColor="#e10027"
                (click)="handleRemove(index)"
                class="tw-absolute tw-right-0 tw-top-0 tw-cursor-pointer icon-remove"></i>
            </div>
            </nz-form-control>
          </nz-form-item>
        </div>
        <nz-divider></nz-divider>
      </form>
      <div class="tw-text-center">
        <button nz-button nzDanger nzType="primary" (click)="form.reset()">
          Làm mới
        </button>
        <button
          nz-button
          nzType="primary"
          class="tw-ml-4"
          (click)="addService()"
          [disabled]="form.invalid"
        >
          Tạo dịch vụ
        </button>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceComponent {
  constructor(public sStore: ServiceStore, private _cdr: ChangeDetectorRef) {}

  vm$ = this.sStore.state$;
  form = this.sStore.form;

  addService() {
    this.sStore.addService({ model: ServiceAddApi.mapModel(this.form) });
  }

  handleUpload = (item: NzUploadXHRArgs) => {
    return new Observable(
      (subscriber: { next: (arg0: string | ArrayBuffer | null) => void }) => {
        const reader = new FileReader();
        reader.onloadend = (e) => {
          subscriber.next(reader.result);
        };
        reader.readAsDataURL(item.file as unknown as File);
      }
    ).subscribe({
      next: (result) => {
        this.sStore.fileListTmp.push({
          uid: item.file.uid,
          name: item.file.name ?? '',
          status: 'done',
          thumbUrl: result!.toString(),
          url: result!.toString().split(';base64,')[1]
        });
        this.form.controls.fileList.patchValue(this.sStore.fileListTmp)
        this.form.controls.serviceDisplayList.value.push({
          serviceDisplayUrl: 'service/' + item.file.name,
          branchDisplayBase64Url: '',
        });
        this._cdr.markForCheck();
      },
      error: (err) => {
        this._cdr.markForCheck();
      },
    });
  };

  handleRemove(index: number) {
    this.sStore.fileListTmp.splice(index,1)
    this.form.controls.fileList.patchValue(this.sStore.fileListTmp)
    this.form.controls.serviceDisplayList.value.splice(index,1)
  }
}
