import { Stack } from "@mui/material";
import Link from "components/Link";
import { BodyCell } from "components/Table";
import { Text } from "components/shared";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { CURRENCY_CODE } from "constant/enums";
import { NS_COMMON } from "constant/index";
import { BILLING_INFO_PATH } from "constant/paths";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { Billing, Budgets } from "store/billing/reducer";
import { formatDate, formatNumber, getPath } from "utils/index";

type dataPaid = {
  paid?: number;
  leftToPay?: number;
};
type MobileContentCellProps = {
  item?: Billing;
  dataPaid?: dataPaid;
  dataWriteOff?: number;
};

type InformationItemProps = {
  label: string;
  children?: string | React.ReactNode;
  href?: string;
};

const MobileContentCell = (props: MobileContentCellProps) => {
  const { item, dataPaid, dataWriteOff } = props;
  const t = useTranslations(NS_COMMON);
  return (
    <>
      <BodyCell align="left">{formatDate(item?.dueDate)}</BodyCell>

      <BodyCell align="left">
        {formatNumber(item?.amount, {
          prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
          numberOfFixed: 2,
        })}
      </BodyCell>

      <BodyCell align="left">
        {formatNumber(dataPaid?.paid, {
          prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
          numberOfFixed: 2,
        })}
      </BodyCell>
      <BodyCell align="left">
        {formatNumber(
          dataWriteOff && dataPaid
            ? (dataPaid?.leftToPay ?? 0) + dataWriteOff
            : 0,
          {
            prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
            numberOfFixed: 2,
          },
        )}
      </BodyCell>
    </>
  );
};

export default memo(MobileContentCell);
