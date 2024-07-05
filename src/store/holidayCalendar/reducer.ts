import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DataStatus } from "constant/enums";
import {
  getAllHolidayCalendar,
  addHolidayCalendar,
  getHolidayCalendar,
  updateHolidayCalendar,
  deleteHolidayCalendar,
  getAllHolidayList,
  addHolidayList,
  getHolidayList,
  updateHolidayList,
  addHolidayItem,
  deleteHolidayItem,
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

type HolidayCalendarPOSTResponse = {
  message?: string;
  holidayCalendar: HolidayCalendar;
};

type HolidayCalendarPUTResponse = HolidayCalendarPOSTResponse;

type HolidayCalendarDELETEResponse = {
  message?: string;
  holiday_calendar: HolidayCalendar;
};

type HolidayListPOSTResponse = {
  message?: string;
  holidayList: HolidayList;
}

type HolidayListPUTResponse = HolidayListPOSTResponse;
type HolidayItemPOSTResponse = HolidayListPOSTResponse;
type HolidayItemDELETEResponse = HolidayListPOSTResponse;

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
  reducers: {
    deleteHolidayCalendar: (state, action: PayloadAction<string>) => ({
      ...state,
      holidayCalendars: state.holidayCalendars.filter(
        (c) => c.id !== action.payload,
      ),
    }),
  },
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
        (state, action: PayloadAction<HolidayCalendar[]>) => ({
          ...state,
          holidayCalendars: action.payload.map((c) => ({
            ...c,
            list: [],
          })),
          status: DataStatus.SUCCEEDED,
        }),
      )
      .addCase(addHolidayCalendar.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(addHolidayCalendar.rejected, (state) => {
        state.status = DataStatus.FAILED;
      })
      .addCase(
        addHolidayCalendar.fulfilled,
        (state, action: PayloadAction<HolidayCalendarPOSTResponse>) => ({
          ...state,
          holidayCalendars: [
            ...state.holidayCalendars,
            {
              ...action.payload.holidayCalendar,
              list: [],
            },
          ],
          status: DataStatus.SUCCEEDED,
        }),
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
            (c) => c.id === action.payload.id,
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
      .addCase(updateHolidayCalendar.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(updateHolidayCalendar.rejected, (state) => {
        state.status = DataStatus.FAILED;
      })
      .addCase(
        updateHolidayCalendar.fulfilled,
        (state, action: PayloadAction<HolidayCalendarPUTResponse>) => {
          const calendarIdx = state.holidayCalendars.findIndex(
            (c) => c.id === action.payload.holidayCalendar.id,
          );
          if (calendarIdx > -1) {
            state.holidayCalendars[calendarIdx] = {
              ...action.payload.holidayCalendar,
              list: state.holidayCalendars[calendarIdx].list,
            };
          }
          state.status = DataStatus.SUCCEEDED;
        },
      )
      .addCase(deleteHolidayCalendar.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(deleteHolidayCalendar.rejected, (state) => {
        state.status = DataStatus.FAILED;
      })
      .addCase(
        deleteHolidayCalendar.fulfilled,
        (state, action: PayloadAction<HolidayCalendarDELETEResponse>) => ({
          ...state,
          holidayCalendars: state.holidayCalendars.filter(
            (c) => c.id !== action.payload.holiday_calendar.id,
          ),
          status: DataStatus.SUCCEEDED,
        }),
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
              (c) => c.id === list.holiday_calendar_id,
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
      .addCase(addHolidayList.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(addHolidayList.rejected, (state) => {
        state.status = DataStatus.FAILED;
      })
      .addCase(
        addHolidayList.fulfilled,
        (state, action: PayloadAction<HolidayList>) => {
          const calendarIdx = state.holidayCalendars.findIndex(
            (c) => c.id === action.payload.holiday_calendar_id,
          );
          if (calendarIdx > -1) {
            state.holidayCalendars[calendarIdx].list.push(action.payload);
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
        (state, action: PayloadAction<HolidayListPOSTResponse>) => {
          const calendarIdx = state.holidayCalendars.findIndex(
            (c) => c.id === action.payload.holidayList.holiday_calendar_id,
          );
          if (calendarIdx > -1) {
            const listIdx = state.holidayCalendars[calendarIdx].list.findIndex(
              (l) => l.id === action.payload.holidayList.id,
            );
            if (listIdx > -1) {
              state.holidayCalendars[calendarIdx].list[listIdx] =
                action.payload.holidayList;
            } else {
              state.holidayCalendars[calendarIdx].list.push(action.payload.holidayList);
            }
          }
          state.status = DataStatus.SUCCEEDED;
        },
      )
      .addCase(updateHolidayList.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(updateHolidayList.rejected, (state) => {
        state.status = DataStatus.FAILED;
      })
      .addCase(
        updateHolidayList.fulfilled,
        (state, action: PayloadAction<HolidayListPUTResponse>) => {
          const calendarIdx = state.holidayCalendars.findIndex(
            (c) => c.id === action.payload.holidayList.holiday_calendar_id,
          );
          if (calendarIdx > -1) {
            const listIdx = state.holidayCalendars[calendarIdx].list.findIndex(
              (l) => l.id === action.payload.holidayList.id,
            );
            if (listIdx > -1) {
              state.holidayCalendars[calendarIdx].list[listIdx] =
                action.payload.holidayList;
            }
          }
          state.status = DataStatus.SUCCEEDED;
        },
      )
      .addCase(addHolidayItem.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(addHolidayItem.rejected, (state) => {
        state.status = DataStatus.FAILED;
      })
      .addCase(
        addHolidayItem.fulfilled,
        (state, action: PayloadAction<HolidayItemPOSTResponse>) => {
          const calendarIdx = state.holidayCalendars.findIndex(
            (c) => c.id === action.payload.holidayList.holiday_calendar_id,
          );
          if (calendarIdx > -1) {
            const listIdx = state.holidayCalendars[calendarIdx].list.findIndex(
              (l) => l.id === action.payload.holidayList.id,
            );
            if (listIdx > -1) {
              state.holidayCalendars[calendarIdx].list[listIdx] =
                action.payload.holidayList;
            }
          }
          state.status = DataStatus.SUCCEEDED;
        },
      )
      .addCase(deleteHolidayItem.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(deleteHolidayItem.rejected, (state) => {
        state.status = DataStatus.FAILED;
      })
      .addCase(
        deleteHolidayItem.fulfilled,
        (state, action: PayloadAction<HolidayItemDELETEResponse>) => {
          const calendarIdx = state.holidayCalendars.findIndex(
            (c) => c.id === action.payload.holidayList.holiday_calendar_id,
          );
          if (calendarIdx > -1) {
            const listIdx = state.holidayCalendars[calendarIdx].list.findIndex(
              (l) => l.id === action.payload.holidayList.id,
            );
            if (listIdx > -1) {
              state.holidayCalendars[calendarIdx].list[listIdx] =
                action.payload.holidayList;
            }
          }
          state.status = DataStatus.SUCCEEDED;
        },
      );
  },
});

export default holidayCalendarSlice.reducer;
