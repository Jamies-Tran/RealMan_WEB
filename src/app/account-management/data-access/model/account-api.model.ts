import { FormControl } from '@angular/forms';
import { RoleType } from 'src/app/share/data-access/api/enum/role.enum';

export namespace AccountAddApi {
  export interface Request {
    firstName: string;
    lastName: string;
    phone: string;
    staffCode: string;
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
    professional: FormControl<string>;
    thumbnail: FormControl<string>;
    professionalTypeCode: FormControl<string>;
    professionalTypeName: FormControl<string>;
    staffCode: FormControl<string>;
  };
}

export namespace AccountPagingApi {
  export interface Request {
    searches: string;
    role: string;
    current: number;
    pageSize: number;
    sorter: string;
    branchId: string;
    orderDescending: boolean;
  }

  export interface Response {
    accountId: number;
    branchId: number;
    thumbnailUrl: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    dob: string;
    gender: string;
    status: string;
    itimacyLevel: string;
    professional: string;
    average: number;
    branch: {
      branchName: string;
    };
    staff: {
      staffId: number;
      averageRating: number;
      scheduleList: [
        {
          scheduleId: number;
          staffId: number;
          shift: string;
          workingDate: string;
          start: {
            hour: number;
            minute: number;
            second: number;
            nano: number;
          };
          end: {
            hour: number;
            minute: number;
            second: number;
            nano: number;
          };
          scheduleStatus: string;
        }
      ];
      professional: string;
    };
    role: RoleType;
  }
}

export namespace AccountUpdateApi {
  export interface Request {
    firstName: string;
    lastName: string;
    phone: string;
    staffCode: string;
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
    professional: FormControl<string>;
    thumbnail: FormControl<string>;
    professionalTypeCode: FormControl<string>;
    professionalTypeName: FormControl<string>;
    staffCode: FormControl<string>;
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
