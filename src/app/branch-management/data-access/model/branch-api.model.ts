import { FormControl } from '@angular/forms';

export namespace BranchApi {
  export interface Request {
    thumbnailUrl: string;
    shopOwnerId: string;
    branchName: string;
    phone: string;
    address: string;
    status: string;
    numberStaffs: number;
    open: string | null;
    close: string | null;
    branchDisplayList: branchDisplayList;
    branchServiceList: branchServiceList;
  }

  export type branchDisplayList = {
    url: string;
    branchDisplayBase64Url: string;
  }[];

  export type branchServiceList = {
    serviceId: string;
    price: string;
  }[];

  export type displayUrlList = [];
  export type serviceIdList = [];
  export type RequestFormGroup = {
    thumbnailUrl: FormControl<string>;
    shopOwnerId: FormControl<string>;
    branchName: FormControl<string>;
    phone: FormControl<string>;
    address: FormControl<string>;
    status: FormControl<string>;
    numberStaffs: FormControl<number>;
    open: FormControl<string | null>;
    close: FormControl<string | null>;
    branchDisplayList: FormControl<branchDisplayList>;
    branchServiceList: FormControl<branchServiceList>;
    serviceArray: FormControl<string[]>;
  };
}

export namespace BranchPagingApi {
  export interface Request {
    search: string;
    current: number;
    sorter: string;
    pageSize: number;
    orderDescending: boolean;
  }

  export interface Response {
    branchId: number;
    shopOwnerId: number;
    branchName: string;
    phone: string;
    address: string;
    status: string;
    numberStaffs: 0;
    open: string;
    close: string;
    displayUrlList: string[];
    serviceIdList: string[];
  }
}

export namespace BranchUpdateApi {
  export interface Request {
    thumbnailUrl: string;
    shopOwnerId: string;
    branchName: string;
    phone: string;
    address: string;
    status: string;
    numberStaffs: number;
    open: string | null;
    close: string | null;
    branchDisplayList: branchDisplayList;
    branchServiceList: branchServiceList;
  }

  export type RequestFormGroup = {
    branchId: FormControl<number>;
    shopOwnerId: FormControl<string>;
    branchName: FormControl<string>;
    thumbnailUrl: FormControl<string>;
    phone: FormControl<string>;
    address: FormControl<string>;
    status: FormControl<string>;
    numberStaffs: FormControl<number>;
    open: FormControl<string | null>;
    close: FormControl<string | null>;
    branchDisplayList: FormControl<branchDisplayList>;
    branchServiceList: FormControl<branchServiceList>;
    serviceArray: FormControl<string[]>;
  };

  export type branchDisplayList = {
    url: string;
    branchDisplayBase64Url: string;
  }[];

  export type branchServiceList = {
    serviceId: string;
    price: string;
  }[];

  export interface BranchDataResponse {
    value: {
      branchId: number;
      shopOwnerId: string;
      branchName: string;
      phone: string;
      address: string;
      status: string;
      numberStaffs: number;
      open: string | null;
      close: string | null;
      branchDisplayList: branchDisplayList;
      branchServiceList: branchServiceList;
    };
  }
}
