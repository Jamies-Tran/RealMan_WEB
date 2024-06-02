import { Directive } from '@angular/core';
import { NzTableComponent } from 'ng-zorro-antd/table';
import { pagingSizeOptionsDefault } from '../../data-access/const/paging-size-options-default.const';

@Directive({
  selector: '[appNzTableDefaultSetting]',
  standalone: true,
})
export class NzTableDefaultSettingDirective {
  constructor(private _nzTable: NzTableComponent<unknown>) {
    _nzTable.nzPageSizeOptions = pagingSizeOptionsDefault;
    _nzTable.nzFrontPagination = false;
    _nzTable.nzPaginationPosition = 'bottom';
    _nzTable.nzOuterBordered = true;
  }
}
