import { AlertColor } from "@mui/material";
import { PayStatus } from "constant/enums";

export const TEXT_STATUS: { [key in PayStatus]: string } = {
  [PayStatus.ACTIVE]: "employees.paid",
  [PayStatus.UNPAID]: "employees.unPaid",
  [PayStatus.PENDING]: "employees.waiting",
  [PayStatus.EXPIRED]: "employees.expirationDate",
};

export const COLOR_STATUS: { [key in PayStatus]: AlertColor } = {
  [PayStatus.ACTIVE]: "success",
  [PayStatus.UNPAID]: "info",
  [PayStatus.PENDING]: "warning",
  [PayStatus.EXPIRED]: "error",
};
