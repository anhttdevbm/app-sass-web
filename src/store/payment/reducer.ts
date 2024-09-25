import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getAccountBillOwner,
  getAllAccountAdmin,
  getAllTransaction,
  getListAccounts,
} from "./actions";

export interface AccountType {
  id: number;
  fullname: string;
  email: string;
  roles: string;
  packageName: string;
  expiration_date: string;
  renewal_date: string;
}
interface AvatarType {
  object: string;
  name: string;
  link: string;
}
interface AccountAdminType {
  fullname: string;
  email: string;
  avatar: AvatarType;
  roles: string;
}
export interface TransactionType {
  billing_plan: string;
  created_time: string;
  email: string;
  id: string;
  packageName: string;
  status: string;
  total_amount: string;
  type: string;
  _id: string;
}

interface DataState<T> {
  data: T[];
  total?: number;
  totalPage: number;
  loading: boolean;
  error: string | null;
}

interface RootState {
  accounts: DataState<AccountType>;
  transactions: DataState<TransactionType>;
  listAccountAdmin: DataState<AccountAdminType>;
}

const initialState: RootState = {
  accounts: { data: [], total: 0, totalPage: 0, loading: false, error: null },
  transactions: {
    data: [],
    total: 0,
    totalPage: 0,
    loading: false,
    error: null,
  },
  listAccountAdmin: { data: [], totalPage: 0, loading: false, error: null },
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListAccounts.pending, (state) => {
        state.accounts.loading = true;
        state.accounts.error = null;
      })
      .addCase(
        getListAccounts.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: AccountType[];
            total: number;
            total_page: number;
          }>,
        ) => {
          state.accounts.loading = false;
          state.accounts.total = action.payload.total;
          state.accounts.data = action.payload.data;
          state.accounts.totalPage = action.payload.total_page;
        },
      )
      .addCase(getListAccounts.rejected, (state, action) => {
        state.accounts.loading = false;
        state.accounts.error =
          action.error.message || "Failed to fetch accounts";
      })
      // transsaction
      .addCase(getAllTransaction.pending, (state) => {
        state.transactions.loading = true;
        state.transactions.error = null;
      })
      .addCase(
        getAllTransaction.fulfilled,
        (
          state,
          action: PayloadAction<{ data: TransactionType[]; total: number }>,
        ) => {
          state.transactions.loading = false;
          state.transactions.data = action.payload.data;
          state.transactions.total = action.payload.total;
        },
      )
      .addCase(getAllTransaction.rejected, (state, action) => {
        state.transactions.loading = false;
        state.transactions.error =
          action.error.message || "Failed to fetch accounts";
      })
      // GET ALL ACCOUNT  ADMIN
      .addCase(getAllAccountAdmin.pending, (state) => {
        state.listAccountAdmin.loading = true;
        state.listAccountAdmin.error = null;
      })
      .addCase(
        getAllAccountAdmin.fulfilled,
        (state, action: PayloadAction<AccountAdminType[]>) => {
          state.listAccountAdmin.loading = false;
          state.listAccountAdmin.data = action.payload;
        },
      )
      .addCase(getAllAccountAdmin.rejected, (state, action) => {
        state.listAccountAdmin.loading = false;
        state.listAccountAdmin.error =
          action.error.message || "Failed to fetch accounts";
      });
  },
});

export default paymentSlice.reducer;
