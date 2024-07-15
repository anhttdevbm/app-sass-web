import { Box } from "@mui/material";
import React from "react";
import CircleChevronDownIcon from "icons/CircleChevronDownIcon";

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
        justifyContent: "space-between",
        height:"40px"
      }}
    >
      <p>
        <span style={{ opacity: "0.5" }}>{props.title}: </span>
        <span style={{ fontWeight: "bold" }}>All</span>
      </p>
      <CircleChevronDownIcon onClick={() => console.log("test12")} />
    </Box>
  );
};

export default SortByCategory;
