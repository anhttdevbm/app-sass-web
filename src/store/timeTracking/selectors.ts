import { DataStatus } from "constant/enums";
import { useCallback, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  BodyCreateTimeSheet,
  BodyPinTimeSheet,
  GetMyTimeSheetQueries,
  GetWorkLogQueries,
  createTimeSheet,
  deleteTimeSheet,
  getCompanyTimeSheet,
  getMyTimeSheet,
  getWorkLog,
  pinTimeSheet,
  updateTimeSheet
} from "./actions";

export const useGetMyTimeSheet = () => {
  const dispatch = useAppDispatch();
  const {
    items,
    status,
    error,
    itemStatus,
    companyItems,
    statusUpdate,
    statusDelete,
    workLog,
    params,
    sameWorker,
  } = useAppSelector((state) => state.timeTracking, shallowEqual);
  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.timeTracking.paging,
    shallowEqual,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetMyTimeSheet = useCallback(
    async (queries: GetMyTimeSheetQueries) => {
      await dispatch(getMyTimeSheet(queries));
    },
    [dispatch],
  );

  const onGetWorkLog = useCallback(
    async (queries: GetWorkLogQueries) => {
      await dispatch(getWorkLog(queries));
    },
    [dispatch],
  );

  const onGetCompanyTimeSheet = useCallback(
    async (queries: GetMyTimeSheetQueries) => {
      await dispatch(getCompanyTimeSheet(queries));
    },
    [dispatch],
  );

  const onCreateTimeSheet = useCallback(
    async (data: Omit<BodyCreateTimeSheet, "id">) => {
      return await dispatch(createTimeSheet(data)).unwrap();
    },
    [dispatch],
  );

  const onUpdateTimeSheet = useCallback(
    async (data: BodyCreateTimeSheet) => {
      return await dispatch(updateTimeSheet(data)).unwrap();
    },
    [dispatch],
  );

  const onDeleteTimeSheet = useCallback(
    async (data: { id: string }) => {
      return await dispatch(deleteTimeSheet(data)).unwrap();
    },
    [dispatch],
  );

  const onPinTimeSheet = useCallback(
    async (data: BodyPinTimeSheet) => {
      return await dispatch(pinTimeSheet(data)).unwrap();
    },
    [dispatch],
  );

  // const onGetSameWorker = useCallback(
  //   async (data: { id: string }) => {
  //     return await dispatch(getSameWorker(data));
  //   },
  //   [dispatch],
  // );

  return {
    params,
    items,
    companyItems,
    sameWorker,
    workLog,
    status,
    itemStatus,
    statusUpdate,
    statusDelete,
    error,
    isIdle,
    isFetching,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    onGetMyTimeSheet,
    onCreateTimeSheet,
    onGetCompanyTimeSheet,
    onUpdateTimeSheet,
    onDeleteTimeSheet,
    onGetWorkLog,
    onPinTimeSheet,
    // onGetSameWorker,
  };
};
