import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, NonNullableFormBuilder } from '@angular/forms';
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
import { ServiceStore } from '../data-access/store/service.store';
import { provideComponentStore } from '@ngrx/component-store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RxLet } from '@rx-angular/template/let';
import { NzTableDefaultSettingDirective } from 'src/app/share/ui/directive/nz-table-default-setting.directive';
import { NzSelectChangeDirective } from 'src/app/share/ui/directive/nz-select-change.directive';

@Component({
  selector: 'app-service-list',
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
    RouterLink,
    NzTableDefaultSettingDirective,
    RxLet,
    FormsModule,
    NzSelectModule,
    NzSelectChangeDirective,
  ],
  providers: [
    NzModalService,
    provideComponentStore(ServiceStore),
    NzMessageService,
  ],
  template: `
    <nz-breadcrumb>
      <nz-breadcrumb-item>Quản lý dịch vụ</nz-breadcrumb-item>
      <nz-breadcrumb-item>Danh sách dịch vụ</nz-breadcrumb-item>
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
      <div class="tw-text-center tw-mt-4 tw-mr-3">
        <button
          nz-button
          [routerLink]="['/service-management', 'create-service']"
          nzType="primary"
        >
          Tạo dịch vụ
        </button>
      </div>
      <!-- </div> -->
      <div nz-col nzSpan="24" class="tw-mt-5">
        <ng-container *rxLet="vm$ as vm">
          <nz-table
            appNzTableDefaultSetting
            class="tw-mr-4"
            [nzData]="vm.servicePaging.content"
            [nzTotal]="vm.servicePaging.totalElements"
            [(nzPageIndex)]="sStore.pagingRequest.current"
            [(nzPageSize)]="sStore.pagingRequest.pageSize"
            (nzQueryParams)="onTableQueryParamsChange($event)"
            [nzShowTotal]="totalText"
            [nzLoading]="!!vm.loadingCount"
            nzShowSizeChanger
          >
            <thead>
              <ng-template #totalText let-total let-range="range">
                <span
                  >{{ range[0] }} - {{ range[1] }} of {{ total }}
                  {{ 'Services' }}</span
                >
              </ng-template>
              <tr>
                <th>STT</th>
                <th>Tên dịch vụ</th>
                <th>Chi nhánh sử dụng</th>
                <th>Mô tả</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let data of vm.servicePaging.content; index as i">
                <td>{{ i + 1 }}</td>
                <td>{{ data.name }}</td>
                <td>{{ data.branchName }}</td>
                <td>{{ data.description }}</td>
                <td class="tw-text-center">
                  <button
                    nz-button
                    nzType="primary"
                    [routerLink]="['/service-management', data.serviceId]"
                    nzSize="small"
                  >
                    Edit
                  </button>
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
})
export class ServiceListComponent {
  constructor(
    private _nzModalSvc: NzModalService,
    private _fb: NonNullableFormBuilder,
    public sStore: ServiceStore
  ) {}

  vm$ = this.sStore.state$;

  onTableQueryParamsChange(params: NzTableQueryParams) {
    const { sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    this.sStore.pagingRequest.sorter = currentSort?.key ?? '';
    this.sStore.pagingRequest.orderDescending = currentSort?.value !== 'ascend';
    this.sStore.getServicePaging();
  }

  // onAddCategory() {
  //   const modalRef = this._nzModalSvc.create({
  //     nzTitle: 'Tạo loại dịch vụ',
  //     nzContent: CategoryAddComponent,
  //   });
  //   const form = this._fb.group<CategoryAddApi.RequestFormGroup>({
  //     description: this._fb.control('', trimRequired),
  //     title: this._fb.control('', trimRequired),
  //   });
  //   modalRef.componentInstance!.form = form;
  //   modalRef
  //     .componentInstance!.clickSubmit.pipe(
  //       tap(() => {
  //         this.sStore.addCategory({
  //           model: CategoryAddApi.mapModel(form),
  //           modalRef: modalRef,
  //         });
  //       })
  //     )
  //     .subscribe();
  // }
}
