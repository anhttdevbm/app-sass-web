import { memo } from "react";
import { StatementHistory } from "store/manager/reducer";
import { BodyCell } from "components/Table";
import { DATE_TIME_FORMAT_SLASH } from "constant/index";
import { formatDate, formatNumber } from "utils/index";

type DesktopCellsProps = {
  item: StatementHistory;
};

const DesktopCells = (props: DesktopCellsProps) => {
  const { item } = props;
  return (
    <>
      <BodyCell
        tooltip={formatDate(item.date_of_payment, DATE_TIME_FORMAT_SLASH)}
      >
        {formatDate(item.date_of_payment)}
      </BodyCell>
      <BodyCell tooltip={formatDate(item.expired_date, DATE_TIME_FORMAT_SLASH)}>
        {formatDate(item.expired_date)}
      </BodyCell>
      <BodyCell align="left" noWrap>
        {item.name}
      </BodyCell>
      <BodyCell>{formatNumber(item.number_of_paid)}</BodyCell>
      <BodyCell>{formatNumber(item.number_of_unpaid)}</BodyCell>
      <BodyCell>{formatNumber(item.total_account)}</BodyCell>
      <BodyCell>{formatNumber(item.amount_of_money)}</BodyCell>
    </>
  );
};

export default memo(DesktopCells);
