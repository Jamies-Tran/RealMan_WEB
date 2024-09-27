import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { RxLet } from '@rx-angular/template/let';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { differenceInCalendarDays } from 'date-fns';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSelectChangeDirective } from 'src/app/share/ui/directive/nz-select-change.directive';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { provideComponentStore } from '@ngrx/component-store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ScheduleStore } from '../data-access/store/schedule.store';
import { PlanDailyUpdateModalApi } from '../data-access/model/plan-daily-api.model';

@Component({
  selector: 'app-hangtag-add-or-update-modal',
  standalone: true,
  imports: [
    NzButtonModule,
    NzFormModule,
    ReactiveFormsModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    CommonModule,
    NzImageModule,
    NgOptimizedImage,
    NzCheckboxModule,
    RxLet,
    NzDatePickerModule,
    NzDividerModule,
    NzModalModule,
    NzSelectChangeDirective,
    NzAutocompleteModule,
  ],
  providers: [provideComponentStore(ScheduleStore), NzMessageService],
  template: `
    <div *rxLet="vm$ as vm">
      <form nz-form [formGroup]="form">
          <nz-form-item nz-col nzSpan="24" class="">
            <nz-form-label class="tw-ml-3"
              >Họ và tên đệm</nz-form-label
            >
            <nz-form-control>
              <input
                class="tw-rounded-md tw-w-[100%]"
                [formControl]="form.controls.staff"
                nz-input
                placeholder="Nhập tên tài khoản"
              />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item nz-col nzSpan="24" class="">
            <nz-form-label class="tw-ml-3" nzRequired>Ca làm việc</nz-form-label>
            <nz-form-control>
              <nz-select
                class="tw-w-[100%]"
                [formControl]="form.controls.shiftCode"
              >
                <nz-option
                  nzValue="MORNING_SHIFT"
                  nzLabel="Ca sáng"
                ></nz-option>
                <nz-option nzValue="NIGHT_SHIFT" nzLabel="Ca tối"></nz-option>
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
        Ok
      </button>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDailyUpdateModalComponent implements OnInit {
  @Input() form!: FormGroup<
    | PlanDailyUpdateModalApi.RequestFormGroup
    | PlanDailyUpdateModalApi.RequestFormGroup
  >;
  @Output() clickSubmit = new EventEmitter<void>();
  vm$ = this.sStore.state$;

  constructor(
    private _nzModalRef: NzModalRef,
    private _cdr: ChangeDetectorRef,
    public sStore: ScheduleStore
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.clickSubmit.emit();
  }

  onDestroyModal() {
    this._nzModalRef.destroy();
  }
}
