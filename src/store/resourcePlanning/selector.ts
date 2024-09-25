import { Endpoint } from "api";
import { budgetClient } from "api/client";
import { DataStatus } from "constant/enums";
import { NS_RESOURCE_PLANNING } from "constant/index";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "store/app/selectors";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  TBudgetListQueries,
  getProjectBudgetList,
} from "store/project/budget/action";
import StringFormat from "string-format";
import {
  BookingData,
  IBookingAllFitler,
  createBookingResource,
  deleteBookingResource,
  getBookingAll,
  getBudgetServices,
  getMyBookingResource,
  updateBookingResource,
} from "./action";
import {
  IDatePicker,
  setBookingAllFilter,
  setCurrentDate,
  setDatePicker,
  setMyBookingFilter,
} from "./reducer";

export const useResourceFilter = () => {
  const { end_date, search_key, start_date, position, working_sort } =
    useAppSelector((state) => state.resourcePlanning.bookingAllFilter);
  const dispatch = useDispatch();

  const updateFilter = (filter: IBookingAllFitler) => {
    dispatch(setBookingAllFilter(filter));
  };

  return {
    end_date,
    search_key,
    position,
    working_sort,
    start_date,
    updateFilter,
  };
};

export const useResourceDate = () => {
  const { currentDate, datePicker } = useAppSelector(
    (state) => state.resourcePlanning,
  );
  const { dateRange, selectedDate } = datePicker;

  const dispatch = useAppDispatch();

  const updateDate = (date: IDatePicker) => {
    dispatch(setDatePicker(date));
  };

  const updateCurrentDate = (date: string) => {
    dispatch(setCurrentDate(date));
  };

  return {
    dateRange,
    selectedDate,
    updateDate,
    updateCurrentDate,
    currentDate,
  };
};

export const useBookingAll = () => {
  const { bookingAll, bookingAllError, bookingAllFilter, bookingAllStatus } =
    useAppSelector((state) => state.resourcePlanning);
  const { onAddSnackbar } = useSnackbar();
  const resourceT = useTranslations(NS_RESOURCE_PLANNING);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const { getMyBooking, myBookingFilter } = useMyBooking();

  const getBookingResource = useCallback(
    async (params: IBookingAllFitler) => {
      const newParams = {
        ...params,
        start_date: params.start_date ?? dayjs().format("YYYY-MM-DD"),
        end_date: params.end_date ?? dayjs().format("YYYY-MM-DD"),
      };

      await dispatch(getBookingAll(params));
    },
    [dispatch],
  );
  const onSetBookingFilter = useCallback(
    (filter: IBookingAllFitler) => {
      dispatch(setBookingAllFilter(filter));
    },
    [dispatch],
  );
  const isReady = useMemo(
    () => bookingAllStatus === DataStatus.SUCCEEDED,
    [bookingAllStatus],
  );

  const isLoading = useMemo(
    () => bookingAllStatus === DataStatus.LOADING,
    [bookingAllStatus],
  );

  const totalHour = useMemo(
    () => bookingAll.reduce((prev, item) => prev + item.total_hour, 0),
    [bookingAll],
  );
  const createBooking = async (
    data: BookingData,
    disableSnackbar?: boolean,
  ) => {
    setLoading(true);
    await dispatch(createBookingResource(data))
      .unwrap()
      .then(async () => {
        await Promise.all([
          getMyBooking(myBookingFilter),
          getBookingResource(bookingAllFilter),
        ]).then(() => {
          !disableSnackbar &&
            onAddSnackbar(resourceT("form.createSuccess"), "success");
          setLoading(false);
        });
      })
      .catch((err) => {
        !disableSnackbar && onAddSnackbar(err.message, "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateBooking = async (
    data: BookingData,
    id: string,
    disableSnackbar?: boolean,
  ) => {
    setLoading(true);
    await dispatch(
      updateBookingResource({
        ...data,
        id,
      }),
    )
      .unwrap()
      .then(async () => {
        await Promise.all([
          getMyBooking(myBookingFilter),
          getBookingResource(bookingAllFilter),
        ]).then(() => {
          !disableSnackbar &&
            onAddSnackbar(resourceT("form.updateSuccess"), "success");
        });
      })
      .catch((err) => {
        !disableSnackbar && onAddSnackbar(err.message, "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteBooking = async (id: string, disableSnackbar?: boolean) => {
    await dispatch(deleteBookingResource(id))
      .unwrap()
      .then(async () => {
        await Promise.all([
          getMyBooking(myBookingFilter),
          getBookingResource(bookingAllFilter),
        ]).then(() => {
          !disableSnackbar &&
            onAddSnackbar(resourceT("form.deleteSuccess"), "success");
        });
      })
      .catch((err) => {
        !disableSnackbar && onAddSnackbar(err.message, "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // useEffect(() => {
  //   if (bookingAllError) {
  //     onAddSnackbar(bookingAllError, "error");
  //   }
  // }, [bookingAllError]);
  return {
    bookingAllFilter,
    totalHour,
    createBooking,
    deleteBooking,
    isLoading,
    loading,
    isReady,
    updateBooking,
    bookingAll,
    bookingAllError,
    setBookingAllFilter: onSetBookingFilter,
    getBookingResource,
  };
};

export const useMyBooking = () => {
  const { myBooking, myBookingError, myBookingStatus, myBookingFilter } =
    useAppSelector((state) => state.resourcePlanning);
  const { onAddSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();

  const onSetMyBookingFilter = (filter: IBookingAllFitler) => {
    dispatch(setMyBookingFilter(filter));
  };
  const isReady = useMemo(
    () => myBookingStatus === DataStatus.SUCCEEDED,
    [myBookingStatus],
  );

  const isLoading = useMemo(
    () => myBookingStatus === DataStatus.LOADING,
    [myBookingStatus],
  );
  const getMyBooking = async (params: IBookingAllFitler) => {
    await dispatch(getMyBookingResource(params));
  };

  // useEffect(() => {
  //   if (myBookingError) {
  //     onAddSnackbar(myBookingError, "error");
  //   }
  // }, [myBookingError]);

  return {
    myBooking,
    myBookingError,
    myBookingFilter,
    isReady,
    isLoading,
    getMyBooking,
    setMyBookingFilter: onSetMyBookingFilter,
  };
};

export const useGetServiceBudget = () => {
  const [projectId, setProjectId] = useState<string>("");
  const budgets = useAppSelector((state) => state.project.budgets);
  const serviceBudget = useAppSelector(
    (state) => state.resourcePlanning.servicesBudget,
  );
  const [queries, setQueries] = useState({
    project_id: projectId,
    pageSize: 10,
    pageIndex: 1,
  } as TBudgetListQueries);
  const dispatch = useAppDispatch();

  const getBudgets = useCallback(
    async (queries) => {
      await dispatch(getProjectBudgetList(queries));
    },
    [dispatch, projectId],
  );

  const getBudgetsByIdProject = async (id: string) => {
    const url = StringFormat(Endpoint.BUDGETS_BY_PROJECT_ID, { id });

    const res = await budgetClient.get(url);
    return res;
  };

  const getServiceByBudgetQueries = async (
    id: string,
    params?:
      | string
      | string[][]
      | Record<string, string>
      | URLSearchParams
      | null,
  ) => {
    const queryString = params ? new URLSearchParams(params).toString() : "";

    const url = StringFormat(Endpoint.SERVICE_QUERIES_BY_BUDGET, { id });

    const res = await budgetClient.get(`${url}?${queryString}`);
    return res;
  };

  const serviceBudgetOptions = useMemo(() => {
    if (!serviceBudget) {
      return [];
    }
    return serviceBudget.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [serviceBudget]);

  useEffect(() => {
    if (projectId) {
      setQueries({
        project_id: projectId,
        pageSize: 10,
        pageIndex: 1,
      });
    }
  }, [projectId]);

  useEffect(() => {
    if (queries) {
      dispatch(getProjectBudgetList(queries));
    }
  }, [JSON.stringify(queries)]);

  useEffect(() => {
    if (budgets) {
      dispatch(
        getBudgetServices({
          project_id: projectId,
          budgets: budgets.map((item) => item.id),
        }),
      );
    }
  }, [budgets]);
  return {
    budgets,
    getBudgets,
    serviceBudgetOptions,
    serviceBudget,
    projectId,
    setProjectId,
    queries,
    setQueries,
    getBudgetsByIdProject,
    getServiceByBudgetQueries,
  };
};
