import { AlertColor } from "@mui/material";
import { PayStatus } from "constant/enums";
import { CompanyStatus } from "store/manager/actions";

export const TEXT_STATUS: { [key in CompanyStatus]: string } = {
  [CompanyStatus.APPROVE]: "approved",
  [CompanyStatus.REJECT]: "rejected",
};

export const TEXT_PAY_STATUS: { [key in PayStatus]: string } = {
  [PayStatus.PAID]: "paid",
  [PayStatus.UNPAID]: "unpaid",
  [PayStatus.WAITING]: "waiting",
};

export const COLOR_PAY_STATUS: { [key in PayStatus]: string } = {
  [PayStatus.PAID]: "success",
  [PayStatus.UNPAID]: "error",
  [PayStatus.WAITING]: "warning",
};

export const COLOR_STATUS: {
  [key in CompanyStatus]: AlertColor;
} = {
  [CompanyStatus.APPROVE]: "success",
  [CompanyStatus.REJECT]: "error",
};

export const WAITING_STATUS = {
  TEXT: "Waiting",
  COLOR: "warning",
};
