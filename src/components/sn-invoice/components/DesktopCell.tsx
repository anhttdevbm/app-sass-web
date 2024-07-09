import { memo } from "react";
import dayjs from "dayjs";
import { BodyCell, StatusCell } from "components/NewTable";
import { NS_BILLING } from "constant/index";
import { Billing } from "store/billing/reducer";
import { COLOR_STATUS, TEXT_STATUS } from "components/sn-invoice/helpers";

type DesktopCellsProps = {
  item: Billing;
};

const DATE_FORMAT = "DD/MM/YYYY";

const DesktopCells = (props: DesktopCellsProps) => {
  const { date, invoiceNumber, budget, status, dueDate, amount } = props.item;

  return (
    <>
      <BodyCell align="left" tooltip={dayjs(date).format(DATE_FORMAT)}>
        {dayjs(date).format(DATE_FORMAT)}
      </BodyCell>
      <BodyCell align="left">{invoiceNumber}</BodyCell>
      <BodyCell align="left">
        {budget ? budget.map((b) => b.name).join(", ") : "No budget"}
      </BodyCell>
      <StatusCell
        namespace={NS_BILLING}
        text={status !== undefined ? TEXT_STATUS[status] : "Unknown Status"}
        color={status !== undefined ? COLOR_STATUS[status] : "grey.900"}
        width={93}
      />
      <BodyCell align="left" tooltip={dayjs(dueDate).format(DATE_FORMAT)}>
        {dayjs(dueDate).format(DATE_FORMAT)}
      </BodyCell>
      <BodyCell align="left">{amount}</BodyCell>
      <BodyCell align="left" tooltip={dayjs(dueDate).format(DATE_FORMAT)}>
        {dayjs(dueDate).format(DATE_FORMAT)}
      </BodyCell>
    </>
  );
};

export default memo(DesktopCells);
