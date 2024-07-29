"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import moment from "moment";
import "../CompanyTimeTrackingCalendar/style.css";
import { boxShadow } from "html2canvas/dist/types/css/property-descriptors/box-shadow";
import Checkbox from "@mui/material/Checkbox";

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
    <TableContainer>
      <Table sx={{ minWidth: 400 }}>
        <TableHead>
          <TableRow
            sx={{
              background: "#D9F0FD",
            }}
          >
            <StyledTableCell
              sx={{
                color: "#0575E6",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              Date
            </StyledTableCell>
            <StyledTableCell
              sx={{
                color: "#0575E6",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              Project name
            </StyledTableCell>
            <StyledTableCell
              sx={{
                color: "#0575E6",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              Task name
            </StyledTableCell>
            <StyledTableCell
              sx={{
                color: "#0575E6",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              User
            </StyledTableCell>
            <StyledTableCell
              sx={{
                color: "#0575E6",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              Time
            </StyledTableCell>
            <StyledTableCell
              sx={{
                color: "#0575E6",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              Creation time
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {timeSheetData.length > 0 ? (
            timeSheetData.map((timesheet) => (
              <StyledTableRow key={timesheet?._id}>
                <StyledTableCell>
                  <Checkbox />
                  {timesheet?.day}
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    color: "#0575E6",
                  }}
                >
                  {timesheet?.project?.name ? <Typography>{timesheet?.project?.name}</Typography> : <Typography sx={{color:"red"}}>Break time</Typography>}
                </StyledTableCell>
                <StyledTableCell>{timesheet.note}</StyledTableCell>
                <StyledTableCell>{timesheet.fullname}</StyledTableCell>
                <StyledTableCell>{timesheet.duration} hrs</StyledTableCell>
                <StyledTableCell>
                  {moment(timesheet.created_time).format("DD/MM/YYYY HH:MM")}
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>No data found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListSheet;
