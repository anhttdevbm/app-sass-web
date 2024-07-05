import { memo } from "react";
import { Stack } from "@mui/material";
import { Text } from "components/shared";
import { formatDate, formatNumber } from "utils/index";
import { BodyCell } from "components/Table";
import { StatementHistory } from "store/manager/reducer";

type MobileContentCellProps = {
  item: StatementHistory;
};

type InformationItemProps = {
  label: string;
  children?: string | React.ReactNode;
};

const MobileContentCell = (props: MobileContentCellProps) => {
  const { item } = props;
  return (
    <BodyCell align="left">
      <Stack spacing={2} py={1.5}>
        <Text variant="h5">{item.name}</Text>
        <InformationItem label="Date of payment">
          {formatDate(item.date_of_payment)}
        </InformationItem>
        <InformationItem label="Expiration date">
          {formatDate(item.expired_date)}
        </InformationItem>
        <InformationItem label="Unpaid account">
          {formatNumber(item.number_of_unpaid)}
        </InformationItem>
        <InformationItem label="Paid account">
          {formatNumber(item.number_of_paid)}
        </InformationItem>
        <InformationItem label="Total account">
          {formatNumber(item.total_account)}
        </InformationItem>
        <InformationItem label="Amount of money">
          {formatNumber(item.amount_of_money)}
        </InformationItem>
      </Stack>
    </BodyCell>
  );
};

export default memo(MobileContentCell);

const InformationItem = (props: InformationItemProps) => {
  const { label, children = "--" } = props;

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Text variant="caption" color="grey.400" width={120}>
        {label}
      </Text>

      {typeof children === "string" ? (
        <Text variant="body2" noWrap>
          {children}
        </Text>
      ) : (
        children
      )}
    </Stack>
  );
};
