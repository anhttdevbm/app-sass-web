/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DataStatus } from "constant/enums";
import {
  AN_ERROR_TRY_AGAIN,
  DEFAULT_PAGING,
  DEFAULT_PAGING_BILLING,
} from "constant/index";
import { ItemListResponse, Paging, Paging_Billing, User } from "constant/types";
import { subDays } from "date-fns";
import { formatDate, getFiltersFromQueries } from "utils/index";
import {
  BillingDataExport,
  DependencyStatus,
  // GetActivitiesQueries,
  GetBillingListQueries,
  addUserToBilling,
  createBilling,
  createCommentBilling,
  downloadPdfBilling,
  exportBilling,
  getBillingDetail,
  getBillingList,
  getBudgetDetail,
  getBudgetList,
  getCommentBilling,
  getServiceBudget,
  updateBilling,
  viewPdfBilling,
} from "./actions";
import { cl } from "@fullcalendar/core/internal-common";

export interface Project {
  _id: string;
  id: string;
  name: string;
  number: string;
  owner: string;
  members: Member[];
  start_date: string;
  end_date: string;
  expected_cost: number;
  working_hours: number;
  description: string;
  type_project: string;
  created_time: string;
  created_by: string;
  is_active: boolean;
  status: string;
  saved: boolean;
  company: string;
  avatar: [
    {
      object: string;
      name: string;
      link: string;
    },
  ];
  working_hours_real: number;
  actual_costs: number;
  currency: string;
  updated_by: string;
  updated_time: string;
}

export interface Member {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  company: string;
  position_project: {
    name: string;
    id: string;
  };
  date_in: string;
  avatar?: {
    link: string;
  };
}

export interface Owner {
  id: string;
  email: string;
  roles: string[];
  company: string;
  fullname: string;
}

export interface Budgets {
  _id: string;
  id: string;
  name: string;
  project: Project;
  created_time: string;
  updated_time: string;
  owner: Owner;
  currency: string;
  start_date: string;
  end_date: string;
  budget_number: number;
  po_number: number;
  __v: number;
  company: string;
  estimate: number;
  revenue: number;
  revenuePJ: number;
}
export interface Invoice {
  id?: string;
  serviceType: string;
  description: string;
  unit: string;
  quality: number;
  rate: number;
  amount: number;
}

export interface Bill {
  id?: string;
  fullNameCompany?: string;
  tax_id?: string;
  street?: string;
  city?: string;
  zipCode?: number;
  state?: string;
  country?: string;
  save?: boolean;
}

export interface Billing {
  id?: string;
  subject?: string;
  invoiceNumber?: number;
  date?: string;
  company?: string;
  budget?: Budgets[];
  att?: string;
  amount?: number;
  amount_unpaid?: number;
  dueDate?: string;
  avatar?: { link: string };
  poNumber?: number;
  invoiceDate?: string;
  status?: number;
  budgetService?: Service[];
  message?: string;
  user?: User[];
  vat?: number;
  city?: string;
  country?: string;
  state?: string;
  street?: string;
  tax?: number;
  tax_id?: string;
  zip?: number;
  save?: boolean;
  billFrom?: any;
  billTo?: any;
}

export interface Payment {
  id?: string;
  dueDate: string;
  totalInvoice: string;
  paid: string;
  leftToPay: string;
  info: PaymentDetail[];
}

export interface PaymentDetail {
  id?: string;
  status: number;
  date: string;
  overdue: string;
  amount: number;
  note: string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Service {
  id: string;
  name: string;
  desc: string;
  serviceType: string;
  billType: string;
  unit: string;
  estimate: number;
  qty: number;
  price: number;
  discount: number;
  markUp: number;
  tolBudget: number;
  createdAt: string;
  updateAt: string;
  creator: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Feed {}

export interface Currency {
  code: string;
  name: string;
}

export interface Todo {
  id: string;
  name: string;
  owner?: User;
  is_done: boolean;
}

export interface Dependency {
  id: string;
  id_link: string;
  id_task: string;
  sub_task?: string;
  id_task_list: string;
  status: DependencyStatus;
}

export interface BillingState {
  items: Billing[];
  status: DataStatus;
  paging: Paging_Billing;
  error?: string;
  filters: Omit<GetBillingListQueries, "pageIndex" | "pageSize">;
  budgets?: Budgets[];
  serviceBudgets?: any;
  budgetDetail?: Budgets;
  item?: Billing;
  itemStatus: DataStatus;
  dataServices?: Service[];
  itemError?: string;
  createStatus?: boolean;
  updateStatus?: boolean;
  commentStatus?: boolean;
  dataComment?: [];
  fileExport?: string;
  dataExport?: any;
  totalAmount?: number;
  totalAmountUnpaid?: number;
  addUserStatus?: boolean;
}

export interface BillingDataUpdate {
  budget?: [];
  budgetService?: [];
  user?: [];
  invoiceMethod?: string;
  vat?: number;
  amount?: number;
  amount_unpaid?: number;
  message?: string;
  company?: string;
  tax_id?: string;
  email?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  id?: string;
  poNumber?: number;
  dueDate?: string;
  date?: string;
  subject?: string;
}

export interface BillingCommentData {
  bill_id?: string;
  user_id?: User;
  file?: [];
  status?: string;
  comment?: string;
  created_at?: string;
}

export interface BillingComment extends Omit<Comment, "creator"> {
  body: BillingCommentData;
}

// export const DEFAULT_RANGE_ACTIVITIES: GetActivitiesQueries = {
//   start_date: formatDate(subDays(new Date(), 7).getTime()),
//   end_date: formatDate(Date.now()),
// };

const initialState: BillingState = {
  items: [],
  status: DataStatus.IDLE,
  paging: DEFAULT_PAGING_BILLING,
  filters: {},
  dataServices: [],
  itemStatus: DataStatus.IDLE,
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) =>
    builder
      .addCase(getBillingList.pending, (state, action) => {
        state.status = DataStatus.LOADING;
        state.filters = getFiltersFromQueries(action.meta.arg);
        state.paging.page = Number(
          action.meta.arg.page ?? DEFAULT_PAGING.pageIndex,
        );
        state.paging.size = Number(
          action.meta.arg.size ?? DEFAULT_PAGING.pageSize,
        );
      })
      .addCase(getBillingList.fulfilled, (state, { payload }) => {
        // const { items, ...paging } = action.payload;
        const data = payload;

        const { ...paging } = {
          page: data.page,
          size: data.size,
          total_page: data.totalPage,
          totalItems: data?.size,
        };

        state.items = data?.listBill as Billing[];
        state.status = DataStatus.SUCCEEDED;
        state.error = undefined;
        state.paging = Object.assign(state.paging, paging);
        state.totalAmount = data.totalAmount;
        state.totalAmountUnpaid = data.totalAmouint_Unpaid;
      })
      .addCase(getBillingList.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })
      .addCase(getBillingDetail.pending, (state, action) => {
        // state.status = DataStatus.LOADING;
      })
      .addCase(getBillingDetail.fulfilled, (state, { payload }) => {
        const data = payload;

        state.item = data as Billing;
        state.status = DataStatus.SUCCEEDED;
        state.error = undefined;
      })
      .addCase(getBillingDetail.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })
      .addCase(getBudgetList.pending, (state, action) => {
        // state.status = DataStatus.LOADING;
        // state.filters = getFiltersFromQueries(action.meta.arg);
        // state.paging.pageIndex = Number(
        //   action.meta.arg.pageIndex ?? DEFAULT_PAGING.pageIndex,
        // );
        // state.paging.pageSize = Number(
        //   action.meta.arg.pageSize ?? DEFAULT_PAGING.pageSize,
        // );
      })
      .addCase(getBudgetList.fulfilled, (state, { payload }) => {
        // const { items, ...paging } = action.payload;
        const data = payload?.docs;

        state.budgets = data as Budgets[];
        state.status = DataStatus.SUCCEEDED;
        state.error = undefined;
        // state.paging = Object.assign(state.paging, paging);
      })
      .addCase(getBudgetList.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })
      .addCase(getServiceBudget.pending, (state, action) => {
        // state.status = DataStatus.LOADING;
        // state.filters = getFiltersFromQueries(action.meta.arg);
        // state.paging.pageIndex = Number(
        //   action.meta.arg.pageIndex ?? DEFAULT_PAGING.pageIndex,
        // );
        // state.paging.pageSize = Number(
        //   action.meta.arg.pageSize ?? DEFAULT_PAGING.pageSize,
        // );
      })
      .addCase(getServiceBudget.fulfilled, (state, { payload }) => {
        // const { items, ...paging } = action.payload;

        state.serviceBudgets = payload;

        state.status = DataStatus.SUCCEEDED;
        state.error = undefined;
        // state.paging = Object.assign(state.paging, paging);
      })
      .addCase(getServiceBudget.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })
      .addCase(getBudgetDetail.pending, (state, action) => {
        // state.status = DataStatus.LOADING;
        // state.filters = getFiltersFromQueries(action.meta.arg);
        // state.paging.pageIndex = Number(
        //   action.meta.arg.pageIndex ?? DEFAULT_PAGING.pageIndex,
        // );
        // state.paging.pageSize = Number(
        //   action.meta.arg.pageSize ?? DEFAULT_PAGING.pageSize,
        // );
      })
      .addCase(getBudgetDetail.fulfilled, (state, { payload }) => {
        // const { items, ...paging } = action.payload;
        const data = payload;

        state.budgetDetail = data as Budgets;
        state.status = DataStatus.SUCCEEDED;
        state.error = undefined;
        // state.paging = Object.assign(state.paging, paging);
      })
      .addCase(getBudgetDetail.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })
      .addCase(createBilling.pending, (state, action) => {
        state.createStatus = false;
      })
      .addCase(createBilling.fulfilled, (state, action) => {
        state.createStatus = true;
      })
      .addCase(createBilling.rejected, (state, action) => {
        state.createStatus = false;
        // state.salesTodoError = action.error.message ?? AN_ERROR_TRY_AGAIN;
      })
      .addCase(updateBilling.pending, (state, action) => {
        state.updateStatus = false;
      })
      .addCase(updateBilling.fulfilled, (state, action) => {
        state.updateStatus = true;
      })
      .addCase(updateBilling.rejected, (state, action) => {
        state.updateStatus = false;
        // state.salesTodoError = action.error.message ?? AN_ERROR_TRY_AGAIN;
      })
      .addCase(createCommentBilling.pending, (state, action) => {
        state.commentStatus = false;
      })
      .addCase(createCommentBilling.fulfilled, (state, action) => {
        state.commentStatus = true;
      })
      .addCase(createCommentBilling.rejected, (state, action) => {
        state.commentStatus = false;
        // state.salesTodoError = action.error.message ?? AN_ERROR_TRY_AGAIN;
      })
      .addCase(getCommentBilling.pending, (state, action) => {
        // state.status = DataStatus.LOADING;
        // state.filters = getFiltersFromQueries(action.meta.arg);
        // state.paging.pageIndex = Number(
        //   action.meta.arg.pageIndex ?? DEFAULT_PAGING.pageIndex,
        // );
        // state.paging.pageSize = Number(
        //   action.meta.arg.pageSize ?? DEFAULT_PAGING.pageSize,
        // );
      })
      .addCase(getCommentBilling.fulfilled, (state, { payload }) => {
        // const { items, ...paging } = action.payload;

        state.dataComment = payload;

        state.status = DataStatus.SUCCEEDED;
        state.error = undefined;
        // state.paging = Object.assign(state.paging, paging);
      })
      .addCase(getCommentBilling.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })
      .addCase(exportBilling.pending, (state, action) => {
        // state.status = DataStatus.LOADING;
        // state.filters = getFiltersFromQueries(action.meta.arg);
        // state.paging.pageIndex = Number(
        //   action.meta.arg.pageIndex ?? DEFAULT_PAGING.pageIndex,
        // );
        // state.paging.pageSize = Number(
        //   action.meta.arg.pageSize ?? DEFAULT_PAGING.pageSize,
        // );
      })
      .addCase(exportBilling.fulfilled, (state, { payload }) => {
        // const { items, ...paging } = action.payload;
        const data = payload;

        if (data.fileType === "xlsx") {
          const url = window.URL.createObjectURL(new Blob([data?.response]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${Date.now()}.xlsx`);
          document.body.appendChild(link);
          link.click();
        }
        if (data.fileType === "csv") {
          const url = window.URL.createObjectURL(new Blob([data?.response]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${Date.now()}.csv`);
          document.body.appendChild(link);
          link.click();
        }
        if (data.fileType?.includes("pdf")) {
          const url = window.URL.createObjectURL(
            new Blob([data?.response], { type: "application/pdf" }),
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${Date.now()}.pdf`);
          document.body.appendChild(link);
          link.click();
          // window.open(url ?? "", "_blank");
          // console.log();

          // state.fileExport = url;
          // state.dataExport = data?.dataBill;
          // localStorage.setItem("file", url);
        }
      })
      .addCase(exportBilling.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })
      .addCase(downloadPdfBilling.pending, (state, action) => {
        // state.status = DataStatus.LOADING;
        // state.filters = getFiltersFromQueries(action.meta.arg);
        // state.paging.pageIndex = Number(
        //   action.meta.arg.pageIndex ?? DEFAULT_PAGING.pageIndex,
        // );
        // state.paging.pageSize = Number(
        //   action.meta.arg.pageSize ?? DEFAULT_PAGING.pageSize,
        // );
      })
      .addCase(downloadPdfBilling.fulfilled, (state, { payload }) => {
        // const { items, ...paging } = action.payload;
        const data = payload;

        if (data.fileType?.includes("pdf")) {
          const url = window.URL.createObjectURL(
            new Blob([data?.response], { type: "application/pdf" }),
          );
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${Date.now()}.pdf`);
          document.body.appendChild(link);
          link.click();
        }
      })
      .addCase(downloadPdfBilling.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })
      .addCase(viewPdfBilling.pending, (state, action) => {
        // state.status = DataStatus.LOADING;
        // state.filters = getFiltersFromQueries(action.meta.arg);
        // state.paging.pageIndex = Number(
        //   action.meta.arg.pageIndex ?? DEFAULT_PAGING.pageIndex,
        // );
        // state.paging.pageSize = Number(
        //   action.meta.arg.pageSize ?? DEFAULT_PAGING.pageSize,
        // );
      })
      .addCase(viewPdfBilling.fulfilled, (state, { payload }) => {
        // const { items, ...paging } = action.payload;
        const data = payload;

        if (data.fileType?.includes("pdf")) {
          const url = window.URL.createObjectURL(
            new Blob([data?.response], { type: "application/pdf" }),
          );
          // const link = document.createElement("a");
          // link.href = url;
          // link.setAttribute("download", `${Date.now()}.pdf`);
          // document.body.appendChild(link);
          // link.click();
          state.fileExport = url;
          state.dataExport = data?.dataBill;
          localStorage.setItem("file", url);
        }
      })
      .addCase(viewPdfBilling.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })
      .addCase(addUserToBilling.pending, (state, action) => {
        state.addUserStatus = false;
      })
      .addCase(addUserToBilling.fulfilled, (state, action) => {
        state.addUserStatus = true;
      })
      .addCase(addUserToBilling.rejected, (state, action) => {
        state.addUserStatus = false;
        // state.salesTodoError = action.error.message ?? AN_ERROR_TRY_AGAIN;
      }),

  // .addCase(
  //   createProject.fulfilled,
  //   (state, action: PayloadAction<Billing>) => {
  //     state.items.unshift(action.payload);
  //     if (state.items.length > state.paging.pageSize) {
  //       state.items.pop();
  //       if (state.paging.totalPages !== undefined) {
  //         state.paging.totalPages += 1;
  //       }
  //     }
  //     if (state.paging.totalItems !== undefined) {
  //       state.paging.totalItems += 1;
  //     }
  //   },
  // )
  // .addCase(
  //   updateProject.fulfilled,
  //   (state, action: PayloadAction<Billing>) => {
  //     const indexUpdated = state.items.findIndex(
  //       (item) => item.id === action.payload.id,
  //     );
  //     if (indexUpdated !== -1) {
  //       state.items[indexUpdated] = Object.assign(
  //         state.items[indexUpdated],
  //         action.payload,
  //       );
  //     }

  //     if (state.item?.id === action.payload.id) {
  //       state.item = action.payload;
  //     }
  //   },
  // )
  // .addCase(getProject.pending, (state) => {
  //   state.itemStatus = DataStatus.LOADING;
  // })
});

export const {
  // removeMember,
  // updateTaskDetail,
  // updateTaskParent,
  // resetTasks,
  reset,
} = billingSlice.actions;
export const billingReducer = billingSlice.reducer;
export default billingSlice.reducer;
