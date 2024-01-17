import { Box, TableRow } from "@mui/material";
import { BodyCell, CellProps, TableLayout } from "components/Table";
import { Checkbox } from "components/shared";
import { NS_BUDGETING } from "constant/index";
import { useTranslations } from "next-intl";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

type TInvoice = {
  id: string;
  subject: string;
  invoiceNumber: string;
  date: string;
  att: string;
  amountNoTax: string;
  amountUnpaid: string;
  dueDate: string;
};

const TemplateData: TInvoice[] = [
  {
    id: "aa11",
    subject: "Weebsite develop",
    invoiceNumber: "353467",
    date: "8/07/2022",
    att: "",
    amountNoTax: "$500.00",
    amountUnpaid: "$500.00",
    dueDate: "8/07/2022",
  },
  {
    id: "aa22",
    subject: "Weebsite 222",
    invoiceNumber: "111111",
    date: "8/07/2022",
    att: "",
    amountNoTax: "$500.00",
    amountUnpaid: "$500.00",
    dueDate: "8/07/2022",
  },
];

export const Invoice = () => {
  const [invoices, setInvoices] = useState<TInvoice[]>([]);
  const [invoiceSelected, setInvoiceSelected] = useState<string[]>([]);

  const budgetT = useTranslations(NS_BUDGETING);

  useEffect(() => {
    setInvoices(TemplateData);
  }, []);

  const handleSelecteAllInvoice = (
    event: ChangeEvent<HTMLInputElement>,
    isChecked: boolean,
  ) => {
    if (!isChecked) {
      setInvoiceSelected([]);
      return;
    }
    const allInvoiceIds = invoices.map((invoice) => invoice.id);
    setInvoiceSelected(allInvoiceIds);
  };

  const handleSelectInvoice = (
    event: ChangeEvent<HTMLInputElement>,
    isChecked: boolean,
  ) => {
    const id = String(event.target.value);

    const indexIdInInvoiceSelected = invoiceSelected.findIndex(
      (expenseId) => expenseId === id,
    );

    if (isChecked) {
      if (indexIdInInvoiceSelected === -1) {
        invoiceSelected.push(id);
      }
    } else {
      delete invoiceSelected[indexIdInInvoiceSelected];
    }

    setInvoiceSelected(invoiceSelected.filter(Boolean));
  };

  const headerList = useMemo(
    (): CellProps[] => [
      {
        value: (
          <Checkbox
            checked={invoiceSelected.length === invoices.length}
            onChange={handleSelecteAllInvoice}
          />
        ),
        align: "center",
        width: "3%",
      },
      { value: budgetT("tabInvoice.subject"), align: "center" },
      { value: budgetT("tabInvoice.invoiceNumber"), align: "center" },
      { value: budgetT("tabInvoice.date"), align: "center" },
      { value: budgetT("tabInvoice.att"), align: "center" },
      {
        value: budgetT("tabInvoice.amountNoTax"),
        data: "$56.000.000",
        align: "center",
      },
      {
        value: budgetT("tabInvoice.amountUnpaid"),
        data: "$56.000.000",
        align: "center",
      },
      { value: budgetT("tabInvoice.dueDate"), align: "center" },
    ],
    [invoices, invoiceSelected],
  );

  return (
    <Box p="15px">
      <TableLayout headerList={headerList} noData={false} titleColor="grey.300">
        {invoices.map((data, index) => {
          const indexIdInInvoiceSelected = invoiceSelected.findIndex(
            (inoviceId) => inoviceId === data.id,
          );
          return (
            <TableRow key={`budget-invoice-${index}`}>
              <BodyCell>
                <Checkbox
                  checked={indexIdInInvoiceSelected !== -1}
                  value={data.id}
                  onChange={handleSelectInvoice}
                />
              </BodyCell>
              <BodyCell>{data.subject}</BodyCell>
              <BodyCell>{data.invoiceNumber}</BodyCell>
              <BodyCell>{data.date}</BodyCell>
              <BodyCell>{data.att}</BodyCell>
              <BodyCell>{data.amountNoTax}</BodyCell>
              <BodyCell>{data.amountUnpaid}</BodyCell>
              <BodyCell>
                <span style={{ color: "red" }}>{data.dueDate}</span>
              </BodyCell>
            </TableRow>
          );
        })}
      </TableLayout>
    </Box>
  );
};
