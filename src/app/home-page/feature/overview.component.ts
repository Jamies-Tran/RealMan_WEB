import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, NzGridModule, NzUploadModule, NzImageModule, NzMenuModule, NzInputModule, NzButtonModule, NzBreadCrumbModule, NzDividerModule],
  template: `
    <nz-breadcrumb>
      <nz-breadcrumb-item>Trang chủ</nz-breadcrumb-item>
      <nz-breadcrumb-item>Tổng quan</nz-breadcrumb-item>
    </nz-breadcrumb>
    <nz-divider></nz-divider>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewComponent {}
