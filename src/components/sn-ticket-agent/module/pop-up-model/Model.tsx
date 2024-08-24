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
import { useQueryClient } from "react-query";
import { selectSearchTicket } from "store/ticket/selectors";
import { QUERY_AGENT_KEY } from "queries/ticket-agent/keys";

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
  const queryClient = useQueryClient()
  const { handleClose, open, handleClickOpen, type } = props || null;
  const { createAgent } = useAgentAction()
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
    const payload = { ...data, }
    createAgent.mutate(payload, {
      onSuccess: (data) => {
        const params = {
          assign: dataFilter?.assingn || "",
          creator: "",
          code: dataFilter?.keySearch || "",
          stage: "",
          type: dataFilter?.ticketType || "",
          fromDate: "",
          createTime: "",
          toDate: "",
          priority: dataFilter?.priority || "",
          // page: page?.page,
          // size: page?.totalItems,
          // page: 1,
          // size: 2,
        };
      
        // push(TICKET_PATH);
        onAddSnackbar("Create ticket success!", "success");
        queryClient.invalidateQueries({queryKey:[QUERY_AGENT_KEY.LIST_AGENT, params]})
        handleClose()
      },
      onError: (err:any) => {
        onAddSnackbar(err?.errorMessage ??  "Create ticket error!", "error");
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