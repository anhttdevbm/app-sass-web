import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "store/hooks";
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
  HolidayCalendarPOSTData,
  HolidayCalendarPUTData,
  HolidayListPOSTData,
  HolidayListPUTData,
  HolidayItemPOSTData,
  HolidayItemDELETEData,
} from "./actions";

export const useHolidayCalendar = () => {
  const dispatch = useAppDispatch();

  const holidayCalendars = useAppSelector(
    (state) => state.holidayCalendar.holidayCalendars,
  );
  const status = useAppSelector((state) => state.holidayCalendar.status);

  const selectHolidayCalendar = useCallback(
    (id: string) => holidayCalendars.find((c) => c.id === id),
    [holidayCalendars],
  );

  const selectHolidayList = useCallback(
    (holidayCalendarId: string, holidayListId: string) =>
      holidayCalendars
        .find((c) => c.id === holidayCalendarId)
        ?.list.find((l) => l.id === holidayListId),
    [holidayCalendars],
  );

  const handleGetAllHolidayCalendar = useCallback(async () => {
    try {
      return await dispatch(getAllHolidayCalendar()).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const handleAddHolidayCalendar = useCallback(
    async (data: HolidayCalendarPOSTData) => {
      try {
        return await dispatch(addHolidayCalendar(data)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleGetHolidayCalendar = useCallback(
    async (id: string) => {
      try {
        return await dispatch(getHolidayCalendar(id)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleUpdateHolidayCalendar = useCallback(
    async (data: HolidayCalendarPUTData) => {
      try {
        return await dispatch(updateHolidayCalendar(data)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleDeleteHolidayCalendar = useCallback(
    async (id: string) => {
      try {
        return await dispatch(deleteHolidayCalendar(id)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleGetAllHolidayList = useCallback(async () => {
    try {
      return await dispatch(getAllHolidayList()).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const handleAddHolidayList = useCallback(
    async (data: HolidayListPOSTData) => {
      try {
        return await dispatch(addHolidayList(data)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleGetHolidayList = useCallback(
    async (id: string) => {
      try {
        return await dispatch(getHolidayList(id)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleUpdateHolidayList = useCallback(
    async (data: HolidayListPUTData) => {
      try {
        return await dispatch(updateHolidayList(data)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleAddHolidayItem = useCallback(
    async (data: HolidayItemPOSTData) => {
      try {
        return await dispatch(addHolidayItem(data)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const handleDeleteHolidayItem = useCallback(
    async (data: HolidayItemDELETEData) => {
      try {
        return await dispatch(deleteHolidayItem(data)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  return {
    holidayCalendars,
    status,
    selectHolidayCalendar,
    selectHolidayList,
    handleGetAllHolidayCalendar,
    handleAddHolidayCalendar,
    handleGetHolidayCalendar,
    handleUpdateHolidayCalendar,
    handleDeleteHolidayCalendar,
    handleGetAllHolidayList,
    handleAddHolidayList,
    handleGetHolidayList,
    handleUpdateHolidayList,
    handleAddHolidayItem,
    handleDeleteHolidayItem,
  };
};
