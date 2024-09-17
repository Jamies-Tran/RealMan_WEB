import { FormControl } from '@angular/forms';
import { RoleType } from 'src/app/share/data-access/api/enum/role.enum';

export namespace AccountAddApi {
  export interface Request {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    professionalTypeCode: string;
    professionalTypeName: string;
    role: string;
    thumbnail: string;
    dob: string;
    gender: string;
  }

  export type RequestFormGroup = {
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    phone: FormControl<string>;
    gender: FormControl<string>;
    dob: FormControl<string>;
    role: FormControl<string>;
    thumbnail: FormControl<string>;
    professionalTypeCode: FormControl<string>;
    professionalTypeName: FormControl<string>;
    address: FormControl<string>;
  };
}

export namespace AccountPagingApi {
  export interface Request {
    search: string;
    role: string;
    current: number;
    pageSize: number;
    sorter: string;
    branchId: string;
    orderDescending: boolean;
  }

  export interface Response {
    accountId: number;
    accountStatusCode: string;
    accountStatusName: string;
    address: string;
    branchId: string;
    dob: string;
    firstName: string;
    genderCode: string;
    genderName: string;
    lastName: string;
    phone: string;
    professionalTypeCode: string;
    professionalTypeName: string;
    roleCode: string;
    roleName: string;
    staffCode: string;
    thumbnail: string;
  }
}

export namespace AccountUpdateApi {
  export interface Request {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    professionalTypeCode: string;
    professionalTypeName: string;
    role: string;
    thumbnail: string;
    dob: string;
    gender: string;
  }

  export type RequestFormGroup = {
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    phone: FormControl<string>;
    gender: FormControl<string>;
    dob: FormControl<string>;
    role: FormControl<string>;
    thumbnail: FormControl<string>;
    professionalTypeCode: FormControl<string>;
    professionalTypeName: FormControl<string>;
    address: FormControl<string>;
  };

  export interface Response {
    value: {
      firstName: string;
      lastName: string;
      phone: string;
      address: string;
      gender: string;
      dob: string;
      branch: number;
      professional: string;
      thumbnailUrl: string;
    } | null;
  }
}

export namespace ScheduleGetApi {
  export interface Response {
    values: {
      scheduleId: number;
      staffId: number;
      shift: string;
      workingDate: string;
      scheduleStatus: string;
    }[];
  }
}
