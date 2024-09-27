import { FormControl } from '@angular/forms';

export namespace PlanDailyApi {
  export interface Request {
    idPlanDaily: number;
    search: string;
    current: number;
    sorter: string;
    pageSize: number;
    orderDescending: boolean;
  }
  export interface Response {
    value: {
      weeklyPlanId: string;
      dailyPlanId: string;
      date: string;
      dayInWeekCode: string;
      dayInWeekName: string;
      dailyPlanStatusCode: string;
      dailyPlanStatusName: string;
      dailyPlanAccounts: dailyPlanAccounts;
      dailyPlanServices: dailyPlanServices;
    };
  }

  export type dailyPlanServices = {
    dailyPlanServiceId: number;
    dailyPlanId: number;
    weeklyPlanId: number;
    branchId: number;
    shopServiceId: string;
    branchServiceId: string;
    shopServiceName: string;
    branchServicePrice: number;
    shopServicePrice: number;
    categoryCode: string;
    categoryName: string;
    estimateDuration: string;
    durationUnitCode: string;
    durationUnitName: string;
  }[];

  export type dailyPlanAccounts = {
    dailyPlanAccountId: string;
    dailyPlanId: string;
    accountId: string;
    fullName: string;
    phone: string;
    genderCode: string;
    genderName: string;
    professionalTypeCode: string;
    professionalTypeName: string;
    thumbnail: string;
    accountStatusCode: string;
    accountStatusName: string;
    shiftCode: string;
    shiftName: string;
  }[];
}

export namespace PlanDailyUpdateModalApi {
  export interface Request {
    services: service;
    staffs: staff;
  }

  export type staff = {
    accountId: string;
    serviceAssignmentCode: string;
    shiftCode: string;
    shiftName: string;
  }[];

  export type service = {
    serviceId: string;
    estimateDuration: string;
    durationUnitCode: string;
    durationUnitName: string;
    assignmentTypeCode: string;
  }[];

  export type RequestFormGroup = {
    services: FormControl<service>;
    staffs: FormControl<staff>;
    staff: FormControl<string>;
    shiftCode: FormControl<string>;
  };
}
