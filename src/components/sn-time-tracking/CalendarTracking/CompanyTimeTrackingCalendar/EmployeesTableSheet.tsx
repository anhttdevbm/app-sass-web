import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { IFormattedDate } from "components/sn-time-tracking/components/timeTracking.types";
import moment from "moment";
import { CompanyTimeSheet, MyTimeSheet } from "store/timeTracking/reducer";
import {
  tableCellDataStyles,
  trackingTableCellStyles,
} from "./TrackingTable.styles";
import { formatHoursToHHMM } from "components/sn-time-tracking/components/helper";

interface IProps {
  formattedDates: IFormattedDate[];
  employeeDataDetail: CompanyTimeSheet | null;
  dateRange: Date[];
}

function EmployeesTableSheet({
  formattedDates,
  employeeDataDetail,
  dateRange,
}: IProps) {
  const isDateEqual = (day: string, date: string) => {
    const year = day.split("-")[0] || 0;
    return day === moment(`${date} ${year}`).format("YYYY-MM-DD");
  };
  const _renderTotalDurationByDay = (
    timeSheet: MyTimeSheet[],
    date: string,
  ) => {
    const totalDurations = timeSheet
      .filter((sheet) => {
        return sheet.day && isDateEqual(sheet.day, date);
      })
      .reduce((pre, curSheet) => pre + (curSheet.duration || 0), 0);
    return formatHoursToHHMM(totalDurations);
  };

  const _renderTotalDuration = (timeSheet: MyTimeSheet[]) => {
    const totalDurations = timeSheet.reduce((pre, curSheet) => {
      return pre + (curSheet.duration || 0);
    }, 0);
    return formatHoursToHHMM(totalDurations);
  };

  const _renderTableBody = () => {
    if (
      employeeDataDetail === null ||
      employeeDataDetail.timesheet.length === 0
    ) {
      return (
        <TableRow>
          <TableCell align="center" colSpan={10}>
            No data found for this employee.
          </TableCell>
        </TableRow>
      );
    }
    return (
      <TableBody>
        {employeeDataDetail &&
          employeeDataDetail?.timesheet?.map((entry, index) => (
            <TableRow key={index}>
              <TableCell
                sx={{
                  borderRight: "1px solid #EBEAF2",
                  color: "#21263C",
                  fontSize: "15px",
                  fontFamily: "unset",
                  backgroundColor: "#FBFAFA",
                }}
              >
                {entry?.project?.name}
              </TableCell>
              {/* Fake task name -> need update */}
              <TableCell
                sx={{
                  borderRight: "1px solid #EBEAF2",
                  color: "#21263C",
                  fontSize: "15px",
                  fontFamily: "unset",
                  backgroundColor: "#FBFAFA",
                }}
              >
                Task {index + 1}
              </TableCell>
              {formattedDates.map(({ date }, i) => {
                const isEqual = entry.day && isDateEqual(entry.day, date);
                return (
                  <TableCell
                    align="center"
                    key={i}
                    sx={{
                      ...tableCellDataStyles,
                      borderRight: "1px solid #EBEAF2",
                    }}
                  >
                    {isEqual
                      ? entry?.duration && formatHoursToHHMM(entry.duration)
                      : ""}
                  </TableCell>
                );
              })}
              <TableCell
                align="center"
                sx={{
                  ...tableCellDataStyles,
                  background: "#D9F0FD",
                  color: "neutral.800",
                  border: "1px solid #EBEAF2",
                  fontWeight: "600",
                }}
              >
                {entry?.duration ? formatHoursToHHMM(entry.duration) : ""}
              </TableCell>
            </TableRow>
          ))}
        <TableRow
          sx={{
            background: "#D9F0FD",
            color: "#333333",
            border: "1px solid #EBEAF2",
            fontWeight: "700",
            "& > td": {
              fontFamily: "unset",
              fontSize: "14px",
              color: "neutral.800",
              fontWeight: "600",
              borderRight: "1px solid #EBEAF2",
            },
          }}
        >
          <TableCell
            colSpan={2}
            align="right"
            sx={{
              textTransform: "uppercase",
            }}
          >
            Total
          </TableCell>
          {formattedDates.map(({ date }, i) => (
            <TableCell align="center" key={i}>
              {employeeDataDetail?.timesheet &&
                _renderTotalDurationByDay(employeeDataDetail.timesheet, date)}
            </TableCell>
          ))}
          <TableCell>
            {employeeDataDetail?.timesheet &&
              _renderTotalDuration(employeeDataDetail.timesheet)}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  };

  return (
    <TableContainer
      sx={{
        maxHeight: "100%",
        overflow: "auto",
        borderRadius: "12px",
        border: "1px solid #EBEAF2",
      }}
    >
      <Table
        stickyHeader
        sx={{ tableLayout: "fixed" }}
        aria-label="sticky table"
      >
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                ...trackingTableCellStyles,
                background: "#0575E6",
                position: "relative",
                borderRight: "1px solid #EBEAF2",
                width: "200px",
                maxWidth: "200px",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Project
            </TableCell>
            <TableCell
              sx={{
                ...trackingTableCellStyles,
                background: "#0575E6",
                position: "relative",
                borderRight: "1px solid #EBEAF2",
                width: "200px",
                maxWidth: "200px",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Task
            </TableCell>

            {formattedDates.map((date, index) => (
              <TableCell
                key={index}
                align="center"
                sx={{
                  ...trackingTableCellStyles,
                  background: "#14B9E5",
                  border: "1px solid #EBEAF2",
                  color: "white",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "inherit",
                    fontWeight: "600",
                    fontSize: "inherit",
                    textTransform: "uppercase",
                  }}
                >
                  {date.day}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "inherit",
                    fontWeight: "600",
                    fontSize: "inherit",
                  }}
                >
                  {date.date}
                </Typography>
              </TableCell>
            ))}

            <TableCell
              align="center"
              sx={{
                background: "#D9F0FD",
                color: "#333333",
                border: "1px solid #EBEAF2",
                fontWeight: "700",
                fontFamily: "unset",
                textTransform: "uppercase",
              }}
            >
              Total
            </TableCell>
          </TableRow>
        </TableHead>
        {_renderTableBody()}
      </Table>
    </TableContainer>
  );
}

export default EmployeesTableSheet;
