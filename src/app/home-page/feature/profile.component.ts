import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzUploadModule } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NzGridModule, NzUploadModule, NzImageModule, NzMenuModule, NzInputModule, NzButtonModule],
  template: `
    <div nz-row nzJustify="start">
      <div nz-col nzSpan="6">
        <div class=" tw-text-center">
          <img
            class="tw-rounded-full"
            nz-image
            width="50%"
            height="50%"
            nzSrc="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            alt=""
          />
          <h1>Yasuo</h1>
          <h5>Shop owner</h5>
        </div>
        <ul nz-menu nzTheme="light" nzMode="inline">
          <li nz-menu-item nzSelected>
            <span>Thông tin tài khoản</span>
          </li>
          <li nz-menu-item>
            <span>123</span>
          </li>
          <li nz-menu-item>
            <span class="tw-text-red-500">Đăng xuất</span>
          </li>
        </ul>
      </div>
      <div nz-col nzSpan="18">
        <div nz-row>
          <div nz-col nzSpan="12">
            <h3 class="tw-ml-5">Họ</h3>
            <input nz-input disabled class="tw-w-[80%] tw-ml-5"/>\
            <h3 class="tw-ml-5">Email</h3>
            <input nz-input disabled class="tw-w-[80%] tw-ml-5"/>
            <h3 class="tw-ml-5">Giới tính</h3>
            <input nz-input disabled class="tw-w-[80%] tw-ml-5"/>
          </div>
          <div nz-col nzSpan="12">
            <h3 class="tw-ml-5">Tên</h3>
            <input nz-input disabled class="tw-w-[80%] tw-ml-5"/>\
            <h3 class="tw-ml-5">Số điện thoại</h3>
            <input nz-input disabled class="tw-w-[80%] tw-ml-5"/>
            <h3 class="tw-ml-5">Ngày sinh</h3>
            <input nz-input disabled class="tw-w-[80%] tw-ml-5"/>
          </div>
        </div>
        <h3 class="tw-ml-5">Địa Chỉ</h3>
        <input nz-input disabled class="tw-w-[90%] tw-ml-5"/> \<br>
        <div class="tw-mt-7 tw-text-center">
        <button nz-button nzType="primary" nzDanger>Hủy</button>
        <button nz-button class="tw-ml-3" nzType="primary">Cập Nhật</button>
      </div>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {}
