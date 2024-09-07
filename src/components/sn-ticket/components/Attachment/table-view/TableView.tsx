import { Box, Stack, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { NS_TICKET } from "constant/index";
import DownloadIcon from "icons/DownloadIcon";
import ImageIcon from "icons/ImageIcon";
import moment from "moment";
import { useTranslations } from "next-intl";
import { useGetTicketDetail } from "queries/ticket/useGetTicket/useGetTicketById";
import React from "react";

const TableView = React.memo(
  ({ downloadAllImages }: { downloadAllImages: (file) => void }) => {
    const { data: dataTicket } = useGetTicketDetail();
    const t = useTranslations(NS_TICKET)
    return (
      <TableContainer>
        <Table
          sx={{ minWidth: 650, maxHeight: "600px", overflowY: "scroll" }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell>{t("ticketDetail.TableView.name")}</TableCell>
              <TableCell>{t("ticketDetail.TableView.Size")}</TableCell>
              <TableCell>{t("ticketDetail.TableView.dateAdded")}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataTicket?.lstFile?.map((row) => (
              <TableRow
                key={row.nameFile}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Stack
                    flexDirection={"row"}
                    gap={"10px"}
                    justifyContent={"start"}
                    alignItems={"center"}
                  >
                    <ImageIcon />{" "}
                    <Typography
                      style={{
                        maxWidth: "250px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {row.nameFile}
                    </Typography>{" "}
                  </Stack>
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
