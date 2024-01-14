import { DataStatus } from "constant/enums";
import { useCallback, useEffect, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  BillingData,
  BillingDataExport,
  GetBillingListQueries,
  GetBudgetListQueries,
  addUserToBilling,
  createBilling,
  createCommentBilling,
  downloadPdfBilling,
  exportBilling,
  exportBillingQueries,
  getBillingDetail,
  getBillingList,
  getBudgetDetail,
  getBudgetList,
  getCommentBilling,
  getServiceBudget,
  updateBilling,
  viewPdfBilling,
} from "./actions";
import { BillingCommentData, BillingDataUpdate, Service } from "./reducer";
import { IOptionStructure } from "components/shared/TextFieldSelect";
import { usePositions } from "store/company/selectors";
import { useTranslations } from "next-intl";
import { NS_COMMON } from "constant/index";
import _ from "lodash";
import { da } from "date-fns/locale";

export const useBillings = () => {
  const dispatch = useAppDispatch();
  const {
    items,
    status,
    error,
    filters,
    item,
    createStatus,
    updateStatus,
    dataComment,
    fileExport,
    dataExport,
    totalAmount,
    totalAmountUnpaid,
    addUserStatus,
  } = useAppSelector((state) => state.billing, shallowEqual);
  const { page, size, totalItems, total_page } = useAppSelector(
    (state) => state.billing.paging,
    shallowEqual,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetBillings = useCallback(
    async (queries: GetBillingListQueries) => {
      await dispatch(getBillingList(queries));
    },
    [dispatch],
  );

  const onCreateBilling = useCallback(
    async (data: BillingData) => {
      return await dispatch(createBilling(data)).unwrap();
    },
    [dispatch],
  );
  const onUpdateBilling = useCallback(
    async (data: BillingDataUpdate) => {
      return await dispatch(updateBilling(data)).unwrap();
    },
    [dispatch],
  );

  const onCreateCommentBilling = useCallback(
    async (data: BillingCommentData) => {
      return await dispatch(createCommentBilling(data));
    },
    [dispatch],
  );

  const onGetCommentBilling = useCallback(
    async (id: string) => {
      return await dispatch(getCommentBilling(id));
    },
    [dispatch],
  );

  const onGetBilling = useCallback(
    async (id: string) => {
      return await dispatch(getBillingDetail(id));
    },
    [dispatch],
  );
  const onExportBilling = useCallback(
    async (queries: exportBillingQueries, data: BillingDataExport) => {
      return await dispatch(exportBilling({ queries, data }));
    },
    [dispatch],
  );
  const onDownloadFileBilling = useCallback(
    async (queries: exportBillingQueries, data: BillingDataExport) => {
      return await dispatch(downloadPdfBilling({ queries, data }));
    },
    [dispatch],
  );
  const onViewFileBilling = useCallback(
    async (queries: exportBillingQueries, data: BillingDataExport) => {
      return await dispatch(viewPdfBilling({ queries, data }));
    },
    [dispatch],
  );

  const onAddUserToBilling = useCallback(
    async (id: string, userId: string) => {
      return await dispatch(addUserToBilling({ id, userId }));
    },
    [dispatch],
  );
  //   const onUpdateProject = useCallback(
  //     async (id: string, data: Partial<ProjectData>) => {
  //       try {
  //         return await dispatch(updateProject({ id, ...data })).unwrap();
  //       } catch (error) {
  //         throw error;
  //       }
  //     },
  //     [dispatch],
  //   );

  return {
    items,
    item,
    status,
    error,
    filters,
    isIdle,
    isFetching,
    page,
    size,
    totalItems,
    total_page,
    createStatus,
    updateStatus,
    dataComment,
    fileExport,
    dataExport,
    totalAmount,
    totalAmountUnpaid,
    addUserStatus,
    onGetBillings,
    onCreateBilling,
    onUpdateBilling,
    onGetBilling,
    onCreateCommentBilling,
    onGetCommentBilling,
    onExportBilling,
    onDownloadFileBilling,
    onViewFileBilling,
    onAddUserToBilling,
  };
};

export const useBudgets = () => {
  const dispatch = useAppDispatch();
  const { budgets, status, error, filters, budgetDetail } = useAppSelector(
    (state) => state.billing,
    shallowEqual,
  );
  const { page, size, totalItems, total_page } = useAppSelector(
    (state) => state.billing.paging,
    shallowEqual,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetBudgets = useCallback(
    async (queries: GetBudgetListQueries) => {
      await dispatch(getBudgetList(queries));
    },
    [dispatch],
  );

  const onGetBudgetDetail = useCallback(
    async (id: string) => {
      await dispatch(getBudgetDetail(id));
    },
    [dispatch],
  );

  //   const onCreateProject = useCallback(
  //     async (data: ProjectData) => {
  //       return await dispatch(createProject(data)).unwrap();
  //     },
  //     [dispatch],
  //   );

  //   const onUpdateProject = useCallback(
  //     async (id: string, data: Partial<ProjectData>) => {
  //       try {
  //         return await dispatch(updateProject({ id, ...data })).unwrap();
  //       } catch (error) {
  //         throw error;
  //       }
  //     },
  //     [dispatch],
  //   );

  return {
    budgets,
    status,
    error,
    filters,
    isIdle,
    isFetching,
    page,
    size,
    totalItems,
    total_page,
    budgetDetail,
    onGetBudgets,
    onGetBudgetDetail,
  };
};

const dataSection = new Array<any>();
export const useServiceBudgets = () => {
  const dispatch = useAppDispatch();
  const arrService = new Array<Service>();

  const { serviceBudgets, status, error, filters, dataServices } =
    useAppSelector((state) => state.billing, shallowEqual);

  const onGetServiceBudgets = useCallback(
    async (id: string) => {
      await dispatch(getServiceBudget(id));
    },
    [dispatch],
  );
  if (serviceBudgets && serviceBudgets?.length > 0) {
    dataSection.push(...serviceBudgets);
  }

  if (dataSection && dataSection?.length > 0) {
    const dataService = new Array<Service>();
    const filterService = new Set<string>();
    dataSection?.map((item) => {
      if (item.services && item.services?.length > 0) {
        item.services?.map((sev: Service) => {
          if (!filterService.has(sev?.id)) {
            filterService.add(sev?.id);
            dataService.push(sev);
          }
        });
      }
    });

    arrService?.push(...dataService);
  }

  const sumAmount = arrService?.reduce((prev, item) => {
    return prev + item.price;
  }, 0);

  //   const onUpdateProject = useCallback(
  //     async (id: string, data: Partial<ProjectData>) => {
  //       try {
  //         return await dispatch(updateProject({ id, ...data })).unwrap();
  //       } catch (error) {
  //         throw error;
  //       }
  //     },
  //     [dispatch],
  //   );

  return {
    arrService,
    sumAmount,
    onGetServiceBudgets,
  };
};

export const useFetchOptions = () => {
  const { onGetPositions } = usePositions();

  useEffect(() => {
    // onGetProjects({ pageSize: -1, pageIndex: 0 });
    onGetPositions({ pageSize: -1, pageIndex: 0 });
  }, []);
};

const useGetOptions = () => {
  // const [projectOptions, setProjectOptions] = useState<IOptionStructure[]>([]);
  // const [positionOptions, setPositionOptions] = useState<IOptionStructure[]>(
  //   [],
  useFetchOptions();
  const { items: positions, onGetPositions } = usePositions();
  const commonT = useTranslations(NS_COMMON);
  // const projectOptions: IOptionStructure[] = useMemo(() => {
  //   if (!_.isEmpty(projects)) {
  //     const resolveProjects = _.map(projects, (project) => {
  //       return {
  //         label: project?.name,
  //         value: project?.id,
  //       };
  //     });
  //     return resolveProjects;
  //   }
  //   return [];
  // }, [JSON.stringify(projects)]);

  const positionOptions: IOptionStructure[] = useMemo(() => {
    if (!_.isEmpty(positions)) {
      const resolvePositions = _.map(positions, (position) => {
        return {
          label: position?.name,
          value: position?.id,
        };
      });
      return resolvePositions;
    }
    return [];
  }, [JSON.stringify(positions)]);

  return {
    positionOptions,
    onGetPositions,
  };
};
export default useGetOptions;

// export const useProject = () => {
//   const dispatch = useAppDispatch();
//   const {
//     item,
//     itemStatus: status,
//     itemError: error,
//   } = useAppSelector((state) => state.project, shallowEqual);

//   const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
//   const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

//   const onGetProject = useCallback(
//     async (id: string) => {
//       await dispatch(getProject(id));
//     },
//     [dispatch],
//   );

//   return {
//     item,
//     status,
//     error,
//     isIdle,
//     isFetching,
//     onGetProject,
//   };
// };
