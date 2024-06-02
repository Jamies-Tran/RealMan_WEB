import { AbstractControl, ValidationErrors } from '@angular/forms';

export const trimRequired = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  return value == null || (typeof value === 'string' && value.trim().length === 0) ? { trimRequired: true } : null;
};
