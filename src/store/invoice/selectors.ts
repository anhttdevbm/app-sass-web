import { DataStatus } from "constant/enums";
import { useCallback, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  createNewInvoice,
  deleteInvoice,
  getAllPaymentByInvoiceId,
  getInvoiceDetail,
  getInvoiceList,
  GetInvoiceListQueries,
} from "./actions";

export const useInvoices = () => {
  const dispatch = useAppDispatch();
  const { items, status, error, item, paymentAll } = useAppSelector(
    (state) => state.invoice,
    shallowEqual,
  );
  const { page, size, totalItems, total_page } = useAppSelector(
    (state) => state.invoice.paging,
    shallowEqual,
  );
  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetInvoices = useCallback(
    async (queries: GetInvoiceListQueries) => {
      await dispatch(getInvoiceList(queries));
    },
    [dispatch],
  );
  const onGetInvoiceDetail = useCallback(
    async (id: string) => {
      return await dispatch(getInvoiceDetail(id));
    },
    [dispatch],
  );
  const onGetAllPayments = useCallback(
    async (id: string) => {
      return await dispatch(getAllPaymentByInvoiceId(id));
    },
    [dispatch],
  );

  const onCreateNewInvoice = useCallback(
    async (data: any) => {
      return await dispatch(createNewInvoice(data));
    },
    [dispatch],
  );

  const onDeleteInvoice = useCallback(
    async (id: string) => {
      return await dispatch(deleteInvoice({ id }));
    },
    [dispatch],
  );

  return {
    items,
    item,
    status,
    error,
    page,
    size,
    totalItems,
    total_page,
    isIdle,
    isFetching,
    paymentAll,
    onGetInvoices,
    onGetInvoiceDetail,
    onGetAllPayments,
    onCreateNewInvoice,
    onDeleteInvoice,
  };
};
