import { FormControl, FormGroup } from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';

export namespace CategoryAddApi {
  export interface Request {
    description: string;
    title: string;
  }

  export type RequestFormGroup = {
    description: FormControl<string>;
    title: FormControl<string>;
  };

  export function mapModel(frm: FormGroup<RequestFormGroup>): Request {
    const formValue = frm.getRawValue();
    return {
      description: formValue.description,
      title: formValue.title,
    };
  }
}

export namespace CategoryDataGet {
  export interface Response {
    values: {
      categoryId: number;
      name: string | null;
      categoryType: string;
      serviceList: string | null;
    }[];
  }
}

export namespace ServiceAddApi {
  export interface Request {
    name: string;
    description: string;
    categoryId: number;
    serviceDisplayList: serviceDisplayList;
    price: number;
    durationValue: number;
    durationTime: string;
  }

  export type serviceDisplayList = {
    serviceDisplayUrl: string;
    branchDisplayBase64Url: string;
  }[];

  export type RequestFormGroup = {
    description: FormControl<string>;
    name: FormControl<string>;
    categoryId: FormControl<number | null>;
    serviceDisplayList: FormControl<serviceDisplayList>;
    price: FormControl<number>;
    durationValue: FormControl<number>;
    durationTime: FormControl<string>;
    fileList: FormControl<NzUploadFile[]>;
  };

  export function mapModel(frm: FormGroup<RequestFormGroup>): Request {
    const formValue = frm.getRawValue();
    return {
      description: formValue.description,
      categoryId: formValue.categoryId!,
      durationTime: formValue.durationTime,
      name: formValue.name,
      serviceDisplayList: formValue.serviceDisplayList,
      durationValue: formValue.durationValue,
      price: formValue.price,
    };
  }
}

export namespace ServicePagingApi {
  export interface Request {
    search: string;
    current: number;
    sorter: string;
    pageSize: number;
    orderDescending: boolean;
  }

  export interface Response {
    description: string;
    name: string;
    branchServiceList: branchServiceList;
    serviceId: number;
    branchName: string
  }

  export type branchServiceList = {
    serviceId: number;
    branchId: number;
    serviceName: string;
    branchName: string;
    thumbnailUrl: string;
    price: number;
  }[];
}

export namespace ServiceDataApi {
  export interface Response {
    values: {
      name: string;
      serviceId: number;
      price: number;
      durationValue: number;
      durationText: string;
    }[];
  }
}

export namespace ServiceUpdateApi {
  export interface Request {
    name: string;
    description: string;
    categoryId: number;
    serviceDisplayList: serviceDisplayList;
    price: number;
    durationValue: number;
    durationTime: string;
  }

  export type serviceDisplayList = {
    serviceDisplayUrl: string;
    branchDisplayBase64Url: string;
  }[];

  export type RequestFormGroup = {
    description: FormControl<string>;
    name: FormControl<string>;
    categoryId: FormControl<number | null>;
    serviceDisplayList: FormControl<serviceDisplayList>;
    price: FormControl<number>;
    durationValue: FormControl<number>;
    durationTime: FormControl<string>;
    fileList: FormControl<NzUploadFile[]>;
  };

  export function mapModel(frm: FormGroup<RequestFormGroup>): Request {
    const formValue = frm.getRawValue();
    return {
      description: formValue.description,
      categoryId: formValue.categoryId!,
      durationTime: formValue.durationTime,
      name: formValue.name,
      serviceDisplayList: formValue.serviceDisplayList,
      durationValue: formValue.durationValue,
      price: formValue.price,
    };
  }
}

export namespace ServiceGetApi {
  export interface Response {
    value: {
      name: string;
      description: string;
      price: number;
      serviceId: string;
      categoryId: number;
      categoryName: string;
      durationValue: number;
      durationTime: string;
      durationText: string;
      serviceDisplayList: serviceDisplayList;
    };
  }
  export type serviceDisplayList = {
    serviceDisplayUrl: string;
    branchDisplayBase64Url: string;
  }[];
}
