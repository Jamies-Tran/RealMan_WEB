import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
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
import { NzUploadModule, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { BranchApi } from '../data-access/model/branch-api.model';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { provideComponentStore } from '@ngrx/component-store';
import { RxLet } from '@rx-angular/template/let';
import { OnlyNumberInputDirective } from 'src/app/share/ui/directive/only-number-input.directive';
import { BranchUpdateStore } from '../data-access/store/branch-update.store';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { NzImageModule } from 'ng-zorro-antd/image';

@Component({
  selector: 'app-branch-update',
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
    RouterLink,
    NzImageModule,
  ],
  providers: [provideComponentStore(BranchUpdateStore), NzMessageService],
  template: `
    <nz-breadcrumb>
      <nz-breadcrumb-item>Quản lý chi nhánh</nz-breadcrumb-item>
      <nz-breadcrumb-item>Chỉnh sửa chi nhánh</nz-breadcrumb-item>
    </nz-breadcrumb>
    <nz-divider></nz-divider>
    <div *rxLet="vm$ as vm">
      <form nz-form [formGroup]="buStore.form">
        <div nz-row class="tw-ml-[12%]">
          <!-- Tên chi nhánh -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Tên chi nhánh</nz-form-label
            >
            <nz-form-control nzErrorTip="Vui lòng nhập họ và tên đệm">
              <input
                class="tw-rounded-md tw-w-[70%]"
                nz-input
                placeholder="Nhập tên tài khoản"
                [formControl]="buStore.form.controls.branchName"
              />
            </nz-form-control>
          </nz-form-item>

          <!-- địa chỉ -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired>Địa chỉ</nz-form-label>
            <nz-form-control nzErrorTip="Vui lòng nhập địa chỉ">
              <input
                class="tw-rounded-md tw-w-[70%]"
                placeholder="Nhập địa chỉ"
                [formControl]="buStore.form.controls.address"
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

          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Thời gian mở cửa</nz-form-label
            >
            <nz-form-control
              nzErrorTip="Vui lòng chọn giờ mở cửa"
              class="tw-w-[70%]"
            >
              <nz-time-picker
                [nzFormat]="'HH:mm'"
                class="tw-rounded-md tw-w-[100%]"
                [formControl]="buStore.form.controls.open"
              ></nz-time-picker>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Thời gian đóng cửa</nz-form-label
            >
            <nz-form-control
              nzErrorTip="Vui lòng chọn giờ đóng cửa"
              class="tw-w-[70%]"
            >
              <nz-time-picker
                nzFormat="HH:mm"
                class="tw-rounded-md tw-w-[100%]"
                [formControl]="buStore.form.controls.close"
              ></nz-time-picker>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired>Hotline</nz-form-label>
            <nz-form-control [nzErrorTip]="phoneErrorTpl">
              <input
                class="tw-rounded-md tw-w-[70%]"
                nz-input
                appOnlyNumber
                placeholder="Nhập số điện thoại"
                [formControl]="buStore.form.controls.phone"
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

          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Số lượng nhân viên</nz-form-label
            >
            <nz-form-control [nzErrorTip]="numberStaffErrorTpl">
              <input
                nz-input
                appOnlyNumber
                class="tw-rounded-md tw-w-[70%]"
                [formControl]="buStore.form.controls.numberStaffs"
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

          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired>Dịch vụ</nz-form-label>
            <nz-form-control nzErrorTip="Vui lòng chọn loại dịch vụ">
              <nz-select
                class="tw-w-[70%] "
                [formControl]="buStore.form.controls.serviceArray"
                nzMode="multiple"
              >
                <nz-option
                  *ngFor="let option of vm.serviceData.values"
                  [nzLabel]="option.name + ' - ' + option.price + 'VND'"
                  [nzValue]="option.serviceId+ '-' + option.price"
                ></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item nz-col nzSpan="24" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Ảnh chi nhánh</nz-form-label
            >
            <nz-form-control nzErrorTip="Vui lòng nhập tên" class="tw-w-[85%]">
              <nz-upload
                nzType="drag"
                [nzMultiple]="true"
                [nzCustomRequest]="handleUpload"
                [nzFileList]="buStore.fileList"
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
              <ng-container *ngIf="buStore.fileList.length">
                <div
                  *ngFor="let file of buStore.fileList; index as index"
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
              </ng-container>
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
          [routerLink]="['/branch-management', 'branch-list']"
        >
          trở lại
        </button>
        <button
          nz-button
          nzType="primary"
          class="tw-ml-4"
          (click)="updateBranch()"
        >
          Cập nhật
        </button>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchUpdateComponent implements OnInit {
  constructor(
    public buStore: BranchUpdateStore,
    private _cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
  }

  vm$ = this.buStore.state$;
  addModel!: BranchApi.Request;

  getAddress(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.buStore.getAddress(value);
  }

  updateBranch() {
    this.buStore.form.controls.branchServiceList.setValue([]);
    this.buStore.form.controls.serviceArray.value.forEach((value) =>
      this.buStore.form.controls.branchServiceList.value.push({
        serviceId: value.toString().split('-')[0],
        price: value.toString().split('-')[1],
      })
    );
    this.buStore.updateBranch({
      id: this.buStore.form.controls.branchId.getRawValue(),
      model: this.buStore.form.getRawValue(),
    });
    console.log(this.buStore.fileList);

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
        this.buStore.fileListTmp.push({
          uid: item.file.uid,
          name: item.file.name ?? '',
          status: 'done',
          thumbUrl: result!.toString(),
          url: result!.toString().split(';base64,')[1],
        });
        this.buStore.fileList = this.buStore.fileListTmp;
        this.buStore.form.controls.branchDisplayList.value.push({
          url: 'branch/' + item.file.name,
          branchDisplayBase64Url: '',
        });
        console.log(result!.toString().split(';base64,')[0]);

        this._cdr.markForCheck();
      },
      error: (err) => {
        this._cdr.markForCheck();
      },
    });
  };

  handleRemove(index: number) {
    this.buStore.fileListTmp.splice(index, 1);
    this.buStore.fileList = this.buStore.fileListTmp;
    this.buStore.form.controls.branchDisplayList.value.splice(index, 1);
  }
}
