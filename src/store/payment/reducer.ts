import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAllTransaction, getListAccounts } from "./actions";

interface AccountType {
  id: number;
  fullname: string;
  email: string;
  roles: string;
  packageName: string;
  expirationDate: string;
}

interface TransactionType {
  id: number;
  name: string;
  email: string;
  role: string;
  package: string;
  expirationDate: string;
}

interface DataState<T> {
  data: T[];
  total: number;
  loading: boolean;
  error: string | null;
}

interface RootState {
  accounts: DataState<AccountType>;
  transactions: DataState<TransactionType>;
}

const initialState: RootState = {
  accounts: { data: [], total: 0, loading: false, error: null },
  transactions: { data: [], total: 0, loading: false, error: null },
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
          action: PayloadAction<{ data: AccountType[]; total: number }>,
        ) => {
          state.accounts.loading = false;
          state.accounts.data = action.payload.data;
          state.accounts.total = action.payload.total;
        },
      )
      .addCase(getListAccounts.rejected, (state, action) => {
        state.accounts.loading = false;
        state.accounts.error =
          action.error.message || "Failed to fetch accounts";
      });
  },
});

export default paymentSlice.reducer;
