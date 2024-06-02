import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AccountAddApi } from '../data-access/model/account-api.model';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { AccountApiService } from '../data-access/api/account.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AccountStore } from '../data-access/store/account.store';
import { provideComponentStore } from '@ngrx/component-store';
import { RxLet } from '@rx-angular/template/let';
import { NzSelectChangeDirective } from 'src/app/share/ui/directive/nz-select-change.directive';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { differenceInCalendarDays } from 'date-fns';

@Component({
  selector: 'app-account',
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
    NzDatePickerModule,
    RxLet,
    NzSelectChangeDirective,
    NzAutocompleteModule
  ],
  providers: [NzMessageService, provideComponentStore(AccountStore)],
  template: `
    <nz-breadcrumb>
      <nz-breadcrumb-item>Quản lý tài khoản</nz-breadcrumb-item>
      <nz-breadcrumb-item>Tạo tài khoản</nz-breadcrumb-item>
    </nz-breadcrumb>
    <nz-divider></nz-divider>
    <div *rxLet="vm$ as vm">
      <form nz-form [formGroup]="form">
        <div nz-row class="tw-ml-[12%]">
          <!-- first name -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Họ và tên đệm</nz-form-label
            >
            <nz-form-control nzErrorTip="Vui lòng nhập họ và tên đệm">
              <input
                class="tw-rounded-md tw-w-[70%]"
                [formControl]="form.controls.firstName"
                nz-input
                placeholder="Nhập tên tài khoản"
              />
            </nz-form-control>
          </nz-form-item>

          <!-- last name -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired>Tên</nz-form-label>
            <nz-form-control nzErrorTip="Vui lòng nhập tên">
              <input
                class="tw-rounded-md tw-w-[70%]"
                [formControl]="form.controls.lastName"
                nz-input
                placeholder="Nhập tên tài khoản"
              />
            </nz-form-control>
          </nz-form-item>

          <!-- dia chi -->

          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired>Địa chỉ</nz-form-label>
            <nz-form-control nzErrorTip="Vui lòng nhập địa chỉ">
            <input
                class="tw-rounded-md tw-w-[70%]"
                placeholder="Nhập địa chỉ"
                [formControl]="form.controls.address"
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

          <!-- so dien thoai -->

          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Số điện thoại</nz-form-label
            >
            <nz-form-control [nzErrorTip]="phoneErrorTpl">
              <input
                class="tw-rounded-md tw-w-[70%]"
                [formControl]="form.controls.phone"
                nz-input
                placeholder="Nhập số điện thoại"
              />
            </nz-form-control>
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
          </nz-form-item>
          <!-- gioi tinh -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired>Giới tính</nz-form-label>
            <nz-form-control nzErrorTip="Chọn giới tính">
              <nz-select
                class="tw-w-[70%]"
                nzPlaceHolder="Chọn giới tính"
                [formControl]="form.controls.gender"
              >
                <nz-option nzValue="NAM" nzLabel="Nam"></nz-option>
                <nz-option nzValue="NU" nzLabel="Nữ"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>
          <!-- ngay sinh -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired>Ngày sinh</nz-form-label>
            <nz-form-control nzErrorTip="Chọn ngày sinh">
              <nz-date-picker
              [nzDisabledDate]="disabledDate"
                class="tw-w-[70%]"
                [formControl]="form.controls.dob"
              ></nz-date-picker>
            </nz-form-control>
          </nz-form-item>
        </div>
        <nz-divider></nz-divider>

        <div nz-row class="tw-ml-[12%]">
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired>Chi nhánh</nz-form-label>
            <nz-form-control>
              <nz-select
                class="tw-w-[70%]"
                [formControl]="form.controls.branch"
                nzShowSearch="true"
                nzServerSearch="false"
                (nzOnSearch)="onSeachBranchName($event)"
                (nzSelectChange)="onChangeLicense($event)"
              >
                <nz-option
                  *ngFor="let option of vm.branchNameData.values"
                  [nzValue]="option.branchId"
                  [nzLabel]="option.branchName"
                ></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3">Địa chỉ chi nhánh</nz-form-label>
            <nz-form-control>
              <input class="tw-rounded-md tw-w-[70%]" nz-input [formControl]="form.controls.branchAddress" />
            </nz-form-control>
          </nz-form-item>
          <!-- ca -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3"
              >Số lượng nhân viên của chi nhánh</nz-form-label
            >
            <nz-form-control>
            <input class="tw-rounded-md tw-w-[70%]" nz-input [formControl]="form.controls.numberStaffs" />
            </nz-form-control>
          </nz-form-item>
          <!-- chuc vu -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired>Chức vụ</nz-form-label>
            <nz-form-control>
              <nz-select
                class="tw-w-[70%]"
                [formControl]="form.controls.professional"
              >
                <nz-option nzValue="STYLIST" nzLabel="Stylist"></nz-option>
                <nz-option nzValue="MASSEUR" nzLabel="Masseur"></nz-option>
                <nz-option
                  nzValue="RECEPTIONIST"
                  nzLabel="Receptionist"
                ></nz-option>
                <nz-option
                  nzValue="BRANCH_MANAGER"
                  nzLabel="Branch Manager"
                ></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>
      </form>
      <div class="tw-text-center">
        <button nz-button nzDanger nzType="primary" (click)="form.reset()">
          Làm mới
        </button>
        <button
          nz-button
          nzType="primary"
          class="tw-ml-4"
          (click)="createAccount()"
          [disabled]="form.invalid"
        >
          Tạo tài khoản
        </button>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent implements OnInit {
  constructor(
    private _fb: NonNullableFormBuilder,
    private _accountSvc: AccountApiService,
    private _nzMessageService: NzMessageService,
    public aStore: AccountStore
  ) {}

  vm$ = this.aStore.state$;
  form = this.aStore.form;
  model!: AccountAddApi.Request;

  ngOnInit(): void {
    this.aStore.getBranchName('');
  }

  createAccount() {
    console.log(this.form.getRawValue());
    this.model = this.form.getRawValue();
    this._accountSvc.createAccount(this.model).subscribe(
      (data) => {
        this._nzMessageService.success('Đăng kí thành công.');
      },
      (error) => {
        this._nzMessageService.error('Đăng kí thất bại.');
      }
    );
  }

  onSeachBranchName(branchName: string){
    this.aStore.getBranchName(branchName);
  }

  onChangeLicense(branchId: number){
    this.aStore.getBranchData(branchId)
  }

  getAddress(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.aStore.getAddress(value);
  }

  today = new Date();

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.today) > -6570;
}
