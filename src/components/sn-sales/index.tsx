"use client";

import { Stack } from "@mui/material";
import FixedLayout from "components/FixedLayout";
import Pagination from "components/Pagination";
import { Text } from "components/shared";
import { CellProps, TableLayout } from "components/Table";
import { NS_COMMON, NS_SALES } from "constant/index";
import useQueryParams from "hooks/useQueryParams";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSales } from "store/sales/selectors";
import {
  cleanObject,
  formatCurrency,
  formatNumber,
  getComparator,
  sortedRowInformation,
  stringifyURLSearchParams
} from "utils/index";
import {
  SortContextProps,
  sortContext,
} from "./context/useSortContext";
import { useFetchEmployeeOptions } from "./hooks/useGetEmployeeOptions";
import SaleItem from "./SaleItem";
import SaleListAction from "./SaleListAction";

const SalesPage = () => {
  const commonT = useTranslations(NS_COMMON);
  const salesT = useTranslations(NS_SALES);
  const { initQuery, isReady, query } = useQueryParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const {
    sales,
    isIdle,
    isFetching,
    totalItems,
    salesError,
    onGetSales,
    totalRevenue,
    totalRevenuePJ,
    salesFilters,
    totalTime,
    pageIndex,
    pageSize,
    totalPages,
  } = useSales();

  const { orderBy, orderDirection, setOrderBy, setOrderDirection } = useContext(
    sortContext,
  ) as SortContextProps;
  const [shouldLoad, setShouldLoad] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeQueries = (queries: { [key: string]: any }) => {
    let newQueries = { ...query, ...queries };
    newQueries = cleanObject(newQueries);
    const queryString = stringifyURLSearchParams(newQueries);
    push(`${pathname}${queryString}`);

    onGetSales(newQueries);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string,
  ) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const onChangeSize = (newSize) => {
    setShouldLoad(true);
    onChangeQueries({ ...salesFilters, pageSize: newSize, pageIndex: 1 });
  };

  const onChangePage = (newPage) => {
    setShouldLoad(true);
    onChangeQueries({ ...salesFilters, pageSize, pageIndex: newPage });
  };

  useEffect(() => {
    if (!isReady) return;
    setShouldLoad(true);
    onGetSales(query);
  }, [isReady, initQuery, onGetSales, query]);

  const itemList = useMemo(() => {
    return sortedRowInformation(sales, getComparator(orderDirection, orderBy));
  }, [sales, orderDirection, orderBy]);

  const headerList: CellProps[] = useMemo(
    () => [
      {
        name: "name",
        value: commonT("name"),
        align: "left",
        width: "18%",
        minWidth: 130,
        sort: true,
      },
      {
        name: "status",
        value: salesT("list.table.stage"),
        align: "center",
        width: "10%",
        minWidth: 160,
        sort: true,
      },
      {
        name: "owner.fullname",
        value: salesT("list.table.owner"),
        align: "left",

        width: "12%",
        sort: true,
        minWidth: 160,
      },
      {
        name: "revenue",
        value: salesT("list.table.revenue"),
        align: "right",
        sort: true,
        component: (props) => (
          <Stack
            {...props}
            alignItems="flex-end"
            sx={{
              paddingTop: "4px",
            }}
          >
            <Text variant="h6" color="grey.400" noWrap>
              {salesT("list.table.revenue")}
            </Text>
            <Text
              variant="h6"
              color={totalRevenue > 0 ? "success.main" : "error.main"}
            >
              {formatCurrency(totalRevenue, {
                prefix: "$",
                numberOfFixed: 2,
              })}
            </Text>
          </Stack>
        ),
        minWidth: 100,
        width: "12%",
      },
      // {
      //   name: "revenuePJ",
      //   value: salesT("list.table.pjRevenue"),
      //   align: "right",
      //   sort: true,
      //   component: (props) => {
      //     return (
      //       <Stack
      //         {...props}
      //         alignItems="flex-end"
      //         sx={{
      //           paddingTop: "4px",
      //         }}
      //       >
      //         <Text
      //           variant="h6"
      //           color="grey.400"
      //           sx={{
      //             textOverflow: "ellipsis",
      //             WebkitLineClamp: 1,
      //             width: "100%",
      //             overflow: "hidden",
      //           }}
      //           noWrap
      //         >
      //           {salesT("list.table.pjRevenue")}
      //         </Text>
      //         <Text
      //           variant="h6"
      //           color={totalRevenuePJ > 0 ? "success.main" : "error.main"}
      //         >
      //           {formatCurrency(totalRevenuePJ, {
      //             prefix: "$",
      //             numberOfFixed: 2,
      //           })}
      //         </Text>
      //       </Stack>
      //     );
      //   },
      //   minWidth: 70,
      //   width: "13%",
      // },
      {
        name: "estimate",
        value: (
          <Stack
            alignItems="flex-end"
            sx={{
              paddingTop: "4px",
            }}
          >
            <Text
              variant="h6"
              color="grey.400"
              noWrap
              sx={{
                textOverflow: "ellipsis",
                WebkitLineClamp: 1,
                width: "100%",
                overflow: "hidden",
              }}
            >
              {salesT("list.table.time")}
            </Text>
            <Text variant="h6">
              {formatNumber(totalTime, { numberOfFixed: 0 })}h
            </Text>
          </Stack>
        ),
        align: "right",
        component: (props) => (
          <Stack {...props} alignItems="flex-end">
            <Text
              variant="h6"
              color="grey.400"
              noWrap
              sx={{
                textOverflow: "ellipsis",
                WebkitLineClamp: 1,
                width: "100%",
                overflow: "hidden",
              }}
            >
              {salesT("list.table.time")}
            </Text>
            <Text variant="h6">
              {formatNumber(totalTime, { numberOfFixed: 0 })}h
            </Text>
          </Stack>
        ),
        minWidth: 70,
        width: "8%",
      },
      {
        name: "probability",
        value: salesT("list.table.probability"),
        align: "right",
        width: "5%",
        minWidth: 70,
        sort: true,
      },
      {
        name: "updated_time",
        value: salesT("list.table.lastActivity"),
        align: "center",
        width: "7%",
        minWidth: 100,
        sort: true,
      },
    ],
    [commonT, salesT, totalRevenue, totalTime],
  );

  useFetchEmployeeOptions();
  return (
    <FixedLayout
      maxHeight={920}
      maxWidth={{
        xs: 1120,
        xl: 1450,
      }}
    >
      <SaleListAction />
      <TableLayout
        handleRequestSort={handleRequestSort}
        orderDirection={orderDirection}
        orderBy={orderBy}
        maxHeight={860}
        headerList={headerList}
        noData={!isIdle && totalItems === 0}
        minWidth={1050}
        px={2}
        pending={isFetching && shouldLoad}
        headerProps={{
          sx: {
            px: { xs: 1, md: 1 },
            overflow: "auto",
            py: "4px",
            pb: "8px",
            height: "auto",
            verticalAlign: "middle",
            background: "#D9F0FD",
            color: "#999999",
            h6: { fontSize: "13px" }
          },
        }}
        containerHeaderProps={{
          sx: {
            overflowX: "hidden",
          },
        }}
        error={salesError as string}
      >
        {itemList.map((item, index) => (
          <SaleItem
            key={`Sale-item-${index}`}
            item={item}
            setShouldLoad={setShouldLoad}
          />
        ))}
      </TableLayout>
      <Pagination
        sx={{
          ".MuiPaginationItem-page.Mui-selected": {
            background: "#14B9E5!important",
            borderColor: "transparent",
            color: "white",
            borderRadius: "12px",
          },
          ".MuiPaginationItem-previousNext": {
            background: "#D9F0FD!important",
            borderColor: "transparent",
            color: "black",
            borderRadius: "12px",
          },
          ".MuiPaginationItem-page": {
            background: "#D9F0FD!important",
            borderColor: "transparent",
            color: "black",
            borderRadius: "12px",
          },

        }}
        onChangePage={onChangePage}
        onChangeSize={onChangeSize}
        pageSize={pageSize}
        containerProps={{ px: { md: 3 }, py: 1 }}
        totalItems={totalItems}
        totalPages={totalPages}
        page={pageIndex}
      />
    </FixedLayout>
  );
};

export default SalesPage;
