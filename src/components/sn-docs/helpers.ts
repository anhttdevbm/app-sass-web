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

export interface GetDocQueries {
  search_key?: string;
  project?: string;
  project_status?: "ACTIVE" | "PAUSE" | "CLOSE";
  user_id?: string;
  order_by?:
    | "id"
    | "name"
    | "created_time"
    | "updated_time"
    | "created_by"
    | "updated_by"
    | "owner"
    | "project_id";
  sort_by?: "DESC" | "ASC";
  from?: string;
  to?: string;
  group_by?: "created_by" | "updated_by" | "owner" | "project_id";
  page?: number;
  size?: number;
}
