import { AfterViewInit, Directive, EventEmitter, Output } from '@angular/core';
import { NzSelectComponent } from 'ng-zorro-antd/select';
import { NgControl } from '@angular/forms';
import { filter, tap } from 'rxjs';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Directive({
  /* eslint-disable @angular-eslint/directive-selector */
  selector: 'nz-select[nzSelectChange]',
  standalone: true,
})
export class NzSelectChangeDirective implements AfterViewInit {
  // only trigger when user interact with nz-select. choose value from dropdown, clear selection
  // not trigger base on value change
  @Output() nzSelectChange = new EventEmitter<NzSafeAny>();

  previousValue: unknown;
  constructor(private _nzSelect: NzSelectComponent, private _ngControl: NgControl) {}

  ngAfterViewInit() {
    this.onUserChooseDropdown();
    this.onControlClearValue();
  }

  onUserChooseDropdown() {
    this._nzSelect.nzOpenChange
      .pipe(
        tap(isOpen => {
          if (isOpen) {
            this.previousValue = this._ngControl.value;
          } else {
            if (this.previousValue !== this._ngControl.value) {
              this.nzSelectChange.emit(this._ngControl.value);
            }
          }
        })
      )
      .subscribe();
  }

  onControlClearValue() {
    this._ngControl
      .valueChanges!.pipe(
        filter(value => !value),
        tap(() => this.nzSelectChange.emit())
      )
      .subscribe();
  }
}
