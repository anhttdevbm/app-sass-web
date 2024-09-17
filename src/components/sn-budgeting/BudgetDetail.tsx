/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Box, CircularProgress, Stack } from "@mui/material";
import "@sweetalert2/theme-material-ui/material-ui.css";
import Avatar from "components/Avatar";
import ConfirmDialog from "components/ConfirmDialog";
import Link from "components/Link";
import TextStatus from "components/TextStatus";
import { Button, IconButton, Text } from "components/shared";
import { Client } from "components/sn-budgeting/TabDetail/Client";
import { Expenses } from "components/sn-budgeting/TabDetail/Expenses";
import { Feed } from "components/sn-budgeting/TabDetail/Feed";
import { Invoice } from "components/sn-budgeting/TabDetail/Invoice";
import { ModalAddTime } from "components/sn-budgeting/TabDetail/Modals/ModalAddTime";
import { ModalExpense } from "components/sn-budgeting/TabDetail/Modals/ModalExpense";
import { TTimeRanges, Time } from "components/sn-budgeting/TabDetail/Time";
import CustomDateRangePicker from "components/sn-resource-planing/components/CustomDateRangePicker";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { NS_BUDGETING, NS_COMMON, NS_PROJECT } from "constant/index";
import { BILLING_CREATE_PATH, BUDGETING_PATH } from "constant/paths";
import dayjs from "dayjs";
import useTheme from "hooks/useTheme";
import useToggle from "hooks/useToggle";
import AddCircleIcon from "icons/AddCircleIcon";
import EditIcon from "icons/EditIcon";
import _ from "lodash";
import { DateRange } from "mui-daterange-picker";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useBudgetUpdate } from "queries/budgeting/budgeting-update";
import { useBudgetGetExpenseQuery } from "queries/budgeting/expense";
import { useBudgetGetServiceQuery } from "queries/budgeting/service-list";
import { useBudgetGetTimeRangeQuery } from "queries/budgeting/time-range";
import {
  createRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSnackbar } from "store/app/selectors";
import { TBudgetExpense } from "store/expense/actions";
import { ProjectStatus } from "store/project/actions";
import { TBudget } from "store/project/budget/action";
import { useProjects } from "store/project/selectors";
import Swal from "sweetalert2";
import { formatNumber, getMessageErrorByAPI } from "utils/index";
import PlusIcon from "../../icons/PlusIcon";
import { useBudgetByIdQuery } from "../../queries/budgeting/get-by-id";
import { BudgetRightSidebar } from "./BudgetRightSidebar";
import { Service } from "./TabDetail/Service";
import ArrowDownIcon from "icons/ArrowDownIcon";
import "./styles.css"

enum TABS {
  FEED = "Feed",
  CLIENT = "Client",
  SERVICES = "Services",
  TIME = "Time",
  EXPENSES = "Expenses",
  INVOICES = "Invoices",
  // RECURRING = "Recurring",
}

export type TBudgetSection = {
  id: string;
  name: string;
  budgetId: string;
  createdAt: string;
  start_date: string;
  services: TBudgetService[];
};

export type TBudgetServiceRes = {
  countItem: number;
  totalService: number;
  result: TBudgetService[];
};

export type TBudgetService = {
  id: string;
  name: string;
  serviceType?: string | null;
  billType: string;
  unit?: string;
  bookingTracking?: boolean;
  timeTracking?: boolean;
  estimate?: number;
  isNewService?: boolean;
  desc?: string;
  discount?: number;
  markUp?: number;
  price?: number;
  qty?: number;
  sectionId?: string;
  serviceId?: string;
  tolBudget?: number;
};

export const budgetDetailRef = createRef<any>();

export const BudgetDetail = () => {
  const { id } = useParams();
  const { isDarkMode } = useTheme();
  const { push } = useRouter();
  const { onUpdateProject } = useProjects();
  const tempStatus = useRef<ProjectStatus>(ProjectStatus.ACTIVE);

  const [isOpenModalTime, openModalTime, hideModalTime] = useToggle();
  const [isOpenModalExpense, openModalExpense, hideModalExpense] = useToggle();
  const [isShowLoadingTab, openLoadingTab, hideLoadingTab] = useToggle();
  const [isEditService, onEditService, offEditService] = useToggle();
  const [isOpenRightSidebar, showRightSidebar, hideRightSidebar] = useToggle();
  const [isOpenModalStatus, showModalStatus, hideModalStatus] = useToggle();
  const { onAddSnackbar } = useSnackbar();

  const [budget, setBudget] = useState<TBudget | null>(null);
  const [activeTab, setActiveTab] = useState<string>(TABS.FEED);
  const [servicesList, setServiceList] = useState<TBudgetService[]>([]);
  const [selectedService, setSelectedService] =
    useState<TBudgetService | null>();
  const [selectedTime, setSelectedTime] = useState<TTimeRanges | null>();
  const [selectedExpense, setSelectedExpense] =
    useState<TBudgetExpense | null>();

  const budgetDetailQuery = useBudgetByIdQuery(String(id));
  const serviceQuery = useBudgetGetServiceQuery(String(id));
  const timeQuery = useBudgetGetTimeRangeQuery(String(id));
  const budgetGetExpenseQuery = useBudgetGetExpenseQuery(String(id));
  const budgetUpdate = useBudgetUpdate();

  const budgetT = useTranslations(NS_BUDGETING);
  const projectT = useTranslations(NS_PROJECT);
  const commonT = useTranslations(NS_COMMON);

  const TAB_NAME = {
    [TABS.FEED]: budgetT("tab.feed"),
    [TABS.CLIENT]: budgetT("tab.client"),
    [TABS.TIME]: budgetT("tab.time"),
    [TABS.EXPENSES]: budgetT("tab.expenses"),
    [TABS.INVOICES]: budgetT("tab.invoices"),
    [TABS.SERVICES]: budgetT("tab.services"),
    // [TABS.RECURRING]: budgetT("tab.recurring"),
  };

  useEffect(() => {
    if (!_.isEmpty(serviceQuery)) {
      const services: any[] = _.map(
        _.get(serviceQuery, "data.data.sections", []),
        (section) => {
          return _.get(section, "services", []);
        },
      );
      setServiceList(_.flattenDeep(services));
    }
  }, [JSON.stringify(serviceQuery)]);

  useEffect(() => {
    if (!_.isEmpty(budgetDetailQuery)) {
      setBudget(_.get(budgetDetailQuery, "data.data"));
    }
  }, [JSON.stringify(budgetDetailQuery)]);

  const scrollToTop = () => {
    const wrapper = document.querySelector("#budget-detail-container");
    if (wrapper) {
      wrapper.scrollTop = 0;
    }
  };

  const changeActiveTab = (newTab: string) => {
    scrollToTop();

    if (isEditService) {
      Swal.fire({
        text: budgetT("tabService.alert"),
        icon: "info",
        customClass: {
          icon: 'Swal-custom-icon-info',
        }
      });

      return;
    }

    if (window["timeoutHideLoadingTab"]) {
      clearTimeout(window["timeoutHideLoadingTab"]);
    }
    openLoadingTab();
    setActiveTab(newTab);
    window["timeoutHideLoadingTab"] = setTimeout(hideLoadingTab, 500);
  };

  const ButtonAction = useMemo(() => {
    switch (activeTab) {
      case TABS.TIME:
        return (
          <Button
            onClick={openModalTime}
            id="budget_add_new_time"
            startIcon={<AddCircleIcon />}
            variant="primary"
            size="small"
            sx={{
              height: "40px",
              mx: "2px",
              fontWeight: "bold",
              background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
              color: "white",
              borderRadius: "100px",
              "&:hover": {
                background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                color: "white",
              },
            }}
          >
            {budgetT("toolbar.addTime")}
          </Button>
        );
      case TABS.EXPENSES:
        return (
          <Button
            onClick={openModalExpense}
            id="budget_add_new_expense"
            startIcon={<AddCircleIcon />}
            variant="primary"
            size="small"
            sx={{
              height: "40px",
              mx: "2px",
              fontWeight: "bold",
              background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
              color: "white",
              borderRadius: "100px",
              "&:hover": {
                background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                color: "white",
              },
            }}
          >
            {budgetT("toolbar.addExpense")}
          </Button>
        );
      case TABS.INVOICES:
        return (
          <Button
            id="budget_add_new_invoice"
            startIcon={<PlusIcon />}
            variant="primary"
            size="small"
            sx={{ height: "40px", mx: "2px" }}
            onClick={() => {
              push(BILLING_CREATE_PATH + `?budget=${id}`);
            }}
          >
            {budgetT("toolbar.addInvoice")}
          </Button>
        );
      case TABS.SERVICES:
        return !isEditService ? (
          <Button
            onClick={onEditService}
            id="budget_edit_service"
            startIcon={<EditIcon />}
            variant="primary"
            size="small"
            sx={{
              height: "40px",
              mx: "2px",

              background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
              color: "white",
              borderRadius: "100px",
              "&:hover": {
                background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                color: "white",
              },
            }}
          >
            {budgetT("toolbar.serviceEdit")}
          </Button>
        ) : (
          <Box sx={{ width: 100 }} />
        );
      default:
        return <Box sx={{ width: 100 }} />;
    }
  }, [activeTab, isEditService]);

  useImperativeHandle(budgetDetailRef, () => ({
    setSelectedServiceData: (service: TBudgetService | null) => {
      setSelectedService(service);
    },
    setSelectedTimeData: (time: TTimeRanges | null) => {
      setSelectedTime(time);
    },
    setSelectedExpense: (expense: TBudgetExpense | null) => {
      setSelectedExpense(expense);
    },
    openModalTime: () => {
      openModalTime();
    },
    openModalExpense: () => {
      openModalExpense();
    },
    budgetDetailRefetch: () => {
      budgetDetailQuery.refetch();
    },
    serviceRefetch: () => {
      serviceQuery.refetch();
    },
    timeRefetch: () => {
      timeQuery.refetch();
    },
    budgetGetExpenseRefetch: () => {
      budgetGetExpenseQuery.refetch();
    },
  }));

  const handleChangeProjectStatus = async (status: ProjectStatus) => {
    try {
      const newData = await onUpdateProject(_.get(budget, "project.id", ""), {
        status: status,
      });
      if (newData) {
        onAddSnackbar(
          projectT("detail.notification.changeStatusSuccess"),
          "success",
        );
        budgetDetailQuery.refetch();
      }
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      hideModalStatus();
    }
  };

  const handleUpdateDate = async (date: DateRange) => {
    try {
      // console.log(budget.id);

      budgetUpdate.mutateAsync(
        {
          id: budget.id,
          start_date: date.startDate,
          end_date: date.endDate,
        },
        {
          onSuccess: () => {
            onAddSnackbar(budgetT("notification.date"), "success");
            budgetDetailQuery.refetch();
          },
        },
      );
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  const handleOpenChangeStatusDialog = (status: ProjectStatus) => {
    tempStatus.current = status;
    showModalStatus();
  };

  const updateBuggeting = (data: TBudget) => {
    setBudget(data);
  };

  if (!budget) return <></>;

  return (
    <Box ref={budgetDetailRef}>
      <Stack
        sx={{
          // position: "sticky !important",
          top: 0,
          background: isDarkMode ? "#313130" : "white",
          // pb: 2,
          zIndex: 11,
          borderRadius: 1,
        }}
      >
        <Stack
          sx={{ background: "#F3F3F3" }}
          direction="row"
          p="10px"
          justifyContent="space-between"
          borderBottom="1px solid #ECECF3"
          gap={2}
        >
          <Stack gap={1} direction="row" alignItems="center">
            <Link href={BUDGETING_PATH}>
              <IconButton>
                <ArrowDownIcon />
              </IconButton>
            </Link>
            <Avatar size={40} src={budget?.created_by?.avatar?.link || ""} />
            <Stack width={"150px"}>
              <Text fontSize="16px" fontWeight="bold" lineHeight={1.2}>
                {budget.project?.name}
              </Text>
              <Text fontSize="16px" lineHeight={1.2}>
                {budget.name}
              </Text>
            </Stack>
            <Stack direction="row" gap={1} alignItems="center">
              <TextStatus
                text="status.open"
                color={
                  _.get(budget, "project.status", "") === ProjectStatus.ACTIVE
                    ? "success"
                    : "common"
                }
                namespace={NS_BUDGETING}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  handleOpenChangeStatusDialog(ProjectStatus.ACTIVE);
                }}
              />
              <Box
                sx={{
                  display: "inline-block",
                  width: "20px",
                  height: "2px",
                  backgroundColor: "#BABCC6",
                }}
              />
              <TextStatus
                text="status.close"
                color={
                  _.get(budget, "project.status", "") === ProjectStatus.CLOSE
                    ? "error"
                    : "common"
                }
                namespace={NS_BUDGETING}
                sx={{ cursor: "pointer" }}
                onClick={() => {
                  handleOpenChangeStatusDialog(ProjectStatus.CLOSE);
                }}
              />
            </Stack>
            <Stack direction="row" alignItems="center">
              <CustomDateRangePicker
                value={{
                  startDate: budget.start_date
                    ? dayjs(budget.start_date).toDate()
                    : undefined,
                  endDate: budget.end_date
                    ? dayjs(budget.end_date).toDate()
                    : undefined,
                }}
                sx={{
                  background: "white",
                  borderRadius: "100px",
                  "label.MuiBox-root": { p: "2px 15px" },
                }}
                onChange={handleUpdateDate}
                iconPosition="left"
                isDropdown
                errorMessage=""
              />
              {/*<IconButton*/}
              {/*  sx={{ color: "grey.300" }}*/}
              {/*  onClick={isOpenRightSidebar ? hideRightSidebar : showRightSidebar}*/}
              {/*>*/}
              {/*  <OpenSidebarIcon />*/}
              {/*</IconButton>*/}
            </Stack>
          </Stack>
          <Stack gap={2} direction="row" alignItems="center">
            <Stack direction="column" alignItems="center">
              <Text
                sx={{ textWrap: "nowrap" }}
                color={"#999999"}
                fontSize={"13px"}
              >
                {projectT("budget.table.revenue")}
              </Text>
              <Text
                sx={{ textWrap: "nowrap" }}
                fontSize={"13px"}
                fontWeight={600}
                color="#03AE00"
              >
                {formatNumber(109000567, {
                  prefix: CURRENCY_SYMBOL["USD"],
                  numberOfFixed: 0,
                })}
              </Text>
            </Stack>
            <Stack direction="column" alignItems="center">
              <Text
                sx={{ textWrap: "nowrap" }}
                color={"#999999"}
                fontSize={"13px"}
              >
                {projectT("budget.table.margin")}
              </Text>
              <Text
                sx={{ textWrap: "nowrap" }}
                fontSize={"13px"}
                fontWeight={600}
                color="#03AE00"
              >
                {formatNumber(123, {
                  prefix: CURRENCY_SYMBOL["USD"],
                  numberOfFixed: 0,
                })}
              </Text>
            </Stack>
            <Stack direction="column" alignItems="center">
              <Text
                sx={{ textWrap: "nowrap" }}
                color={"#999999"}
                fontSize={"13px"}
              >
                {projectT("budget.table.invoiced") + " %"}
              </Text>
              <Text
                sx={{ textWrap: "nowrap" }}
                fontSize={"13px"}
                fontWeight={600}
                color="#03AE00"
              >
                {formatNumber(123, {}) + " %"}
              </Text>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          borderBottom="1px solid #ECECF3"
          sx={{ overflowX: "auto" }}
          p={"10px"}
        >
          <Stack
            sx={{
              height: "40px",
              border: "1px solid #EFEFEF",
              borderRadius: "100px",
              mr: { xs: "10px", md: "20px", xl: "38px" },
            }}
            direction="row"
            justifyContent="start"
            alignItems="center"
          >
            {Object.keys(TABS).map((tab, index) => {
              const currentTab = TABS[tab];
              return (
                <Box
                  key={`budget-detail-tab-${index}`}
                  p={1}
                  // mx="2px"
                  borderBottom="2px solid transparent"
                  sx={{
                    px: { xs: "20px", md: "30px" },
                    borderRadius: "100px",
                    cursor: "pointer",
                    transaction: "all .2s",
                    ...(activeTab === currentTab && {
                      color: "primary.main",
                      background: "#D9F0FD",
                    }),
                  }}
                  onClick={() => changeActiveTab(currentTab)}
                >
                  {TAB_NAME[currentTab]}
                </Box>
              );
            })}
          </Stack>
          {ButtonAction}
        </Stack>
      </Stack>

      <Stack p={"10px"} direction="row" >
        <Box
          position="relative"
          sx={{
            width: isOpenRightSidebar ? "calc(100% - 350px)" : "100%",
            transition: "all .2s",
            overflow: "auto",
            height: "calc(100vh - 200px)",
            '&::-webkit-scrollbar': {
              display: 'none', 
            },
            msOverflowStyle: 'none', 
            scrollbarWidth: 'none', 
          }}
        >
          <Stack
            p="50px"
            alignItems="center"
            position="absolute"
            width="100%"
            top={0}
            left={0}
            display={isShowLoadingTab ? "flex" : "none"}
          >
            <CircularProgress />
          </Stack>
          <Box sx={{ opacity: isShowLoadingTab ? 0 : 1 }}>
            {activeTab === TABS.FEED && <Feed budget={budget} />}
            {activeTab === TABS.CLIENT && (
              <Client
                bugetId={budget.id}
                clientId={budget?.client}
                update={updateBuggeting}
              />
            )}
            {activeTab === TABS.TIME && (
              <Time
                timeList={_.get(timeQuery, "data.data.docs", [])}
                selectedTime={selectedTime}
                refetch={() => {
                  timeQuery.refetch();
                }}
              />
            )}
            {activeTab === TABS.EXPENSES && (
              <Expenses
                expenseList={_.get(budgetGetExpenseQuery, "data.data.docs", [])}
              />
            )}
            {activeTab === TABS.INVOICES && <Invoice />}
            {/* {activeTab === TABS.RECURRING && <Recurring />} */}
            {activeTab === TABS.SERVICES && (
              <Service
                sections={_.get(serviceQuery, "data.data.sections", [])}
                isEdit={isEditService}
                onCloseEdit={() => {
                  serviceQuery.refetch();
                  offEditService();
                }}
                serviceData={_.get(serviceQuery, "data.data")}
                refetch={() => {
                  serviceQuery.refetch();
                }}
              />
            )}
          </Box>
        </Box>
        <Box
          sx={{
            width: "350px",
            borderLeft: "2px solid",
            borderColor: "grey.200",
            p: 2,
            transition: "all .2s",
            position: isOpenRightSidebar ? "relative" : "absolute",
            zIndex: isOpenRightSidebar ? 10 : -1,
            right: isOpenRightSidebar ? 0 : "-350px",
            top: 0,
            backgroundColor: isDarkMode ? "#313130" : "white",
          }}
        >
          <BudgetRightSidebar budget={budget} />
        </Box>
      </Stack>

      <ModalAddTime
        serviceId={_.get(selectedService, "id", "")}
        services={servicesList}
        open={isOpenModalTime}
        onClose={() => {
          setSelectedTime(null);
          setSelectedService(null);
          hideModalTime();
        }}
        timeData={selectedTime}
        refetch={() => {
          timeQuery.refetch();
        }}
      />
      <ModalExpense
        expenseData={selectedExpense || undefined}
        open={isOpenModalExpense}
        onClose={() => {
          setSelectedExpense(null);
          setSelectedService(null);
          hideModalExpense();
        }}
        services={servicesList}
        serviceId={_.get(selectedService, "id", "")}
      />
      <ConfirmDialog
        onSubmit={() => {
          handleChangeProjectStatus(tempStatus.current);
        }}
        open={isOpenModalStatus}
        onClose={hideModalStatus}
        title={budgetT("confirmChangeStatus.title")}
        content={budgetT("confirmChangeStatus.content", {
          status:
            tempStatus.current === ProjectStatus.CLOSE
              ? budgetT("status.close")
              : budgetT("status.open"),
        })}
      />
    </Box>
  );
};
