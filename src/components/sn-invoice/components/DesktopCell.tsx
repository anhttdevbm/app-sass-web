import { BodyCell, StatusCell } from "components/NewTable";
import { COLOR_STATUS, TEXT_STATUS } from "components/sn-invoice/helpers";
import { NS_BILLING } from "constant/index";
import { INVOICE_INFO_PATH } from "constant/paths";
import dayjs from "dayjs";
import { memo } from "react";
import { Invoice } from "store/invoice/reducer";
import { getPath } from "utils/index";

type DesktopCellsProps = {
  item: Invoice;
};

const DATE_FORMAT = "DD/MM/YYYY";

const DesktopCells = (props: DesktopCellsProps) => {
  const {
    due_date,
    invoice_date,
    invoice_number,
    budget_name,
    status,
    total,
    balance_due,
  } = props.item;

  return (
    <>
      <BodyCell
        align="left"
        textProps={{ color: "neutral.800", fontSize: 16 }}
        tooltip={dayjs(invoice_date).format(DATE_FORMAT)}
      >
        {dayjs(invoice_date).format(DATE_FORMAT)}
      </BodyCell>
      <BodyCell
        align="left"
        textProps={{
          color: "blue.normal",
          fontWeight: "500",
          fontSize: 13,
        }}
        href={getPath(INVOICE_INFO_PATH, undefined, {
          id: invoice_number ?? "",
        })}
      >
        {invoice_number}
      </BodyCell>
      <BodyCell align="left" textProps={{ color: "neutral.800", fontSize: 16 }}>
        {budget_name}
      </BodyCell>
      <StatusCell
        namespace={NS_BILLING}
        text={status ? "Sent" : "Draft"}
        color={status !== undefined ? COLOR_STATUS[status] : "grey.900"}
        width={93}
        align="left"
        textProps={{ px: 0 }}
      />
      <BodyCell
        align="left"
        textProps={{ color: "neutral.800", fontSize: 16 }}
        tooltip={dayjs(due_date).format(DATE_FORMAT)}
      >
        {dayjs(due_date).format(DATE_FORMAT)}
      </BodyCell>
      <BodyCell align="left" textProps={{ color: "neutral.800", fontSize: 16 }}>
        {total}
      </BodyCell>
      <BodyCell align="left" textProps={{ color: "neutral.800", fontSize: 16 }}>
        {balance_due}
      </BodyCell>
    </>
  );
};

export default memo(DesktopCells);
