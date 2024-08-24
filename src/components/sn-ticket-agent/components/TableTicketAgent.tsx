"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import { Button, Text } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_TICKET } from "constant/index";
import Model from "../module/pop-up-model/Model";
import EssentialIcon from "icons/EssentialIcon";
import Tooltip from './ToolTip';
import ModelRemove from "../module/pop-up-model/ModelRemove";

const upperCaseText = (string: string) => {
  return string.toUpperCase();
};
const TableTicketAgent = (props: any) => {
  const t = useTranslations(NS_TICKET);
  const [openModel, setOpenModel] = useState(false);
  const [openModelRemove, setOpenModelRemove] = useState(false);

  const [tooltipOpen, setTooltipOpen] = useState<number | null>(null);
  const [statusActions, setStatusActions] = useState(false)
  const [dataDetail , setDataDeatil] = useState(null)

  const handleClickActions = (index) => {
    setTooltipOpen(index);
    setStatusActions(prev => !prev)
  };

  const { data } = props;

  const handleClickOpenModel = (data) => {
    console.log("check data click" , data)
    setDataDeatil(data)
    setOpenModel(true);
  };

  const handleCloseModel = () => {
    setOpenModel(false);
  };

  const handleClickOpenModelRemove = (data) => {
    setDataDeatil(data)
    setOpenModelRemove(true);
  };

  const handleCloseModelRemove = () => {
    setOpenModelRemove(false);
  };

  const bgStage = (check: String) => {
    if (check == "New") return "#FF2C56";
    if (check == "In-progress") return "#03AE00";
    if (check == "Resolved") return "#E605DD";
    if (check == "Closed") return "#697469";
  };
  const colorPriority = (check: String) => {
    if (check == "Medium") return "#03AE00";
    if (check == "Low") return "#0575E6";
    if (check == "High") return "#FF2C56";
  };
  const bgPriority = (check: String) => {
    if (check == "Medium") return "#DDFFDC";
    if (check == "Low") return "#D9F0FD";
    if (check == "High") return "#FFEEF1";
  };

  console.log("check data truyen" , dataDetail)
  return (

    <>
      <TableContainer sx={{ boxShadow: "none" }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#D9F0FD" }}>
              <TableCell sx={{ border: "none" }}>
                <Typography fontWeight="500">{t("ticketFields.id")}</Typography>
              </TableCell>
              <TableCell sx={{ border: "none" }}>
                <Typography fontWeight="500">{t("ticketFields.name")}</Typography>
              </TableCell>
              <TableCell sx={{ border: "none" }}>
                <Typography fontWeight="500">EMAIL</Typography>
              </TableCell>
              <TableCell sx={{ border: "none" }}>
                <Typography fontWeight="500">PHONE</Typography>
              </TableCell>
              <TableCell sx={{ border: "none" }}>
                <Typography fontWeight="500">POSITION</Typography>
              </TableCell>
              <TableCell sx={{ border: "none" }}>
                <Typography fontWeight="500">STATUS</Typography>
              </TableCell>
              <TableCell sx={{ border: "none" }}>
                <Typography fontWeight="500">Ticket in-progress</Typography>
              </TableCell>
              <TableCell sx={{ border: "none" }}>
                <Typography fontWeight="500">
                  {t("ticketFields.creationTime")}
                </Typography>
              </TableCell>
              <TableCell sx={{ border: "none" }}>
                <Typography fontWeight="500">
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row, index) => {


              return (
                <TableRow key={row.id}>
                  <TableCell sx={{ border: "none", color: "#0575E6" }}>
                    {row?.code}
                  </TableCell>
                  <TableCell sx={{ border: "none" }}>
                    {row?.detail?.fullname}
                  </TableCell>
                  <TableCell sx={{ border: "none" }}>
                    {row?.detail?.email}
                  </TableCell>
                  <TableCell sx={{ border: "none" }}>
                    {row?.detail?.phone}
                  </TableCell>
                  <TableCell sx={{ border: "none" }}>
                    {row?.roleTicket[0]}
                  </TableCell>
                  <TableCell sx={{ border: "none" }}>
                    {row?.detail?.status}
                  </TableCell>
                  <TableCell sx={{ border: "none" }}>
                    {row?.numTicketAssign}
                  </TableCell>
                  <TableCell sx={{ border: "none" }}>
                  {row?.createDate?.slice(0, 10)}{" "}
                  {row?.createDate?.slice(11, 16)}{" "}
                </TableCell>

                  <TableCell sx={{ position: 'relative', border: 'none' }}>

                    <EssentialIcon onClick={() => { handleClickActions(index) }} />
                    {/* Hiển thị Tooltip nếu tooltipOpen là index hiện tại */}
                    {tooltipOpen == index &&
                      <Tooltip
                        openModelEdit={() => handleClickOpenModel(row?.detail)}
                        openModelRemove = {() => handleClickOpenModelRemove(row?.detail)}
                        setStatusActions={() => setStatusActions(prev => !prev)}
                        open={statusActions}
                      />
                    }
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Model
        type="edit"
        open={openModel}
        handleClickOpen={handleClickOpenModel}
        handleClose={handleCloseModel}
        data = {dataDetail}
      />

      <ModelRemove
        open={openModelRemove}
        handleClickOpen={handleClickOpenModelRemove}
        handleClose={handleCloseModelRemove}
        data = {dataDetail}
      />

    </>

  );
};

export default memo(TableTicketAgent);
