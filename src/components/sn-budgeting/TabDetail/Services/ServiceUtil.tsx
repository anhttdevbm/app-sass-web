import { Stack, Typography } from "@mui/material";
import { TBudgetService } from "components/sn-budgeting/BudgetDetail";
import { PropsWithChildren } from "react";

export const H6 = ({ children }: PropsWithChildren) => {
  return (
    <Typography component="h6" fontSize="h6" fontWeight={500}>
      {children}
    </Typography>
  );
};

export const PTag = ({ children }: PropsWithChildren) => {
  return <Typography component="p">{children}</Typography>;
};

export const ServiceBox = ({
  children,
  remaining
}: PropsWithChildren<{ remaining?: string }>) => {
  return (
    <Stack
      // p="10px"
      // boxShadow="0 0 2px 1px rgba(0,0,0,0.1)"
      borderRadius="4px"
      gap={1}
      sx={{
        position: "relative",
        overflow: "hidden",
        ...(remaining && {
          "&:after": {
            content: "''",
            width: remaining,
            height: "2px",
            position: "absolute",
            bottom: 0,
            left: 0,
            bgcolor: "secondary.main",
          },
        })
      }}
    >
      {children}
    </Stack>
  );
};

export type TSection = {
  id: string;
  name: string;
};

export type TSectionData = {
  id: string;
  name: string;
  type: string;
  billingType: string;
  unit: string;
  tracking: { time: number; booking: number };
  estimate: string;
  isNewService?: boolean;
};

export type TError = { itemIndex: number; fieldName: string; errorMgs: string };
export type TErrors = Record<number, TError[]>;
