import { AlertColor } from "@mui/material";
import { BillingStatus } from "store/billing/actions";

export const TEXT_STATUS: { [key in BillingStatus]: string } = {
  [BillingStatus.OPEN]: "OPEN",
  [BillingStatus.PAID]: "PAID",
  [BillingStatus.UNPAID]: "UNPAID",
};

export const COLOR_STATUS: { [key in BillingStatus]: AlertColor } = {
  [BillingStatus.OPEN]: "warning",
  [BillingStatus.PAID]: "error",
  [BillingStatus.UNPAID]: "success",
};

export type Member = {
  id: string;
  fullname: string;
};

export const INITIAL_VALUES = {
  name: "",
  owner: "",
  start_date: "",
  end_date: "",
  expected_cost: "",
  working_hours: "",
  description: "",
  members: [],
  type_project: "",
};

export const STATUS_BILLING_OPTIONS = [
  { label: TEXT_STATUS.Open, value: BillingStatus.OPEN },
  { label: TEXT_STATUS.Paid, value: BillingStatus.PAID },
  { label: TEXT_STATUS.Unpaid, value: BillingStatus.UNPAID },
];

export enum ATTACHMENT_TYPE {
  ALL = "0",
  IMAGE = "1",
  FILE = "2",
}
