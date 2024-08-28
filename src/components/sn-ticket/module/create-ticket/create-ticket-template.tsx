"use client";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { Button, Input, Select } from "components/shared";
import LabelFormCustom from "components/sn-ticket/form/LabelFormCustom";
import MinHeightTextarea from "components/sn-ticket/form/MinHeightTextarea";
import Wrapper from "components/Wrapper";
import { useCallback, useEffect, useState } from "react";
import FileUpload from "./upload/FileUpload";
import useTicketAction from "queries/ticket/useTicketAction/useTicketAction";
import { useSnackbar } from "store/app/selectors";
import { useRouter } from "next/navigation";
import { TICKET_PATH } from "constant/paths";
import { useTranslations } from "next-intl";
import { NS_TICKET } from "constant/index";

export interface IFormTicket {
  title: string;
  description: string;
  type?: string;
  priority?: "low" | "hight" | "medium" | null;
  files: File[];
}

const CreateTicket = () => {
  const t = useTranslations(NS_TICKET)
  const { createTicket } = useTicketAction();
  const { onAddSnackbar } = useSnackbar();
  const { push, back } = useRouter();
  const [formTicket, setFormTicket] = useState<IFormTicket>({
    title: "",
    description: "",
    type: "",
    priority: null,
    files: [],
  });

  const handleChange = useCallback((value: string, type: keyof IFormTicket) => {
    setFormTicket((prev) => ({ ...prev, [type]: value }));
  }, []);

  const handleSubmit = (data: IFormTicket) => {
    createTicket.mutate(data, {
      onSuccess: (data) => {
        push(TICKET_PATH);
        onAddSnackbar("Create ticket success!", "success");
      },
      onError: (err) => {
        onAddSnackbar("Create ticket error!", "error");
      },
    });
  };

  return (
    <Wrapper overflow="auto" inFrame>
      <Stack
        sx={{
          overflowY: "scroll",
          scrollbarWidth: "none",
          height: "calc(100vh - 100px)",
        }}
      >
        <Box sx={{ padding: "34px 36px" }}>
          <Typography
            sx={{ fontSize: "20px", fontWeight: "600", paddingBottom: "20px" }}
          >
            {(t("createTicketFrom.titleHeader"))}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <LabelFormCustom title={(t("createTicketFrom.Title"))} required />
              <Input
                fullWidth
                size="medium"
                placeholder="Type ticket title"
                value={formTicket.title}
                onChange={(e) => {
                  handleChange(e.target.value, "title");
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <LabelFormCustom title={(t("createTicketFrom.Description"))} required />
              <MinHeightTextarea
                placeholder={"Type ticket description"}
                value={formTicket.description}
                onChange={(e) => {
                  handleChange(e.target.value, "description");
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LabelFormCustom title={(t("createTicketFrom.RequestTicketType"))} />
              <Select
                options={[
                  {
                    label: "Service Request",
                    value: "ServiceRequest",
                  },
                  {
                    label: "Problem",
                    value: "Problem",
                  },
                  {
                    label: "Question",
                    value: "Question",
                  },
                  {
                    label: "Others",
                    value: "Others",
                  },
                ]}
                fullWidth
                size="medium"
                placeholder="Choose Type"
                value={formTicket.type}
                showPlaceholder={true}
                onChange={(e) => {
                  handleChange(e.target.value, "type");
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LabelFormCustom title={(t("createTicketFrom.Priority"))} />
              <Select
                options={[
                  {
                    label: "High",
                    value: "High",
                  },
                  {
                    label: "Medium",
                    value: "Medium",
                  },
                  {
                    label: "Low",
                    value: "Low",
                  },
                ]}
                fullWidth
                size="medium"
                placeholder="Select Status"
                value={formTicket.priority}
                showPlaceholder={true}
                onChange={(e) => {
                  handleChange(e.target.value, "priority");
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FileUpload
                files={formTicket.files}
                setFiles={(files) =>
                  setFormTicket((prev) => ({ ...prev, files }))
                }
              />
            </Grid>
          </Grid>
          <Stack
            width={"100%"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            flexDirection={"row"}
            marginTop={"20px"}
          >
            <Button
              onClick={() => {
                handleSubmit(formTicket);
              }}
              size="small"
              variant="primary"
              sx={{
                height: 40,
                width: "fit-content",
                borderRadius: 100,
                background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                marginRight: "100px",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                },
              }}
            >
              {(t("createTicketFrom.create"))}
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Wrapper>
  );
};

export default CreateTicket;
