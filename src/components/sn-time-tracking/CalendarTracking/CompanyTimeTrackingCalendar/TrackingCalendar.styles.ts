import { SxProps, Theme } from "@mui/system";

export const calendarStyles: SxProps<Theme> = {
  ".hide-calendar-table": {
    display: "none",
  },
  " &.hide-calendar-table": {
    " .fc-view-harness": {
      height: "70px !important",
    },
    table: {
      tbody: {
        display: "none",
      },
    },
  },
  " .fc-daygrid-dot-event": {
    marginRight: "0px !important",
    marginLeft: "0px !important",
    ":hover": {
      background: "transparent",
    },
  },
  " .fc-timegrid-axis": {
    width: "128px",
    backgroundColor: "#FAFAFA",
  },
  " .fc-v-event": {
    border: "none",
    background: "white",
  },
  " .fc-event-main": {
    padding: "0px",
    borderRadius: "4px",
    overflow: "hidden",
  },
  " .fc-day-sun": {
    backgroundColor: "#FAFAFA",
  },
  " .fc-day-sat": {
    backgroundColor: "#FAFAFA",
  },
  " .fc-timegrid-axis-frame": {
    fontSize: "10px",
    fontWeight: 400,
    color: "#71717A",
    padding: "7px 8px 16px",
    justifyContent: "flex-start",
    lineHeight: "18px",
  },
  " .fc-col-header-cell-cushion": {
    width: "100%",
    padding: "4px 8px 16px",
  },
};
