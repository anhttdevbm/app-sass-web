import { createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "constant/enums";
import {
  AN_ERROR_TRY_AGAIN,
  DEFAULT_PAGING,
  DEFAULT_PAGING_BILLING,
} from "constant/index";
import { Paging_Invoice, User } from "constant/types";
import { getInvoiceList } from "./actions";

export interface PaymentItem {
  payment_method?: string;
  payment_link?: string;
}

export interface Service {
  service_name?: string;
  rate?: number;
  discount?: number;
  amount?: number;
}
export interface Invoice {
  id?: string;
  invoice_number?: string;
  invoice_date?: string;
  due_date?: string;
  subject?: string;
  customer_name?: string;
  budget_name?: string;
  note?: string;
  service_items?: Service[];
  payment_items?: PaymentItem[];
  created_time: string;
}
export type InvoiceState = {
  items: Invoice[];
  status: DataStatus;
  paging: Paging_Invoice;
  itemStatus: DataStatus;
  error?: string;
};

const initialState: InvoiceState = {
  items: [],
  status: DataStatus.IDLE,
  paging: DEFAULT_PAGING_BILLING,
  itemStatus: DataStatus.IDLE,
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) =>
    builder
      .addCase(getInvoiceList.pending, (state, action) => {
        state.status = DataStatus.LOADING;
        state.paging.page = Number(
          action.meta.arg.page ?? DEFAULT_PAGING.pageIndex,
        );
        state.paging.size = Number(
          action.meta.arg.size ?? DEFAULT_PAGING.pageSize,
        );
      })
      .addCase(getInvoiceList.fulfilled, (state, { payload }) => {
        // const { items, ...paging } = action.payload;
        const data = payload;

        const { ...paging } = {
          page: data.page,
          size: data.size,
          total_page: data.totalPage,
          totalItems: data?.size,
        };

        state.items = data?.data as Invoice[];
        state.status = DataStatus.SUCCEEDED;
        // state.error = undefined;
        state.paging = Object.assign(state.paging, paging);
        // state.totalAmount = data.totalAmount;
        // state.totalAmountUnpaid = data.totalAmouint_Unpaid;
      })
      .addCase(getInvoiceList.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      }),
});

export const { reset } = invoiceSlice.actions;
export const invoiceReducer = invoiceSlice.reducer;
export default invoiceSlice.reducer;
