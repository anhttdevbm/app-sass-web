"use client";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Button, Text } from "components/shared";
import { NS_TICKET } from "constant/index";
import { TICKET_PATH } from "constant/paths";
import CloseIcon from "icons/CloseIcon";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import CreateAgent from "../create-ticket-agent/create-agent";
import useAgentAction from "queries/ticket-agent/useAgentAction/useTicketAction";
import { useSnackbar } from "store/app/selectors";

type PropsModel = {
  open: boolean
  handleClose: () => void;
  handleClickOpen: () => void;
  type: "edit" | "create";
}

export interface IFromAgent {
  nameUser: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

const Model = (props: PropsModel) => {
  const t = useTranslations(NS_TICKET);
  const { handleClose, open, handleClickOpen, type } = props || null;
  const { createAgent } = useAgentAction()
  const { onAddSnackbar } = useSnackbar();


  const [formAgent, setFormAgent] = useState<IFromAgent>({
    nameUser: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });


  useEffect(() => {
    if (type == "edit") {
      const dataDetail: IFromAgent = {
        nameUser: "123",
        username: "456",
        email: "789",
        phone: "03949349",
        password: "aaaa",
      }
      console.log("check type", type)
      setFormAgent(dataDetail)
    }

  }, [])

  const handleChange = useCallback((value: string, type: keyof IFromAgent) => {
    setFormAgent((prev) => ({ ...prev, [type]: value }));
  }, []);

  const handleSubmit = (data: IFromAgent) => {
    console.log("check data  res", { ...data, phone: Number(data?.phone) })
    const payload = { ...data, phone: Number(data?.phone) }
    createAgent.mutate(payload, {
      onSuccess: (data) => {
        // push(TICKET_PATH);
        onAddSnackbar("Create ticket success!", "success");
      },
      onError: (err) => {
        onAddSnackbar("Create ticket error!", "error");
      },
    });
  };


  return (

    <Dialog sx={{
      "& .MuiDialog-paper": {
        borderRadius: 5,
      },
    }}
      open={open} onClose={handleClose}
    >
      <DialogTitle textAlign="end" sx={{ backgroundColor: "#fff" }}>
        <CloseIcon onClick={handleClose} sx={{ width: 25, height: 25, cursor: "pointer" }} />
      </DialogTitle>
      <DialogContent sx={{ width: 765, height: 400 }}>

        <CreateAgent type={type} formAgent={formAgent} handleChange={handleChange} />

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
          onClick={() => handleSubmit(formAgent)}
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
            Confirm
          </Text>
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default memo(Model)