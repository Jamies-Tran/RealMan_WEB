import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { AccountStore } from '../data-access/store/account.store';
import { provideComponentStore } from '@ngrx/component-store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { RxLet } from '@rx-angular/template/let';
import { NzSelectChangeDirective } from 'src/app/share/ui/directive/nz-select-change.directive';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-update',
  standalone: true,
  imports: [
    CommonModule,
    NzCalendarModule,
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
    NzDatePickerModule,
    RxLet,
    NzSelectChangeDirective,
    NzAutocompleteModule,
    NzBadgeModule,
  ],
  providers: [provideComponentStore(AccountStore), NzMessageService],
  template: `<nz-breadcrumb>
      <nz-breadcrumb-item>Quản lý tài khoản</nz-breadcrumb-item>
      <nz-breadcrumb-item>Chi tiết tài khoản</nz-breadcrumb-item>
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
                Sđt gồm 10 số hoặc hơn
              </ng-container>
              <ng-container
                *ngIf="
                  control.hasError('maxlength') &&
                  !control.hasError('minlength')
                "
              >
                Sđt ít hơn 12 số
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
                class="tw-w-[70%]"
                [formControl]="form.controls.dob"
              ></nz-date-picker>
            </nz-form-control>
          </nz-form-item>
        </div>
      </form>
      <nz-divider></nz-divider>
      <!-- calendar -->
      <div nz-row>
        <div>
          <h3 class="tw-ml-[11%]">Lịch làm</h3>
          <nz-calendar nz-col nzMd="18" class="tw-ml-[11%]">
            <ul *nzDateCell="let date" class="events">
              <ng-container *ngFor="let event of aStore.schedule">
                <li *ngIf="event.date.getTime() === date.getTime()">
                  <nz-badge
                    [nzStatus]="event.content === 'MORNING' ? 'success' : 'warning'"
                    [nzText]="event.content === 'MORNING' ? 'Ca Sáng' : 'Ca Tối'"
                  ></nz-badge>
                </li>
              </ng-container>
            </ul>
          </nz-calendar>
        </div>
      </div>

      <div class="tw-text-center">
        <button nz-button nzDanger nzType="primary" (click)="click()">
          Trở lại
        </button>
      </div>
    </div> `,
  styles: [
    `
      .events {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .events .ant-badge-status {
        overflow: hidden;
        white-space: nowrap;
        width: 100%;
        text-overflow: ellipsis;
        font-size: 12px;
      }

      .notes-month {
        text-align: center;
        font-size: 28px;
      }

      .notes-month section {
        font-size: 28px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountUpdateComponent implements OnInit {
  constructor(public aStore: AccountStore, private _router: Router) {}

  vm$ = this.aStore.state$;
  form = this.aStore.form;

  ngOnInit(): void {
    this.aStore.getAccountData();
    this.aStore.getScheduleData();
    this.form.disable()
  }

  getAddress(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.aStore.getAddress(value);
  }

  onSeachBranchName(branchName: string) {
    this.aStore.getBranchName(branchName);
  }

  onChangeLicense(branchId: number) {
    this.aStore.getBranchData(branchId);
  }

  click(){
    this._router.navigate(['/account-management/account-list'])

  }
}
