import { Stack, TableHead, TableRow } from "@mui/material";
import { BodyCell, CellProps, TableLayout } from "components/Table";
import { Button, IconButton, Text } from "components/shared";
import { NS_BILLING, NS_COMMON } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import TrashIcon from "icons/TrashIcon";
import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import { Bill, Billing, Budgets } from "store/billing/reducer";
import MobileContentCell from "./MobileContentCell";
import DesktopCells from "./DesktopCells";

type IProps = {
  arrBudgets?: Budgets[];
  isEdit?: boolean;
  item?: Billing;
};

const PaymentTableTop = (props: IProps) => {
  const { arrBudgets, isEdit, item } = props;

  const { isMdSmaller } = useBreakpoint();
  const commonT = useTranslations(NS_COMMON);
  const billingT = useTranslations(NS_BILLING);

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      {
        value: (
          <Text variant={"body2"} sx={{ color: "#fff" }}>
            {billingT("detail.form.payment.table.dueDate")}
          </Text>
        ),
        align: "left",
      },
      {
        value: (
          <Text variant={"body2"} sx={{ color: "#fff" }}>
            {billingT("detail.form.payment.table.totalInvoice")}
          </Text>
        ),
        align: "left",
      },
      {
        value: (
          <Text variant={"body2"} sx={{ color: "#fff" }}>
            {billingT("detail.form.payment.table.paid")}
          </Text>
        ),
        align: "left",
      },
      {
        value: (
          <Text variant={"body2"} sx={{ color: "#fff" }}>
            {billingT("detail.form.payment.table.leftToPay")}
          </Text>
        ),
      },
      {
        value: (
          <Text variant={"body2"} sx={{ color: "#fff" }}>
            {billingT("detail.form.payment.table.paid")}
          </Text>
        ),
        align: "left",
        key: "paid",
      },
      {
        value: (
          <Text variant={"body2"} sx={{ color: "#fff" }}>
            {billingT("detail.form.payment.table.leftToPay")}
          </Text>
        ),
      },
    ],
    [billingT],
  );
  const mobileHeaderList: CellProps[] = useMemo(
    () => [
      {
        value: (
          <Text variant={"body2"} sx={{ color: "#fff" }}>
            {billingT("detail.form.payment.table.dueDate")}
          </Text>
        ),
        align: "left",
      },
      {
        value: (
          <Text variant={"body2"} sx={{ color: "#fff" }}>
            {billingT("detail.form.payment.table.totalInvoice")}
          </Text>
        ),
        align: "left",
      },
      {
        value: (
          <Text variant={"body2"} sx={{ color: "#fff" }}>
            {billingT("detail.form.payment.table.paid")}
          </Text>
        ),
        align: "left",
      },
      {
        value: (
          <Text variant={"body2"} sx={{ color: "#fff" }}>
            {billingT("detail.form.payment.table.leftToPay")}
          </Text>
        ),
      },
      {
        value: (
          <Text variant={"body2"} sx={{ color: "#fff" }}>
            {billingT("detail.form.payment.table.paid")}
          </Text>
        ),
        align: "left",
        key: "paid",
      },
      {
        value: (
          <Text variant={"body2"} sx={{ color: "#fff" }}>
            {billingT("detail.form.payment.table.leftToPay")}
          </Text>
        ),
      },
    ],
    [billingT],
  );

  const headerList = useMemo(() => {
    const additionalHeaderList = isMdSmaller
      ? mobileHeaderList
      : desktopHeaderList;
    return [
      ...additionalHeaderList,

      { value: "", width: "10%" },
    ] as CellProps[];
  }, [desktopHeaderList, isMdSmaller, mobileHeaderList]);

  const findBudget = arrBudgets?.filter((budget) =>
    item?.budget?.find((budget2) => budget2.id === budget.id),
  );

  return (
    <>
      <TableLayout
        headerList={headerList}
        // pending={isFetching}
        headerProps={{
          sx: {
            px: { xs: 0.5, md: 2 },
            background: "#3699FF",
          },
        }}

        // error={error as string}
        // noData={!isIdle && totalItems === 0}
        // px={{ md: 3 }}
      >
        {/* {findBudget?.map((item, index) => { */}
        {/* //   const indexSelected = selectedList.findIndex(
          //     (selected) => selected?.id === item.id,
          //   );
          // return ( */}
        <TableRow key={item?.id}>
          {/* <BodyCell sx={{ pl: { xs: 0.5, md: 2 } }}>
            <Checkbox
              checked={indexSelected !== -1}
              onChange={onToggleSelect(item, indexSelected)}
            />
          </BodyCell> */}
          {isMdSmaller ? (
            <MobileContentCell />
          ) : (
            <DesktopCells
              // item={item}
              order={0}
            />
          )}
          {/* <BodyCell align="left" sx={{ px: { xs: 0.5, md: 2 } }}>
            <IconButton
              // onClick={onActionToItem(DataAction.UPDATE, item)}
              tooltip={commonT("delete")}
              variant="normal"
              size="small"
              sx={{
                // backgroundColor: isDarkMode ? "grey.50" : "primary.light",
                color: "text.primary",
                p: { xs: "4px!important", md: 1 },
                "&:hover svg": {
                  color: "common.white",
                },
              }}
            >
              <TrashIcon fontSize="small" />
            </IconButton>
          </BodyCell> */}
        </TableRow>
        {/* );
        })} */}
      </TableLayout>
    </>
  );
};

export default memo(PaymentTableTop);
