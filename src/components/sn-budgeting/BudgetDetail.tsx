/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { Box, CircularProgress, Stack } from "@mui/material";
import Avatar from "components/Avatar";
import Link from "components/Link";
import { Button, DatePicker, IconButton, Text } from "components/shared";
import { Expenses } from "components/sn-budgeting/TabDetail/Expenses";
import { Feed } from "components/sn-budgeting/TabDetail/Feed";
import { Invoice } from "components/sn-budgeting/TabDetail/Invoice";
import { ModalAddTime } from "components/sn-budgeting/TabDetail/ModalAddTime";
import { ModalExpense } from "components/sn-budgeting/TabDetail/ModalExpense";
import { TTimeRanges, Time } from "components/sn-budgeting/TabDetail/Time";
import TextStatus from "components/TextStatus";
import { NS_BUDGETING } from "constant/index";
import { BUDGETING_PATH } from "constant/paths";
import dayjs from "dayjs";
import useToggle from "hooks/useToggle";
import EditIcon from "icons/EditIcon";
import EyeIcon from "icons/EyeIcon";
import OpenSidebarIcon from "icons/OpenSidebarIcon";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
  createRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { TBudget } from "store/project/budget/action";
import CloseIcon from "../../icons/CloseIcon";
import PlusIcon from "../../icons/PlusIcon";
import { useBudgetByIdQuery } from "../../queries/budgeting/get-by-id";
import { BudgetRightSidebar } from "./BudgetRightSidebar";
import { Recurring } from "./TabDetail/Recurring";
import { Service } from "./TabDetail/Service";
import { useBudgetGetServiceQuery } from "queries/budgeting/service-list";
import useTheme from "hooks/useTheme";
import _ from "lodash";

enum TABS {
  FEED = "Feed",
  SERVICES = "Services",
  TIME = "Time",
  EXPENSES = "Expenses",
  INVOICES = "Invoices",
  RECURRING = "Recurring",
}

export type TBudgetSection = {
  id: string;
  name: string;
  budgetId: string;
  createdAt: string;
  start_date: string;
  services: TBudgetService[];
};

export type TBudgetService = {
  id: string;
  name: string;
  type: string;
  billingType: string;
  unit?: string;
  bookingTracking?: boolean;
  timeTracking?: boolean;
  estimate?: string;
  isNewService?: boolean;
  desc?: string;
  discount?: number;
  markUp?: number;
  price?: number;
  qty?: number;
  sectionId?: string;
  serviceType?: string;
  tolBudget?: number;
};

export const budgetDetailRef = createRef<any>();

export const BudgetDetail = () => {
  const [isOpenModalTime, openModalTime, hideModalTime] = useToggle();
  const [isOpenModalExpense, openModalExpense, hideModalExpense] = useToggle();
  const [isShowLoadingTab, openLoadingTab, hideLoadingTab] = useToggle();
  const [isEditService, onEditService, offEditService] = useToggle();
  const [isOpenRightSidebar, showRightSidebar, hideRightSidebar] = useToggle();

  const [budget, setBudget] = useState<TBudget | null>(null);
  const [activeTab, setActiveTab] = useState<string>(TABS.FEED);
  const [dateFilter, setDateFilter] = useState<any>("");
  const [sections, setSections] = useState<TBudgetSection[]>([]);
  const [servicesList, setServiceList] = useState<TBudgetService[]>([]);
  const [selectedService, setSelectedService] = useState<TBudgetService | null>();
  const [selectedTime, setSelectedTime] = useState<TTimeRanges | null>();

  const { id } = useParams();
  const { isDarkMode } = useTheme();

  const budgetDetailQuery = useBudgetByIdQuery(String(id));
  const serviceQuery = useBudgetGetServiceQuery(String(id));

  const budgetT = useTranslations(NS_BUDGETING);

  useEffect(() => {
    if (serviceQuery) {
      const services: any[] = _.map(
        _.get(serviceQuery, "data.data", []),
        (section) => {
          return _.get(section, "services", []);
        },
      );
      setServiceList(_.flattenDeep(services));
      setSections(_.get(serviceQuery, "data.data", []));
    }
  }, [JSON.stringify(serviceQuery)]);

  useEffect(() => {
    if (budgetDetailQuery) {
      setBudget(budgetDetailQuery.data);
    }
  }, [budgetDetailQuery]);

  const changeActiveTab = (newTab: string) => {
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
            startIcon={<PlusIcon />}
            variant="primary"
            size="small"
            sx={{ height: "40px", mx: "2px" }}
          >
            {budgetT("toolbar.addTime")}
          </Button>
        );
      case TABS.EXPENSES:
        return (
          <Button
            onClick={openModalExpense}
            id="budget_add_new_expense"
            startIcon={<PlusIcon />}
            variant="primary"
            size="small"
            sx={{ height: "40px", mx: "2px" }}
          >
            {budgetT("toolbar.addExpense")}
          </Button>
        );
      case TABS.INVOICES:
        return (
          <Button
            onClick={() => {}}
            id="budget_add_new_invoice"
            startIcon={<PlusIcon />}
            variant="primary"
            size="small"
            sx={{ height: "40px", mx: "2px" }}
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
            sx={{ height: "40px", mx: "2px" }}
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
    openModalTime: (data?: any) => {
      setSelectedTime(data);
      openModalTime();
    },
    openModalExpense: (data?: any) => {
      openModalExpense();
    },
    refetchServiceQuery: () => {
      serviceQuery.refetch();
    }
  }));

  if (!budget) return <></>;

  return (
    <Box ref={budgetDetailRef}>
      <Box
        sx={{
          position: "sticky !important",
          top: 0,
          background: isDarkMode ? "#313130" : "white",
          py: 2,
          zIndex: 10,
        }}
      >
        <Stack
          direction="row"
          p="15px"
          justifyContent="space-between"
          borderBottom="1px solid #ECECF3"
        >
          <Stack direction="row" alignItems="center">
            <Avatar size={40} src={budget?.created_by?.avatar?.link || ""} />
            <Stack pl="7px">
              <Text fontSize="20px" fontWeight="bold" lineHeight={1.2}>
                {budget.project.name}
              </Text>
              <Text lineHeight={1.2}>{budget.name}</Text>
            </Stack>
          </Stack>
          <Stack direction="row" alignItems="center">
            <DatePicker
              onChange={(name, date) => {
                if (!date) return;
                setDateFilter(dayjs(date.toString()).format("YYYY-MM-DD"));
              }}
              name="name"
              size="small"
              value={dateFilter}
            />
            <IconButton sx={{ color: "grey.300" }}>
              <EyeIcon sx={{ fontSize: "26px" }} />
            </IconButton>
            <IconButton sx={{ color: "grey.300" }}>
              <ShareOutlinedIcon />
            </IconButton>
            <IconButton
              sx={{ color: "grey.300" }}
              onClick={isOpenRightSidebar ? hideRightSidebar : showRightSidebar}
            >
              <OpenSidebarIcon />
            </IconButton>
            <Link href={BUDGETING_PATH}>
              <IconButton>
                <CloseIcon fontSize="medium" sx={{ color: "grey.300" }} />
              </IconButton>
            </Link>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          borderBottom="1px solid #ECECF3"
        >
          <Stack direction="row" gap={2} alignItems="center" p="15px" pr={0}>
            <TextStatus
              text="status.open"
              color="success"
              namespace={NS_BUDGETING}
              sx={{ cursor: "pointer" }}
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
              color="error"
              namespace={NS_BUDGETING}
              sx={{ cursor: "pointer" }}
            />
          </Stack>
          <Stack direction="row" alignItems="center">
            {Object.keys(TABS).map((tab, index) => {
              const currentTab = TABS[tab];
              return (
                <Box
                  key={`budget-detail-tab-${index}`}
                  p="15px"
                  mx="2px"
                  borderBottom="2px solid transparent"
                  sx={{
                    cursor: "pointer",
                    transaction: "all .2s",
                    ...(activeTab === currentTab && {
                      color: "primary.main",
                      borderColor: "primary.main",
                    }),
                    "&:hover": {
                      color: "primary.main",
                      borderColor: "primary.main",
                    },
                  }}
                  onClick={() => changeActiveTab(currentTab)}
                >
                  {currentTab}
                </Box>
              );
            })}
            {ButtonAction}
          </Stack>
        </Stack>
      </Box>
      <Stack direction="row">
        <Box
          position="relative"
          sx={{
            width: isOpenRightSidebar ? "calc(100% - 350px)" : "100%",
            transition: "all .2s",
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
            {activeTab === TABS.TIME && <Time />}
            {activeTab === TABS.EXPENSES && <Expenses />}
            {activeTab === TABS.INVOICES && <Invoice />}
            {activeTab === TABS.RECURRING && <Recurring />}
            {activeTab === TABS.SERVICES && (
              <Service
                sections={sections}
                isEdit={isEditService}
                onCloseEdit={offEditService}
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
          }}
        >
          <BudgetRightSidebar budget={budget} />
        </Box>
      </Stack>
      <ModalAddTime
        serviceId={_.get(selectedService, 'id', '')}
        services={servicesList}
        open={isOpenModalTime}
        onClose={() => {
          setSelectedService(null);
          hideModalTime();
        }}
        timeData={selectedTime}
      />
      <ModalExpense
        open={isOpenModalExpense}
        onClose={hideModalExpense}
        projectId={budget.project.id}
      />
    </Box>
  );
};
