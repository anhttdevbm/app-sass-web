import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  CompanyData,
  CompanyStatus,
  GetCompanyListQueries,
  GetEmployeeListQueries,
  GetStatementHistoryQueries,
  companyApproveOrReject,
  employeeApproveOrReject,
  getCompany,
  getCompanyList,
  getEmployeesOfCompany,
  getStatementHistory,
  updateCompany,
} from "./actions";
import { DataStatus, PayStatus } from "constant/enums";
import { useMemo, useCallback } from "react";
import { shallowEqual } from "react-redux";

export const useEmployeesOfCompany = () => {
  const dispatch = useAppDispatch();
  const {
    employees: items,
    employeesStatus: status,
    employeesError: error,
    employeesFilters: filters,
    employeesStatistic: statistic,
  } = useAppSelector((state) => state.manager, shallowEqual);
  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.manager.employeesPaging,
    shallowEqual,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetEmployees = useCallback(
    async (company: string, queries: GetEmployeeListQueries) => {
      await dispatch(getEmployeesOfCompany({ ...queries, company }));
    },
    [dispatch],
  );

  const onApproveOrReject = async (
    ids: string[],
    type: CompanyStatus,
    companyCode: string,
  ) => {
    try {
      return await dispatch(
        employeeApproveOrReject({ ids, type, companyCode }),
      ).unwrap();
    } catch (error) {
      throw error;
    }
  };

  return {
    items,
    status,
    error,
    filters,
    isIdle,
    isFetching,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    statistic,
    onGetEmployees,
    onApproveOrReject,
  };
};

export const useCompany = () => {
  const dispatch = useAppDispatch();
  const {
    company: item,
    companyStatus: status,
    companyError: error,
  } = useAppSelector((state) => state.manager, shallowEqual);

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetCompany = useCallback(
    async (id: string) => {
      await dispatch(getCompany(id));
    },
    [dispatch],
  );

  const onUpdateCompany = useCallback(
    async (id: string, data: CompanyData) => {
      console.log('Update∆')
      try {
        return await dispatch(updateCompany({ id, ...data })).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  return {
    item,
    status,
    isIdle,
    isFetching,
    error,
    onGetCompany,
    onUpdateCompany,
  };
};

export const useCompanies = () => {
  const dispatch = useAppDispatch();
  const {
    companies: items,
    companiesStatus: status,
    companiesError: error,
    companiesFilters: filters,
    companiesStatistic: statistic,
  } = useAppSelector((state) => state.manager, shallowEqual);
  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.manager.companiesPaging,
    shallowEqual,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetCompanies = useCallback(
    async (queries: GetCompanyListQueries) => {
      await dispatch(getCompanyList(queries));
    },
    [dispatch],
  );

  const onApproveOrReject = async (ids, type: CompanyStatus) => {
    try {
      return await dispatch(companyApproveOrReject({ ids, type })).unwrap();
    } catch (error) {
      throw error;
    }
  };

  return {
    items,
    status,
    error,
    filters,
    isIdle,
    isFetching,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    statistic,
    onGetCompanies,
    onApproveOrReject,
  };
};

export const useCompanyOptions = () => {
  const dispatch = useAppDispatch();

  const {
    companyOptions: options,
    companyOptionsStatus: status,
    companyOptionsError: error,
    companyOptionsFilters: filters = {},
  } = useAppSelector((state) => state.manager, shallowEqual);
  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.manager.companyOptionsPaging,
    shallowEqual,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetOptions = useCallback(
    (queries: GetCompanyListQueries) => {
      dispatch(getCompanyList({ concat: true, ...queries }));
    },
    [dispatch],
  );

  return {
    options,
    status,
    error,
    isIdle,
    isFetching,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    filters,
    onGetOptions,
  };
};

export const useStatementHistory = () => {
  const dispatch = useAppDispatch();
  const {
    statementHistories: items,
    statementHistoriesStatus: status,
    statementHistoriesError: error,
    statementHistoriesFilters: filters,
  } = useAppSelector((state) => state.manager, shallowEqual);
  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.manager.statementHistoriesPaging,
    shallowEqual,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetStatementHistory = useCallback(
    async (queries: GetStatementHistoryQueries) => {
      await dispatch(getStatementHistory(queries));
    },
    [dispatch],
  );

  return {
    items,
    status,
    error,
    isIdle,
    isFetching,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    filters,
    onGetStatementHistory,
  };
};
