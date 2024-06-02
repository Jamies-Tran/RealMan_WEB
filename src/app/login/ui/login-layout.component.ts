import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NzImageModule } from 'ng-zorro-antd/image';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    NzImageModule,
    RouterOutlet
  ],
  template: `
    <div class="background">
      <div>
      <div class="tw-pl-[36%] tw-pt-[10%]">
        <div
          class="tw-bg-gray-200 tw-w-[30%] tw-h-[450px] tw-absolute tw-rounded-lg tw-opacity-90"
        >
          <div class="tw-text-center tw-mt-7">
            <img
              nz-image
              nzSrc="/./assets/icon/icon.png"
              alt=""
            />
            <h1>ĐĂNG NHẬP</h1>
          </div>
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .background {
        height: 100vh;
        width: 100vw;
        background-image: linear-gradient(0,rgba(169, 169, 169, 0.5), rgba(169, 169, 169,0.5)), url(/./assets/icon/background.png);
        background-size: cover;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
