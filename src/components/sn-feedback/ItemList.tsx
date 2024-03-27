"use client";
import { Stack, TableRow } from "@mui/material";
import FixedLayout from "components/FixedLayout";
import {
  ActionsCell,
  BodyCell,
  CellProps,
  TableLayout,
} from "components/Table";
import { NS_FEEDBACK } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import { HEADER_HEIGHT } from "layouts/Header";
import Pagination from "components/Pagination";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useState } from "react";
// import { useCategoryBlogs } from "store/blog-category/selectors";
import DesktopCells from "./components/DesktopCells";
import MobileContentCells from "./components/MobileContentCell";
import useQueryParams from "hooks/useQueryParams";
import {getPath } from "utils/index";
import { useFeedback } from "store/feedback/selectors";
import { usePathname, useRouter } from "next-intl/client";

const ItemList = () => {
  const feedbackT = useTranslations(NS_FEEDBACK);
  const { isMdSmaller } = useBreakpoint();
  // const { loading, categories } = useSelector((state: RootState) => state.categoryBlogs);
  const { initQuery, isReady, query } = useQueryParams();
  const { onGetFeedback, items, totalItems, total_page, page, size, isIdle } = useFeedback();
  const pathname = usePathname();
  const { push } = useRouter();

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      { value: feedbackT("feedbackTable.topic"), width: "15%", align: "left" },
      { value: feedbackT("feedbackTable.phone"), width: "10%", align: "left" },
      { value: feedbackT("feedbackTable.email"), width: "20%", align: "left" },
      { value: feedbackT("feedbackTable.subject"), width: "15%", align: "left" },
      {
        value: feedbackT("feedbackTable.content"),
        width: "24%",
        align: "left",
      },
      { value: feedbackT("feedbackTable.status"), width: "11%", align: "left" },
      { value: feedbackT("feedbackTable.responsed"), width: "5%", align: "left" },
    ],
    [feedbackT],
  );

  const onChangeQueries = (queries: { [key: string]: any }) => {
    const newQueries = { ...query, ...queries };
    const path = getPath(pathname, newQueries);
    push(path);

    onGetFeedback(newQueries);
  };

  const onChangePage = (newPage: number) => {
    onChangeQueries({ page: newPage, size });
  };

  const onChangeSize = (newPageSize: number) => {
    onChangeQueries({ page: 1, size: newPageSize });
  };

  const headerList = useMemo(() => {
    const additionalHeaderList = isMdSmaller
      ? MOBILE_HEADER_LIST
      : desktopHeaderList;

    return [
      ...additionalHeaderList,
      { value: "", width: isMdSmaller ? "20%" : "8%" },
    ] as CellProps[];
  }, [isMdSmaller, desktopHeaderList]);

  useEffect(() => {
    if (!isReady) return;
    onGetFeedback({ ...initQuery });
  }, [initQuery, isReady, onGetFeedback]);
  
  return (
    <>
      <FixedLayout>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          pb={0.25}
        ></Stack>
        <TableLayout
          headerList={headerList}
          noData={!isIdle && totalItems === 0}
          px={{ xs: 0, md: 3 }}
          containerHeaderProps={{
            sx: {
              maxHeight: { xs: 0, md: undefined },
              minHeight: { xs: 0, md: HEADER_HEIGHT },
            },
          }}
          sx={{ bgcolor: { xs: "grey.50", md: "transparent" } }}
        >
          {items.map((item, index) => {
            return (
              <TableRow key={index}>
                {isMdSmaller ? (
                  <MobileContentCells item={item} />
                ) : (
                  <DesktopCells item={item} />
                )}
                <ActionsCell
                  sx={{
                    pl: { xs: 0.5, md: 0 },
                    verticalAlign: { xs: "top", md: "middle" },
                    pt: { xs: 2, md: 0 },
                  }}
                  iconProps={{
                    sx: {
                      p: { xs: "4px!important", lg: 1 },
                    },
                  }}
                />
              </TableRow>
            );
          })}
        </TableLayout>
        <Pagination
          totalItems={total_page}
          totalPages={total_page}
          page={page}
          pageSize={size}
          containerProps={{ px: { md: 3 }, py: 1 }}
          onChangePage={onChangePage}
          onChangeSize={onChangeSize}
        />
      </FixedLayout>
    </>
  );
};

export default memo(ItemList);

const MOBILE_HEADER_LIST = [{ value: "", width: "100%", align: "left" }];
function onAddSnackbar(arg0: string, arg1: string) {
  throw new Error("Function not implemented.");
}
