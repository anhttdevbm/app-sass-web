"use client";
import { Box, Grid, Stack, Typography } from "@mui/material";
import {  Input } from "components/shared";
import LabelFormCustom from "components/sn-ticket-agent/form/LabelFormCustom";
import { IFromAgent } from "../pop-up-model/Model";
import { useTranslations } from "next-intl";
import { NS_TICKET } from "constant/index";

interface PropsFormAgent {
  formAgent: IFromAgent
  handleChange?: any
  type: "edit" | "create";

}


const CreateAgent = (props: PropsFormAgent) => {
  const { formAgent, handleChange, type } = props || null
  const t = useTranslations(NS_TICKET)

  return (
    <>
      <Stack
        sx={{
          // height: "calc(100vh - 100px)",
        }}
      >
        <Box>
          <Typography
            sx={{ fontSize: "20px", fontWeight: "600", paddingBottom: "20px" }}
          >
            {type == "create" ? `${(t("ticketAgnet.createTitle"))}` : `${(t("ticketAgnet.editTitle"))}`}

          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <LabelFormCustom title={(t("ticketFields.name"))} required />
              <Input
                fullWidth
                rootSx={{ borderRadius: "30px" }}
                size="medium"
                placeholder="Type name"
                value={formAgent?.nameUser}
                onChange={(e) => {
                  handleChange(e.target.value, "nameUser");
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <LabelFormCustom title={(t("ticketAgnet.USERNAME"))} required />
              <Input
                fullWidth
                disabled={type == "edit" ? true : false}
                rootSx={{ borderRadius: "30px" }}
                size="medium"
                placeholder="Type user name"
                value={formAgent?.username}
                onChange={(e) => {
                  handleChange(e.target.value, "username");
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} >
              <LabelFormCustom title={(t("ticketAgnet.EMAIL"))} required />
              <Input
                fullWidth
                rootSx={{ borderRadius: "30px" }}
                size="medium"
                placeholder="Type email"
                value={formAgent?.email}
                onChange={(e) => {
                  handleChange(e.target.value, "email");
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} >
              <LabelFormCustom title={(t("ticketAgnet.PHONE"))} required />
              <Input
                fullWidth
                rootSx={{ borderRadius: "30px" }}
                size="medium"
                placeholder="Type number"
                value={formAgent?.phone}
                onChange={(e) => {
                  handleChange(e.target.value, "phone");
                }}
              />
            </Grid>

            <Grid item xs={12}  md={12}>
              <LabelFormCustom title={(t("ticketAgnet.PASSWORD"))} required />
              <Input
                fullWidth
                disabled={type == "edit" ? true : false}
                rootSx={{ borderRadius: "30px" }}
                size="medium"
                type="password"
                placeholder="Type password"
                value={formAgent?.password}
                onChange={(e) => {
                  handleChange(e.target.value, "password");
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </>
  );
};

export default CreateAgent;
