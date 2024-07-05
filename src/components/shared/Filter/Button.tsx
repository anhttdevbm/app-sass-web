import { Button, ButtonProps } from "@mui/material";
import React from "react";

interface IProps extends ButtonProps {
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
}

const FilterButton: React.FC<IProps> = ({
  sx,
  startIcon,
  endIcon,
  ...props
}) => {
  return (
    <Button
      {...props}
      sx={{
        height: "40px",
        padding: "12px 24px",
        color: "red",
        background: "green",
        fontSize: "14px",
        lineHeight: "16px",
        fontWeight: 600,
        borderRadius: "4px",
        boxShadow: "none",
        minWidth: "max-content",
        ":hover": {
          background: "red",
          color: "green",
        },
        ...sx,
      }}
      variant="contained"
    />
  );
};

export default FilterButton;
