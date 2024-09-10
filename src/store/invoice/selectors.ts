import { DataStatus } from "constant/enums";
import { useCallback, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  createNewInvoice,
  deleteInvoice,
  deleteMultipleInvoice,
  getAllPaymentByInvoiceId,
  getInvoiceDetail,
  getInvoiceList,
  GetInvoiceListQueries,
  updateInvoice,
} from "./actions";
import { Service } from "./reducer";

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
  const onDeleteMultipleInvoice = useCallback(
    async (invoice_numbers: string[]) => {
      return await dispatch(
        deleteMultipleInvoice({ invoice_number: invoice_numbers }),
      );
    },
    [dispatch],
  );

  const onUpdateInvoice = useCallback(
    async (service_items: Service[], id: string) => {
      return await dispatch(updateInvoice({ service_items, id }));
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
    onDeleteMultipleInvoice,
    onUpdateInvoice,
  };
};
