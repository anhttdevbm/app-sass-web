/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack, TableRow, Typography } from "@mui/material";
import { BodyCell, CellProps, TableLayout } from "components/Table";
import { Button, Checkbox, Text } from "components/shared";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { CURRENCY_CODE } from "constant/enums";
import { NS_BUDGETING } from "constant/index";
import { BILLING_INFO_PATH, BUDGET_INVOICE_EXPORT_PATH } from "constant/paths";
import useBreakpoint from "hooks/useBreakpoint";
import FolderIcon from "icons/FolderIcon";
import _ from "lodash";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useParams } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Billing } from "store/billing/reducer";
import { useBillings } from "store/billing/selectors";
import { formatDate, formatNumber, getPath } from "utils/index";

export const Invoice = () => {
  const [invoiceSelected, setInvoiceSelected] = useState<string[]>([]);

  const { id } = useParams();
  const { push } = useRouter();
  const { isMdSmaller } = useBreakpoint();

  const {
    items,
    totalAmount,
    totalAmountUnpaid,
    onGetBillings,
  } = useBillings();
  const budgetT = useTranslations(NS_BUDGETING);

  useEffect(() => {
    if (id) {
      onGetBillings({ budgetId: id as string });
    }
  }, [id]);

  const onChangeAll = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      if (isChecked) {
        setInvoiceSelected(_.map(items || [], (item: any) => item?.id || ""));
      } else {
        setInvoiceSelected([]);
      }
    },
    [items],
  );

  const isCheckedAll = useMemo(
    () =>
      Boolean(
        invoiceSelected.length && invoiceSelected.length === items?.length,
      ),
    [invoiceSelected.length, items?.length],
  );

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      {
        value: budgetT("tabInvoice.subject"),
        align: "center",
      },
      {
        value: budgetT("tabInvoice.invoiceNumber"),
        align: "center",
      },
      {
        value: budgetT("tabInvoice.date"),
        align: "center",
      },
      { value: budgetT("tabInvoice.att"), align: "center" },
      {
        value: (
          <>
            <Stack>
              {budgetT("tabInvoice.amount")}
              <Text variant={"body2"} align="center" fontWeight={600}>
                {formatNumber(totalAmount, {
                  prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                  numberOfFixed: 2,
                })}
              </Text>
            </Stack>
          </>
        ),
        align: "center",
      },
      {
        value: (
          <>
            <Stack>
              {budgetT("tabInvoice.amountUnpaid")}
              <Text variant={"body2"} align="center" fontWeight={600}>
                {formatNumber(totalAmountUnpaid, {
                  prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                  numberOfFixed: 2,
                })}
              </Text>
            </Stack>
          </>
        ),
        align: "center",
      },
      {
        value: budgetT("tabInvoice.dueDate"),
        align: "center",
      },
    ],
    [budgetT, totalAmount, totalAmountUnpaid],
  );
  const mobileHeaderList: CellProps[] = useMemo(
    () => [
      {
        value: budgetT("list.table.subject"),
        align: "center",
      },
      {
        value: budgetT("list.table.invoiceNumber"),
        align: "center",
      },
      {
        value: budgetT("list.table.date"),
        align: "center",
      },
      { value: budgetT("list.table.budgets"), align: "center" },
      { value: budgetT("list.table.att"), align: "center" },
      {
        value: (
          <>
            <Stack>
              {budgetT("list.table.amount")}
              <Text variant={"body2"} align="center" fontWeight={600}>
                {formatNumber(totalAmount, {
                  prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                  numberOfFixed: 2,
                })}
              </Text>
            </Stack>
          </>
        ),
        align: "center",
      },
      {
        value: (
          <>
            <Stack>
              {budgetT("list.table.amountUnpaid")}
              <Text variant={"body2"} align="center" fontWeight={600}>
                {formatNumber(totalAmountUnpaid, {
                  prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                  numberOfFixed: 2,
                })}
              </Text>
            </Stack>
          </>
        ),
        align: "center",
      },
      { value: budgetT("list.table.dueDate"), align: "center" },
    ],
    [budgetT, totalAmount, totalAmountUnpaid],
  );

  const headerList = useMemo(() => {
    const additionalHeaderList = isMdSmaller
      ? mobileHeaderList
      : desktopHeaderList;
    return [
      // {
      //   value: <Checkbox checked={isCheckedAll} onChange={onChangeAll} />,
      //   width: isMdSmaller ? "10%" : "3%",
      //   align: "center",
      // },
      ...additionalHeaderList,
      { value: "", width: "10%" },
    ] as CellProps[];
  }, [
    desktopHeaderList,
    isMdSmaller,
    mobileHeaderList,
    isCheckedAll,
    onChangeAll,
  ]);

  // const onChangeQueries = (queries: { [key: string]: any }) => {
  //   const newQueries: any = clearNullField({ budgetId: id, ...queries });
  //   onGetBillings(newQueries);
  // };

  // const onChangePage = (newPage: number) => {
  //   onChangeQueries({ page: newPage, size });
  // };

  // const onChangeSize = (newPageSize: number) => {
  //   onChangeQueries({ page: 1, size: newPageSize });
  // };

  // const onToggleSelect = (item: Billing, indexSelected: number) => {
  //   return () => {
  //     if (indexSelected === -1) {
  //       setInvoiceSelected((prevList) => [...prevList, item]);
  //     } else {
  //       setInvoiceSelected((prevList) => {
  //         const newList = [...prevList];
  //         newList.splice(indexSelected, 1);
  //         return newList;
  //       });
  //     }
  //   };
  // };

  const onOpenModalExport = (value: Billing) => {
    push(
      getPath(BUDGET_INVOICE_EXPORT_PATH, undefined, { id: value?.id ?? "" }),
    );
  };

  const handleSelectInvoice = (
    event: ChangeEvent<HTMLInputElement>,
    isChecked: boolean,
  ) => {
    const id = String(event.target.value);

    const indexIdInInvoiceSelected = invoiceSelected.findIndex(
      (expenseId) => expenseId === id,
    );

    if (isChecked) {
      if (indexIdInInvoiceSelected === -1) {
        invoiceSelected.push(id);
      }
    } else {
      delete invoiceSelected[indexIdInInvoiceSelected];
    }

    setInvoiceSelected(invoiceSelected.filter(Boolean));
  };

  return (
    <Box p="15px">
      <TableLayout headerList={headerList} noData={false} titleColor="grey.300">
        {_.map(items || [], (data, index) => {
          const indexIdInInvoiceSelected = invoiceSelected.findIndex(
            (inoviceId) => inoviceId === data.id,
          );
          return (
            <TableRow
              key={`budget-invoice-${index}`}
              sx={{
                "& > *": { borderBottom: "none !important" },
                minHeight: 100,
                minWidth: {
                  md: 1320,
                  xs: 1320,
                  overflow: "visible",
                },
                width: "100%",
              }}
            >
              {/* <BodyCell sx={{ minWidth: 60 }}>
                <Checkbox
                  checked={indexIdInInvoiceSelected !== -1}
                  value={data.id}
                  onChange={handleSelectInvoice}
                />
              </BodyCell> */}
              <BodyCell>
                <Typography
                  sx={{ fontWeight: 700, cursor: "pointer" }}
                  onClick={() => {
                    push(getPath(BILLING_INFO_PATH, undefined, { id: data?.id || "" }));
                  }}
                >
                  {_.get(data, "subject", "")}
                </Typography>
              </BodyCell>
              <BodyCell>{_.get(data, "invoiceNumber", "")}</BodyCell>
              <BodyCell>{formatDate(data?.date)}</BodyCell>
              <BodyCell>
                <Button onClick={() => onOpenModalExport(data ?? {})}>
                  <FolderIcon />
                </Button>
              </BodyCell>
              <BodyCell>
                {formatNumber(_.get(data, "amount", 0), {
                  prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                  numberOfFixed: 2,
                })}
              </BodyCell>
              <BodyCell>
                {formatNumber(_.get(data, "amount_unpaid", 0), {
                  prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                  numberOfFixed: 2,
                })}
              </BodyCell>
              <BodyCell>
                <Typography component="span">
                  {formatDate(data?.dueDate)}
                </Typography>{" "}
              </BodyCell>
            </TableRow>
          );
        })}
      </TableLayout>

      {/* <Pagination
        totalItems={totalItems}
        totalPages={total_page}
        page={page}
        pageSize={size}
        containerProps={{ px: { md: 3 }, py: 1 }}
        onChangePage={onChangePage}
        onChangeSize={onChangeSize}
      /> */}
    </Box>
  );
};
