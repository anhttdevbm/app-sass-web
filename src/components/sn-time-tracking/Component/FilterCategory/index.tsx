import { Box } from "@mui/material";
import React from "react";
import SortByCategory from "../Search";

interface IProps {
  personVisibleFilter?: boolean;
}

const FilterCategory: React.FC<IProps> = ({ personVisibleFilter = true }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        minHeight: "56px",
        gap: "12px",
        border: "1px solid #EFEFEF",
        borderRadius: "100px",
        padding: "14px 33px",
        background: "#F7F7FD",
        width: "100%",
      }}
    >
      <p style={{ marginRight: "2px" }}>View by: </p>
      <SortByCategory title="Project" />
      <SortByCategory title="Period" />
      <div
        style={{
          display: personVisibleFilter ? "block" : "none",
        }}
      >
        <SortByCategory title="Person" />
      </div>
    </Box>
  );
};

export default FilterCategory;
