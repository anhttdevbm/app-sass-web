import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  getAllHolidayCalendar,
  getAllHolidayList,
  getHolidayCalendar,
  getHolidayList,
} from "./actions";

export const useHolidayCalendar = () => {
  const dispatch = useAppDispatch();

  const holidayCalendars = useAppSelector(
    (state) => state.holidayCalendar.holidayCalendars,
  );

  const status = useAppSelector((state) => state.holidayCalendar.status);

  const handleGetAllHolidayCalendar = useCallback(async () => {
    try {
      return await dispatch(getAllHolidayCalendar()).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const handleGetAllHolidayList = useCallback(async () => {
    try {
      return await dispatch(getAllHolidayList()).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

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

  return {
    holidayCalendars,
    status,
    handleGetAllHolidayCalendar,
    handleGetAllHolidayList,
    handleGetHolidayCalendar,
    handleGetHolidayList,
  };
};
