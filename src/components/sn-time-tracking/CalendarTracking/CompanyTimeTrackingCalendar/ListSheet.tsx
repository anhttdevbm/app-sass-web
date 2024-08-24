"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import moment from "moment";
import React, { useEffect, useState } from "react";
import "../CompanyTimeTrackingCalendar/style.css";
import { formatHoursToHHMM } from "components/sn-time-tracking/components/helper";

interface Timesheet {
  created_time: string;
  day: string;
  duration: number;
  end_time: string;
  _id: string;
  is_pin: boolean;
  note: string;
  fullname: string; // Assuming fullname is added to each timesheet
  project: Project;
}

interface Project {
  id: string;
  name: string;
  company: string;
  avatar: string | null; // Example assumes avatar is a string URL or null
}

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "none",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0,
    boxShadow: 0,
  },
}));

const ListSheet: React.FC<IProps> = (props) => {
  const [timeSheetData, setTimeSheetData] = useState<Timesheet[]>([]);

  useEffect(() => {
    //get all timesheet from company data api and then apply fullname property to each timesheet of the user
    if (props.data) {
      let allTimesheets = [];

      props.data.forEach((data) => {
        if (data.timesheet && Array.isArray(data.timesheet)) {
          allTimesheets = allTimesheets.concat(
            data.timesheet.map((timesheet) => ({
              ...timesheet,
              fullname: data.fullname,
            })),
          );
        }
      });

      setTimeSheetData(allTimesheets);
    }
  }, [props.data]);
  return (
    <TableContainer sx={{ maxHeight: "100%" }}>
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
            <StyledTableCell
              sx={{
                color: "#0575E6",
                fontWeight: "600",
                fontSize: "16px",
                fontFamily: "unset",
              }}
            >
              Date
            </StyledTableCell>
            <StyledTableCell
              sx={{
                color: "#0575E6",
                fontWeight: "600",
                fontSize: "16px",
                fontFamily: "unset",
              }}
            >
              Project name
            </StyledTableCell>
            <StyledTableCell
              sx={{
                color: "#0575E6",
                fontWeight: "600",
                fontSize: "16px",
                fontFamily: "unset",
              }}
            >
              Task name
            </StyledTableCell>
            <StyledTableCell
              sx={{
                color: "#0575E6",
                fontWeight: "600",
                fontSize: "16px",
                fontFamily: "unset",
              }}
            >
              User
            </StyledTableCell>
            <StyledTableCell
              sx={{
                color: "#0575E6",
                fontWeight: "600",
                fontSize: "16px",
                fontFamily: "unset",
              }}
            >
              Time
            </StyledTableCell>
            <StyledTableCell
              sx={{
                color: "#0575E6",
                fontWeight: "600",
                fontSize: "16px",
                fontFamily: "unset",
              }}
            >
              Creation time
            </StyledTableCell>
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
                <StyledTableCell
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    sx={{
                      color: "#DFE1E6",
                      "& > svg > path": {
                        clipPath: "inset(0 round 4px)", // Apply border radius to the SVG
                      },
                    }}
                  />
                  {moment(timesheet?.day).format("DD/MM/YYYY")}
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    color: "#0575E6",
                  }}
                >
                  {timesheet?.project?.name ? (
                    <Typography>{timesheet?.project?.name}</Typography>
                  ) : (
                    <Typography sx={{ color: "red" }}>Break time</Typography>
                  )}
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  {timesheet.note}
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  {timesheet.fullname}
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    fontSize: "16px",
                  }}
                >
                  {formatHoursToHHMM(timesheet.duration)}
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    fontSize: "16px",
                  }}
                >
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
