import { SxProps, Theme } from "@mui/material";
import { inter } from "../CalendarTracking/CalendarTracking.styles";

export const timeCreateInputStyles: SxProps<Theme> = {
  borderRadius: "32px",
  background:
    "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
  height: "40px",
  padding: "0 20px",
  borderColor: "#EFEFEF",
  "& input": {
    height: "100%",
    cursor: "pointer",
    fontFamily: inter.style.fontFamily,
    color: "neutral.800",
    background: "transparent",
  },
};
