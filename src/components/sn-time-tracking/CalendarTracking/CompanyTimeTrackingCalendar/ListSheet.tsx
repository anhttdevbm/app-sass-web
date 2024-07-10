"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import moment from "moment";
import "../CompanyTimeTrackingCalendar/style.css";
import { boxShadow } from "html2canvas/dist/types/css/property-descriptors/box-shadow";
import Checkbox from "@mui/material/Checkbox";

interface IProps{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?:any
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

const fakeData = [
  {
    _id: "1",
    day: "2024-07-07",
    project: { name: "Project Alpha" },
    note: "Worked on initial setup",
    type: "Development",
    username: "Thu Nguyen",
    duration: "05:00",
    created_time: "2024-07-07T08:00:00Z",
  },
  {
    _id: "2",
    day: "2024-07-06",
    project: { name: "Project Beta" },
    note: "Debugging issues",
    type: "Testing",
    username: "Thu Nguyen",
    duration: "05:00",
    created_time: "2024-07-06T09:30:00Z",
  },
  {
    _id: "3",
    day: "2024-07-05",
    project: null, // No project assigned, so it should be "BreakTime"
    note: "Team meeting",
    type: "Meeting",
    username: "Thu Nguyen",
    duration: "05:00",
    created_time: "2024-07-05T11:00:00Z",
  },
  {
    _id: "4",
    day: "2024-07-04",
    project: { name: "Project Gamma" },
    note: "Implemented feature X",
    type: "Development",
    username: "Thu Nguyen",
    duration: "05:00",
    created_time: "2024-07-04T10:00:00Z",
  },
  {
    _id: "5",
    day: "2024-07-03",
    project: { name: "Project Delta" },
    note: "Reviewed code",
    type: "Code Review",
    username: "Thu Nguyen",
    duration: "05:00",
    created_time: "2024-07-03T14:00:00Z",
  },
];

const ListSheet:React.FC<IProps> = (props) => {
  const rows = fakeData.map((row) => ({
    id: row._id,
    Date: row.day,
    Project_name: row.project?.name || "BreakTime",
    Task_name: row.note,
    username: row.username,
    Time: row.duration,
    Creation_time: moment(row.created_time).format("L HH:mm"),
  }));

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
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
          {rows.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>
                <Checkbox />
                {row.Date}
              </StyledTableCell>
              <StyledTableCell
                sx={{
                  color: "#0575E6",
                }}
              >
                {row.Project_name}
              </StyledTableCell>
              <StyledTableCell>{row.Task_name}</StyledTableCell>
              <StyledTableCell>{row.username}</StyledTableCell>
              <StyledTableCell>{row.Time}</StyledTableCell>
              <StyledTableCell>{row.Creation_time}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListSheet;
