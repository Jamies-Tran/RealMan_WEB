import { ShiftType } from 'src/app/share/data-access/api/enum/shift.enum';

export namespace PlanPagingApi {
  export interface Request {
    search: string;
    current: number;
    sorter: string;
    pageSize: number;
    orderDescending: boolean;
  }

  export interface Response {
    weeklyPlanId: number;
    weeklyPlanName: string;
    branchId: string;
    weeklyPlanStatusCode: string;
    weeklyPlanStatusName: string;
    dailyPlanActive: string;
    dailyPlans: string | null;
  }
}

export namespace PlanCreateApi {
  export interface Request {
    pickupDateReq: string;
  }
}

export namespace PlanWeeklyDetailApi {
  export interface Response {
    value: {
      weeklyPlanId: string;
      dailyPlanId: string;
      date: string;
      dayInWeekCode: string;
      dayInWeekName: string;
      dailyPlanStatusCode: string;
      dailyPlanStatusName: string;
      dailyPlans: dailyPlanAccounts;
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
    weeklyPlanId: number;
    dailyPlanId: number;
    date: string;
    dayInWeekCode: string;
    dayInWeekName: string;
    dailyPlanStatusCode: string;
    dailyPlanStatusName: string;
    dailyPlanAccounts: string | null;
    dailyPlanServices: string | null;
  }[]
}
