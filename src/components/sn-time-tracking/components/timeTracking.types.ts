/* eslint-disable @typescript-eslint/no-explicit-any */

export const TIME_TRACKING_HEADER_HEIGHT = 72;

export interface IFormattedDate {
  day: string;
  date: string;
}

export interface WeeklyHours {
  sun: number;
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
}

export interface EmployeeTimeSheetRowData {
  id: string;
  fullname: string;
  avatar: string;
  weeklyHours: WeeklyHours;
  totalHours: number;
  is_pin: string;
}
