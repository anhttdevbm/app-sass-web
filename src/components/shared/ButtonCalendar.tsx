import { Button } from "@mui/material";
import useTheme from "hooks/useTheme";
import { ReactElement } from "react";
import useBreakpoint from "hooks/useBreakpoint";

type ButtonProps = {
  icon?: ReactElement;
  title?: string;
  sx?: object;
  isActive?: boolean;
  onClick: () => void;
};

const ButtonCalendar = (props: ButtonProps) => {
  const { onClick, icon, title, sx, isActive } = props;
  const { isDarkMode } = useTheme();
  const { isSmSmaller } = useBreakpoint();
  return (
    <Button
      startIcon={icon}
      size="small"
      variant="contained"
      sx={{
        height: "32px",
        width: isSmSmaller ? '100px' : "161px",
        padding: 0,
        fontSize: isSmSmaller ? '10px' : "13px",
        backgroundColor: isDarkMode
          ? "grey.100"
          : isActive
          ? "#ebf8f8"
          : "common.white",
        color: "grey.300",
        textTransform: "none",
        border: isActive ? "1px solid #1BC5BD" : "1px solid #999999",
        boxShadow: "none",
        "&:hover": {
          backgroundColor: isDarkMode ? "#565656" : "#ebf8f8",
          //opacity: "10%",
          border: "1px solid #1BC5BD",
        },
        ...sx,
      }}
      onClick={() => onClick()}
    >
      {title}
    </Button>
  );
};

export default ButtonCalendar;
