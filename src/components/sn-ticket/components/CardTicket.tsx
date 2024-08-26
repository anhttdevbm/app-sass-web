"use client";

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import { Button, Text } from "components/shared";
import { NS_TICKET } from "constant/index";
import { TICKET_INFO_PATH } from "constant/paths";
import OpenTicketDetailIcon from "icons/OpenTicketDetailIcon";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { memo, useState } from "react";
import { useAppDispatch } from "store/hooks";
import { setDataTicketDetail } from "store/ticket/actions";

const CardTicket = (props: any) => {
  const t = useTranslations(NS_TICKET);
  const router = useRouter();
  const { push } = router;
  const dispatch = useAppDispatch();

  const { data } = props;

  const handleOpenTicketDetail = (id: string) => {
    const path = TICKET_INFO_PATH.replace("{id}", id);
    push(path);
    dispatch(setDataTicketDetail(data));
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
    if (check == "Medium" || check == "In-progress") return "#DDFFDC";
    if (check == "Low" || check == "") return "#D9F0FD";
    if (check == "High" || check == "New") return "#FFEEF1";
  };
  return (
    <>
      <Card
        sx={{
          width: "100%",
          boxShadow: "none",
          border: "1px solid #EFEFEF",
          mb: 1,
        }}
      >
        <CardHeader
          sx={{ borderBottom: "1px solid #EFEFEF" }}
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography sx={{ fontWeight: 700 }} variant="h6">
                {t("cardTicket.title")} {data?.code}
              </Typography>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                px={2}
                sx={{
                  borderRadius: "100px",
                  backgroundColor: bgPriority(data?.stage),
                  height: 30,
                }}
              >
                <Text
                  sx={{
                    fontSize: 13,
                    color: bgStage(data?.stage),
                    fontWeight: 700,
                  }}
                >
                  {data?.stage}
                </Text>
              </Box>
            </Box>
          }
        />
        <CardContent>
          <Stack flexDirection="row">
            <Stack width="60%" gap="10px">
              <Typography
                sx={{ fontWeight: 700 }}
                gutterBottom
                variant="h5"
                component="div"
              >
                {data?.title}
              </Typography>
              <Typography
                sx={{ color: "#4D4D4D" }}
                variant="body2"
                color="text.secondary"
              >
                {data?.description}
              </Typography>
            </Stack>
            <Stack
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="20%"
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                px={2}
                sx={{
                  borderRadius: "100px",
                  backgroundColor: bgPriority(data?.priority),
                  height: 30,
                }}
              >
                <Text
                  sx={{
                    fontSize: 13,
                    color: colorPriority(data?.priority),
                    fontWeight: 700,
                  }}
                >
                  {data?.priority}
                </Text>
              </Box>
            </Stack>
            <Stack
              display="flex"
              alignItems="flex-start"
              justifyContent="center"
              width="20%"
            >
              <Text sx={{ fontSize: 13 }}>
                {data?.createTime?.slice(0, 10)}{" "}
                {data?.createTime?.slice(11, 16)}
              </Text>
              <Text sx={{ fontSize: 13 }}>
                {t("cardTicket.created")}: {data?.creatorUser?.fullname}
              </Text>
              <Text sx={{ fontSize: 13 }}>
                {t("cardTicket.lastRespond")}: {data?.creatorUser?.fullname}
              </Text>
            </Stack>
          </Stack>
          <Stack
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            width="96%"
          >
            <Box
              width="150px"
              display="flex"
              gap="10px"
              alignItems="center"
              py={2}
            >
              <Box
                component="img"
                height="30px"
                width="30px"
                src="https://via.placeholder.com/150"
                alt="Image description"
                sx={{ borderRadius: "100%" }}
              />
              <Text sx={{ fontSize: 13 }}>
                {data?.assignUser?.fullname || "nothing"}
              </Text>
            </Box>
            <Box
              onClick={() => handleOpenTicketDetail(data?.id)}
              display="flex"
              alignContent="center"
              justifyContent="center"
              gap="10px"
              px={5}
            >
              <Text
                sx={{
                  color: "#0575E6",
                  fontSize: 13,
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                {" "}
                {t("cardTicket.openTicket")}
              </Text>
              <OpenTicketDetailIcon />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
};

export default memo(CardTicket);
