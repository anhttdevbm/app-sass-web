"use client";

import ListAccount from "./ListAccount";
import Sumary from "./Sumary";
import ListTransactionHistory from "./ListTransactionHistory";
import { Box, Stack } from "@mui/material";
import { useAuth } from "store/app/selectors";
import { Permission } from "constant/enums";

const PackageManagement = () => {
  const { user } = useAuth();
  const isRole =
    user?.roles?.includes(Permission.SA) ||
    user?.roles?.includes(Permission.AM);
  return (
    <Box sx={{ overflow: "auto", overflowY: "auto" }}>
      <Box sx={{ padding: "26px 42px" }}>
        <Sumary />
      </Box>
      {isRole && (
        <Box sx={{ padding: "26px 42px" }}>
          <ListAccount />
        </Box>
      )}
      <Box sx={{ padding: "26px 42px" }}>
        <ListTransactionHistory />
      </Box>
    </Box>
  );
};

export default PackageManagement;
