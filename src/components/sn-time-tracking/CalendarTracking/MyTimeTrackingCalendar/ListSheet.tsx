"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { formatHoursToHHMM } from "components/sn-time-tracking/components/helper";
import moment from "moment";
import { MyTimeSheet } from "store/timeTracking/reducer";
import { tableCellHeadingStyles } from "../CalendarTracking.styles";
import "../CompanyTimeTrackingCalendar/style.css";
import { TimeCreateValue } from "components/sn-time-tracking/TimeTrackingModal/TimeCreate";

interface IProps {
  data: MyTimeSheet[];
  handleSelectListSheetRow?: (selectedRowData: TimeCreateValue) => void;
}

const tableCellHeader = ["Date", "Project name", "Type", "Time", "Start time"];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "none",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  cursor: "default",
  ":hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
}));

const StyledTableHeadRow = styled(TableRow)(({ theme }) => ({
  background: "#D9F0FD",
  borderRadius: "8px",
  "& th:first-of-type": {
    borderTopLeftRadius: "12px",
    borderBottomLeftRadius: "12px",
  },
  "& th:last-child": {
    borderTopRightRadius: "12px",
    borderBottomRightRadius: "12px",
  },
  "& > th": {
    background: "#D9F0FD",
  },
}));

const ListSheet = ({ data, handleSelectListSheetRow }: IProps) => {
  const onRowSelected = (row: MyTimeSheet) => {
    const rowData: TimeCreateValue = {
      day: row.day,
      duration: row.duration,
      start_time: row.start_time,
      id: row.id,
      note: row.note,
      position: row.position?.id,
      project_id: row.project_id,
      type: row.type,
    };
    handleSelectListSheetRow?.(rowData);
  };

  return (
    <TableContainer sx={{ maxHeight: "100%" }}>
      <Table stickyHeader aria-label="sticky table" sx={{ minWidth: 650 }}>
        <TableHead>
          <StyledTableHeadRow>
            {tableCellHeader.map((cellTitle) => (
              <StyledTableCell
                key={cellTitle}
                sx={{
                  ...tableCellHeadingStyles,
                }}
              >
                {cellTitle}
              </StyledTableCell>
            ))}
          </StyledTableHeadRow>
        </TableHead>
        {data?.length > 0 ? (
          <TableBody>
            {data.map((row, index) => (
              <StyledTableRow
                sx={{
                  "& td": {
                    fontFamily: "unset",
                  },
                }}
                key={index}
                onClick={() => onRowSelected(row)}
              >
                <StyledTableCell>{row.day}</StyledTableCell>
                <StyledTableCell
                  sx={{
                    color: row.project?.name ? "#0575E6" : "red",
                  }}
                >
                  {row.project?.name || "Break time"}
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    color: row.project?.name ? "#0575E6" : "red",
                  }}
                >
                  {row.type}
                </StyledTableCell>
                <StyledTableCell
                  sx={{ color: row.project?.name ? "#0575E6" : "red" }}
                >
                  {formatHoursToHHMM(row.duration || 0)}
                </StyledTableCell>
                <StyledTableCell>
                  {moment(row.start_time).format("L HH:mm")}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <StyledTableRow>
              <StyledTableCell
                align="center"
                colSpan={5}
                sx={{
                  fontFamily: "unset",
                }}
              >
                No data found
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
};

export default ListSheet;
