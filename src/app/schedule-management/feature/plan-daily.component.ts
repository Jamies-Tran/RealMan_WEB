import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { provideComponentStore } from '@ngrx/component-store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RxLet } from '@rx-angular/template/let';
import { ScheduleStore } from '../data-access/store/schedule.store';
import { MapShiftTypeNamePipe } from '../until/shift.pipe';
import { NzTableDefaultSettingDirective } from 'src/app/share/ui/directive/nz-table-default-setting.directive';
import { PlanDailyStore } from '../data-access/store/plan-daily.store';

@Component({
  selector: 'app-plan-daily',
  standalone: true,
  providers: [
    NzModalService,
    provideComponentStore(PlanDailyStore),
    NzMessageService,
  ],
  template: `
    <nz-breadcrumb>
      <nz-breadcrumb-item>Quản lý lịch làm</nz-breadcrumb-item>
      <nz-breadcrumb-item>Lịch hằng ngày</nz-breadcrumb-item>
    </nz-breadcrumb>
    <nz-divider></nz-divider>
    <div nz-row>
      <!-- <div nz-row class="tw-mt-4 tw-flex"> -->
      <!-- </div> -->
      <div nz-col nzSpan="24" class="tw-mt-5">
        <ng-container *rxLet="vm$ as vm">
          <nz-table
          appNzTableDefaultSetting
            class="tw-mr-4"
            [nzData]="[]"
            [nzTotal]="${7}"
            [(nzPageIndex)]="pdStore.pagingRequest.current"
            [(nzPageSize)]="pdStore.pagingRequest.pageSize"
            (nzQueryParams)="onTableQueryParamsChange($event)"
            [nzShowTotal]="totalText"
            [nzLoading]="!!vm.loadingCount"
            nzShowSizeChanger
          >
            <thead>
              <ng-template #totalText let-total let-range="range">
                <span
                  >{{ range[0] }} - {{ range[1] }} of {{ total }}
                  {{ 'Branches' }}</span
                >
              </ng-template>
              <tr>
                <th>STT</th>
                <th>Tên Nhân Viên</th>
                <th>Trạng Thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>

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
    NzTableDefaultSettingDirective
  ],
})
export class PlanDailyComponent implements OnInit {
  constructor(
    private _nzModalSvc: NzModalService,
    private _fb: NonNullableFormBuilder,
    public pdStore: PlanDailyStore
  ) {}

  vm$ = this.pdStore.state$;
  today = new Date();

  ngOnInit(): void {
  }

  onTableQueryParamsChange(params: NzTableQueryParams) {
    const { sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    this.pdStore.pagingRequest.sorter = currentSort?.key ?? '';
    this.pdStore.pagingRequest.orderDescending = currentSort?.value !== 'ascend';
    this.pdStore.getPlanDailyPaging();
  }

}
