import { useAppDispatch, useAppSelector } from "store/hooks";
import { DataStatus } from "constant/enums";
import { useMemo, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { getCurrencyOptions, getPositionOptions, getProjectTypeOptions } from "./actions";
import { BaseQueries } from "constant/types";

export const usePositionOptions = () => {
  const dispatch = useAppDispatch();
  const {
    positionOptions: options,
    positionOptionsStatus: status,
    positionOptionsError: error,
  } = useAppSelector((state) => state.global, shallowEqual);

  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.global.positionOptionsPaging,
    shallowEqual,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetOptions = useCallback(
    async (queries: BaseQueries) => {
      await dispatch(getPositionOptions(queries));
    },
    [dispatch],
  );

  return {
    status,
    isIdle,
    isFetching,
    error,
    options,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    onGetOptions,   
  };
};

export const useProjectTypeOptions = () => {
  const dispatch = useAppDispatch();
  const {
    projectTypeOptions: options,
    projectTypeOptionsStatus: status,
    projectTypeOptionsError: error,
  } = useAppSelector((state) => state.global, shallowEqual);

  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.global.projectTypeOptionsPaging,
    shallowEqual,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetOptions = useCallback(
    async (queries: BaseQueries) => {
      await dispatch(getProjectTypeOptions(queries));
    },
    [dispatch],
  );

  return {
    status,
    isIdle,
    isFetching,
    error,
    options,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    onGetOptions,
  };
};

export const useCurrencyOptions = () => {
  const dispatch = useAppDispatch();
  const {
    currencyOptions: options,
    currencyOptionsStatus: status,
    currencyOptionsError: error,
  } = useAppSelector((state) => state.global, shallowEqual);
  
  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.global.currencyOptionsPaging,
    shallowEqual,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetOptions = useCallback(
    async (queries: BaseQueries) => {
      await dispatch(getCurrencyOptions(queries));
    },
    [dispatch],
  );
  return {
    status,
    isIdle,
    isFetching,
    error,
    options,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    onGetOptions,
  };
};
