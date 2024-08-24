import { InvoiceStatus } from "constant/enums";

export const TEXT_STATUS: { [key in InvoiceStatus]: string } = {
  [InvoiceStatus.DRAFT]: "list.table.draft",
};

export const COLOR_STATUS: { [key in InvoiceStatus]: string } = {
  [InvoiceStatus.DRAFT]: "grey.400",
};
