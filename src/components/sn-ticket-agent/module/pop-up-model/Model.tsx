"use client";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Button, Text } from "components/shared";
import { NS_TICKET } from "constant/index";
import CloseIcon from "icons/CloseIcon";
import { useTranslations } from "next-intl";
import { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CreateAgent from "../create-ticket-agent/create-agent";
import useAgentAction from "queries/ticket-agent/useAgentAction/useTicketAction";
import { useSnackbar } from "store/app/selectors";
import { useQueryClient } from "react-query";
import { selectSearchTicket } from "store/ticket/selectors";
import { QUERY_AGENT_KEY } from "queries/ticket-agent/keys";
import useAgentUpdate from "queries/ticket-agent/useUpdateAgent/useUpdateAgent";
import { useAppSelector } from "store/hooks";
import { selectSearchTicketAgent } from "store/ticket-agent/selectors";

type PropsModel = {
  open: boolean
  handleClose: () => void;
  handleClickOpen: any;
  type: "edit" | "create";
  data?: any
}

export interface IFromAgent {
  nameUser: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  id?: string
}

const Model = (props: PropsModel) => {
  const t = useTranslations(NS_TICKET);
  const params = useAppSelector(selectSearchTicketAgent)
  const queryClient = useQueryClient()
  const { handleClose, open, handleClickOpen, type, data } = props || null;
  const { createAgent } = useAgentAction();
  const { updateAgent } = useAgentUpdate();
  const dataFilter = useSelector(selectSearchTicket);
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
        id: data?.id,
        nameUser: data?.fullname,
        username: data?.username,
        email: data?.email,
        phone: data?.phone,
        password: "",
      }
      setFormAgent(dataDetail)
    }

  }, [data])

  const handleChange = useCallback((value: string, type: keyof IFromAgent) => {
    setFormAgent((prev) => ({ ...prev, [type]: value }));
  }, []);

  const handleSubmit = (data: IFromAgent) => {
    const payload = { ...data }
    console.log("check payload update", payload)

    if (type == "edit") {
      updateAgent.mutate(payload, {
        onSuccess: (data) => {
          onAddSnackbar("update ticket success!", "success");
          queryClient.invalidateQueries({ queryKey: [QUERY_AGENT_KEY.LIST_AGENT, params] })
          handleClose()
        },
        onError: (err: any) => {
          onAddSnackbar(err?.errorMessage ?? "update ticket error!", "error");
        },
      });
      return
    }
    createAgent.mutate(payload, {
      onSuccess: (data) => {

        // push(TICKET_PATH);
        onAddSnackbar("Create ticket success!", "success");
        queryClient.invalidateQueries({ queryKey: [QUERY_AGENT_KEY.LIST_AGENT, params] })
        setFormAgent({
          nameUser: "",
          username: "",
          email: "",
          phone: "",
          password: "",
        })
        handleClose()
      },
      onError: (err: any) => {
        onAddSnackbar(err?.errorMessage ?? "Create ticket error!", "error");
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
      <DialogContent sx={{
        width: { xs: 300, sm: 700, md: 756 },
        height: 400,
        '&::-webkit-scrollbar': {
          display: "none"
        },
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>

        <CreateAgent type={type} formAgent={formAgent} handleChange={handleChange} />

      </DialogContent>


      <DialogActions sx={{
        padding: { xs: "12px 24px", md: "36px 24px" },
        display: "flex",
        flexDirection: { xs: "column ", md: "row" },
        gap : {xs : 2 , md : 0}
      }}>
        <Button
          onClick={handleClose}
          size="small"
          variant="primary"
          sx={{
            height: 45,
            width: {xs : "100%" , md : 150},
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
          onClick={() => handleSubmit(formAgent)}
          size="small"
          variant="primary"
          sx={{
            height: 45,
            width: {xs : "100%" , md : 150},
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
            {t("ticketAgnet.CONFIRM")}
          </Text>
        </Button>
      </DialogActions>
    </Dialog>
  )
}
export default memo(Model)