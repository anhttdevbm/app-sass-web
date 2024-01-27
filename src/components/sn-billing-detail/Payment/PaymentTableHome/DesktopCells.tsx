import { Link, Stack } from "@mui/material";
import { BodyCell } from "components/Table";
import { Text } from "components/shared";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { CURRENCY_CODE } from "constant/enums";
import { NS_COMMON } from "constant/index";
import { BILLING_DETAIL_PATH, BILLING_INFO_PATH } from "constant/paths";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { Billing, Budgets } from "store/billing/reducer";
import { formatDate, formatNumber, getPath } from "utils/index";

type DesktopCellsProps = {
  item?: Billing;
  order: number;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const { item, order } = props;
  const commonT = useTranslations(NS_COMMON);

  return (
    <>
      {/* <BodyCell align="center">{order}</BodyCell> */}
      <BodyCell align="left">{formatDate(item?.dueDate)}</BodyCell>

      <BodyCell align="left" sx={{ paddingLeft: 0 }}>
        {formatNumber(item?.amount, {
          prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
          numberOfFixed: 2,
        })}
      </BodyCell>

      <BodyCell align="left">
        {formatNumber(item?.amount, {
          prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
          numberOfFixed: 2,
        })}
      </BodyCell>
      <BodyCell align="left">
        {formatNumber(item?.amount_unpaid, {
          prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
          numberOfFixed: 2,
        })}
      </BodyCell>
    </>
  );
};

export default memo(DesktopCells);
