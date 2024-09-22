import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzFormModule } from 'ng-zorro-antd/form';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { trimRequired } from 'src/app/share/form-validator/trim-required.validator';
import { SignInApi } from '../data-access/model/sign-in-api.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SignInApiService } from '../data-access/api/sign-in.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  providers: [NzMessageService],
  imports: [
    CommonModule,
    NzImageModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    RouterLink,
  ],
  template: `
    <form nz-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
      <nz-form-item>
        <nz-form-control [nzErrorTip]="phoneErrorTpl" class="tw-text-center">
          <input
            class="tw-w-[85%] tw-mt-7 tw-rounded-full"
            [formControl]="validateForm.controls.staffCode"
            nz-input
            placeholder="Nhấp số điện thoại của bạn"
          />
        </nz-form-control>
        <ng-template #phoneErrorTpl let-control>
          <ng-container *ngIf="control.hasError('trimRequired')">
            Vui Lòng Nhập Sđt
          </ng-container>
          <ng-container
            *ngIf="
              control.hasError('minlength') && !control.hasError('trimRequired')
            "
          >
            Sđt gồm 10 số
          </ng-container>
          <ng-container
            *ngIf="
              control.hasError('maxlength') && !control.hasError('trimRequired')
            "
          >
            Sđt gồm 10 số
          </ng-container>
        </ng-template>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control  class="tw-text-center">
          <input
            class="tw-w-[85%] tw-rounded-full"
            [formControl]="validateForm.controls.password"
            nz-input
            [type]="'password'"
            placeholder="Nhấp số mật khẩu"
          />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control class="tw-text-center">
          <button
            class="tw-w-[85%] tw-rounded-full tw-bg-gradient-to-r tw-from-gray-600 tw-to-gray-300"
            nz-button
            nzType="primary"
            [disabled]="!validateForm.valid"
          >
            Đăng Nhập
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent implements OnInit {
  constructor(
    private _fb: NonNullableFormBuilder,
    private _siSvc: SignInApiService,
    private _router: Router,
    private _nzMessageService: NzMessageService,
  ) {}
  validateForm!: FormGroup<SignInApi.RequestFormGroup>;

  submitForm(): void {
    this._siSvc
      .login(this.validateForm.getRawValue())
      .subscribe(
        (data) => {
          this._router.navigate(["/homepage"])
          localStorage.setItem('phone', this.validateForm.controls.staffCode.getRawValue())
          localStorage.setItem('token$', data['value']['accessToken'])
        },
        (error) => {this._nzMessageService.error(error);
        }
      );
  }

  ngOnInit(): void {
    this.validateForm = this._fb.group<SignInApi.RequestFormGroup>({
      staffCode: this._fb.control('', [
        trimRequired
      ]),
      password: this._fb.control('', [trimRequired, Validators.minLength(3)])
    });
  }
}
