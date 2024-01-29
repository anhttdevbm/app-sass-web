import { createSlice } from "@reduxjs/toolkit";
import { TBudgetExpense } from "./actions";

export interface BudgetExpenseState {
  selectedExpenses?: TBudgetExpense[];
};

const initialState: BudgetExpenseState = {
  selectedExpenses: []
};

const budgetExpense = createSlice({
  name: 'budgetExpense',
  initialState,
  reducers: {
    reset: () => initialState,
    setSelectedExpenses: (state, action) => {
      state.selectedExpenses = action.payload;
    }
  }
})

export const { reset, setSelectedExpenses } = budgetExpense.actions
export default budgetExpense.reducer