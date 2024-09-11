/* eslint-disable @typescript-eslint/no-explicit-any */

import { CalendarApi } from "@fullcalendar/core";
import { Project, WorkType } from "store/timeTracking/reducer";

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

export interface FullCalendarExtendedProps {
  id: string;
  date: string;
  start_time: string;
  project: Project;
  avatar: string;
  day: string;
  name: string;
  position: { id: string; name: string };
  hour: number;
  typeDefault: WorkType;
  type: string;
  note: string;
}

export interface FullCalendarEventProps {
  title?: string;
  start?: string;
  end?: string;
  extendedProps: Partial<FullCalendarExtendedProps>;
}

export interface IFilter {
  start_date: string;
  end_date: string;
  search_key: string;
}

export interface ITimeRangeAction {
  action: "view" | "week";
  value: "next" | "prev" | "today";
}
