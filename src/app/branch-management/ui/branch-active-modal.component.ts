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
import { BranchActiveApi } from '../data-access/model/branch-api.model';
import { BranchStore } from '../data-access/store/branch.store';

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
  ],
  template: `
    <div *rxLet="vm$ as vm">
      <form nz-form [formGroup]="form">
        <div nz-row class="tw-ml-[6%]">
          <nz-form-item nz-col nzSpan="22" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Nhân viên chi nhánh</nz-form-label
            >
            <nz-form-control>
              <nz-select
                class=""
                [nzMaxTagCount]="4"
                nzMode="multiple"
                nzPlaceHolder="Chọn nhân viên"
                [formControl]="form.controls.staffIdList"
              >
                <nz-option
                  *ngFor="let data of vm.acountPaging.content"
                  [nzValue]="data.accountId"
                  [nzLabel]="data.firstName + data.lastName + data.professionalTypeName"
                ></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item nz-col nzSpan="22" class="">
            <nz-form-label class="tw-ml-3" nzRequired
              >Dịch vụ chi nhánh</nz-form-label
            >
            <nz-form-control>
              <nz-select
                class=""
                [nzMaxTagCount]="4"
                nzMode="multiple"
                nzPlaceHolder="Chọn nhân viên"
                [formControl]="form.controls.staffIdList"
              >
                <nz-option
                  nzValue="OPERATOR_STAFF"
                  nzLabel="Cắt tóc - 50000"
                ></nz-option>
                <nz-option
                  nzValue="BRANCHMANAGER"
                  nzLabel="Massage - 30000"
                ></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>
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
export class BranchActiveModalComponent implements OnInit {
  @Input() form!: FormGroup<BranchActiveApi.RequestFormGroup>;
  @Output() clickSubmit = new EventEmitter<void>();
  vm$ = this.bStore.state$;

  constructor(
    private _nzModalRef: NzModalRef,
    private _cdr: ChangeDetectorRef,
    public bStore: BranchStore,
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.clickSubmit.emit();
  }

  onDestroyModal() {
    this._nzModalRef.destroy();
  }

  today = new Date();

  disabledDate = (current: Date): boolean =>
    // Can not select days before today and today
    differenceInCalendarDays(current, this.today) > -6570;

  // onChangeLicense() {
  //     if(this.form.controls.role.value === "BRANCHMANAGER" || this.form.controls.role.value === ""){
  //       this.form.controls.professionalTypeCode.disable()
  //       this.form.controls.professionalTypeCode.setValue("")
  //     }
  //     else {
  //       this.form.controls.professionalTypeCode.enable()
  //     }
  //   }
}
