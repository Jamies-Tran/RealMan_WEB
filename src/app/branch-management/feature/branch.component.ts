import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  NzUploadFile,
  NzUploadModule,
  NzUploadXHRArgs,
} from 'ng-zorro-antd/upload';
import { BranchApi } from '../data-access/model/branch-api.model';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { BranchStore } from '../data-access/store/branch.store';
import { provideComponentStore } from '@ngrx/component-store';
import { RxLet } from '@rx-angular/template/let';
import { OnlyNumberInputDirective } from 'src/app/share/ui/directive/only-number-input.directive';
import { Observable } from 'rxjs';
import { getStorage, ref, uploadString } from 'firebase/storage';
import { NzImageModule } from 'ng-zorro-antd/image';

@Component({
  selector: 'app-branch',
  standalone: true,
  imports: [
    CommonModule,
    NzBreadCrumbModule,
    NzDividerModule,
    NzGridModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzTableModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzUploadModule,
    NzTimePickerModule,
    NzInputNumberModule,
    NzAutocompleteModule,
    RxLet,
    OnlyNumberInputDirective,
    NzImageModule,
  ],
  providers: [provideComponentStore(BranchStore), NzMessageService],
  template: `
    <nz-breadcrumb>
      <nz-breadcrumb-item>Quản lý chi nhánh</nz-breadcrumb-item>
      <nz-breadcrumb-item>Tạo chi nhánh</nz-breadcrumb-item>
    </nz-breadcrumb>
    <nz-divider></nz-divider>
    <div *rxLet="vm$ as vm">
      <form nz-form [formGroup]="bStore.form">
        <div nz-row class="tw-ml-[12%]">
          <!-- Tên chi nhánh -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Tên chi nhánh</nz-form-label
            >
            <nz-form-control nzErrorTip="Vui lòng nhập tên chi nhánh">
              <input
                class=" tw-w-[70%]"
                nz-input
                placeholder="Nhập tên chi nhánh"
                [formControl]="bStore.form.controls.branchName"
              />
            </nz-form-control>
          </nz-form-item>

          <!-- địa chỉ -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired>Địa chỉ</nz-form-label>
            <nz-form-control nzErrorTip="Vui lòng nhập địa chỉ">
              <input
                class=" tw-w-[70%]"
                placeholder="Nhập địa chỉ"
                [formControl]="bStore.form.controls.branchAddress"
                nz-input
                (input)="getAddress($event)"
                [nzAutocomplete]="auto"
              />
              <nz-autocomplete
                [nzDataSource]="vm.addressData"
                nzBackfill
                #auto
              ></nz-autocomplete>
            </nz-form-control>
          </nz-form-item>
          <!-- thoi gian mo cua -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Thời gian mở cửa</nz-form-label
            >
            <nz-form-control
              nzErrorTip="Chọn thời gian mở cửa"
              class="tw-w-[70%]"
            >
              <nz-time-picker
                nzFormat="HH:mm"
                class=" tw-w-[100%]"
                [formControl]="bStore.form.controls.open"
              ></nz-time-picker>
            </nz-form-control>
          </nz-form-item>

          <!-- thoi gian dong cua -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Thời gian đóng cửa</nz-form-label
            >
            <nz-form-control
              nzErrorTip="Chọn thời gian đóng cửa"
              class="tw-w-[70%]"
            >
              <nz-time-picker
                nzFormat="HH:mm"
                class=" tw-w-[100%]"
                [formControl]="bStore.form.controls.close"
              ></nz-time-picker>
            </nz-form-control>
          </nz-form-item>

          <!-- so dien thoai -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired>Hotline</nz-form-label>
            <nz-form-control [nzErrorTip]="phoneErrorTpl">
              <input
                class=" tw-w-[70%]"
                nz-input
                appOnlyNumber
                placeholder="Nhập số điện thoại"
                [formControl]="bStore.form.controls.branchHotline"
              />
              <ng-template #phoneErrorTpl let-control>
                <ng-container *ngIf="control.hasError('trimRequired')">
                  Vui lòng nhập sđt
                </ng-container>
                <ng-container
                  *ngIf="
                    control.hasError('minlength') &&
                    !control.hasError('trimRequired')
                  "
                >
                  Sđt gồm 10 số
                </ng-container>
                <ng-container
                  *ngIf="
                    control.hasError('maxlength') &&
                    !control.hasError('minlength')
                  "
                >
                  Sđt gồm 10 số
                </ng-container>
              </ng-template>
            </nz-form-control>
          </nz-form-item>
          <!-- so luong nhan vien -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Số lượng nhân viên</nz-form-label
            >
            <nz-form-control [nzErrorTip]="numberStaffErrorTpl">
              <input
                nz-input
                appOnlyNumber
                class=" tw-w-[70%]"
              />
              <ng-template #numberStaffErrorTpl let-control>
                <ng-container *ngIf="control.hasError('trimRequired')">
                  Vui lòng nhập số lượng nhân viên
                </ng-container>
                <ng-container
                  *ngIf="
                    control.hasError('min') && !control.hasError('trimRequired')
                  "
                >
                  số lượng nhân viên > 0
                </ng-container>
                <ng-container
                  *ngIf="
                    control.hasError('max') && !control.hasError('minlength')
                  "
                >
                  số lượng nhân viên < 101
                </ng-container>
              </ng-template>
            </nz-form-control>
          </nz-form-item>

          <!-- dich vu -->
          <!-- <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired>Dịch vụ</nz-form-label>
            <nz-form-control nzErrorTip="Vui lòng chọn loại dịch vụ">
              <nz-select
                class="tw-w-[70%] "
                [formControl]="bStore.form.controls.serviceArray"
                nzMode="multiple"
              >
                <nz-option
                  *ngFor="let option of vm.serviceData.values"
                  [nzLabel]="option.name + ' - ' + option.price + 'VND'"
                  [nzValue]="option.serviceId + '-' + option.price"
                ></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item> -->

          <!-- anh chi nhanh -->
          <nz-form-item nz-col nzSpan="24" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Ảnh chi nhánh</nz-form-label
            >
            <nz-form-control nzErrorTip="Vui lòng nhập tên" class="tw-w-[85%]">
              <nz-upload
                nzType="drag"
                [nzMultiple]="true"
                [nzCustomRequest]="handleUpload"
                [nzFileList]="bStore.fileList"
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
              <div
                *ngFor="let file of bStore.fileList; index as index"
                class="tw-relative tw-text-center tw-mt-3"
              >
                <img
                  nz-image
                  nzSrc="{{ file.thumbUrl }}"
                  width="30%"
                  height="30%"
                  alt="preview-image"
                  class="tw-object-contain tw-cursor-pointer"
                />
                <i
                  nz-icon
                  nzType="close-circle"
                  nzTheme="twotone"
                  nzTwotoneColor="#e10027"
                  (click)="handleRemove(index)"
                  class="tw-absolute tw-right-0 tw-top-0 tw-cursor-pointer icon-remove"
                ></i>
              </div>
            </nz-form-control>
          </nz-form-item>

          <!-- dia chi -->
        </div>
        <nz-divider></nz-divider>
      </form>
      <div class="tw-text-center">
        <button
          nz-button
          nzDanger
          nzType="primary"
          (click)="bStore.form.reset()"
        >
          Làm mới
        </button>
        <button
          nz-button
          nzType="primary"
          class="tw-ml-4"
          (click)="addBranch()"
        >
          Tạo Chi nhánh
        </button>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchComponent {
  constructor(public bStore: BranchStore, private _cdr: ChangeDetectorRef) {}

  vm$ = this.bStore.state$;
  addModel!: BranchApi.Request;
  branchDisplayList = [{ url: '' }];

  addBranch() {
    this.branchDisplayList = [];
    this.bStore.fileList.forEach((url) => {
      this.branchDisplayList.push({ url: 'branch/' + url.name });
    });
    // this.addModel = this.bStore.form.getRawValue();
    console.log(this.bStore.form.getRawValue());

    this.bStore.addBranch({ model: this.bStore.form.getRawValue() });
  }

  getAddress(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.bStore.getAddress(value);
    console.log(value);

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
        this.bStore.fileListTmp.push({
          uid: item.file.uid,
          name: item.file.name ?? '',
          status: 'done',
          thumbUrl: result!.toString(),
          url: result!.toString().split(';base64,')[1],
        });
        this.bStore.fileList = this.bStore.fileListTmp;
        this.bStore.form.controls.branchDisplays.value.push({
          branchDisplayContent: 'branch/' + item.file.name,
        });
        this._cdr.markForCheck();
      },
      error: (err) => {
        this._cdr.markForCheck();
      },
    });
  };

  handleRemove(index: number) {
    this.bStore.fileListTmp.splice(index, 1);
    this.bStore.fileList = this.bStore.fileListTmp;
    this.bStore.form.controls.branchDisplays.value.splice(index, 1);
  }
}
