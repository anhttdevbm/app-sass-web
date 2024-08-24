import { find } from "lodash";
import { useEffect, useMemo } from "react";
import { useBookingAll } from "store/resourcePlanning/selector";
import { Sales } from "store/sales/reducer";
import { useSales } from "store/sales/selectors";
import { useGetMyTimeSheet } from "store/timeTracking/selectors";

interface IScheduleTime {
  id: string;
  lefToSchedule: number;
}

export const useCalculateDetail = (
  service_id?: string,
  project_id?: string,
  resourceId?: string,
  userId?: string,
) => {
  const { sales } = useSales();
  const { bookingAll } = useBookingAll();
  const {
    onGetMyTimeSheet,
    params,
    // sameWorker,
    items: timesheets,
    // onGetSameWorker,
  } = useGetMyTimeSheet();

  const estimate = useMemo(() => {
    const result = find(sales, { id: service_id })?.estimate;
    return result || 0;
  }, [sales, service_id]);

  const workedTime = useMemo(() => {
    return timesheets.reduce((acc, cur) => {
      if (cur.id === project_id) {
        return acc + (cur.duration || 0);
      }
      return acc;
    }, 0);
  }, [timesheets, project_id]);

  const scheduledTime = useMemo(() => {
    const parentResource = bookingAll.find((item) => item.id === resourceId);
    return parentResource?.total_hour || 0;
  }, [bookingAll, resourceId]);

  const leftToSchedule = useMemo(() => {
    return estimate - workedTime - scheduledTime;
  }, [estimate, workedTime, scheduledTime]);
  // console.log(sameWorker, "sameWorker");
  useEffect(() => {
    onGetMyTimeSheet(params);
    // onGetSameWorker({
    //   id: userId || "",
    // });
  }, []);

  return { estimate, workedTime, scheduledTime, leftToSchedule };
};

export const useGetTotalScheduleTime = () => {
  const { bookingAll } = useBookingAll();
  const { sales } = useSales();
  //how to get timesheet of one person
  const { onGetMyTimeSheet, params, items: timesheets } = useGetMyTimeSheet();

  const totalScheduleTime = useMemo(() => {
    return bookingAll.reduce((acc, cur) => {
      return acc + cur.total_hour;
    }, 0);
  }, [bookingAll]);
  const totalLeftToSchedule = useMemo(() => {
    return bookingAll.reduce((acc, cur) => {
      const services = cur.bookings.reduce((acc, cur) => {
        if (!cur.service_id) return acc;
        const isExist = acc.find((item) => item?.id === cur.service_id);
        if (isExist) return acc;
        const sale = find(sales, { id: cur.service_id });
        if (sale) {
          acc.push(sale);
        }
        return acc;
      }, [] as Sales[]);

      const serviceTime = services.reduce((acc, cur) => {
        return acc + (cur?.estimate || 0);
      }, 0);
      const totalWorkedTime = cur.bookings.reduce((acc, cur) => {
        return timesheets.reduce((acc, cur) => {
          if (cur.id === cur.project_id) {
            return acc + (cur.duration || 0);
          }
          return acc;
        }, 0);
      }, 0);
      acc = {
        ...acc,
        [cur.id]: serviceTime - cur.total_hour - totalWorkedTime,
      };
      return acc;
    }, {} as Record<string, number>);
  }, [bookingAll, timesheets, sales]);

  const totalScheduleAll = useMemo(() => {
    return Object.values(totalLeftToSchedule).reduce((acc, cur) => {
      return acc + cur;
    }, 0);
  }, [totalLeftToSchedule]);
  return { totalLeftToSchedule, totalScheduleAll, totalScheduleTime };
};
