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
import { Text } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_TICKET } from "constant/index";
import AssignGroup from "./AssignGroup";
import { useRouter } from "next/navigation";
import { TICKET_PATH } from "constant/paths";

const upperCaseText = (string: string) => {
  return string.toUpperCase();
};
const TableTicket = (props: any) => {
  const t = useTranslations(NS_TICKET);
  const { push } = useRouter();

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

  const { data } = props;
  return (
    <TableContainer sx={{ boxShadow: "none" }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#D9F0FD" }}>
            <TableCell sx={{ border: "none" }}>
              <Typography fontWeight="500">{t("ticketFields.id")}</Typography>
            </TableCell>
            <TableCell sx={{ border: "none" }}>
              <Typography fontWeight="500">
                {t("ticketFields.stage")}
              </Typography>
            </TableCell>
            <TableCell sx={{ border: "none" }}>
              <Typography fontWeight="500">{t("ticketFields.name")}</Typography>
            </TableCell>
            <TableCell sx={{ border: "none" }}>
              <Typography fontWeight="500">
                {t("ticketFields.ticketType")}
              </Typography>
            </TableCell>
            <TableCell sx={{ border: "none" }}>
              <Typography fontWeight="500">
                {t("ticketFields.priority")}
              </Typography>
            </TableCell>
            <TableCell sx={{ border: "none" }}>
              <Typography fontWeight="500">
                {t("ticketFields.assignedTo")}
              </Typography>
            </TableCell>
            <TableCell sx={{ border: "none" }}>
              <Typography fontWeight="500">
                {t("ticketFields.creator")}
              </Typography>
            </TableCell>
            <TableCell sx={{ border: "none" }}>
              <Typography fontWeight="500">
                {t("ticketFields.creationTime")}
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => {
            return (
              <TableRow key={row.id}>
                <TableCell
                  sx={{ border: "none", color: "#0575E6", cursor: "pointer" }}
                  onClick={() => push(`${TICKET_PATH}/${row?.id}`)}
                >
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
                <TableCell sx={{ border: "none" }}>
                  <AssignGroup item={row} />
                </TableCell>
                <TableCell sx={{ border: "none" }}>
                  {row?.creatorUser?.fullname}
                </TableCell>
                <TableCell sx={{ border: "none" }}>
                  {row?.createTime?.slice(0, 10)}{" "}
                  {row?.createTime?.slice(11, 16)}{" "}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default memo(TableTicket);
