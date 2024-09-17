import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTableDefaultSettingDirective } from 'src/app/share/ui/directive/nz-table-default-setting.directive';
import { FormsModule, NonNullableFormBuilder } from '@angular/forms';
import { BranchStore } from '../data-access/store/branch.store';
import { provideComponentStore } from '@ngrx/component-store';
import { RxLet } from '@rx-angular/template/let';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BranchActiveApi } from '../data-access/model/branch-api.model';
import { tap } from 'rxjs';
import { BranchActiveModalComponent } from '../ui/branch-active-modal.component';

@Component({
  selector: 'app-branch-list',
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
    NzSelectModule,
    FormsModule,
    NzTableDefaultSettingDirective,
    RxLet,
  ],
  providers: [provideComponentStore(BranchStore), NzMessageService, NzModalService],
  template: `
    <nz-breadcrumb>
      <nz-breadcrumb-item>Quản lý chi nhánh</nz-breadcrumb-item>
      <nz-breadcrumb-item>Danh sách chi nhánh</nz-breadcrumb-item>
    </nz-breadcrumb>
    <nz-divider></nz-divider>
    <div nz-row>
      <div nz-col nzSpan="22" class="">
        <nz-input-group nzSearch [nzAddOnAfter]="suffixIconButton">
          <input
            type="text"
            nz-input
            placeholder="Tìm theo tên"
            [(ngModel)]="bStore.pagingRequest.search"
            (keyup.enter)="onSearch()"
          />
        </nz-input-group>
        <ng-template #suffixIconButton>
          <button nz-button nzType="primary" nzSearch (click)="onSearch()">
            <span nz-icon nzType="search"></span>
          </button>
        </ng-template>
      </div>
      <div nz-col nzSpan="2" class="tw-text-center">
        <button
          nz-button
          nzType="primary"
          [routerLink]="['/branch-management', 'create-branch']"
        >
          Tạo chi nhánh
        </button>
      </div>
      <div nz-col nzSpan="24" class="tw-mt-5">
        <ng-container *rxLet="vm$ as vm">
          <nz-table
            appNzTableDefaultSetting
            class="tw-mr-4"
            [nzData]="vm.branchPaging.content"
            [nzTotal]="vm.branchPaging.totalElement"
            [(nzPageIndex)]="bStore.pagingRequest.current"
            [(nzPageSize)]="bStore.pagingRequest.pageSize"
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
                <th
                  nzColumnKey="stt"
                  [nzSortFn]="true"
                  [nzSortDirections]="['ascend', 'descend']"
                  [nzSortOrder]="'ascend'"
                >
                  STT
                </th>
                <th>Tên chi nhánh</th>
                <th>Địa chỉ</th>
                <th>Hotline</th>
                <th>Trạng thái</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let data of vm.branchPaging.content; index as i">
                <td>{{ i + 1 }}</td>
                <td>{{ data.branchName }}</td>
                <td>
                  {{
                    data.branchStreet +
                      ', ' +
                      data.branchWard +
                      ', ' +
                      data.branchDistrict +
                      ', ' +
                      data.branchProvince
                  }}
                </td>
                <td></td>
                <td>{{ data.branchStatusName }}</td>
                <td class="tw-text-center">
                  <button
                    *ngIf="data.branchStatusCode === 'INACTIVE'"
                    nz-button
                    nzType="primary"
                    nzDanger
                    nzSize="small"
                    (click)="onActiveBranch(data.branchId)"
                  >
                    Kích hoạt
                  </button>
                  <button
                    class="tw-ml-3"
                    nz-button
                    nzType="primary"
                    nzSize="small"
                  >
                    Chỉnh sửa
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
export class BranchListComponent {
  constructor(
    public bStore: BranchStore,
    private _nzModalSvc: NzModalService,
    private _fb: NonNullableFormBuilder
  ) {}
  vm$ = this.bStore.state$;

  onTableQueryParamsChange(params: NzTableQueryParams) {
    const { sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    this.bStore.pagingRequest.sorter = currentSort?.key ?? '';
    this.bStore.pagingRequest.orderDescending = currentSort?.value !== 'ascend';
    this.bStore.getBranchPaging();
    console.log();
  }

  onSearch() {
    this.bStore.pagingRequest.search = this.bStore.pagingRequest.search.replace(
      /[\t\n\r]/,
      ''
    );
    if (this.bStore.pagingRequest.current !== 1) {
      this.bStore.pagingRequest.current = 1;
    } else {
      this.bStore.getBranchPaging();
    }
  }

  onActiveBranch(branchId: number) {
    const modalRef = this._nzModalSvc.create({
      nzTitle: 'Kích hoạt chi nhánh',
      nzWidth: '720px',
      nzContent: BranchActiveModalComponent,
    });

    const form = this._fb.group<BranchActiveApi.RequestFormGroup>({
      staffIdList: this._fb.control([]),
      serviceList: this._fb.control([]),
      service: this._fb.control([])
    });

    this.bStore.getAccountPaging();
    this.bStore.getServicePaging()

    modalRef.componentInstance!.form = form;


    modalRef
      .componentInstance!.clickSubmit.pipe(
        tap(() => {
          this.bStore.activeBranch({
            id: branchId,
            model: form.getRawValue(),
            modalRef,
          });
          console.log(form.getRawValue());
        })
      )
      .subscribe();
  }
}
