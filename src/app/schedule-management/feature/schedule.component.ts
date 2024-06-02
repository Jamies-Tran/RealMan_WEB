import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, NonNullableFormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { tap } from 'rxjs';
import { provideComponentStore } from '@ngrx/component-store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { trimRequired } from 'src/app/share/form-validator/trim-required.validator';
import { RxLet } from '@rx-angular/template/let';
import { ScheduleStore } from '../data-access/store/schedule.store';
import { MapShiftTypeNamePipe } from '../until/shift.pipe';
import { ShiftType } from 'src/app/share/data-access/api/enum/shift.enum';

@Component({
  selector: 'app-schedule',
  standalone: true,
  providers: [
    NzModalService,
    provideComponentStore(ScheduleStore),
    NzMessageService,
  ],
  template: `
    <nz-breadcrumb>
      <nz-breadcrumb-item>Quản lý lịch làm</nz-breadcrumb-item>
      <nz-breadcrumb-item>Xem và sửa lịch làm</nz-breadcrumb-item>
    </nz-breadcrumb>
    <nz-divider></nz-divider>
    <div nz-row>
      <div nz-col nzSpan="24" class="">
        <nz-input-group nzSearch [nzAddOnAfter]="suffixIconButton">
          <input type="text" nz-input placeholder="Tìm theo tên" />
        </nz-input-group>
        <ng-template #suffixIconButton>
          <button nz-button nzType="primary" nzSearch>
            <span nz-icon nzType="search"></span>
          </button>
        </ng-template>
      </div>
      <!-- <div nz-row class="tw-mt-4 tw-flex"> -->
      <!-- </div> -->
      <div nz-col nzSpan="24" class="tw-mt-5">
        <ng-container *rxLet="vm$ as vm">
          <nz-table
            appNzTableDefaultSetting
            class="tw-mr-4"
            [nzData]="fakeData.content"
            [nzTotal]="fakeData.totalElements"
            [(nzPageIndex)]="sStore.pagingRequest.current"
            [(nzPageSize)]="sStore.pagingRequest.pageSize"
            [nzShowTotal]="totalText"
            [nzLoading]="!!vm.loadingCount"
            nzShowSizeChanger
          >
            <thead>
              <ng-template #totalText let-total let-range="range">
                <span
                  >{{ range[0] }} - {{ range[1] }} of {{ total }}
                  {{ 'Staffs' }}</span
                >
              </ng-template>
              <tr>
                <th>STT</th>
                <th>Tên nhân viên</th>
                <th>Thứ 2</th>
                <th>Thứ 3</th>
                <th>Thứ 4</th>
                <th>Thứ 5</th>
                <th>Thứ 6</th>
                <th>Thứ 7</th>
                <th>Chủ nhật</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let data of fakeData.content; index as i">
                <td>{{ i + 1 }}</td>
                <td>{{ data.name }}{{ ' - ' + data.phone }}</td>
                <td>{{ data.schedules.mon | mapShiftTypeName }}</td>
                <td>{{ data.schedules.tue | mapShiftTypeName }}</td>
                <td>{{ data.schedules.wed | mapShiftTypeName }}</td>
                <td>{{ data.schedules.thurs | mapShiftTypeName }}</td>
                <td>{{ data.schedules.fri | mapShiftTypeName }}</td>
                <td>{{ data.schedules.sat | mapShiftTypeName }}</td>
                <td>{{ data.schedules.sun | mapShiftTypeName }}</td>
                <td class="tw-text-center">
                  <button nz-button nzType="primary">Chỉnh sửa</button>
                </td>
              </tr>
            </tbody>
          </nz-table>
        </ng-container>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NzBreadCrumbModule,
    NzDividerModule,
    NzGridModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzTableModule,
    RouterLink,
    NzSelectModule,
    RxLet,
    MapShiftTypeNamePipe,
  ],
})
export class ScheduleComponent {
  constructor(
    private _nzModalSvc: NzModalService,
    private _fb: NonNullableFormBuilder,
    public sStore: ScheduleStore
  ) {}

  vm$ = this.sStore.state$;
  fakeData = {
    totalElements: 0,
    totalPages: 1,
    pageSize: 10,
    current: 0,
    content: [
      {
        name: 'quan',
        phone: '0387824877',
        schedules: {
          mon: ShiftType.MORNING,
          tue: ShiftType.MORNING,
          wed: ShiftType.MORNING,
          thurs: ShiftType.MORNING,
          fri: ShiftType.MORNING,
          sat: ShiftType.MORNING,
          sun: ShiftType.MORNING,
        },
      },
      {
        name: 'Quang',
        phone: '1234512345',
        schedules: {
          mon: ShiftType.NIGHT,
          tue: ShiftType.NIGHT,
          wed: ShiftType.NIGHT,
          thurs: ShiftType.NIGHT,
          fri: ShiftType.NIGHT,
          sat: ShiftType.NIGHT,
          sun: ShiftType.NIGHT,
        },
      },
      {
        name: 'Tuan',
        phone: '1231231231',
        schedules: {
          mon: ShiftType.MORNING,
          tue: ShiftType.MORNING,
          wed: ShiftType.MORNING,
          thurs: ShiftType.MORNING,
          fri: ShiftType.MORNING,
          sat: ShiftType.MORNING,
          sun: ShiftType.MORNING,
        },
      },
      {
        name: 'minh',
        phone: '1234123412',
        schedules: {
          mon: ShiftType.NIGHT,
          tue: ShiftType.NIGHT,
          wed: ShiftType.NIGHT,
          thurs: ShiftType.NIGHT,
          fri: ShiftType.NIGHT,
          sat: ShiftType.NIGHT,
          sun: ShiftType.NIGHT,
        },
      },
    ],
  };
  // onTableQueryParamsChange(params: NzTableQueryParams) {
  //   const { sort } = params;
  //   const currentSort = sort.find((item) => item.value !== null);
  //   this.sStore.pagingRequest.sorter = currentSort?.key ?? '';
  //   this.sStore.pagingRequest.orderDescending = currentSort?.value !== 'ascend';
  //   this.sStore.getServicePaging();
  //   console.log();
  // }
}
