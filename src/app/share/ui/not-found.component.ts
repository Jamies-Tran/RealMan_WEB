import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'nz-demo-result-fot',
  imports: [NzResultModule, NzButtonModule],
  standalone: true,
  template: `
    <nz-result nzStatus="403" nzTitle="403" nzSubTitle="Sorry, you are not authorized to access this page.">
    </nz-result>
  `
})
export class NotFoundComponent {
}
