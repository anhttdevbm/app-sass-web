import { Checkbox, TableRow } from "@mui/material";
import { BodyCell, CellProps, TableLayout } from "components/NewTable";
import DesktopCells from "components/sn-invoice/components/DesktopCell";
import { NS_INVOICE } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import { useTranslations } from "next-intl";
import { ChangeEvent, useMemo } from "react";
import { Invoice } from "store/invoice/reducer";

const MOBILE_HEADER_LIST = [{ value: "#", width: "70%", align: "left" }];

type InvoiceTableProps = {
  invoices: Invoice[];
  selectedList: Invoice[];
  onToggleSelect: (item: Invoice) => void;
  isCheckedAll: boolean;
  onChangeAll: (event: ChangeEvent<HTMLInputElement>) => void;
  isFetching: boolean;
  error?: string;
  isIdle: boolean;
  totalItems?: number;
};

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  selectedList,
  onToggleSelect,
  isCheckedAll,
  onChangeAll,
  isFetching,
  error,
  isIdle,
  totalItems,
}) => {
  const { isMdSmaller } = useBreakpoint();

  const invoiceT = useTranslations(NS_INVOICE);

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      { value: invoiceT("list.table.date"), width: "14.2%", align: "left" },
      {
        value: invoiceT("list.table.invoice"),
        width: "14.2%",
        align: "left",
      },
      { value: invoiceT("list.table.budget"), width: "14.2%", align: "left" },
      { value: invoiceT("list.table.status"), width: "14.2%", align: "left" },
      {
        value: invoiceT("list.table.dueDate"),
        width: "14.2%",
        align: "left",
      },
      { value: invoiceT("list.table.amount"), width: "14.2%", align: "left" },
      {
        value: invoiceT("list.table.balanceDue"),
        width: "14.2%",
        align: "left",
      },
    ],
    [invoiceT],
  );

  const headerList = useMemo(() => {
    const additionalHeaderList = isMdSmaller
      ? MOBILE_HEADER_LIST
      : desktopHeaderList;

    return [
      {
        value: <Checkbox checked={isCheckedAll} onChange={onChangeAll} />,
        width: isMdSmaller ? "10%" : "3%",
      },
      ...additionalHeaderList,
    ] as CellProps[];
  }, [isMdSmaller, desktopHeaderList, isCheckedAll, onChangeAll]);

  return (
    <TableLayout
      headerList={headerList}
      pending={isFetching}
      error={error as string}
      noData={!isIdle && totalItems === 0}
      containerHeaderProps={{
        sx: {
          maxHeight: { xs: 0, md: undefined },
          minHeight: { xs: 0, md: 70 },
        },
      }}
      sx={{ bgcolor: { xs: "grey.50", md: "transparent" } }}
      titleColor="#4D4D4D"
      titleWeight="400"
      titleSize="16px"
      headerProps={{
        sx: { paddingTop: 0.5, paddingBottom: 0.5 },
      }}
    >
      {invoices?.map((item) => {
        const indexSelected = selectedList.findIndex(
          (selected) => selected.id === item.id,
        );
        return (
          <TableRow key={item.id}>
            <BodyCell sx={{ pl: { xs: 0.5, md: 2 } }}>
              <Checkbox
                checked={indexSelected !== -1}
                onChange={() => onToggleSelect(item as Invoice)}
              />
            </BodyCell>
            <DesktopCells item={item} />
          </TableRow>
        );
      })}
    </TableLayout>
  );
};

export default InvoiceTable;
