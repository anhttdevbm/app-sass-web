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

  const handleClickActions = (index) => {
    setTooltipOpen(index);
    setStatusActions(prev => !prev)
  };

  const { data } = props;

  const handleClickOpenModel = () => {
    setOpenModel(true);
  };

  const handleCloseModel = () => {
    setOpenModel(false);
  };

  const handleClickOpenModelRemove = () => {
    setOpenModelRemove(true);
  };

  const handleCloseModelRemove = () => {
    setOpenModelRemove(false);
  };
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

              return (
                <TableRow key={row.id}>
                  <TableCell sx={{ border: "none", color: "#0575E6" }}>
                    {row?.code}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "none",
                      color: bgStage(row?.stage),
                      fontWeight: "700",
                    }}
                  >
                    {row?.stage}
                  </TableCell>
                  <TableCell sx={{ border: "none" }}>{row?.title}</TableCell>
                  <TableCell sx={{ border: "none" }}>{row?.type}</TableCell>
                  <TableCell sx={{ border: "none" }}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        borderRadius: "100px",
                        backgroundColor: bgPriority(row?.priority),
                        height: 30,
                      }}
                    >
                      <Text
                        sx={{
                          fontSize: 12,
                          color: colorPriority(row?.priority),
                          fontWeight: 700,
                        }}
                      >
                        {row?.priority}
                      </Text>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ border: "none" }}></TableCell>
                  <TableCell sx={{ border: "none" }}>
                    {row?.creatorUser?.fullname}
                  </TableCell>
                  <TableCell sx={{ border: "none" }}>
                    {row?.createTime?.slice(0, 10)}{" "}
                    {row?.createTime?.slice(11, 16)}{" "}
                  </TableCell>
                  <TableCell sx={{ position: 'relative', border: 'none' }}>

                    <EssentialIcon onClick={() => { handleClickActions(index) }} />
                    {/* Hiển thị Tooltip nếu tooltipOpen là index hiện tại */}
                    {tooltipOpen == index &&
                      <Tooltip
                        openModelEdit={handleClickOpenModel}
                        openModelRemove = {handleClickOpenModelRemove}
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
      />

      <ModelRemove
        open={openModelRemove}
        handleClickOpen={handleClickOpenModelRemove}
        handleClose={handleCloseModelRemove}
      />

    </>

  );
};

export default memo(TableTicketAgent);
