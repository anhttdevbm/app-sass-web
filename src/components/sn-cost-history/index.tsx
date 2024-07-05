"use client";

import { Stack } from "@mui/material";
import { Text } from "components/shared";
import { memo, useEffect } from "react";
import { useCostHistory } from "store/company/selectors";
import Item from "./Item";
import StatusServer from "components/StatusServer";
import { DEFAULT_PAGING, NS_COMPANY } from "constant/index";
import useQueryParams from "hooks/useQueryParams";
import Pagination from "components/Pagination";
import { usePathname, useRouter } from "next-intl/client";
import { getPath } from "utils/index";
import { useTranslations } from "next-intl";
import FixedLayout from "components/FixedLayout";

const CostHistoryPage = () => {
  const {
    items,
    isFetching,
    error,
    isIdle,
    totalItems,
    totalPages,
    pageIndex,
    pageSize,
    onGetCostHistory,
  } = useCostHistory();

  const companyT = useTranslations(NS_COMPANY);

  const { initQuery, isReady, query } = useQueryParams();
  const pathname = usePathname();
  const { push } = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeQueries = (queries: { [key: string]: any }) => {
    const newQueries = { ...query, ...queries };
    const path = getPath(pathname, newQueries);
    push(path);

    onGetCostHistory(newQueries);
  };

  const onChangePage = (newPage: number) => {
    onChangeQueries({ pageIndex: newPage, pageSize });
  };

  const onChangeSize = (newPageSize: number) => {
    onChangeQueries({ pageIndex: 1, pageSize: newPageSize });
  };

  useEffect(() => {
    if (!isReady) return;
    onGetCostHistory({ ...DEFAULT_PAGING, ...initQuery });
  }, [initQuery, isIdle, isReady, onGetCostHistory]);

  return (
    <FixedLayout flex={1}>
      <Stack p={{ xs: 1, sm: 3 }} spacing={2}>
        <Text variant="h5">{companyT("costHistory.title")}</Text>
        <StatusServer isFetching={isFetching} error={error}>
          <Stack width="100%">
            {items.map((item) => (
              <Item key={item.id} {...item} />
            ))}
          </Stack>

          <Pagination
            totalItems={totalItems}
            totalPages={totalPages}
            page={pageIndex}
            pageSize={pageSize}
            onChangePage={onChangePage}
            onChangeSize={onChangeSize}
          />
        </StatusServer>
      </Stack>
    </FixedLayout>
  );
};

export default memo(CostHistoryPage);
