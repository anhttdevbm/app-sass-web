import { Box } from "@mui/material";
import React from "react";
import CircleChevronDownIcon from "icons/CircleChevronDownIcon";
import ChevronIcon from "icons/ChevronIcon";

interface IProps {
  title: string;
  isVisible?: boolean;
}

const SortByCategory: React.FC<IProps> = (props) => {
  return (
    <Box
      sx={{
        padding: "0 10px",
        border: "1px solid #EFEFEF",
        borderRadius: "100px",
        textAlign: "center",
        background: "#FFFFFF",
        minWidth: "150px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        height: "40px",
      }}
    >
      <p style={{ fontWeight: "bold", fontSize: "13px" }}>
        <span style={{ opacity: "0.5" }}>{props.title}:</span>
        <span> All</span>
      </p>
      <div
        style={{
          width: "18px",
          height: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: "0.2px",
          borderStyle: "solid",
          borderColor: "#5C5C5C",
          borderRadius: "100%",
        }}
      >
        <ChevronIcon />
      </div>
    </Box>
  );
};

export default SortByCategory;
