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
import { useSnackbar } from "store/app/selectors";
import useRemoveAgent from "queries/ticket-agent/useRemoveAgent/useRemoveAgent";
import { useQueryClient } from "react-query";
import { QUERY_AGENT_KEY } from "queries/ticket-agent/keys";

type PropsModel = {
    open: boolean
    handleClose: () => void;
    handleClickOpen: any;
    data?: any
}
const ModelRemove = (props: PropsModel) => {
    const t = useTranslations(NS_TICKET);
    const { handleClose, open, handleClickOpen, data } = props || null;
    const { onAddSnackbar } = useSnackbar();
    const queryClient = useQueryClient();
    const [id , setId] = useState("")




    useEffect(() => {
        setId(data?.id)
    }, [data])

    const { removeAgent } = useRemoveAgent()

    const handleSubmit = (payload) => {
        removeAgent.mutate(payload, {
            onSuccess: (data) => {

                // push(TICKET_PATH);
                onAddSnackbar("Remove success!", "success");
                queryClient.invalidateQueries({ queryKey: [QUERY_AGENT_KEY.LIST_AGENT, payload] })
                handleClose()
            },
            onError: (err: any) => {
                onAddSnackbar(err?.errorMessage ?? "Remove error!", "error");
            },
        });
    }



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
                width: 450,
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 3
            }}>
                <Text
                    sx={{ fontSize: "18px", fontWeight: 600 }}
                >Confirm to Delete</Text>
                <Text
                    sx={{ fontSize: "15px", fontWeight: 600, color: "#999999" }}
                >Are you sure to delete this agent?</Text>
            </DialogContent>
            <DialogActions
                sx={{
                    padding: "36px 24px",
                    margin: "auto"
                }}
            >
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
                      onClick={() => handleSubmit(id)}
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
export default memo(ModelRemove)