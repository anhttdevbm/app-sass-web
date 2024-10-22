"use client";

import { Person } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { formatHoursToHHMM } from "components/sn-time-tracking/components/helper";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import { CompanyTimeSheet, MyTimeSheet } from "store/timeTracking/reducer";
import "../CompanyTimeTrackingCalendar/style.css";

interface TimeSheetRowData extends MyTimeSheet {
  avatar: string;
  fullname: string;
}

interface IProps {
  data: CompanyTimeSheet[];
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "none",
  fontFamily: "unset",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0,
    boxShadow: 0,
  },
}));

const tableCellHeader = [
  "Date",
  "Project name",
  "Type",
  "User",
  "Time",
  "Start time",
];

const ListSheet = ({ data }: IProps) => {
  const [timeSheetData, setTimeSheetData] = useState<TimeSheetRowData[]>([]);
  useEffect(() => {
    // Add additional field (fullname, avatar)
    if (data) {
      const allTimesheets: TimeSheetRowData[] = [];
      const today = dayjs().format("YYYY-MM-DD");
      data.forEach((data) => {
        if (data.timesheet && Array.isArray(data.timesheet)) {
          const pushedTimeSheet: TimeSheetRowData[] = [];
          data.timesheet.forEach((item) => {
            if (item.day === today) {
              pushedTimeSheet.push({
                ...item,
                fullname: data.fullname,
                avatar: data.avatar,
              });
            }
          });
          allTimesheets.push(...pushedTimeSheet);
        }
      });

      setTimeSheetData(allTimesheets);
    }
  }, [data]);
  return (
    <TableContainer sx={{ height: "100%" }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead
          sx={{
            "& th:first-of-type": {
              borderTopLeftRadius: "12px",
              borderBottomLeftRadius: "12px",
            },
            "& th:last-child": {
              borderTopRightRadius: "12px",
              borderBottomRightRadius: "12px",
            },
            "& > tr > th": {
              background: "#D9F0FD",
            },
          }}
        >
          <TableRow>
            {tableCellHeader.map((title) => (
              <StyledTableCell
                key={title}
                sx={{
                  color: "#0575E6",
                  fontWeight: "600",
                  fontSize: "14px",
                  fontFamily: "unset",
                  height: "40px",
                  padding: "0px 16px",
                }}
              >
                {title}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {timeSheetData.length > 0 ? (
            timeSheetData.map((timesheet) => (
              <StyledTableRow
                sx={{
                  "& td": {
                    fontFamily: "unset",
                  },
                }}
                key={timesheet?._id}
              >
                <StyledTableCell>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontFamily: "inherit",
                      position: "relative",
                      top: "1px",
                    }}
                  >
                    {moment(timesheet?.day).format("DD/MM/YYYY")}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    color: "#0575E6",
                  }}
                >
                  {timesheet?.project?.name ? (
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontFamily: "inherit",
                      }}
                    >
                      {timesheet?.project?.name}
                    </Typography>
                  ) : (
                    <Typography
                      sx={{
                        color: "red",
                        fontSize: "14px",
                        fontFamily: "inherit",
                      }}
                    >
                      Break time
                    </Typography>
                  )}
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    color: timesheet?.project?.name ? "#0575E6" : "red",
                  }}
                >
                  {timesheet?.project?.name ? "Work time" : "Break time"}
                </StyledTableCell>
                <StyledTableCell>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {timesheet.avatar ? (
                      <Avatar
                        src={`${timesheet.avatar}`}
                        sx={{ width: 20, height: 20 }}
                      />
                    ) : (
                      <Avatar sx={{ width: 20, height: 20 }}>
                        <Person />
                      </Avatar>
                    )}
                    <Typography
                      sx={{
                        color: "blue.normal",
                        fontWeight: 500,
                        fontSize: "14px",
                        fontFamily: "inherit",
                      }}
                    >
                      {timesheet.fullname}
                    </Typography>
                  </Box>
                </StyledTableCell>
                <StyledTableCell>
                  {formatHoursToHHMM(timesheet.duration || 0)}
                </StyledTableCell>
                <StyledTableCell>
                  {moment(timesheet.created_time).format("DD/MM/YYYY HH:MM")}
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <TableRow>
              <TableCell align="center" colSpan={6}>
                No data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListSheet;
