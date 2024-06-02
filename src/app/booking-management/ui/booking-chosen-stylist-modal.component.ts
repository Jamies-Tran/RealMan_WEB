import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { BookingChosenStylistApi } from '../data-access/model/booking-api.model';
import { BookingStore } from '../data-access/store/booking.store';
import { RxLet } from '@rx-angular/template/let';
import { provideComponentStore } from '@ngrx/component-store';

@Component({
  selector: 'app-booking-chosen-stylist-modal',
  standalone: true,
  imports: [
    CommonModule,
    NzGridModule,
    NzButtonModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzModalModule,
    NzSelectModule,
    RxLet,
  ],
  providers: [NzMessageService, provideComponentStore(BookingStore)],
  template: `
    <div *rxLet="vm$ as vm">
      <form nz-form [formGroup]="form">
        <!-- Tên chi nhánh -->
        <nz-form-item class="tw-flex">
          <nz-form-label [nzSm]="6" [nzXs]="24" class="tw-ml-3" nzRequired
            >Thợ cắt tóc</nz-form-label
          >
          <nz-form-control
            [nzSm]="14"
            [nzXs]="24"
            nzErrorTip="Vui lòng nhập tên loại dịch vụ"
          >
            <nz-select
              nzPlaceHolder="Chọn thợ cắt tóc"
              [formControl]="form.controls.staffId"
            >
              <nz-option
                *ngFor="let option of vm.staffFreeData.content"
                [nzValue]="option.staff.staffId"
                [nzLabel]="option.firstName + option.lastName"
              >
              </nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
    <div *nzModalFooter>
      <button nz-button nzType="default" (click)="onDestroyModal()">
        Trở lại
      </button>
      <button
        nz-button
        nzType="primary"
        (click)="onSubmit()"
        [disabled]="form.invalid"
      >
        Chọn
      </button>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingChosenStylistModalComponent {
  @Input() form!: FormGroup<BookingChosenStylistApi.RequestFormGroup>;
  @Output() clickSubmit = new EventEmitter<void>();

  constructor(private _nzModalRef: NzModalRef, public bstore: BookingStore) {}
  vm$ = this.bstore.state$;

  onSubmit() {
    this.clickSubmit.emit();
  }

  onDestroyModal() {
    this._nzModalRef.destroy();
  }
}
