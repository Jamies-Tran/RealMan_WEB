import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { CategoryAddApi } from '../data-access/model/service-api.model';

@Component({
  selector: 'app-add-category-modal',
  standalone: true,
  imports: [
    CommonModule,
    NzGridModule,
    NzInputModule,
    NzButtonModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzModalModule
  ],
  providers: [NzMessageService],
  template: `
    <div>
      <form nz-form [formGroup]="form">
        <!-- Tên chi nhánh -->
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="22" class="tw-ml-3" nzRequired>Tên loại</nz-form-label>
          <nz-form-control nzErrorTip="Vui lòng nhập tên loại dịch vụ">
            <input
              class="tw-rounded-md tw-w-[70%]"
              nz-input
              [formControl]="form.controls.title"
              placeholder="Nhập tên loại dịch vụ"
            />
          </nz-form-control>
        </nz-form-item>

        <!-- địa chỉ -->
        <nz-form-item>
          <nz-form-label [nzSm]="6" [nzXs]="22" class="tw-ml-3" nzRequired>Mô tả</nz-form-label>
          <nz-form-control nzErrorTip="Vui lòng nhập mô tả">
            <input
              class="tw-rounded-md tw-w-[70%]"
              nz-input
              [formControl]="form.controls.description"
              placeholder="Nhập mô tả"
            />
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <button nz-button nzType="default" (click)="onDestroyModal()">
        Trở lại
      </button>
      <button nz-button nzType="primary" (click)="onSubmit()" [disabled]="form.invalid">
        Tạo
      </button>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryAddComponent {
  @Input() form!: FormGroup<CategoryAddApi.RequestFormGroup>;
  @Output() clickSubmit = new EventEmitter<void>();

  constructor(private _nzModalRef: NzModalRef) {}

  onSubmit() {
    this.clickSubmit.emit();
  }

  onDestroyModal() {
    this._nzModalRef.destroy();
  }
}
