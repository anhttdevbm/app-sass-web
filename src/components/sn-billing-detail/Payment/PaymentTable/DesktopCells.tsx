import { Box, Link, Stack } from "@mui/material";
import { BodyCell } from "components/Table";
import { Text } from "components/shared";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { CURRENCY_CODE } from "constant/enums";
import { NS_BILLING, NS_COMMON } from "constant/index";
import { BILLING_DETAIL_PATH, BILLING_INFO_PATH } from "constant/paths";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { PaymentData } from "store/billing/actions";
import { Billing, Budgets } from "store/billing/reducer";
import { formatDate, formatNumber, getPath } from "utils/index";

type DesktopCellsProps = {
  item?: PaymentData;
  order: number;
  payment_number: String;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const { item, order, payment_number } = props;
  const commonT = useTranslations(NS_COMMON);
  const billingT = useTranslations(NS_BILLING);

  return (
    <>
      {/* <BodyCell align="center">{order}</BodyCell> */}
      <BodyCell align="left">{formatDate(item?.created_time)}</BodyCell>
      <BodyCell align="left">
        <Text color="#0575E6">{payment_number}</Text>
      </BodyCell>
      <BodyCell align="left">{item?.note}</BodyCell>
      <BodyCell align="left">
        {item?.status ? (
          <Box
            sx={{
              padding: "6px 0",
              backgroundColor: "#E8F2EF",
              borderRadius: "16px",
              width: "100px",
              textAlign: "center",
            }}
          >
            <Text
              variant="body2"
              color="#0BB783"
              fontWeight={600}
              lineHeight={1.28}
              // sx={{ "&:hover": { color: "primary.main" } }}
            >
              Paid
            </Text>
          </Box>
        ) : (
          <Box
            sx={{
              padding: "6px 0",
              backgroundColor: "#FFD9E1",
              borderRadius: "16px",
              width: "100px",
              textAlign: "center",
            }}
          >
            <Text
              variant="body2"
              color="#FF2C56"
              fontWeight={600}
              lineHeight={1.28}
              // sx={{ "&:hover": { color: "primary.main" } }}
            >
              Write Off
            </Text>
          </Box>
        )}
      </BodyCell>

      <BodyCell align="left">
        {item?.status ? (
          <Text
            variant="body2"
            color="#4D4D4D"
            // fontWeight={600}
            lineHeight={1.28}
            // sx={{ "&:hover": { color: "primary.main" } }}
          >
            {formatNumber(Number(item?.amount), {
              prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
              numberOfFixed: 2,
            })}
          </Text>
        ) : (
          <Text
            variant="body2"
            color="#f78080"
            // fontWeight={600}
            lineHeight={1.28}
            // sx={{ "&:hover": { color: "primary.main" } }}
          >
            {formatNumber(Number(item?.amount), {
              prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
              numberOfFixed: 2,
            })}
          </Text>
        )}
      </BodyCell>
    </>
  );
};

export default memo(DesktopCells);
