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
    };
  }

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
