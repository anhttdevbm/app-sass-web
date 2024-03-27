import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, DEFAULT_PAGING } from "constant/index";
import { ItemListResponse, Paging, User } from "constant/types";
import { Avatar } from "store/chat/type";
import { Comment } from "store/project/reducer";
import { getFiltersFromQueries } from "utils/index";
import {
  GetSalesListQueries,
  createComment,
  createDeal,
  createServiceSection,
  createTodo,
  deleteSection,
  deleteTodo,
  getDetailDeal,
  getSales,
  getServices,
  updateDeal,
  updatePriority,
  updateServiceSection,
  updateTodo,
} from "./actions";
import build from "next/dist/build";
import { CellProps } from "components/Table";
import { ServiceColumn } from "components/sn-sales-detail/hooks/useGetHeaderColumn";

export interface Todo {
  id: string;
  name: string;
  is_done: boolean;
  priority: number;
  expiration_date: string;
  owner: string;
}
export interface SalesComment extends Omit<Comment, "creator"> {
  creator: {
    body: User;
  };
}
export interface Sales {
  id: string;
  name: string;
  created_time: string;
  updated_time: string;
  created_by: User;
  updated_by: User;
  status: string;
  start_date: string;
  owner: User;
  members: User[];
  description?: string;
  is_active: boolean;
  company: string;
  avatar?: Avatar[];
  tags?: string[];
  currency: string;
  probability: number;
  todo_list: Todo[];
  stage: string;
  comments: SalesComment[];
  revenue: number;
  revenuePJ: number;
  todoItem: Todo;
  estimate: number;
  total: SaleTotal;
  activity: string[];
}

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
  updatedAt: string;
  creator: string;
}

export interface SaleTotal {
  revenue: number;
  revenuePJ: number;
  estimate: number;
}

export interface ServiceSection {
  id: string;
  name?: string;
  start_date: string;
  servie: Service[];
  createdAt: string;
  updatedAt: string;
  creator: string;
  deal: string;
}

export interface SectionColumnsProps {
  id: string;
  columns: ServiceColumn[];
}

export type TotalListResponse = ItemListResponse & { totalDetail: SaleTotal };
export interface SaleState {
  sales: Sales[];
  saleTotal: SaleTotal;
  salesStatus: DataStatus;
  salesPaging: Paging;
  salesError?: string;
  salesFilters: Omit<GetSalesListQueries, "pageIndex" | "pageSize">;

  saleDetail: Sales | null;
  saleTotalDetail: SaleTotal;
  saleRevenue: number;
  saleDetailStatus: DataStatus;
  saleDetailError?: string;

  salesTodo: Todo | null;
  salesTodoStatus: DataStatus;
  salesTodoError?: string;

  comments: SalesComment[];
  commentsStatus: DataStatus;
  commentsError?: string;

  serviceSectionList: ServiceSection[];
  serviceSection: ServiceSection | null;
  servicesStatus: DataStatus;
  servicesError?: string;

  sectionColumns: SectionColumnsProps[];
}

const defaultCol = [
  {
    id: ServiceColumn.NAME,
  },
];
const initState: SaleState = {
  sales: [],
  saleTotal: {
    revenue: 0,
    revenuePJ: 0,
    estimate: 0,
  },
  salesStatus: DataStatus.IDLE,
  salesPaging: DEFAULT_PAGING,
  salesError: undefined,
  salesFilters: {
    sort: "DESC",
  },

  saleDetail: null,
  saleTotalDetail: {
    revenue: 0,
    revenuePJ: 0,
    estimate: 0,
  },
  saleRevenue: 0,
  saleDetailStatus: DataStatus.IDLE,
  saleDetailError: undefined,

  salesTodo: null,
  salesTodoStatus: DataStatus.IDLE,
  salesTodoError: undefined,

  comments: [],
  commentsStatus: DataStatus.IDLE,
  commentsError: undefined,

  serviceSectionList: [],
  serviceSection: null,
  servicesStatus: DataStatus.IDLE,
  servicesError: undefined,

  sectionColumns: [],
};

const salesSlice = createSlice({
  name: "sales",
  initialState: initState,
  reducers: {
    setColumn: (state, action) => {
      const { sectionIndex, columns } = action.payload;
      if (!state.sectionColumns[sectionIndex]) {
        state.sectionColumns.push({
          id: action.payload.sectionIndex,
          columns: [...columns],
        });
      }
      state.sectionColumns[sectionIndex].columns = [...columns];
    },
    setRevenue: (state, action) => {
      state.saleRevenue = action.payload;
    },
    reset: () => initState,
  },
  extraReducers: (builder) => {
    builder.addCase(getSales.pending, (state, action) => {
      state.salesStatus = DataStatus.LOADING;
      state.salesFilters = getFiltersFromQueries(action.meta.arg);
      state.salesPaging.pageIndex = Number(
        action.meta.arg.pageIndex || DEFAULT_PAGING.pageIndex,
      );
      state.salesPaging.pageSize = Number(
        action.meta.arg.pageSize || DEFAULT_PAGING.pageSize,
      );
    });
    builder.addCase(getSales.fulfilled, (state, action) => {
      const {
        items,
        totalDetail: total,
        ...paging
      } = action.payload as TotalListResponse;

      state.sales = items as Sales[];
      state.saleTotal = total as SaleTotal;
      state.salesStatus = DataStatus.SUCCEEDED;
      state.salesPaging = Object.assign(state.salesPaging, paging);
    });
    builder.addCase(getSales.rejected, (state, action) => {
      state.salesStatus = DataStatus.FAILED;
      state.salesError = action.error.message ?? AN_ERROR_TRY_AGAIN;
    });
    builder.addCase(createDeal.fulfilled, (state, action) => {
      state.sales.unshift(action.payload);
      if (state.sales.length > state.salesPaging.pageSize) {
        state.sales.pop();
        if (
          state.salesPaging.totalPages != undefined &&
          state.salesPaging.totalPages <
            (state.salesPaging.totalItems || 0) / state.salesPaging.pageSize
        ) {
          state.salesPaging.totalPages += 1;
        }
      }
      if (state.salesPaging.totalItems !== undefined) {
        state.salesPaging.totalItems += 1;
      }
    });
    builder.addCase(updateDeal.fulfilled, (state, action) => {
      if (state.saleDetail) {
        // state.saleDetail.probability = action.payload.probability;
        // state.saleDetail.status = action.payload.status;
        // state.saleDetail.members = action.payload.members;
        // state.saleDetail.start_date = action.payload.start_date;
        // state.saleDetail.todo_list = action.payload.todo_list;
      }
      // const index = state.sales.findIndex(
      //   (item) => item.id === action.payload.id,
      // );
      // if (index !== -1) {
      //   state.sales[index] = Object.assign(state.sales[index], action.payload);
      // }
    });
    builder.addCase(updateDeal.rejected, (state, action) => {
      state.saleDetailError = action.error.message ?? AN_ERROR_TRY_AGAIN;
    });
    builder.addCase(createDeal.rejected, (state, action) => {
      state.saleDetailError = action.error.message ?? AN_ERROR_TRY_AGAIN;
    });
    builder.addCase(getDetailDeal.pending, (state, action) => {
      state.salesStatus = DataStatus.LOADING;
    });
    builder.addCase(getDetailDeal.fulfilled, (state, action) => {
      state.saleDetail = action.payload;
      state.salesStatus = DataStatus.SUCCEEDED;
    });
    builder.addCase(getDetailDeal.rejected, (state, action) => {
      state.saleDetailError = action.error.message ?? AN_ERROR_TRY_AGAIN;
    });
    builder.addCase(createTodo.pending, (state, action) => {
      state.salesTodoStatus = DataStatus.LOADING;
    });
    builder.addCase(createTodo.fulfilled, (state, action) => {
      if (state.saleDetail) {
        // state.saleDetail.todo_list = action.payload.deal_update.todo_list;
      }
    });
    builder.addCase(createTodo.rejected, (state, action) => {
      // state.salesTodoError = action.error.message ?? AN_ERROR_TRY_AGAIN;
    });
    builder.addCase(updateTodo.fulfilled, (state, action) => {
      if (state.saleDetail) {
        // state.saleDetail.todo_list = action.payload.deal_update.todo_list;
      }
    });
    builder.addCase(updateTodo.rejected, (state, action) => {
      state.salesTodoError = action.error.message ?? AN_ERROR_TRY_AGAIN;
    });
    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      if (state.saleDetail) {
        // state.saleDetail.todo_list = action.payload.deal_update.todo_list;
      }
    });
    builder.addCase(deleteTodo.rejected, (state, action) => {
      state.salesTodoError = action.error.message ?? AN_ERROR_TRY_AGAIN;
    });
    builder.addCase(createComment.fulfilled, (state, action) => {
      if (state.saleDetail) {
        // state.saleDetail.todo_list = action.payload.deal_update.todo_list;
      }
    });
    builder.addCase(getServices.pending, (state, action) => {
      state.servicesStatus = DataStatus.LOADING;
    });
    builder.addCase(getServices.fulfilled, (state, action) => {
      state.serviceSectionList = action.payload.sections;
      state.servicesStatus = DataStatus.SUCCEEDED;
      state.sectionColumns = action.payload.sections.map((section) => {
        return {
          id: section.id,
          columns: [
            ServiceColumn.NAME,
            ServiceColumn.DESCRIPTION,
            ServiceColumn.SERVICE_TYPE,
            ServiceColumn.BILL_TYPE,
            ServiceColumn.UNIT,
            ServiceColumn.ESTIMATE,
            ServiceColumn.QUANTITY,
            ServiceColumn.PRICE,
            ServiceColumn.DISCOUNT,
            ServiceColumn.MARK_UP,
            ServiceColumn.TOTAL_BUGET,
          ],
        };
      });
    });
    builder.addCase(getServices.rejected, (state, action) => {
      state.servicesError = action.error.message ?? AN_ERROR_TRY_AGAIN;
    });
    builder.addCase(updateServiceSection.fulfilled, (state, action) => {
      // state.serviceSection = action.payload.service;
      state.servicesStatus = DataStatus.SUCCEEDED;
    });
    builder.addCase(updateServiceSection.rejected, (state, action) => {
      state.servicesError = action.error.message ?? AN_ERROR_TRY_AGAIN;
      state.servicesStatus = DataStatus.FAILED;
    });
    builder.addCase(createServiceSection.fulfilled, (state, action) => {
      state.servicesStatus = DataStatus.SUCCEEDED;
    });
    builder.addCase(createServiceSection.rejected, (state, action) => {
      state.servicesError = action.error.message ?? AN_ERROR_TRY_AGAIN;
      state.servicesStatus = DataStatus.FAILED;
    });
    builder.addCase(deleteSection.fulfilled, (state, action) => {
      state.servicesStatus = DataStatus.SUCCEEDED;
    });
    builder.addCase(deleteSection.rejected, (state, action) => {
      state.servicesError = action.error.message ?? AN_ERROR_TRY_AGAIN;
      state.servicesStatus = DataStatus.FAILED;
    });
  },
});

export const salesReducer = salesSlice.reducer;
export const { setColumn, reset, setRevenue } = salesSlice.actions;
