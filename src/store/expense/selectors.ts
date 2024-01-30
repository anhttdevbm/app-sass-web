import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { TBudgetExpense } from "./actions";
import { setSelectedExpenses } from "./reducer";

export const useBudgetExpense = () => {
  const dispatch = useAppDispatch();

  const { selectedExpenses } = useAppSelector((state) => state.budgetExpense)

  const onSetSelectedExpenses = useCallback(async (selectedExpenses: TBudgetExpense[]) => {
    return dispatch(setSelectedExpenses(selectedExpenses));
  }, [dispatch]);

  return {
    selectedExpenses,
    onSetSelectedExpenses
  }
};