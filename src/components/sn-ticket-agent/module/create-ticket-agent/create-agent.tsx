"use client";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { Button, Input, Select } from "components/shared";
import LabelFormCustom from "components/sn-ticket-agent/form/LabelFormCustom";
import MinHeightTextarea from "components/sn-ticket-agent/form/MinHeightTextarea";
import Wrapper from "components/Wrapper";
import { useCallback, useEffect, useState } from "react";
import useTicketAction from "queries/ticket/useTicketAction/useTicketAction";
import { useSnackbar } from "store/app/selectors";
import { useRouter } from "next/navigation";
import { TICKET_PATH } from "constant/paths";
import { IFromAgent } from "../pop-up-model/Model";

interface PropsFormAgent {
  formAgent : IFromAgent
  handleChange?: any
  type : "edit" | "create";

}


const CreateAgent = (props : PropsFormAgent) => {
  const { createTicket } = useTicketAction();
  const { onAddSnackbar } = useSnackbar();
  const { push, back } = useRouter();
  const {formAgent , handleChange , type} = props || null



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
            {type == "create" ? "Create New Agent" : "Edit Agent"}
            
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <LabelFormCustom title="Name" required />
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
            <Grid item xs={6}>
              <LabelFormCustom title="User name" required />
              <Input
                fullWidth
                rootSx={{ borderRadius: "30px" }}
                size="medium"
                placeholder="Type user name"
                value={formAgent?.username}
                onChange={(e) => {
                  handleChange(e.target.value, "username");
                }}
              />
            </Grid>
            <Grid item xs={6} >
              <LabelFormCustom title="Email" required />
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
            <Grid item xs={6} >
              <LabelFormCustom title="Phone number" required />
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

            <Grid item xs={12} md={12}>
              <LabelFormCustom title="Password" required />
              <Input
                fullWidth
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
            {/* <Grid item xs={12}>
              <FileUpload
                files={formTicket.files}
                setFiles={(files) =>
                  setFormTicket((prev) => ({ ...prev, files }))
                }
              />
            </Grid> */}
          </Grid>
          {/* <Stack
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
              Create
            </Button>
          </Stack> */}
        </Box>
      </Stack>
    </>
  );
};

export default CreateAgent;
