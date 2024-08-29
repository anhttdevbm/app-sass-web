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
  paddingBlock: "4px",
}));

const upperCaseText = (string: string) => {
  return string.toUpperCase();
};
const TableTicketAgent = (props: any) => {
  const listOnline = useSelector(selectListAgentOnline);
  const t = useTranslations(NS_TICKET);
  const [openModel, setOpenModel] = useState(false);
  const [openModelRemove, setOpenModelRemove] = useState(false);

  const [tooltipOpen, setTooltipOpen] = useState<number | null>(null);
  const [statusActions, setStatusActions] = useState(false);
  const [dataDetail, setDataDeatil] = useState(null);

  const listIdOnline = React.useMemo(() => {
    if (!listOnline || !listOnline.length) return [];
    return Array.from(new Set(listOnline?.map((it) => it.id)));
  }, [listOnline]);

  const handleClickActions = (index) => {
    setTooltipOpen(index);
    setStatusActions((prev) => !prev);
  };

  const { data } = props;

  const handleClickOpenModel = (data) => {
    // console.log("check data click" , data)
    setDataDeatil(data);
    setOpenModel(true);
  };

  const handleCloseModel = () => {
    setOpenModel(false);
  };

  const handleClickOpenModelRemove = (data) => {
    setDataDeatil(data);
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
      <TableContainer sx={{ boxShadow: "none" }} component={Paper}>
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
