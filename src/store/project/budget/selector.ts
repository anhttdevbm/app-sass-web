import { DataStatus } from "constant/enums";
import { useCallback, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  createProjectBudget,
  deleteProjectBudget,
  getProjectBudgetList,
  TBudgetCreateParam,
  TBudgetListQueries,
  TBudgetUpdateParam,
  updateProjectBudget,
} from "store/project/budget/action";

export const useBudgets = () => {
  const dispatch = useAppDispatch();

  const { budgets, budgetStatus, budgetError, budgetFilters } = useAppSelector(
    (state) => state.project,
    shallowEqual,
  );

  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.project.budgetPaging,
    shallowEqual,
  );

  const isIdle = useMemo(
    () => budgetStatus === DataStatus.IDLE,
    [budgetStatus],
  );

  const isFetching = useMemo(
    () => budgetStatus === DataStatus.LOADING,
    [budgetStatus],
  );

  const triggerGetProjectBudget = useCallback(
    async (queries?: TBudgetListQueries) =>
      await dispatch(getProjectBudgetList(queries ?? {})),
    [dispatch],
  );

  const triggerCreateProjectBudget = useCallback(
    async (data: TBudgetCreateParam) =>
      await dispatch(createProjectBudget(data)).unwrap(),
    [dispatch],
  );

  const triggerDeleteProjectBudget = useCallback(
    async (id: string) =>
      await dispatch(deleteProjectBudget(id)).unwrap(),
    [dispatch],
  );

  const triggerUpdateProjectBudget = useCallback(
    async (budgetId: string, data: Partial<TBudgetUpdateParam>) =>
      await dispatch(updateProjectBudget({ budgetId, data })).unwrap(),
    [dispatch],
  );

  return {
    items: budgets,
    status: budgetStatus,
    error: budgetError,
    filters: budgetFilters,
    get: triggerGetProjectBudget,
    create: triggerCreateProjectBudget,
    update: triggerUpdateProjectBudget,
    delete: triggerDeleteProjectBudget,
    isIdle,
    isFetching,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
  };
};
