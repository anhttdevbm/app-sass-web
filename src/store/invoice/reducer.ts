import { createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "constant/enums";
import {
  AN_ERROR_TRY_AGAIN,
  DEFAULT_PAGING,
  DEFAULT_PAGING_BILLING,
} from "constant/index";
import { Paging_Invoice, User } from "constant/types";
import {
  getAllPaymentByInvoiceId,
  getInvoiceDetail,
  getInvoiceList,
} from "./actions";

export interface PaymentItem {
  payment_method?: string;
  payment_link?: string;
}

export interface PaymentDesc {
  id?: string;
}

export interface Service {
  service_name?: string;
  rate?: number;
  discount?: number;
  amount?: number;
  quantity?: number;
}

export interface Member {
  id: string;
  fullname?: string;
  email?: string;
  date_in?: string;
}
export interface BillTo {
  name: String;
  tax_code: String;
  phone: String;
  address: String;
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
  total: number;
  status: boolean;
  balance_due: string;
  members?: Member[];
  bill_to: BillTo;
}

export type InvoiceState = {
  items: Invoice[];
  status: DataStatus;
  paging: Paging_Invoice;
  itemStatus: DataStatus;
  error?: string;
  item?: Invoice;
  paymentAll?: PaymentDesc[];
  total?: number;
  total_page?: number;
};

const initialState: InvoiceState = {
  items: [],
  status: DataStatus.IDLE,
  paging: DEFAULT_PAGING_BILLING,
  itemStatus: DataStatus.IDLE,
  paymentAll: [],
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
          total_page: data.total_page,
          totalItems: data?.total,
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
      })
      .addCase(getInvoiceDetail.pending, (state, action) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(getInvoiceDetail.fulfilled, (state, { payload }) => {
        const data = payload;

        state.item = data as Invoice;
        state.status = DataStatus.SUCCEEDED;
        state.error = undefined;
      })
      .addCase(getInvoiceDetail.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })
      .addCase(getAllPaymentByInvoiceId.fulfilled, (state, { payload }) => {
        const data = payload;
        state.paymentAll = data;
      })
      .addCase(getAllPaymentByInvoiceId.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      }),
});

export const { reset } = invoiceSlice.actions;
export const invoiceReducer = invoiceSlice.reducer;
export default invoiceSlice.reducer;
