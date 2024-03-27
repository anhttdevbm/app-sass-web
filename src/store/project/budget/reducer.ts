import { ActionReducerMapBuilder } from "@reduxjs/toolkit/src/mapBuilders";
import { ProjectState } from "store/project/reducer";
import { DataStatus } from "constant/enums";
import { PayloadAction } from "@reduxjs/toolkit";
import { ItemListResponse } from "constant/types";
import { AN_ERROR_TRY_AGAIN } from "constant/index";
import {
  createProjectBudget,
  getProjectBudgetList,
} from "store/project/budget/action";

export const BudgetReducer = (
  builder: ActionReducerMapBuilder<ProjectState>,
) => {
  // add case for getProjectBudgetList
  builder.addCase(getProjectBudgetList.pending, (state, { meta: { arg } }) => {
    state.budgetStatus = DataStatus.LOADING;
  });
  builder.addCase(
    getProjectBudgetList.fulfilled,
    (state, action: PayloadAction<ItemListResponse>) => {
      const { items, ...paging } = action.payload;
      state.budgets = items;
      state.budgetStatus = DataStatus.SUCCEEDED;
      state.budgetError = undefined;
      state.budgetPaging = Object.assign(state.budgetPaging, paging);
    },
  );
  builder.addCase(getProjectBudgetList.rejected, (state, { error }) => {
    state.budgetStatus = DataStatus.FAILED;
    state.budgetError = error?.message ?? AN_ERROR_TRY_AGAIN;
  });

  // add case for
  builder.addCase(createProjectBudget.pending, (state, { meta: { arg } }) => {
    state.budgetStatus = DataStatus.LOADING;
  });
  builder.addCase(
    createProjectBudget.fulfilled,
    (state, action: PayloadAction<any>) => {
      // const { items, ...paging } = action.payload;
      // state.budgets = items;
      state.budgetStatus = DataStatus.SUCCEEDED;
      state.budgetError = undefined;
      // state.budgetPaging = Object.assign(state.budgetPaging, paging);
    },
  );
  builder.addCase(createProjectBudget.rejected, (state, { error }) => {
    state.budgetStatus = DataStatus.FAILED;
    state.budgetError = error?.message ?? AN_ERROR_TRY_AGAIN;
  });
};
