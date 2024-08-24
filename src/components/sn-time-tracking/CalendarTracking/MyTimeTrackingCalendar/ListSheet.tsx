"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { styled } from "@mui/material/styles";
import moment from "moment";
import React from "react";
import "../CompanyTimeTrackingCalendar/style.css";

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
  },
}));

const StyledTableHeadRow = styled(TableRow)(({ theme }) => ({
  background: "#D9F0FD",
  borderRadius: "8px",
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
    Type: row.type,
    Time: formatDuration(row.duration),
    Creation_time: moment(row.created_time).format("L HH:mm"),
  }));

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <StyledTableHeadRow>
            <StyledTableCell
              sx={{
                color: "#0575E6",
                fontWeight: "600",
                fontSize: "16px",
                borderRadius: "8px 0 0 0",
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
                borderRadius: "0 8px 0 0",
              }}
            >
              Creation time
            </StyledTableCell>
          </StyledTableHeadRow>
        </TableHead>
        {rows?.length > 0 ? (
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>{row.Date}</StyledTableCell>
                <StyledTableCell
                  sx={{
                    color: "#0575E6",
                  }}
                >
                  {row.Project_name}
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    color: row.Type === "Break time" ? "red" : "#0575E6",
                  }}
                >
                  {row.Type}
                </StyledTableCell>
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
            height: '100px',
          }}>
            <Typography>No data found</Typography>
          </div>
        )}
      </Table>
    </TableContainer>
  );
};

export default ListSheet;
