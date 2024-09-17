export namespace PlanDailyApi {
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
    };
  }

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
    // dailyPlanAccountId: string;
    // dailyPlanId: string;
    // accountId: string;
    // fullName: string;
    // phone: string;
    // genderCode: string;
    // genderName: string;
    // professionalTypeCode: string;
    // professionalTypeName: string;
    // thumbnail: string;
    // accountStatusCode: string;
    // accountStatusName: string;
    // shiftCode: string;
    // shiftName: string;
  }[];
}
