import { DataStatus } from "constant/enums";
import { useCallback, useEffect, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  addPayment,
  addUserToBilling,
  BillingData,
  BillingDataExport,
  BillingDataMark,
  BillPaymentData,
  BillTagData,
  createBilling,
  createCommentBilling,
  deleteBilling,
  deletePayment,
  downloadPdfBilling,
  exportBilling,
  exportBillingQueries,
  getBillingClientDetail,
  getBillingDetail,
  getBillingList,
  GetBillingListQueries,
  getBudgetDetail,
  getBudgetFilterList,
  getBudgetList,
  GetBudgetListQueries,
  getCommentBilling,
  getPaymentByBillId,
  getServiceBudget,
  getTags,
  markAsSendBilling,
  setShowEditClient,
  updateBilling,
  updateClientBill,
  updatePayment,
  updateTagBill,
  viewPdfBilling,
} from "./actions";
import { BillingCommentData, BillingDataUpdate, Service, Tag } from "./reducer";
import { usePositions } from "store/company/selectors";
import { Option } from "constant/types";

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
    markAsSend,
    isDeleted,
    isUpdateTagBill,
    dataPayment,
    isAddPayment,
    isUpdatePayment,
    isDeletedPayment,
    billingClientDetail,
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
    async (id: string, param: string) => {
      return await dispatch(getCommentBilling({ id, param }));
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

  const onMarkAsSentBilling = useCallback(
    async (id: string, data: BillingDataMark) => {
      return await dispatch(markAsSendBilling({ id, data }));
    },
    [dispatch],
  );

  const onDeleteBilling = useCallback(
    async (id: string) => {
      return await dispatch(deleteBilling({ id }));
    },
    [dispatch],
  );

  const onUpdateTagBilling = useCallback(
    async (id: string, data: BillTagData) => {
      return await dispatch(updateTagBill({ id, data }));
    },
    [dispatch],
  );
  const onGetPayments = useCallback(
    async (id: string) => {
      return await dispatch(getPaymentByBillId({ id }));
    },
    [dispatch],
  );
  const onUpdatePayment = useCallback(
    async (id: string, data: BillPaymentData) => {
      return await dispatch(updatePayment({ id, data }));
    },
    [dispatch],
  );
  const onAddPayment = useCallback(
    async (id: string, data: BillPaymentData) => {
      return await dispatch(addPayment({ id, data }));
    },
    [dispatch],
  );
  const onDeletePayment = useCallback(
    async (id: string) => {
      return await dispatch(deletePayment({ id }));
    },
    [dispatch],
  );

  const onGetBillingDetail = useCallback(
    async (id: string) => {
      return await dispatch(getBillingClientDetail({ id }));
    },
    [dispatch],
  );

  const onDeleteManyBillings = useCallback(
    async (ids: string[]) => {
      return dispatch(deleteBilling({ id: ids.join(",") }));
    },
    [dispatch],
  );

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
    markAsSend,
    isDeleted,
    isUpdateTagBill,
    dataPayment,
    isAddPayment,
    isUpdatePayment,
    isDeletedPayment,
    billingClientDetail,
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
    onMarkAsSentBilling,
    onDeleteBilling,
    onUpdateTagBilling,
    onGetPayments,
    onAddPayment,
    onUpdatePayment,
    onDeletePayment,
    onGetBillingDetail,
    onDeleteManyBillings,
  };
};

export const useBudgets = () => {
  const dispatch = useAppDispatch();
  const { budgets, status, error, filters, budgetDetail, budgetFilter } =
    useAppSelector((state) => state.billing, shallowEqual);
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

  const onGetBudgetFilters = useCallback(
    async (queries: GetBudgetListQueries) => {
      await dispatch(getBudgetFilterList(queries));
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
    budgetFilter,
    onGetBudgets,
    onGetBudgetDetail,
    onGetBudgetFilters,
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

// const useGetOptions = () => {
//   // const [projectOptions, setProjectOptions] = useState<IOptionStructure[]>([]);
//   // const [positionOptions, setPositionOptions] = useState<IOptionStructure[]>(
//   //   [],
//   useFetchOptions();
//   const { items: positions, onGetTags } = useStags();
//   const commonT = useTranslations(NS_COMMON);
//   // const projectOptions: IOptionStructure[] = useMemo(() => {
//   //   if (!_.isEmpty(projects)) {
//   //     const resolveProjects = _.map(projects, (project) => {
//   //       return {
//   //         label: project?.name,
//   //         value: project?.id,
//   //       };
//   //     });
//   //     return resolveProjects;
//   //   }
//   //   return [];
//   // }, [JSON.stringify(projects)]);

//   const positionOptions: IOptionStructure[] = useMemo(() => {
//     if (!_.isEmpty(positions)) {
//       const resolvePositions = _.map(positions, (position) => {
//         return {
//           label: position?.name,
//           value: position?.id,
//         };
//       });
//       return resolvePositions;
//     }
//     return [];
//   }, [JSON.stringify(positions)]);

//   return {
//     positionOptions,
//     onGetTags,
//   };
// };
// export default useGetOptions;

export const usePayment = () => {
  const dispatch = useAppDispatch();
  const {
    item,
    itemStatus: status,
    itemError: error,
  } = useAppSelector((state) => state.billing, shallowEqual);

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetPayment = useCallback(
    async (id: string) => {
      await dispatch(getPaymentByBillId({ id }));
    },
    [dispatch],
  );

  return {
    item,
    status,
    error,
    isIdle,
    isFetching,
    onGetPayment,
  };
};

export const useTags = () => {
  const dispatch = useAppDispatch();
  const {
    dataTag,
    itemStatus: status,
    itemError: error,
  } = useAppSelector((state) => state.billing, shallowEqual);
  const [tagsOptions, setTagsOptions] = useState<Option[]>([]);

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetTags = useCallback(async () => {
    await dispatch(getTags());
  }, [dispatch]);

  useEffect(() => {
    if (dataTag && dataTag?.length > 0) {
      const options = dataTag?.map((tag: Tag) => ({
        label: tag?.name ?? "",
        value: tag?.id ?? "",
      }));
      setTagsOptions(options);
    }
  }, [dataTag]);

  return {
    tagsOptions,
    status,
    error,
    isIdle,
    isFetching,
    onGetTags,
  };
};

export const useClientBill = () => {
  const dispatch = useAppDispatch();
  const { isShowEditClient } = useAppSelector(
    (state) => state.billing,
    shallowEqual,
  );

  const onUpdateClientId = useCallback(
    async (id?: string, clientId?: string) => {
      await dispatch(updateClientBill({ id, clientId }));
    },
    [dispatch],
  );

  const onSetShowEditClient = useCallback(
    async (value: boolean) => {
      console.log(value);
      await dispatch(setShowEditClient(value));
    },
    [dispatch],
  );

  return {
    onUpdateClientId,
    isShowEditClient,
    onSetShowEditClient,
  };
};
