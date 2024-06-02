import { ShiftType } from "src/app/share/data-access/api/enum/shift.enum";

export namespace SchedulePagingApi {
  export interface Request {
    search: string;
    current: number;
    sorter: string;
    pageSize: number;
    orderDescending: boolean;
  }

  export interface Response {
    name: string;
    phone: string;
    schedules: schedule;
  }

  export type schedule = {
    mon: ShiftType;
    tue: ShiftType;
    wed: ShiftType;
    thurs: ShiftType;
    fri: ShiftType;
    sat: ShiftType;
    sun: ShiftType;
  };
}
