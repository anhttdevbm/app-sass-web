import { SxProps } from "@mui/material";
import { inter } from "components/sn-time-tracking/CalendarTracking/CalendarTracking.styles";

export const filterTextStyles: SxProps = {
  whiteSpace: "nowrap",
  color: "#212121",
  fontWeight: 700,
  fontFamily: inter.style.fontFamily,
  fontSize: "13px",
};

export const sxConfig: Record<string, SxProps> = {
  input: {
    height: 56,
  },
  item: {
    minWidth: "150px",
    py: 1,
    pr: 1,
    pl: "30px",
    gap: 1,
    margin: "8px 0",
    marginLeft: "auto",
    border: "solid 1px #efefef",
    borderRadius: "2rem",
    bgcolor: "white",
    position: "relative",
    height: "40px",
  },
};
