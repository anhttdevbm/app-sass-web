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
  item?: Budgets;
  order: number;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const { item, order } = props;
  const commonT = useTranslations(NS_COMMON);

  return (
    <>
      {/* <BodyCell align="center">{order}</BodyCell> */}
      <BodyCell align="left">
        <Text
          variant="body2"
          color="#1BC5BD"
          fontWeight={600}
          lineHeight={1.28}
          // sx={{ "&:hover": { color: "primary.main" } }}
        >
          {item?.name}
        </Text>
      </BodyCell>

      <BodyCell align="left" sx={{ paddingLeft: 0 }}>
        {formatDate(item?.start_date) + " - " + formatDate(item?.end_date)}
      </BodyCell>

      <BodyCell align="center">
        {formatNumber(item?.revenue, {
          suffix: CURRENCY_CODE.USD,
          numberOfFixed: 2,
        })}
      </BodyCell>
      <BodyCell align="center">
        {formatNumber(item?.revenuePJ, {
          suffix: CURRENCY_CODE.USD,
          numberOfFixed: 2,
        })}
      </BodyCell>
    </>
  );
};

export default memo(DesktopCells);
