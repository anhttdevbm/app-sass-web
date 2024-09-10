"use client";

import Search from "components/sn-project-detail/Budget/Actions/Search";
import ListAccount from "./ListAccount";
import Sumary from "./Sumary";
import ListTransactionHistory from "./ListTransactionHistory";
import { Box } from "@mui/material";

const PackageManagement = () => {
  return (
    <>
      <Box sx={{ padding: "26px 42px" }}>
        <Sumary />
      </Box>
      <Box sx={{ padding: "26px 42px" }}>
        <ListAccount />
      </Box>
      <Box sx={{ padding: "26px 42px" }}>
        <ListTransactionHistory />
      </Box>
    </>
  );
};

export default PackageManagement;

const getContainerBoundingClientRect = (element: HTMLElement) =>
  element.getBoundingClientRect();
