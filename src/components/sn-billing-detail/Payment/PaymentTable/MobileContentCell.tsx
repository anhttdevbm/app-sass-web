import { Stack } from "@mui/material";
import Link from "components/Link";
import { BodyCell } from "components/Table";
import { Text } from "components/shared";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { CURRENCY_CODE } from "constant/enums";
import { NS_BILLING, NS_COMMON } from "constant/index";
import { BILLING_INFO_PATH } from "constant/paths";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { PaymentData } from "store/billing/actions";
import { Billing, Budgets } from "store/billing/reducer";
import { formatDate, formatNumber, getPath } from "utils/index";

type MobileContentCellProps = {
  item?: PaymentData;
};

type InformationItemProps = {
  label: string;
  children?: string | React.ReactNode;
  href?: string;
};

const MobileContentCell = (props: MobileContentCellProps) => {
  const { item } = props;
  const t = useTranslations(NS_COMMON);
  const billingT = useTranslations(NS_BILLING);
  return (
    <>
      <BodyCell align="left">
        <Text
          variant="body2"
          color="#1BC5BD"
          fontWeight={600}
          lineHeight={1.28}
          // sx={{ "&:hover": { color: "primary.main" } }}
        >
          {item?.status}
        </Text>
      </BodyCell>

      <BodyCell align="left" sx={{ paddingLeft: 0 }}>
        {formatDate(item?.date)}
      </BodyCell>

      <BodyCell align="left">
        {item?.overdue + " " + billingT("detail.form.payment.table2.date")}
      </BodyCell>
      <BodyCell align="left">
        <Text
          variant="body2"
          color="#1BC5BD"
          // fontWeight={600}
          lineHeight={1.28}
          // sx={{ "&:hover": { color: "primary.main" } }}
        >
          {formatNumber(item?.amount, {
            prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
            numberOfFixed: 2,
          })}
        </Text>
      </BodyCell>
      <BodyCell align="left">{item?.note}</BodyCell>
    </>
  );
};

export default memo(MobileContentCell);
