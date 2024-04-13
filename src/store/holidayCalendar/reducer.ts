import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DataStatus } from "constant/enums";
import {
  getAllHolidayCalendar,
  getAllHolidayList,
  getHolidayCalendar,
  getHolidayList,
} from "./actions";

export type HolidayItem = {
  id: string;
  name: string;
  date: string;
};

export type HolidayList = {
  id: string;
  holiday_calendar_id: string;
  year: number;
  items: HolidayItem[];
};

export type HolidayCalendar = {
  id: string;
  name: string;
  country: string;
  province: string;
  company: string;
  list: HolidayList[];
  created_time: string;
  updated_time: string;
};

export type HolidayCalendarState = {
  status: DataStatus;
  holidayCalendars: HolidayCalendar[];
};

const initialState: HolidayCalendarState = {
  status: DataStatus.IDLE,
  holidayCalendars: [],
};

const holidayCalendarSlice = createSlice({
  name: "holidayCalendar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllHolidayCalendar.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(getAllHolidayCalendar.rejected, (state) => {
        state.status = DataStatus.FAILED;
      })
      .addCase(
        getAllHolidayCalendar.fulfilled,
        (state, action: PayloadAction<HolidayCalendar[]>) => {
          state.holidayCalendars = action.payload.map((c) => ({
            ...c,
            list: [],
          }));
          state.status = DataStatus.SUCCEEDED;
        },
      )
      .addCase(getAllHolidayList.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(getAllHolidayList.rejected, (state) => {
        state.status = DataStatus.FAILED;
      })
      .addCase(
        getAllHolidayList.fulfilled,
        (state, action: PayloadAction<HolidayList[]>) => {
          const clearedHolidayCalendar: string[] = [];
          // push in new lists
          action.payload.forEach((list) => {
            const calendarIdx = state.holidayCalendars.findIndex(
              (c) => (c.id === list.holiday_calendar_id),
            );
            if (calendarIdx > -1) {
              // clear current holiday lists
              if (!clearedHolidayCalendar.includes(list.holiday_calendar_id)) {
                state.holidayCalendars[calendarIdx].list = [];
                clearedHolidayCalendar.push(list.holiday_calendar_id);
              }
              state.holidayCalendars[calendarIdx].list.push(list);
            }
          });
          state.status = DataStatus.SUCCEEDED;
        },
      )
      .addCase(getHolidayCalendar.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(getHolidayCalendar.rejected, (state) => {
        state.status = DataStatus.FAILED;
      })
      .addCase(
        getHolidayCalendar.fulfilled,
        (state, action: PayloadAction<HolidayCalendar>) => {
          const calendarIdx = state.holidayCalendars.findIndex(
            (c) => (c.id === action.payload.id),
          );
          if (calendarIdx > -1) {
            state.holidayCalendars[calendarIdx] = {
              ...action.payload,
              list: state.holidayCalendars[calendarIdx].list,
            };
          } else {
            state.holidayCalendars.push(action.payload);
          }
          state.status = DataStatus.SUCCEEDED;
        },
      )
      .addCase(getHolidayList.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(getHolidayList.rejected, (state) => {
        state.status = DataStatus.FAILED;
      })
      .addCase(
        getHolidayList.fulfilled,
        (state, action: PayloadAction<HolidayList>) => {
          const calendarIdx = state.holidayCalendars.findIndex(
            (c) => (c.id === action.payload.holiday_calendar_id),
          );
          if (calendarIdx > -1) {
            const listIdx = state.holidayCalendars[calendarIdx].list.findIndex(
              (l) => (l.id === action.payload.id),
            );
            if (listIdx > -1) {
              state.holidayCalendars[calendarIdx].list[listIdx] =
                action.payload;
            } else {
              state.holidayCalendars[calendarIdx].list.push(action.payload);
            }
          }
          state.status = DataStatus.SUCCEEDED;
        },
      )
  },
});

export default holidayCalendarSlice.reducer;
