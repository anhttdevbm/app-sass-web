import { DataStatus } from "constant/enums";
import { useCallback, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  GetListAccounts,
  getListAccounts,
  GetAllTransaction,
  getAllTransaction,
} from "./actions";

export const usePayment = () => {
  const dispatch = useAppDispatch();

  const {
    accounts: {
      data: accounts,
      loading: loadingAccounts,
      error: errorAccounts,
    },
    transactions: {
      data: transactions,
      loading: loadingTransactions,
      error: errorTransactions,
    },
  } = useAppSelector((state) => state.payment, shallowEqual);

  const isIdle = useMemo(
    () =>
      !loadingAccounts &&
      !loadingTransactions &&
      !errorAccounts &&
      !errorTransactions,
    [loadingAccounts, loadingTransactions, errorAccounts, errorTransactions],
  );

  const isFetching = useMemo(
    () => loadingAccounts || loadingTransactions,
    [loadingAccounts, loadingTransactions],
  );

  const onGetListAccounts = useCallback(
    async (queries: GetListAccounts) => {
      await dispatch(getListAccounts(queries));
    },
    [dispatch],
  );

  const onGetAllTransaction = useCallback(
    async (queries: GetAllTransaction) => {
      await dispatch(getAllTransaction(queries));
    },
    [dispatch],
  );

  return {
    accounts,
    transactions,
    status: isFetching ? DataStatus.LOADING : DataStatus.IDLE,
    error: errorAccounts || errorTransactions,
    isIdle,
    isFetching,
    onGetListAccounts,
    onGetAllTransaction,
  };
};
