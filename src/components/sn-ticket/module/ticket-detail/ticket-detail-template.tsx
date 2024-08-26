"use client";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Button, Text } from "components/shared";
import ActivityTemplate from "components/sn-ticket/components/activity/activity-template";
import AttachmentTemplate from "components/sn-ticket/components/Attachment/attachment-template";
import Tag from "components/sn-ticket/components/custom-tag";
import DescriptionDetail from "components/sn-ticket/components/DescriptionDetail";
import ModelReply from "components/sn-ticket/components/ModelReply";
import Wrapper from "components/Wrapper";
import { NS_TICKET } from "constant/index";
import { TICKET_PATH } from "constant/paths";
import ReplyIcon from "icons/ReplyIcon";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { useGetTicketDetail } from "queries/ticket/useGetTicket/useGetTicketById";
import { useCallback, useEffect, useMemo, useState } from "react";

const TicketDetail = () => {
  const t = useTranslations(NS_TICKET);
  const tags = useMemo(
    () => [
      {
        id: 1,
        active: false,
        element: 1,
        title: t("ticketDetail.New"),
        left: 0,
      },
      {
        id: 2,
        active: false,
        element: 2,
        title: t("ticketDetail.Open"),
        left: -42,
      },
      {
        id: 3,
        active: false,
        element: 2,
        title: t("ticketDetail.inProgress"),
        left: -68,
      },
      {
        id: 4,
        active: false,
        element: 2,
        title: t("ticketDetail.onHold"),
        left: -94,
      },
      {
        id: 5,
        active: false,
        element: 2,
        title: t("ticketDetail.Sold"),
        left: -120,
      },
      {
        id: 6,
        active: false,
        element: 2,
        title: t("ticketDetail.Closed"),
        left: -146,
      },
      { id: 7, active: false, element: 3, title: "...", left: -172 },
    ],
    [t],
  );
  const { push } = useRouter();
  // const data = useSelector(selectTicketDetailData);

  const { data: dataTicket } = useGetTicketDetail();

  const [activeTag, setActiveTag] = useState<number>(1);

  const handleTagClick = useCallback((id: number) => {
    setActiveTag(id);
  }, []);

  useEffect(() => {
    const stageTicket = dataTicket?.stage ?? "";
    switch (stageTicket) {
      case "New":
        handleTagClick(1);
        break;
      case "Open":
        handleTagClick(2);
        break;
      case "Closed":
        handleTagClick(6);
        break;
      default:
        handleTagClick(1);
        break;
    }
  }, [dataTicket, handleTagClick]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Wrapper overflow="auto" inFrame>
      <Box
        sx={{
          padding: "34px 36px",
          gap: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "scroll",
          scrollbarWidth: "none",
          height: "calc(98vh - 100px)",
          p: 4,
          boxSizing: "border-box",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            onClick={() => {
              push(TICKET_PATH);
            }}
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            {/* <ArrowDownIcon sx={{ width: 13, height: 13 }} />
            <Text>{t("ticketDetail.title")} {data?.id}</Text> */}
            <Text
              fontWeight="600"
              sx={{ fontSize: 20, margin: "6px 0 12px 0" }}
            >
              {t("ticketDetail.question")}
            </Text>
          </Box>
          <Text sx={{ fontSize: 13, color: "#84818A" }}>
            {t("ticketDetail.created")} {dataTicket?.createTime?.slice(11, 16)}
          </Text>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {tags.map((tag, idx) => (
              <Tag
                key={`${tag.id}-${idx}`}
                element={tag.element}
                active={tag.id === activeTag}
                left={tag.left}
                title={tag.title}
                onClick={() => handleTagClick(tag.id)}
              />
            ))}
          </Box>

          <Button
            onClick={handleClickOpen}
            size="small"
            variant="primary"
            sx={{
              height: 32,
              width: 90,
              borderRadius: 100,
              background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
              "&:hover": {
                background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
              },
              gap: 1,
            }}
          >
            <ReplyIcon />
            <Text
              sx={{ display: { xs: "none", md: "block" } }}
              color="inherit"
              fontWeight="700"
            >
              {/* {billingT("list.button.invoice")} */}
              {t("ticketDetail.reply")}
            </Text>
          </Button>
        </Stack>

        <Stack>
          <DescriptionDetail data={dataTicket} />
        </Stack>
        <AttachmentTemplate />
        <ActivityTemplate />
      </Box>

      <ModelReply
        open={open}
        handleClose={handleClose}
        handleClickOpen={handleClickOpen}
      />
    </Wrapper>
  );
};

export default TicketDetail;
