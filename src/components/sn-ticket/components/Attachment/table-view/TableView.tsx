import { useSelector } from "react-redux";
import { selectTicketDetailData } from "store/ticket/selectors";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ImageIcon from "public/images/ticket/ImageIcon.svg";
import moment from "moment";
import DownloadIcon from "public/images/ticket/downloadIcon.svg";
import React from "react";
import { Box } from "@mui/material";

const TableView = React.memo(
  ({ downloadAllImages }: { downloadAllImages: (file) => void }) => {
    const data = useSelector(selectTicketDetailData);
    return (
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Date Added</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.lstFile?.map((row) => (
              <TableRow
                key={row.nameFile}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <ImageIcon /> {row.nameFile}
                </TableCell>
                <TableCell>{row.size}KB</TableCell>
                <TableCell>
                  {moment(row?.createTime).format("DD MMM YYYY, HH:mm")}
                </TableCell>
                <TableCell>
                  <Box
                    onClick={() => downloadAllImages([row])}
                    style={{ cursor: "pointer" }}
                  >
                    <DownloadIcon />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  },
);
export default TableView;
