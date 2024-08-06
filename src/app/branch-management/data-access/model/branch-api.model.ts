import { FormControl } from '@angular/forms';

export namespace BranchApi {
  export interface Request {
    branchName: string;
    branchHotline: string;
    branchThumbnail: string;
    branchAddress: string;
    open: string | null;
    close: string | null;
    branchDisplays: branchDisplays;
  }

  export type branchDisplays = { branchDisplayContent: string }[];
  export type serviceIdList = [];
  export type RequestFormGroup = {
    branchThumbnail: FormControl<string>;
    shopOwnerId: FormControl<string>;
    branchName: FormControl<string>;
    branchHotline: FormControl<string>;
    branchAddress: FormControl<string>;
    open: FormControl<string | null>;
    close: FormControl<string | null>;
    branchDisplays: FormControl<branchDisplays>;
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
    branchName: string;
    branchThumbnail: string;
    branchAddress: string | null;
    branchStreet: string;
    branchWard: string;
    branchDistrict: string;
    branchProvince: string;
    open: string;
    close: string;
    branchStatusCode: string;
    branchStatusName: string;
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

export namespace BranchActiveApi {
  export interface Request {
    staffIdList: string[];
    serviceList: serviceList
  }

  export type serviceList = {
    shopServiceId: number;
    price: number;
  }[];

  export type RequestFormGroup = {
    staffIdList: FormControl<string[]>;
    serviceList: FormControl<serviceList>
  };
}
