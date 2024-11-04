"use client";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Stack} from "@mui/material";
import { Button, Text } from "components/shared";
import EditorGroup from "components/sn-ticket/components/EditorGroup";
import { NS_TICKET } from "constant/index";
import CloseIcon from "icons/CloseIcon";
import { useTranslations } from "next-intl";
import { memo, useCallback, useState } from "react";
import useTicketAction from "queries/ticket/useTicketAction/useTicketAction";
import { useSnackbar } from "store/app/selectors";
import { useParams } from "next/navigation";
import { useQueryClient } from "react-query";
import { QUERY_TICKET_KEY } from "queries/ticket/keys";

type PropsModelReply = {
  open: boolean
  handleClose: () => void;
  handleClickOpen: () => void;
}

export interface IFormSendReply {
  email: string;
  title: string;
  content: string;
  files: File[];
}


const ModelReply = (props: PropsModelReply) => {
  const t = useTranslations(NS_TICKET);
  const params = useParams();
  const id = params?.id as string;
  const queryClient = useQueryClient()
  const { sendReply } = useTicketAction()
  const { handleClose, open, handleClickOpen } = props || null
  const { onAddSnackbar } = useSnackbar();
  const [formSendReply, setFormSendReply] = useState<IFormSendReply>({
    email: "",
    title: "",
    content: "",
    files: [],
  });

  const clearForm = () => {
    const form = {
      email: "",
      title: "",
      content: "",
      files: [],
    }
    setFormSendReply(form)
  }

  const handleSubmit = () => {
    const payload = {
      ...formSendReply, id: id
    }
    console.log("check reply", formSendReply)
    sendReply.mutate(payload, {
      onSuccess: (data) => {
        onAddSnackbar(" Reply success!", "success");
        queryClient.invalidateQueries({ queryKey: [QUERY_TICKET_KEY.LIST_REPLY, id] })
        clearForm()
        handleClose()
      },
      onError: (err) => {
        onAddSnackbar(" Reply error!", "error");
      },
    });
  }

  const handleChange = useCallback((value: string, type: keyof IFormSendReply) => {
    setFormSendReply((prev) => ({ ...prev, [type]: value }));
  }, []);


  return (

    <Dialog open={open} onClose={handleClose}>

      <DialogTitle
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ backgroundColor: "#F2FAFF" }}
      >
        <Text sx={{ color: "#4D4D4D", fontSize: 20, fontWeight: 600 }}>{t("modelReply.title")}</Text>
        <CloseIcon onClick={handleClose} sx={{ width: 25, height: 25, cursor: "pointer" }} />
      </DialogTitle>

      <DialogContent
        sx={{
          width: { xs: 300, sm: 700, md: 756 },
          height: 400,
          '&::-webkit-scrollbar': {
            display: "none"
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
        <Stack sx={{ maxWidth: "100%" }} py={1}>
          <Box display="flex" sx={{ height: 35, gap: 1 }}>
            <Text fontSize={15}>To :</Text>
            <textarea
              id="tour-chatmb-textarea"
              placeholder={t("modelReply.email")}
              value={formSendReply.email}
              disabled={true}
              onChange={(e) => {
                handleChange(e.target.value, "email");
              }}
              style={{
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
              autoFocus
            />
          </Box>
          <textarea
            id="tour-chatmb-textarea"
            disabled={true}
            placeholder={t("modelReply.subject")}
            value={formSendReply.title}
            onChange={(e) => {
              handleChange(e.target.value, "title");
            }}
            style={{
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
            autoFocus
          />
          <EditorGroup setFormSendReply={setFormSendReply} formSendReply={formSendReply} />
        </Stack>
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
            color="#045EB8"
            fontWeight="700"
          >
            {t("modelReply.cancel")}
          </Text>
        </Button>

        <Button
          onClick={() => handleSubmit()}
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
            color="inherit"
            fontWeight="700"
          >
            {t("modelReply.send")}
          </Text>
        </Button>
      </DialogActions>
      
    </Dialog>
  )
}
export default memo(ModelReply)