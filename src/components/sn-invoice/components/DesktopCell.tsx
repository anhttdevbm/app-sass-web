import { BodyCell, StatusCell } from "components/NewTable";
import { COLOR_STATUS, TEXT_STATUS } from "components/sn-invoice/helpers";
import { NS_BILLING } from "constant/index";
import dayjs from "dayjs";
import { memo } from "react";
import { Billing } from "store/billing/reducer";

type DesktopCellsProps = {
  item: Billing;
};

const DATE_FORMAT = "DD/MM/YYYY";

const DesktopCells = (props: DesktopCellsProps) => {
  const { date, invoiceNumber, budget, status, dueDate, amount } = props.item;

  return (
    <>
      <BodyCell
        align="left"
        textProps={{ color: "neutral.800", fontSize: 16 }}
        tooltip={dayjs(date).format(DATE_FORMAT)}
      >
        {dayjs(date).format(DATE_FORMAT)}
      </BodyCell>
      <BodyCell
        align="left"
        textProps={{
          color: "blue.normal",
          fontWeight: "500",
          fontSize: 13,
        }}
      >
        {invoiceNumber}
      </BodyCell>
      <BodyCell align="left" textProps={{ color: "neutral.800", fontSize: 16 }}>
        {budget ? budget.map((b) => b.name).join(", ") : "No budget"}
      </BodyCell>
      <StatusCell
        namespace={NS_BILLING}
        text={
          status !== undefined
            ? TEXT_STATUS.DRAFT + `.${status}`
            : "Unknown Status"
        }
        color={status !== undefined ? COLOR_STATUS[status] : "grey.900"}
        width={93}
        align="left"
        textProps={{ px: 0 }}
      />
      <BodyCell
        align="left"
        textProps={{ color: "neutral.800", fontSize: 16 }}
        tooltip={dayjs(dueDate).format(DATE_FORMAT)}
      >
        {dayjs(dueDate).format(DATE_FORMAT)}
      </BodyCell>
      <BodyCell align="left" textProps={{ color: "neutral.800", fontSize: 16 }}>
        {amount}
      </BodyCell>
      <BodyCell
        align="left"
        textProps={{ color: "neutral.800", fontSize: 16 }}
        tooltip={dayjs(dueDate).format(DATE_FORMAT)}
      >
        {dayjs(dueDate).format(DATE_FORMAT)}
      </BodyCell>
    </>
  );
};

export default memo(DesktopCells);
