import { AlertColor } from "@mui/material";
import { PayStatus } from "constant/enums";
import { CompanyStatus } from "store/manager/actions";

export const TEXT_STATUS: { [key in CompanyStatus]: string } = {
  [CompanyStatus.APPROVE]: "approved",
  [CompanyStatus.REJECT]: "rejected",
};

export const TEXT_PAY_STATUS: { [key in PayStatus]: string } = {
  [PayStatus.ACTIVE]: "paid",
  [PayStatus.UNPAID]: "unpaid",
  [PayStatus.PENDING]: "waiting",
  [PayStatus.EXPIRED]: "error",
};

export const COLOR_PAY_STATUS: { [key in PayStatus]: string } = {
  [PayStatus.ACTIVE]: "success",
  [PayStatus.UNPAID]: "error",
  [PayStatus.PENDING]: "warning",
  [PayStatus.EXPIRED]: "error",
};

export const COLOR_STATUS: {
  [key in CompanyStatus]: AlertColor;
} = {
  [CompanyStatus.APPROVE]: "success",
  [CompanyStatus.REJECT]: "error",
};

export const WAITING_STATUS = {
  TEXT: "waiting",
  COLOR: "warning",
};
