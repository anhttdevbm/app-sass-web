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
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import moment from "moment";
import "../CompanyTimeTrackingCalendar/style.css";
import { boxShadow } from "html2canvas/dist/types/css/property-descriptors/box-shadow";
import Checkbox from "@mui/material/Checkbox";

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
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
const formatDuration = (duration) => {
  const hours = Math.floor(duration);
  const minutes = (duration - hours) * 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}`;
};

const ListSheet: React.FC<IProps> = (props) => {
  const rows = props.data?.map((row) => ({
    id: row._id,
    Date: row.day,
    Project_name: row.project?.name || "Break time",
    Task_name: row.note,
    Type: row.type,
    Time: formatDuration(row.duration),
    Creation_time: moment(row.created_time).format("L HH:mm"),
  }));

  return (
    <TableContainer>
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
              Type
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
        {rows?.length > 0 ? (
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
                {row.Type === "Break time" ? (
                  <StyledTableCell
                    sx={{
                      color: "red",
                    }}
                  >
                    {row.Type}
                  </StyledTableCell>
                ) : (
                  <StyledTableCell>{row.Type}</StyledTableCell>
                )}
                <StyledTableCell>{row.Time}</StyledTableCell>
                <StyledTableCell>{row.Creation_time}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        ) : (
          <div style={{
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            
          }}>
            <Typography>No data found</Typography>
          </div>
        )}
      </Table>
    </TableContainer>
  );
};

export default ListSheet;
