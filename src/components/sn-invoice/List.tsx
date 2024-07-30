"use client";

import FixedLayout from "components/FixedLayout";
import Pagination from "components/NewPagination";
import { useTranslations } from "next-intl";
import { NS_INVOICE } from "constant/index";
import useQueryParams from "hooks/useQueryParams";
import { usePathname } from "next-intl/client";
import useBreakpoint from "hooks/useBreakpoint";
import { getPath } from "utils/index";
import { useBillings } from "store/billing/selectors";
import { Billing } from "store/billing/reducer";
import { useInvoiceSelection } from "components/sn-invoice/hooks/useInvoiceSelection";
import { usePagination } from "components/sn-invoice/hooks/usePagination";
import InvoiceTable from "components/sn-invoice/components/InvoiceTable";
import { useEffect } from "react";
import { Stack } from "@mui/system";
import { useInvoices } from "store/invoice/selectors";

const List = () => {
  const {
    items: invoices,
    onGetInvoices,
    totalItems,
    total_page: totalPages,
    error,
    isFetching,
    isIdle,
  } = useInvoices();

  const {
    selectedList,
    setSelectedList,
    isCheckedAll,
    toggleSelectAll,
    toggleSelectItem,
  } = useInvoiceSelection(invoices);

  const { pageIndex, pageSize, onChangeSize, onChangePage } = usePagination(
    1,
    10,
    (page, size) => {
      onGetInvoices({ page, size });
    },
  );

  const invoiceT = useTranslations(NS_INVOICE);

  const { initQuery, isReady, query } = useQueryParams();
  const pathname = usePathname();
  const { isMdSmaller } = useBreakpoint();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeQueries = (queries: { [key: string]: any }) => {
    const newQueries = {
      ...query,
      ...queries,
    };
    const path = getPath(pathname, newQueries);
    window.history.pushState(
      { ...window.history.state, as: path, url: path },
      "",
      path,
    );

    onGetInvoices({ ...newQueries });
  };

  useEffect(() => {
    if (isReady) {
      onGetInvoices({ ...initQuery });
    }
  }, [isReady, onGetInvoices, initQuery]);

  return (
    <Stack padding={"0px 16px"} overflow={"hidden"}>
      <FixedLayout sxContainer={{ bgcolor: "transparent" }}>
        <InvoiceTable
          invoices={invoices}
          selectedList={selectedList}
          onToggleSelect={toggleSelectItem}
          isCheckedAll={isCheckedAll}
          onChangeAll={toggleSelectAll}
          isFetching={isFetching}
          error={error}
          isIdle={isIdle}
          totalItems={totalItems}
        />

        <Pagination
          totalItems={totalItems}
          totalPages={totalPages}
          page={pageIndex}
          pageSize={pageSize}
          containerProps={{ px: { md: 3 }, py: 1 }}
          onChangePage={onChangePage}
          onChangeSize={onChangeSize}
        />
      </FixedLayout>
    </Stack>
  );
};

export default List;
