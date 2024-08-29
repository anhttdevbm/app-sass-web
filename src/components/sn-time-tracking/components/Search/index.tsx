import { Box, MenuItem, Select, Typography } from "@mui/material";
import ChevronIcon from "icons/ChevronIcon";
import { useState } from "react";

export interface SelectDataProps {
  id: string;
  value: string;
}

interface IProps {
  title: string;
  isVisible?: boolean;
  data: SelectDataProps[] | null;
}

const SortByCategory = ({ data, title, isVisible }: IProps) => {
  const [selectedItemValue, setSelectedItemValue] = useState("all");

  return (
    <Box
      sx={{
        padding: "0 0 0 10px",
        border: "1px solid #EFEFEF",
        borderRadius: "100px",
        background: "#FFFFFF",
        minWidth: "150px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        height: "40px",
        position: "relative",
      }}
    >
      <Typography
        component="span"
        sx={{ fontWeight: "bold", fontSize: "13px", opacity: 0.5 }}
      >
        {title}:
      </Typography>
      <Select
        defaultValue="all"
        value={selectedItemValue}
        onChange={(e) => setSelectedItemValue(e.target.value)}
        IconComponent={() => null}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: "12px",
              maxHeight: "50vh",
            },
          },
        }}
        sx={{
          textAlign: "center",
          fontSize: "13px",
          fontFamily: "unset",
          fontWeight: "bold",
          maxWidth: "200px",
          "& fieldset": {
            border: "none",
          },
          "& .MuiSelect-select": {
            padding: "0 40px 0 0 !important",
          },
        }}
      >
        <MenuItem
          sx={{
            fontSize: "13px",
            fontWeight: "Bold",
            color: "neutral.700",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            width: "300px",
            display: "block",
          }}
          value="all"
        >
          All
        </MenuItem>
        {data &&
          data.map((item) => (
            <MenuItem
              sx={{
                fontSize: "13px",
                fontWeight: "Bold",
                color: "neutral.700",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                width: "300px",
                display: "block",
              }}
              key={item.id}
              value={item.id}
            >
              {item.value}
            </MenuItem>
          ))}
      </Select>
      <Box
        sx={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "18px",
          height: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: "0.2px",
          borderStyle: "solid",
          borderColor: "#5C5C5C",
          borderRadius: "100%",
          pointerEvents: "none",
        }}
      >
        <ChevronIcon />
      </Box>
    </Box>
  );
};

export default SortByCategory;
