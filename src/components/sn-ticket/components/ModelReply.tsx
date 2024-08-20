"use client";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { Button, Text } from "components/shared";
import Tag from "components/sn-ticket/components/custom-tag";
import DescriptionDetail from "components/sn-ticket/components/DescriptionDetail";
import EditorGroup from "components/sn-ticket/components/EditorGroup";
import Wrapper from "components/Wrapper";
import { NS_TICKET } from "constant/index";
import { TICKET_PATH } from "constant/paths";
import AddSquareIcon from "icons/AddSquareIcon";
import ArrowDownIcon from "icons/ArrowDownIcon";
import CloseIcon from "icons/CloseIcon";
import PlusIcon from "icons/PlusIcon";
import ReplyIcon from "icons/ReplyIcon";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { memo, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectTicketDetailData } from "store/ticket-detail/selectors";

type PropsModelReply = {
  open: boolean
  handleClose: () => void;
  handleClickOpen: () => void;
}


const ModelReply = (props: PropsModelReply) => {
  const t = useTranslations(NS_TICKET);

  const { handleClose, open, handleClickOpen } = props || null
  return (

    <Dialog open={open} onClose={handleClose}>
      <DialogTitle display="flex" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "#F2FAFF" }}>
        <Text sx={{ color: "#4D4D4D", fontSize: 20, fontWeight: 600 }}>{t("modelReply.title")}</Text>
        <CloseIcon onClick={handleClose} sx={{ width: 25, height: 25, cursor: "pointer" }} />
      </DialogTitle>
      <DialogContent sx={{ width: 765, height: 400 }}>
        <Stack py={1}>
          <Box display="flex" sx={{ height: 35, gap: 1 }}>
            <Text fontSize={15}>To :</Text>
            <textarea
              id="tour-chatmb-textarea"
              placeholder={t("modelReply.email")}
              style={{
                // background: isDarkMode ? "#3a3b3c" : "#fff",
                height: "100%",
                resize: "none",
                appearance: "none",
                border: "none",
                fontFamily: "inherit",
                outline: "none",
                width: "70%",
                padding: "2px 0 0 0",
                fontSize: 14
              }}
              rows={1}
              // onKeyDown={handleInputText}
              // value={inputValue}
              // onChange={handleChange}
              autoFocus
            />
          </Box>
          <textarea
            id="tour-chatmb-textarea"
            placeholder={t("modelReply.subject")}
            style={{
              // background: isDarkMode ? "#3a3b3c" : "#fff",
              height: "35px",
              resize: "none",
              appearance: "none",
              border: "none",
              fontFamily: "inherit",
              outline: "none",
              width: "100%",
              padding: "5px 0 0 0",
              fontSize: 15
            }}
            rows={1}
            // onKeyDown={handleInputText}
            // value={inputValue}
            // onChange={handleChange}
            autoFocus
          />

        </Stack>


        <EditorGroup />
      </DialogContent>
      <DialogActions sx={{ padding: "36px 24px" }}>
        <Button
          onClick={handleClose}
          size="small"
          variant="primary"
          sx={{
            height: 45,
            width: 150,
            borderRadius: 100,
            border: "1px solid #14B9E5",
            gap: 1,
            background: "#fff",
            "&:hover": {
              background:
                "#fff",
            },
          }}
        >
          <Text
            sx={{ display: { xs: "none", md: "block" } }}
            color="#045EB8"
            fontWeight="700"
          >
            {/* {billingT("list.button.invoice")} */}
            {t("modelReply.cancel")}
          </Text>
        </Button>

        <Button
          onClick={handleClickOpen}
          size="small"
          variant="primary"
          sx={{
            height: 45,
            width: 150,
            borderRadius: 100,
            background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
            "&:hover": {
              background:
                "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
            },
            gap: 1
          }}
        >
          <Text
            sx={{ display: { xs: "none", md: "block" } }}
            color="inherit"
            fontWeight="700"
          >
            {/* {billingT("list.button.invoice")} */}
            {t("modelReply.send")}
          </Text>
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default memo(ModelReply)