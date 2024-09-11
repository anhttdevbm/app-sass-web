"use client";

import ListAccount from "./ListAccount";
import Sumary from "./Sumary";
import ListTransactionHistory from "./ListTransactionHistory";
import { Box, Stack } from "@mui/material";
import { useAuth } from "store/app/selectors";
import { Permission } from "constant/enums";
import { memo } from "react";
import MobileUpgradePackage from "./mobile/index";

const PackageManagement = () => {
  const { user } = useAuth();
  const isRole =
    user?.roles?.includes(Permission.SA) ||
    user?.roles?.includes(Permission.AM);
  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "column",
        overflowY: "scroll",
        scrollbarWidth: "none",
        height: "calc(98vh - 100px)",
        boxSizing: "border-box",
      }}
    >
      <Box
        padding={{
          xs: "26px 27px",
          sm: "26px 42px",
        }}
        borderRadius={{
          xs: "12px",
        }}
        border={{
          xs: "1px solid #EFEFEF",
          sm: "none",
        }}
        mb={{
          xs: "16px",
        }}
      >
        <Sumary />
      </Box>
      {isRole && (
        <Box
          padding={{
            xs: "26px 27px",
            sm: "26px 42px",
          }}
          borderRadius={{
            xs: "12px",
          }}
          border={{
            xs: "1px solid #EFEFEF",
            sm: "none",
          }}
          mb={{
            xs: "16px",
          }}
        >
          {" "}
          <ListAccount />
        </Box>
      )}
      <Box
        padding={{
          xs: "26px 27px",
          sm: "26px 42px",
        }}
        borderRadius={{
          xs: "12px",
        }}
        border={{
          xs: "1px solid #EFEFEF",
          sm: "none",
        }}
      >
        {" "}
        <ListTransactionHistory />
      </Box>
    </Stack>
  );
};

export default memo(PackageManagement);
