import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  companyApproveOrReject,
  employeeApproveOrReject,
  getCompany,
  getCompanyList,
  GetCompanyListQueries,
  GetEmployeeListQueries,
  getEmployeesOfCompany,
  getStatementHistory,
  GetStatementHistoryQueries,
  updateCompany,
} from "./actions";
import { BaseQueries, ItemListResponse, Option, Paging } from "constant/types";
import { DataStatus } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, DEFAULT_PAGING } from "constant/index";
import { getFiltersFromQueries, removeDuplicateItem } from "utils/index";

import { Employee, Company } from "store/company/reducer";

export interface StatementHistory {
  id: string;
  date_of_payment: string;
  expired_date: string;
  name: string;
  number_of_paid: number;
  number_of_unpaid: number;
  total_account: number;
  amount_of_money: number;
}

type CompaniesStatistic = {
  total_company?: number;
  total_company_paid?: number;
};

type EmployeesOfCompanyStatistic = {
  total_user_paid?: number;
  total_user_un_paid?: number;
};

export interface ManagerState {
  employees: Employee[];
  employeesStatus: DataStatus;
  employeesPaging: Paging;
  employeesError?: string;
  employeesFilters: Omit<GetEmployeeListQueries, "pageIndex" | "pageSize">;
  employeesStatistic?: EmployeesOfCompanyStatistic;

  companies: Company[];
  companiesStatus: DataStatus;
  companiesPaging: Paging;
  companiesError?: string;
  companiesFilters: Omit<GetCompanyListQueries, "pageIndex" | "pageSize">;
  companiesStatistic?: CompaniesStatistic;

  companyOptions: Option[];
  companyOptionsStatus: DataStatus;
  companyOptionsPaging: Paging;
  companyOptionsError?: string;
  companyOptionsFilters: Omit<BaseQueries, "pageIndex" | "pageSize">;

  company?: Company;
  companyStatus: DataStatus;
  companyError?: string;

  statementHistories: StatementHistory[];
  statementHistoriesStatus: DataStatus;
  statementHistoriesPaging: Paging;
  statementHistoriesError?: string;
  statementHistoriesFilters: Omit<
    GetStatementHistoryQueries,
    "pageIndex" | "pageSize"
  >;
}

const initialState: ManagerState = {
  employees: [],
  employeesStatus: DataStatus.IDLE,
  employeesPaging: DEFAULT_PAGING,
  employeesFilters: {},

  companyStatus: DataStatus.IDLE,

  companies: [],
  companiesStatus: DataStatus.IDLE,
  companiesPaging: DEFAULT_PAGING,
  companiesFilters: {},

  companyOptions: [],
  companyOptionsStatus: DataStatus.IDLE,
  companyOptionsPaging: DEFAULT_PAGING,
  companyOptionsFilters: {},

  statementHistories: [],
  statementHistoriesStatus: DataStatus.IDLE,
  statementHistoriesPaging: DEFAULT_PAGING,
  statementHistoriesFilters: {},
};

const managerSlice = createSlice({
  name: "manager",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) =>
    builder
      .addCase(getEmployeesOfCompany.pending, (state, action) => {
        state.employeesStatus = DataStatus.LOADING;
        state.employeesFilters = getFiltersFromQueries(action.meta.arg);

        state.employeesPaging.pageIndex = Number(
          action.meta.arg.pageIndex ?? DEFAULT_PAGING.pageIndex,
        );
        state.employeesPaging.pageSize = Number(
          action.meta.arg.pageSize ?? DEFAULT_PAGING.pageSize,
        );
      })
      .addCase(
        getEmployeesOfCompany.fulfilled,
        (
          state,
          action: PayloadAction<ItemListResponse & EmployeesOfCompanyStatistic>,
        ) => {
          const { items, total_user_paid, total_user_un_paid, ...paging } =
            action.payload;

          state.employees = items as Employee[];
          state.employeesStatus = DataStatus.SUCCEEDED;
          state.employeesError = undefined;
          state.employeesPaging = Object.assign(state.employeesPaging, paging);

          state.employeesStatistic = {
            total_user_paid,
            total_user_un_paid,
          };
        },
      )
      .addCase(getEmployeesOfCompany.rejected, (state, action) => {
        state.employees = [];
        state.employeesStatus = DataStatus.FAILED;
        state.employeesError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })

      .addCase(getCompany.pending, (state) => {
        state.companyStatus = DataStatus.LOADING;
      })
      .addCase(
        getCompany.fulfilled,
        (state, action: PayloadAction<Company>) => {
          state.company = action.payload;
          state.companyStatus = DataStatus.SUCCEEDED;
          state.companyError = undefined;
        },
      )
      .addCase(getCompany.rejected, (state, action) => {
        state.company = undefined;
        state.companyStatus = DataStatus.FAILED;
        state.companyError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })
      .addCase(
        updateCompany.fulfilled,
        (state, action: PayloadAction<Company>) => {
          if (state?.company?.id === action.payload.id) {
            state.company = action.payload;
          }
        },
      )
      .addCase(getCompanyList.pending, (state, action) => {
        const prefixKey = action.meta.arg["concat"]
          ? "companyOptions"
          : "companies";

        state[`${prefixKey}Status`] = DataStatus.LOADING;
        state[`${prefixKey}Filters`] = getFiltersFromQueries(action.meta.arg);

        if (action.meta.arg?.concat && action.meta.arg.pageIndex === 1) {
          state.companyOptions = [];
        }
        state[`${prefixKey}Paging`].pageIndex = Number(
          action.meta.arg.pageIndex ?? DEFAULT_PAGING.pageIndex,
        );
        state[`${prefixKey}Paging`].pageSize = Number(
          action.meta.arg.pageSize ?? DEFAULT_PAGING.pageSize,
        );
      })
      .addCase(
        getCompanyList.fulfilled,
        (
          state,
          action: PayloadAction<ItemListResponse & CompaniesStatistic>,
        ) => {
          const {
            items,
            concat,
            total_company,
            total_company_paid,
            ...paging
          } = action.payload;

          if (concat) {
            const newOptions = (items as Company[]).map((item) => ({
              label: item.name,
              value: item.id,
            }));
            state.companyOptions = removeDuplicateItem(
              state.companyOptions.concat(newOptions),
              "value",
            );
          } else {
            state.companies = items as Company[];
            state.companiesStatistic = {
              total_company,
              total_company_paid,
            };
          }

          const prefixKey = concat ? "companyOptions" : "companies";

          state[`${prefixKey}Status`] = DataStatus.SUCCEEDED;
          state[`${prefixKey}Error`] = undefined;
          state[`${prefixKey}Paging`] = Object.assign(
            state[`${prefixKey}Paging`],
            paging,
          );
        },
      )
      .addCase(getCompanyList.rejected, (state, action) => {
        const prefixKey = action.meta.arg["concat"]
          ? "companyOptions"
          : "companies";
        if (!action.meta.arg["concat"]) {
          state.companiesStatistic = undefined;
        }

        state[`${prefixKey}Status`] = DataStatus.FAILED;
        state[`${prefixKey}Error`] =
          action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })

      .addCase(getStatementHistory.pending, (state, action) => {
        state.statementHistoriesStatus = DataStatus.LOADING;

        state.statementHistoriesFilters = getFiltersFromQueries(
          action.meta.arg,
        );

        state.statementHistoriesPaging.pageIndex = Number(
          action.meta.arg.pageIndex ?? DEFAULT_PAGING.pageIndex,
        );
        state.statementHistoriesPaging.pageSize = Number(
          action.meta.arg.pageSize ?? DEFAULT_PAGING.pageSize,
        );
      })
      .addCase(
        getStatementHistory.fulfilled,
        (state, action: PayloadAction<ItemListResponse>) => {
          const { items, ...paging } = action.payload;
          state.statementHistories = items as StatementHistory[];
          state.statementHistoriesStatus = DataStatus.SUCCEEDED;
          state.statementHistoriesError = undefined;
          state.statementHistoriesPaging = Object.assign(
            state.statementHistoriesPaging,
            paging,
          );
        },
      )
      .addCase(getStatementHistory.rejected, (state, action) => {
        state.statementHistories = [];
        state.statementHistoriesStatus = DataStatus.FAILED;
        state.statementHistoriesError =
          action.error?.message ?? AN_ERROR_TRY_AGAIN;
      })
      .addCase(companyApproveOrReject.fulfilled, (state, action) => {
        state.companies = state.companies.map((item) => {
          if (action.payload.includes(item.id)) {
            return { ...item, is_approve: Boolean(action.meta.arg.type) };
          }
          return item;
        });
      })
      .addCase(employeeApproveOrReject.fulfilled, (state, action) => {
        state.employees = state.employees.map((item) => {
          if (action.payload.includes(item.id)) {
            return { ...item, approve: Boolean(action.meta.arg.type) };
          }
          return item;
        });
      }),
});

export const { reset } = managerSlice.actions;

export default managerSlice.reducer;
