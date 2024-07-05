"use client";

import { memo, useEffect, useMemo } from "react";
import { TableRow } from "@mui/material";
import { TableLayout, CellProps } from "components/Table";
import { DEFAULT_PAGING } from "constant/index";
import useQueryParams from "hooks/useQueryParams";
import Pagination from "components/Pagination";
import { usePathname, useRouter } from "next-intl/client";
import { getPath } from "utils/index";
import { useStatementHistory } from "store/manager/selectors";
import { MobileContentCell, DesktopCells } from "./components";
import useBreakpoint from "hooks/useBreakpoint";
import FixedLayout from "components/FixedLayout";

const ItemList = () => {
  const {
    items,
    isFetching,
    isIdle,
    error,
    totalItems,
    pageSize,
    pageIndex,
    totalPages,
    onGetStatementHistory,
  } = useStatementHistory();

  const { initQuery, isReady, query } = useQueryParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const { isMdSmaller } = useBreakpoint();

  const headerList = useMemo(() => {
    return isMdSmaller ? MOBILE_HEADER_LIST : DESKTOP_HEADER_LIST;
  }, [isMdSmaller]) as CellProps[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeQueries = (queries: { [key: string]: any }) => {
    const newQueries = { ...query, ...queries };
    const path = getPath(pathname, newQueries);
    push(path);

    onGetStatementHistory(newQueries);
  };

  const onChangePage = (newPage: number) => {
    onChangeQueries({ pageIndex: newPage, pageSize });
  };

  const onChangeSize = (newPageSize: number) => {
    onChangeQueries({ pageIndex: 1, pageSize: newPageSize });
  };

  useEffect(() => {
    if (!isReady) return;
    onGetStatementHistory({ ...DEFAULT_PAGING, ...initQuery });
  }, [initQuery, isReady, onGetStatementHistory]);

  return (
    <>
      <FixedLayout>
        <TableLayout
          headerList={headerList}
          pending={isFetching}
          error={error as string}
          noData={!isIdle && totalItems === 0}
          px={{ xs: 0, md: 3 }}
        >
          {items.map((item) => {
            return (
              <TableRow key={item.id}>
                {isMdSmaller ? (
                  <MobileContentCell item={item} />
                ) : (
                  <DesktopCells item={item} />
                )}
              </TableRow>
            );
          })}
        </TableLayout>

        <Pagination
          totalItems={totalItems}
          totalPages={totalPages}
          page={pageIndex}
          pageSize={pageSize}
          containerProps={{ px: 3, p: 2.5 }}
          onChangePage={onChangePage}
          onChangeSize={onChangeSize}
        />
      </FixedLayout>
    </>
  );
};

export default memo(ItemList);

const DESKTOP_HEADER_LIST = [
  { value: "Date of payment", width: "15%" },
  { value: "Expiration date", width: "15%" },
  { value: "Name company", width: "20%", align: "left" },
  { value: "Unpaid account", width: "12.5%" },
  { value: "Paid account", width: "12.5%" },
  { value: "Total account", width: "12.5%" },
  { value: "Amount of money", width: "12.5%" },
];

const MOBILE_HEADER_LIST = [{ value: "#", width: "100%", align: "left" }];
