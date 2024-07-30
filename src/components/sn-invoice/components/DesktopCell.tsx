import { BodyCell, StatusCell } from "components/NewTable";
import { COLOR_STATUS, TEXT_STATUS } from "components/sn-invoice/helpers";
import { NS_BILLING } from "constant/index";
import dayjs from "dayjs";
import { memo } from "react";
import { Invoice } from "store/invoice/reducer";

type DesktopCellsProps = {
  item: Invoice;
};

const DATE_FORMAT = "DD/MM/YYYY";

const DesktopCells = (props: DesktopCellsProps) => {
  const { due_date, invoice_date, invoice_number, note, budget_name } =
    props.item;

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
      >
        {invoice_number}
      </BodyCell>
      <BodyCell align="left" textProps={{ color: "neutral.800", fontSize: 16 }}>
        {budget_name}
      </BodyCell>
      <StatusCell
        namespace={NS_BILLING}
        text={note ?? "unknown status"}
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
        No Data
      </BodyCell>
      <BodyCell align="left" textProps={{ color: "neutral.800", fontSize: 16 }}>
        No Data
      </BodyCell>
    </>
  );
};

export default memo(DesktopCells);
