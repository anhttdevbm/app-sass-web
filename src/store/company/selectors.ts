import { ClientCompany } from "components/sn-client-companies/type";
import { DataStatus, Permission } from "constant/enums";
import { BaseQueries, Option } from "constant/types";
import { useCallback, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  CompanyData,
  EmployeeClientData,
  EmployeeData,
  GetEmployeeListQueries,
  InviteEmployeeData,
  PositionData,
  createClientCompany,
  createEmployee,
  createEmployeeClient,
  createPosition,
  createProjectType,
  deleteClientCompany,
  deleteEmployees,
  deletePosition,
  deleteProjectType,
  getClientCompanies,
  getClientCompaniesMemberOptions,
  getClientCompanyDetails,
  getCostHistory,
  getEmployeeOptions,
  getEmployees,
  getMyCompany,
  getPositionList,
  getProjectTypeList,
  inviteEmployee,
  multipleDeleteClientCompany,
  updateClientCompany,
  updateEmployee,
  updateMyCompany,
  updatePosition,
  updateProjectType,
} from "./actions";

export const useEmployees = () => {
  const dispatch = useAppDispatch();
  const {
    employees: items,
    employeesStatus: status,
    employeesError: error,
    employeesFilters: filters,
  } = useAppSelector((state) => state.company, shallowEqual);
  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.company.employeesPaging,
    shallowEqual,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetEmployees = useCallback(
    async (queries: GetEmployeeListQueries) => {
      await dispatch(getEmployees(queries));
    },
    [dispatch],
  );

  const onCreateEmployee = useCallback(
    async (data: EmployeeData) => {
      return await dispatch(createEmployee(data)).unwrap();
    },
    [dispatch],
  );

  const onInviteEmployee = useCallback(
    async (data: InviteEmployeeData) => {
      const response = await dispatch(inviteEmployee(data)).unwrap();
      await dispatch(getEmployees(filters));
      return response;
    },
    [dispatch, filters],
  );

  const onCreateEmployeeClient = useCallback(
    async (data: EmployeeClientData) => {
      return await dispatch(createEmployeeClient(data)).unwrap();
    },
    [dispatch],
  );

  const onUpdateEmployee = useCallback(
    async (id: string, position: string, roles: Permission[]) => {
      try {
        return await dispatch(updateEmployee({ id, position, roles })).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const onDeleteEmployees = useCallback(
    async (ids: string[]) => {
      try {
        return await dispatch(deleteEmployees(ids)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const clientEmployees = useMemo(
    () => items.filter((e) => !!e.client_company),
    [items],
  );

  return {
    items,
    clientEmployees,
    status,
    error,
    filters,
    isIdle,
    isFetching,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    onGetEmployees,
    onCreateEmployee,
    onInviteEmployee,
    onCreateEmployeeClient,
    onUpdateEmployee,
    onDeleteEmployees,
  };
};

export const useEmployeeOptions = () => {
  const dispatch = useAppDispatch();

  const {
    employeeOptions: items,
    employeeOptionsStatus: status,
    employeeOptionsError: error,
    employeeOptionsFilters: filters = {},
  } = useAppSelector((state) => state.company, shallowEqual);
  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.company.employeeOptionsPaging,
    shallowEqual,
  );

  const options: Option[] = useMemo(
    () =>
      items.map((item) => ({
        label: item.fullname,
        value: item.id,
        avatar: item?.avatar,
        subText: item.email,
      })),
    [items],
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetOptions = useCallback(
    (queries: GetEmployeeListQueries) => {
      dispatch(getEmployeeOptions(queries));
    },
    [dispatch],
  );

  return {
    items,
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

export const usePositions = () => {
  const dispatch = useAppDispatch();
  const {
    positions: items,
    positionsStatus: status,
    positionsError: error,
  } = useAppSelector((state) => state.company, shallowEqual);

  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.company.positionsPaging,
    shallowEqual,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetPositions = useCallback(
    async (queries: BaseQueries) => {
      await dispatch(getPositionList(queries));
    },
    [dispatch],
  );

  const onCreatePosition = useCallback(
    async (data: PositionData) => {
      return await dispatch(createPosition(data)).unwrap();
    },
    [dispatch],
  );

  const onUpdatePosition = useCallback(
    async (id: string, name: string) => {
      try {
        return await dispatch(updatePosition({ id, name })).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const onDeletePosition = useCallback(
    async (id: string) => {
      try {
        return await dispatch(deletePosition(id)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  return {
    items,
    status,
    isIdle,
    isFetching,
    error,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    onGetPositions,
    onCreatePosition,
    onUpdatePosition,
    onDeletePosition,
  };
};

export const useProjectTypes = () => {
  const dispatch = useAppDispatch();
  const {
    projectTypes: items,
    projectTypesStatus: status,
    projectTypesError: error,
  } = useAppSelector((state) => state.company, shallowEqual);

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);
  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.company.projectTypesPaging,
    shallowEqual,
  );

  const onGetProjectTypes = useCallback(
    async (queries: BaseQueries) => {
      await dispatch(getProjectTypeList(queries));
    },
    [dispatch],
  );

  const onCreateProjectType = useCallback(
    async (data: PositionData) => {
      return await dispatch(createProjectType(data)).unwrap();
    },
    [dispatch],
  );

  const onUpdateProjectType = useCallback(
    async (id: string, name: string) => {
      try {
        return await dispatch(updateProjectType({ id, name })).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const onDeleteProjectType = useCallback(
    async (id: string) => {
      try {
        return await dispatch(deleteProjectType(id)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  return {
    items,
    status,
    isIdle,
    isFetching,
    error,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    onGetProjectTypes,
    onCreateProjectType,
    onUpdateProjectType,
    onDeleteProjectType,
  };
};

export const useMyCompany = () => {
  const dispatch = useAppDispatch();
  const {
    myItem: item,
    myItemStatus: status,
    myItemError: error,
  } = useAppSelector((state) => state.company, shallowEqual);

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);
  const id = useMemo(() => item?.id, [item?.id]);

  const onGetCompany = useCallback(async () => {
    await dispatch(getMyCompany());
  }, [dispatch]);

  const onUpdateMyCompany = useCallback(
    async (data: CompanyData) => {
      try {
        return await dispatch(updateMyCompany(data)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  return {
    id,
    item,
    status,
    isIdle,
    isFetching,
    error,
    onGetCompany,
    onUpdateMyCompany,
  };
};

export const useCostHistory = () => {
  const dispatch = useAppDispatch();
  const {
    costHistories: items,
    costHistoriesStatus: status,
    costHistoriesError: error,
  } = useAppSelector((state) => state.company, shallowEqual);
  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.company.costHistoriesPaging,
    shallowEqual,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetCostHistory = useCallback(
    async (queries: BaseQueries) => {
      await dispatch(getCostHistory(queries));
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
    onGetCostHistory,
  };
};

export const useClientCompanies = () => {
  const dispatch = useAppDispatch();
  const {
    clientCompanies: items,
    clientCompaniesMemberOptions: options,
    clientCompaniesStatus: status,
    clientCompaniesError: error,
    clientCompaniesFilters: filters,
    clientCompaniesOptionsFilters: optionsFilters,
    clientCompanyDetail: detailItem,
  } = useAppSelector((state) => state.company, shallowEqual);
  const { pageIndex, pageSize, totalItems, totalPages } = useAppSelector(
    (state) => state.company.clientCompaniesPaging,
    shallowEqual,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetClientCompanies = useCallback(
    async (queries: BaseQueries) => {
      await dispatch(getClientCompanies(queries));
    },
    [dispatch],
  );

  const onGetMemberOptions = useCallback(
    async (queries: BaseQueries) => {
      await dispatch(getClientCompaniesMemberOptions(queries));
    },
    [dispatch],
  );

  const onCreateClientCompany = useCallback(
    async (data: ClientCompany) => {
      return await dispatch(createClientCompany(data)).unwrap();
    },
    [dispatch],
  );

  const onDeleteClientCompany = useCallback(
    async (id: string) => {
      try {
        return await dispatch(deleteClientCompany(id)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const onMultipleDeleteClientCompany = useCallback(
    async (ids: string[]) => {
      try {
        return await dispatch(multipleDeleteClientCompany(ids)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const onGetClientCompanyDetails = useCallback(
    async (id: string) => {
      await dispatch(getClientCompanyDetails(id));
    },
    [dispatch],
  );

  const onUpdateClientCompany = useCallback(
    async (data: ClientCompany) => {
      return await dispatch(updateClientCompany(data)).unwrap();
    },
    [dispatch],
  );

  return {
    items,
    status,
    error,
    filters,
    optionsFilters,
    isIdle,
    isFetching,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    options,
    detailItem,
    onGetClientCompanies,
    onGetMemberOptions,
    onCreateClientCompany,
    onDeleteClientCompany,
    onMultipleDeleteClientCompany,
    onGetClientCompanyDetails,
    onUpdateClientCompany,
  };
};
