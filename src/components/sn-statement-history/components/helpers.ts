import { AlertColor } from "@mui/material";

enum EmployeeStatus {
  APPROVE = 1,
  REJECT,
}

export const TEXT_STATUS: { [key in EmployeeStatus]: string } = {
  [EmployeeStatus.APPROVE]: "Approved",
  [EmployeeStatus.REJECT]: "Rejected",
};

export const COLOR_STATUS: { [key in EmployeeStatus]: AlertColor } = {
  [EmployeeStatus.APPROVE]: "success",
  [EmployeeStatus.REJECT]: "error",
};
