import { AlertColor } from "@mui/material";
import { PayStatus } from "constant/enums";

export const TEXT_STATUS: { [key in PayStatus]: string } = {
  [PayStatus.PAID]: "employees.paid",
  [PayStatus.UNPAID]: "employees.unPaid",
  [PayStatus.WAITING]: "employees.waiting",
};

export const COLOR_STATUS: { [key in PayStatus]: AlertColor } = {
  [PayStatus.PAID]: "success",
  [PayStatus.UNPAID]: "info",
  [PayStatus.WAITING]: "warning",
};
