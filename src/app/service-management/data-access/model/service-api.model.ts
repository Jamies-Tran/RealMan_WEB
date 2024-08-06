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
    shopServiceName: string;
    shopCategoryId: string;
    serviceDisplays: serviceDisplays;
    shopServicePrice: number;
    shopServiceThumbnail: string;
  }

  export type serviceDisplays = {
    serviceDisplayContent: string;
  }[];

  export type RequestFormGroup = {
    shopServiceName: FormControl<string>;
    shopCategoryId: FormControl<string>;
    serviceDisplays: FormControl<serviceDisplays>;
    shopServicePrice: FormControl<number>;
    shopServiceThumbnail: FormControl<string>;
    fileList: FormControl<NzUploadFile[]>;
  };

  export function mapModel(frm: FormGroup<RequestFormGroup>): Request {
    const formValue = frm.getRawValue();
    return {
      shopCategoryId: formValue.shopCategoryId!,
      shopServiceName: formValue.shopServiceName,
      serviceDisplays: formValue.serviceDisplays,
      shopServicePrice: formValue.shopServicePrice,
      shopServiceThumbnail: formValue.shopServiceThumbnail,
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
    shopServiceId: string;
    branchId: string;
    shopServiceName: string;
    shopServicePrice: string;
    shopServiceThumbnail: string;
    shopCategoryId: string;
    shopCategoryCode: string;
    shopCategoryName: string;
    serviceDisplays: serviceDisplays;
  }

  export type serviceDisplays = {
    serviceDisplayContent: string;
  }[];

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
    shopServiceName: string;
    shopCategoryId: string;
    serviceDisplays: serviceDisplays;
    shopServicePrice: number;
    shopServiceThumbnail: string;
  }

  export type serviceDisplays = {
    serviceDisplayContent: string;
  }[];

  export type RequestFormGroup = {
    shopServiceName: FormControl<string>;
    shopCategoryId: FormControl<string>;
    serviceDisplays: FormControl<serviceDisplays>;
    shopServicePrice: FormControl<number>;
    shopServiceThumbnail: FormControl<string>;
    fileList: FormControl<NzUploadFile[]>;
  };

  export function mapModel(frm: FormGroup<RequestFormGroup>): Request {
    const formValue = frm.getRawValue();
    return {
      shopCategoryId: formValue.shopCategoryId!,
      shopServiceName: formValue.shopServiceName,
      serviceDisplays: formValue.serviceDisplays,
      shopServicePrice: formValue.shopServicePrice,
      shopServiceThumbnail: formValue.shopServiceThumbnail,
    };
  }
}

export namespace ServiceGetApi {
  export interface Response {
    content: {
      shopServiceId: string;
      shopServiceName: string;
      shopServicePrice: number;
      shopServiceThumbnail: string;
      shopCategoryId: string;
      serviceDisplays: serviceDisplays;
    };
  }

  export type serviceDisplays = {
    serviceDisplayContent: string;
  }[];
}
