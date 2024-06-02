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
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { provideComponentStore } from '@ngrx/component-store';
import { RxLet } from '@rx-angular/template/let';
import { OnlyNumberInputDirective } from 'src/app/share/ui/directive/only-number-input.directive';
import { NzImageModule } from 'ng-zorro-antd/image';
import { BookingStore } from '../data-access/store/booking.store';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { BookingAddApi } from '../data-access/model/booking-api.model';

@Component({
  selector: 'app-booking',
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
    NzTimePickerModule,
    NzInputNumberModule,
    NzAutocompleteModule,
    RxLet,
    OnlyNumberInputDirective,
    NzImageModule,
    NzDatePickerModule,
  ],
  providers: [provideComponentStore(BookingStore), NzMessageService],
  template: `
    <nz-breadcrumb>
      <nz-breadcrumb-item>Quản lý booking</nz-breadcrumb-item>
      <nz-breadcrumb-item>Tạo booking</nz-breadcrumb-item>
    </nz-breadcrumb>
    <nz-divider></nz-divider>
    <div *rxLet="vm$ as vm">
      <form nz-form [formGroup]="form">
        <div nz-row class="tw-ml-[12%]">
          <!-- Họ khách -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Họ và tên đệm</nz-form-label
            >
            <nz-form-control nzErrorTip="Vui lòng nhập họ và tên đệm">
              <input
                class=" tw-w-[70%]"
                nz-input
                placeholder="Nhập họ và tên đệm"
                [formControl]="form.controls.firstName"
              />
            </nz-form-control>
          </nz-form-item>

          <!-- tên khách -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired>Tên</nz-form-label>
            <nz-form-control nzErrorTip="Vui lòng nhập tên">
              <input
                class=" tw-w-[70%]"
                placeholder="Nhập tên"
                [formControl]="form.controls.lastName"
                nz-input
              />
            </nz-form-control>
          </nz-form-item>

          <!-- so dien thoai -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Số điện thoại</nz-form-label
            >
            <nz-form-control [nzErrorTip]="phoneErrorTpl">
              <input
                class=" tw-w-[70%]"
                nz-input
                appOnlyNumber
                placeholder="Nhập số điện thoại"
                [formControl]="form.controls.phone"
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

          <!-- dich vu -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired>Dịch vụ</nz-form-label>
            <nz-form-control nzErrorTip="Vui lòng chọn loại dịch vụ">
              <nz-select
                class="tw-w-[70%] "
                [formControl]="form.controls.serviceArray"
                nzMode="multiple"
                nzPlaceHolder="chọn dịch vụ"
              >
                <nz-option
                  *ngFor="let option of vm.serviceData.values"
                  [nzLabel]="option.name + ' - ' + option.price + 'VND'"
                  [nzValue]="option.serviceId"
                ></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>

          <!-- ngày đặt -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Ngày đặt lịch</nz-form-label
            >
            <nz-form-control nzErrorTip="Chọn ngày đặt">
              <nz-date-picker
                [nzDisabledDate]="disabledDate"
                class="tw-w-[70%]"
                [formControl]="form.controls.appointmentDateV2"
              ></nz-date-picker>
            </nz-form-control>
          </nz-form-item>

          <!-- giờ đặt -->
          <nz-form-item nz-col nzSpan="12" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Giờ đặt lịch</nz-form-label
            >
            <nz-form-control nzErrorTip="Chọn giờ đặt lịch">
              <nz-time-picker
                nzFormat="HH:mm"
                class="tw-w-[70%]"
                [formControl]="form.controls.startAppointment"
              ></nz-time-picker>
            </nz-form-control>
          </nz-form-item>
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
          [disabled]="form.invalid"
        >
          Tạo booking
        </button>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingComponent implements OnInit{
  constructor(public bStore: BookingStore, private _cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.bStore.getService()
  }

  vm$ = this.bStore.state$;
  form = this.bStore.form;
  branchDisplayList = [{ url: '' }];

  addBranch() {
    this.form.controls.bookingServices.setValue([])
    this.form.controls.serviceArray.value.forEach((data) => {
      this.form.controls.bookingServices.value.push({
        bookingServiceType: 'PICKUP_STYLIST',
        startAppointmentV2: new Date(this.form.controls.startAppointment.value!),
        endAppointmentV2:
         new Date(this.form.controls.startAppointment.value!.setMinutes(this.form.controls.startAppointment.value!.getMinutes()+20)),
        serviceId: data,
        staffId: null,
      });
    });
    console.log(this.form.getRawValue());

    this.bStore.addBooking({model: BookingAddApi.mapModel(this.form)})

  }

  today = new Date();

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.today) < 0;
}
