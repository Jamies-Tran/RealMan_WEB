import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { AccountStore } from '../data-access/store/account.store';
import { provideComponentStore } from '@ngrx/component-store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableDefaultSettingDirective } from 'src/app/share/ui/directive/nz-table-default-setting.directive';
import { RxLet } from '@rx-angular/template/let';
import { MapRoleTypeNamePipe } from '../until/role.pipe';
import { FormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import {
  RoleType,
  roleTypeNameMapping,
} from 'src/app/share/data-access/api/enum/role.enum';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSelectChangeDirective } from 'src/app/share/ui/directive/nz-select-change.directive';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { AccountAddModalComponent } from '../ui/account-add-modal.component';
import { AccountAddApi } from '../data-access/model/account-api.model';
import { trimRequired } from 'src/app/share/form-validator/trim-required.validator';
import { tap } from 'rxjs';

@Component({
  selector: 'app-account-list',
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
    MapRoleTypeNamePipe,
    FormsModule,
    NzSelectModule,
    NzSelectChangeDirective,
  ],
  providers: [provideComponentStore(AccountStore), NzMessageService, NzModalService],
  template: `
    <nz-breadcrumb>
      <nz-breadcrumb-item>Quản lý tài khoản</nz-breadcrumb-item>
      <nz-breadcrumb-item>Danh sách tài khoản</nz-breadcrumb-item>
    </nz-breadcrumb>
    <nz-divider></nz-divider>
    <div nz-row>
      <div nz-col nzSpan="22" class="">
        <nz-input-group nzSearch [nzAddOnAfter]="suffixIconButton">
          <input
            type="text"
            nz-input
            placeholder="Tìm theo tên"
            [(ngModel)]="aStore.pagingRequest.search"
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
          (click)="onAddAccount()"
        >
          Tạo tài khoản
        </button>
      </div>
      <nz-select
        *ngIf="role$ === roleType.SHOP_OWNER"
        class="tw-w-[150px] tw-mt-5"
        nzPlaceHolder="Chọn chức vụ"
        (nzSelectChange)="onChangeLicense()"
        [(ngModel)]="aStore.pagingRequest.role"
      >
        <nz-option
          *ngFor="let option of roleTypeNameMapping"
          [nzValue]="option.value"
          [nzLabel]="option.label"
        >
        </nz-option>
      </nz-select>
      <div nz-col nzSpan="24" class="tw-mt-5">
        <ng-container *rxLet="vm$ as vm">
          <nz-table
            appNzTableDefaultSetting
            class="tw-mr-4"
            [nzData]="vm.acountPaging.content"
            [nzTotal]="vm.acountPaging.totalElements"
            [(nzPageIndex)]="aStore.pagingRequest.current"
            [(nzPageSize)]="aStore.pagingRequest.pageSize"
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
                <th>Họ và tên</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Giới tính</th>
                <!-- <th>Ngày làm</th>
                <th>Ca làm</th> -->
                <th>Trạng thái</th>
                <th>Chức vụ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let data of vm.acountPaging.content; index as i">
                <td>{{ i + 1 }}</td>
                <td>{{ data.firstName + ' ' + data.lastName }}</td>
                <td>{{ data.address }}</td>
                <td>{{ data.phone }}</td>
                <td>{{ data.genderCode }}</td>
                <!-- <ng-container *ngFor="let schedule of data.staff.scheduleList">
                  <td>
                    {{ schedule.workingDate ? schedule.workingDate : '' }}
                  </td>

                  <td>{{ schedule.shift ? schedule.shift : '' }}</td>
                </ng-container> -->

                <td>{{ data.accountStatusName }}</td>
                <td>{{ data.roleName }}</td>
                <td class="tw-text-center">
                  <button
                    nz-button
                    nzType="primary"
                    nzSize="small"
                  >
                    Chi Tiết
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
export class AccountListComponent {
  constructor(public aStore: AccountStore, private _nzModalSvc: NzModalService, private _fb: NonNullableFormBuilder) {}

  vm$ = this.aStore.state$;
  role$ = localStorage.getItem('role$');
  roleType = RoleType;

  onTableQueryParamsChange(params: NzTableQueryParams) {
    const { sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    this.aStore.pagingRequest.sorter = currentSort?.key ?? '';
    this.aStore.pagingRequest.orderDescending = currentSort?.value !== 'ascend';
    this.aStore.getAccountPaging();
  }

  onSearch() {
    this.aStore.pagingRequest.search =
      this.aStore.pagingRequest.search.replace(/[\t\n\r]/, '');
    if (this.aStore.pagingRequest.current !== 1) {
      this.aStore.pagingRequest.current = 1;
    } else {
      this.aStore.getAccountPaging();
    }
  }

  onChangeLicense() {
    if (this.aStore.pagingRequest.current !== 1) {
      this.aStore.pagingRequest.current = 1;
    } else {
      this.aStore.getAccountPaging();
    }
  }

  onAddAccount() {
    const modalRef = this._nzModalSvc.create({
      nzTitle: 'Tạo Tài Khoản',
      nzWidth: '1024px',
      nzContent: AccountAddModalComponent,
    });

    const form = this._fb.group<AccountAddApi.RequestFormGroup>({
      firstName: this._fb.control('', trimRequired),
    lastName: this._fb.control('', [trimRequired]),
    dob: this._fb.control('', Validators.required),
    gender: this._fb.control('', Validators.required),
    phone: this._fb.control('', [
      trimRequired,
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    role: this._fb.control(''),
    thumbnail: this._fb.control('123'),
    professionalTypeCode: this._fb.control({value: '', disabled: true}),
    professionalTypeName: this._fb.control(''),
    staffCode: this._fb.control(''),
    });


    modalRef.componentInstance!.form = form;
    modalRef
      .componentInstance!.clickSubmit.pipe(
        tap(() => {
          this.aStore.addAccount({
            model: form.getRawValue(),
            modalRef,
          });
        })
      )
      .subscribe();
  }

  readonly roleTypeNameMapping = roleTypeNameMapping;
}
