"use client";
import FixedLayout from "components/FixedLayout";
import React, { useContext, useEffect, useState } from "react";
import TabList, { SALES_DETAIL_TAB } from "./components/TabList/TabList";
import TabHeader from "./components/TabHeader/TabHeader";
import { useFetchDealDetail } from "./hooks/useGetDealDetail";
import { TabContext, TabPanel } from "@mui/lab";
import SaleFeed from "./sn-feed";
import { useFormContext } from "react-hook-form";
import { Todo } from "store/sales/reducer";
import { useSaleDetail, useSalesService } from "store/sales/selectors";
import Loading from "components/Loading";
import { useFetchEmployeeOptions } from "components/sn-sales/hooks/useGetEmployeeOptions";
import moment from "moment";
import { DATE_FORMAT_HYPHEN } from "constant/index";
import { formatDate } from "utils/index";
import SaleService from "./components/sn-service";
import useFetchServiceSection from "./hooks/useGetServiceSection";
import { EditContext } from "./components/sn-service/context/EditContext";
import SaleClient from "./components/Client/index";

const SalesDetail = () => {
  const [tab, setTab] = useState<SALES_DETAIL_TAB>(SALES_DETAIL_TAB.FEED);
  const { getValues, resetField, reset } = useFormContext();
  const onChangeTab = (e: React.SyntheticEvent, newTab: SALES_DETAIL_TAB) => {
    setTab(newTab);
  };
  const id = getValues("id");

  useFetchDealDetail(id);
  useFetchEmployeeOptions();
  useFetchServiceSection();

  const { isFetching: isServiceFetching } = useSalesService();
  const { saleDetail, isFetching, onReset } = useSaleDetail();
  const { serviceSectionList } = useSalesService();
  const { isEdit } = useContext(EditContext);
  useEffect(() => {
    if (!saleDetail) return;

    const sortedTodoList = [...saleDetail?.todo_list].sort((a, b) =>
      a.priority - b.priority ? -1 : 1,
    );
    const comments = [...saleDetail?.comments];
    comments?.sort((a, b) => {
      return moment(b.created_time).isAfter(moment(a.created_time)) ? 1 : -1;
    });

    const todo_list: Record<string, Todo> = sortedTodoList.reduce(
      (acc, todo, index) => {
        acc[todo.id] = {
          ...todo,
          priority: todo.priority,
          expiration_date:
            todo.expiration_date &&
            formatDate(todo.expiration_date, DATE_FORMAT_HYPHEN),
        };
        return acc;
      },
      {},
    ) as Record<string, Todo>;

    reset({
      ...saleDetail,
      todo_list,
      comments: comments,
      id,
      sectionsList: serviceSectionList,
    });

    return reset();
  }, [JSON.stringify(serviceSectionList), JSON.stringify(saleDetail)]);

  useEffect(() => {
    return () => onReset();
  }, []);
  if (isFetching) return <Loading open />;

  return (
    <FixedLayout
      maxHeight={1020}
      // maxWidth={{
      //   xs: 1120,
      //   xl: 1450,
      // }}
      sx={{
        width: "auto",
        minWidth: "95%",
        overflowY: "hidden",
        marginLeft: { lg: "8px", xl: "24px" },
        marginRight: { lg: "8px", xl: "24px" },
      }}
      rounded="4px"
    >
      <TabHeader />
      <TabList value={tab} onChange={onChangeTab} />
      <TabContext value={tab}>
        <TabPanel
          sx={{
            overflowY: "auto",
          }}
          value={SALES_DETAIL_TAB.FEED}
        >
          <SaleFeed />
        </TabPanel>
        <TabPanel
          sx={{
            overflowY: "auto",
            pt: 0,
          }}
          value={SALES_DETAIL_TAB.SERVICE}
        >
          <SaleService />
        </TabPanel>
        <TabPanel
          sx={{
            paddingX: { xs: "8px", sm: "8px", md: "24px" },
            paddingTop: { xs: 1.5, sm: 1.5, md: 1.5, lg: 3 },
            overflowY: "hidden",
          }}
          value={SALES_DETAIL_TAB.CLIENT}
        >
          <SaleClient />
        </TabPanel>
      </TabContext>
    </FixedLayout>
  );
};

export default SalesDetail;
