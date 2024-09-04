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
  Stack,
  BoxProps,
} from "@mui/material";
import { styled } from "@mui/system";
import { memo, useEffect, useMemo, useState } from "react";
import { Button, Text } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_TICKET } from "constant/index";
import Model from "../module/pop-up-model/Model";
import EssentialIcon from "icons/EssentialIcon";
import Tooltip from "./ToolTip";
import ModelRemove from "../module/pop-up-model/ModelRemove";
import { useSelector } from "react-redux";
import { selectListAgentOnline } from "store/ticket-agent/selectors";

interface CustomButtonProps extends BoxProps {
  color?: string;
  bgcolor?: string;
}

const CustomStatus = styled(Box, {
  shouldForwardProp: (prop) => prop !== "color" && prop !== "bgcolor",
})<CustomButtonProps>(({ theme, color, bgcolor }) => ({
  backgroundColor: bgcolor || theme.palette.primary.main,
  color: color || theme.palette.common.white,
  borderRadius: "13px",
  justifyContent: "center",
  display: "flex",
  alignItems: "center",
  padding : " 4px 12px"
}));

const upperCaseText = (string: string) => {
  return string.toUpperCase();
};
const TableTicketAgent = (props: any) => {
  const { data } = props;
  const listOnline = useSelector(selectListAgentOnline);
  const t = useTranslations(NS_TICKET);
  const [openModel, setOpenModel] = useState(false);
  const [openModelRemove, setOpenModelRemove] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState<number | null>(null);
  const [statusActions, setStatusActions] = useState(false);
  const [dataDetail, setDataDetail] = useState(null);

  const listIdOnline = React.useMemo(() => {
    if (!listOnline || !listOnline.length) return [];
    return Array.from(new Set(listOnline?.map((it) => it.id)));
  }, [listOnline]);

  const handleClickActions = (index) => {
    setTooltipOpen(index);
    setStatusActions((prev) => !prev);
  };

  const handleClickOpenModel = (data) => {
    // console.log("check data click" , data)
    setDataDetail(data);
    setOpenModel(true);
  };

  const handleCloseModel = () => {
    setOpenModel(false);
  };

  const handleClickOpenModelRemove = (data) => {
    setDataDetail(data);
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

  const renderStatus = React.useCallback(
    (id: string) => {
      if (listIdOnline.includes(id)) {
        return (
          <CustomStatus
            color={statusType["ONLINE"].color}
            bgcolor={statusType["ONLINE"].bg}
          >
            {statusType["ONLINE"]?.label}
          </CustomStatus>
        );
      }
      return (
        <CustomStatus
          color={statusType["ON_LEAVE"].color}
          bgcolor={statusType["ON_LEAVE"].bg}
        >
          {statusType["ON_LEAVE"]?.label}
        </CustomStatus>
      );
    },
    [listIdOnline],
  );

  return (
    <>
      <TableContainer sx={{ boxShadow: "none", display: { xs: "none", md: "block" } }} component={Paper}>
        <Table>
          <TableHead sx={{ padding: 0 }}>
            <TableRow sx={{ backgroundColor: "#D9F0FD" }}>
              <TableCell sx={{ border: "none", padding: "10px" }}>
                <Typography fontWeight="500" fontSize="13px">
                  {upperCaseText(t("ticketFields.id"))}
                </Typography>
              </TableCell>
              <TableCell sx={{ border: "none", padding: "10px" }}>
                <Typography fontWeight="500" fontSize="13px">
                  {upperCaseText(t("ticketFields.name"))}
                </Typography>
              </TableCell>
              <TableCell sx={{ border: "none", padding: "10px" }}>
                <Typography fontWeight="500" fontSize="13px">
                  {upperCaseText(t("ticketAgnet.EMAIL"))}
                </Typography>
              </TableCell>
              <TableCell sx={{ border: "none", padding: "10px" }}>
                <Typography fontWeight="500" fontSize="13px">
                  {upperCaseText(t("ticketAgnet.PHONE"))}
                </Typography>
              </TableCell>
              <TableCell sx={{ border: "none", padding: "10px" }}>
                <Typography fontWeight="500" fontSize="13px">
                  {upperCaseText(t("ticketAgnet.POSITION"))}
                </Typography>
              </TableCell>
              <TableCell sx={{ border: "none", padding: "10px" }}>
                <Typography fontWeight="500" fontSize="13px">
                  {upperCaseText(t("ticketAgnet.STATUS"))}
                </Typography>
              </TableCell>
              <TableCell sx={{ border: "none", padding: "10px" }}>
                <Typography fontWeight="500" fontSize="13px">
                  {upperCaseText(t("ticketAgnet.Inprogress"))}
                </Typography>
              </TableCell>
              <TableCell sx={{ border: "none", padding: "10px" }}>
                <Typography fontWeight="500" fontSize="13px">
                  {upperCaseText(t("ticketFields.creationTime"))}
                </Typography>
              </TableCell>
              <TableCell sx={{ border: "none" }}>
                <Typography fontWeight="500" fontSize="13px"></Typography>
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
                    {renderStatus(row?.detail?.id)}
                  </TableCell>
                  <TableCell sx={{ border: "none" }}>
                    {row?.numTicketAssign}
                  </TableCell>
                  <TableCell sx={{ border: "none" }}>
                    {row?.createDate?.slice(0, 10)}{" "}
                    {row?.createDate?.slice(11, 16)}{" "}
                  </TableCell>

                  <TableCell sx={{ position: "relative", border: "none" }}>
                    <EssentialIcon
                      onClick={() => {
                        handleClickActions(index);
                      }}
                    />
                    {/* Hiển thị Tooltip nếu tooltipOpen là index hiện tại */}
                    {tooltipOpen == index && (
                      <Tooltip
                        openModelEdit={() => handleClickOpenModel(row?.detail)}
                        openModelRemove={() =>
                          handleClickOpenModelRemove(row?.detail)
                        }
                        setStatusActions={() =>
                          setStatusActions((prev) => !prev)
                        }
                        open={statusActions}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* {mobile table} */}

      <Box sx={{ display: { xs: "block", md: "none" }, p: 2 }}>
        {data?.map((row, index) => (
          <Box
            key={row.id}
            sx={{
              borderBottom: "1px solid #ddd",
              mb: 2,
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              backgroundColor: "#FAFAFA",
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end", position: "relative" }}>
              <EssentialIcon
                onClick={() => handleClickActions(index)}
                sx={{ cursor: "pointer" }}
              />
              {tooltipOpen === index && (
                <Tooltip
                  mobile={true}
                  openModelEdit={() => handleClickOpenModel(row?.detail)}
                  openModelRemove={() => handleClickOpenModelRemove(row?.detail)}
                  setStatusActions={() => setStatusActions((prev) => !prev)}
                  open={statusActions}
                />
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1" sx={{ fontWeight: "500", }}>
                {t("ticketFields.id")}
              </Typography>
              <Typography variant="body1" sx={{ color: "#0575E6", fontWeight: 700, textAlign: 'right' }}>
                {row?.code}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1" sx={{ fontWeight: "500", }}>
                {t("ticketFields.name")}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'right' ,fontWeight: "700"}}>
                {row?.detail?.fullname}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1" sx={{ fontWeight: "500", }}>
                {t("ticketAgnet.EMAIL")}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'right' }}>
                {row?.detail?.email}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1" sx={{ fontWeight: "500", }}>
                {t("ticketAgnet.PHONE")}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'right' }}>
                {row?.detail?.phone}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1" sx={{ fontWeight: "500", }}>
                {t("ticketAgnet.POSITION")}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'right' }}>
                {row?.roleTicket[0]}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1" sx={{ fontWeight: "500", }}>
                {t("ticketAgnet.STATUS")}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'right' }}>
                {renderStatus(row?.detail?.id)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1" sx={{ fontWeight: "500", }}>
                {t("ticketAgnet.Inprogress")}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'right' }}>
                {row?.numTicketAssign}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1" sx={{ fontWeight: "500" }}>
                {t("ticketFields.creationTime")}
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'right' }}>
                {row?.createDate?.slice(0, 10)} {row?.createDate?.slice(11, 16)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>


      <Model
        type="edit"
        open={openModel}
        handleClickOpen={handleClickOpenModel}
        handleClose={handleCloseModel}
        data={dataDetail}
      />

      <ModelRemove
        open={openModelRemove}
        handleClickOpen={handleClickOpenModelRemove}
        handleClose={handleCloseModelRemove}
        data={dataDetail}
      />
    </>
  );
};

export const statusType = {
  ONLINE: {
    label: "online",
    color: "#0BB783",
    bg: "#E8F2EF",
  },
  ON_LEAVE: {
    label: "On leave",
    color: "#F64E60",
    bg: "#FFE2E5",
  },
  BREAK: {
    label: "online",
    color: "#FFA800",
    bg: "#FFF4DE",
  },
};

export default memo(TableTicketAgent);
