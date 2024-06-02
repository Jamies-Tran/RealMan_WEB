import { FormControl } from '@angular/forms';

export namespace SignInApi {
  export interface Request {
    staffCode: string;
    password: string;
  }

  export type RequestFormGroup = {
    staffCode: FormControl<string>;
    password: FormControl<string>;
  };
}
