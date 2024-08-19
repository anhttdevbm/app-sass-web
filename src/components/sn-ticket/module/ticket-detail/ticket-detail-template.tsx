"use client";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { Button, Text } from "components/shared";
import Tag from "components/sn-ticket/components/custom-tag";
import DescriptionDetail from "components/sn-ticket/components/DescriptionDetail";
import EditorGroup from "components/sn-ticket/components/EditorGroup";
import ModelReply from "components/sn-ticket/components/ModelReply";
import Wrapper from "components/Wrapper";
import { TICKET_PATH } from "constant/paths";
import AddSquareIcon from "icons/AddSquareIcon";
import ArrowDownIcon from "icons/ArrowDownIcon";
import CloseIcon from "icons/CloseIcon";
import PlusIcon from "icons/PlusIcon";
import ReplyIcon from "icons/ReplyIcon";
import { useRouter } from "next-intl/client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectTicketDetailData } from "store/ticket-detail/selectors";

const TicketDetail = () => {
  const tags = [
    { id: 1, active: false, element: 1, title: 'New', left: 0 },
    { id: 2, active: false, element: 2, title: 'Open', left: -42 },
    { id: 3, active: false, element: 2, title: 'In Progress', left: -68 },
    { id: 4, active: false, element: 2, title: 'On Hold', left: -94 },
    { id: 5, active: false, element: 2, title: 'Sold', left: -120 },
    { id: 6, active: false, element: 2, title: 'Closed', left: -146 },
    { id: 7, active: false, element: 3, title: '...', left: -172 },
  ];
  const { push } = useRouter()
  const data = useSelector(selectTicketDetailData);
  console.log("check store detail", data)
  const [activeTag, setActiveTag] = useState<any>(tags);
  const handleTagClick = (id: number) => {
    const _tags = [...tags]
    const idx = activeTag.findIndex((item) => item.id == id)
    _tags[idx]["active"] = true
    setActiveTag(_tags)
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Wrapper overflow="auto" inFrame>
      <Box sx={{
        padding: "34px 36px",
        gap: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>

        <Stack direction="row" justifyContent="space-between" alignItems="center">

          <Box
            onClick={() => {
              push(TICKET_PATH);
            }}
            sx={{ display: "flex", gap: 1, alignItems: "center", cursor: "pointer" }}>
            <ArrowDownIcon sx={{ width: 13, height: 13 }} />
            <Text>Ticket# {data?.id}</Text>
          </Box>
          <Text sx={{ fontSize: 13, color: "#84818A" }} >created at 12:45AM</Text>
        </Stack>

        <Text fontWeight="600" sx={{ fontSize: 20, margin: "6px 0 12px 0" }} >How to deposit money to my portal?</Text>

        <Stack direction="row" justifyContent="space-between" alignItems="center">

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {activeTag.map(tag => (
              <Tag
                key={tag.element}
                element={tag.element}
                active={tag.active}
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
                background:
                  "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
              },
              gap: 1
            }}
          >
            <ReplyIcon />
            <Text
              sx={{ display: { xs: "none", md: "block" } }}
              color="inherit"
              fontWeight="700"
            >
              {/* {billingT("list.button.invoice")} */}
              Reply
            </Text>
          </Button>
        </Stack>

        <Stack>
          <DescriptionDetail data={data} />
        </Stack>
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
