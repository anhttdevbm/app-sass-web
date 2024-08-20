"use client";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { Button, Input, Select } from "components/shared";
import LabelFormCustom from "components/sn-ticket/form/LabelFormCustom";
import MinHeightTextarea from "components/sn-ticket/form/MinHeightTextarea";
import Wrapper from "components/Wrapper";
import { useState } from "react";
import styled from "styled-components";
import FileUpload from "./upload/FileUpload";

interface IFormTicket {
  title: string;
  description: string;
  requestTicketType: string;
  status: "low" | "hight" | "medium" | null;
}

const CreateTicket = () => {
  const [formTicket, setFormTicket] = useState<IFormTicket>({
    title: "",
    description: "",
    requestTicketType: "",
    status: null,
  });

  const handleChange = (value: string, type: keyof typeof formTicket) => {
    setFormTicket((prev) => ({ ...prev, [type]: value }));
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
            Create New Ticket
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <LabelFormCustom title="Title" required />
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
              <LabelFormCustom title="Description" required />
              <MinHeightTextarea
                placeholder={"Type ticket description"}
                value={formTicket.description}
                onChange={(e) => {
                  handleChange(e.target.value, "description");
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <LabelFormCustom title="Request Ticket Type" />
              <Select
                options={[
                  {
                    label: "Service Request",
                    value: "Service",
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
                value={formTicket.requestTicketType}
                showPlaceholder={true}
                onChange={(e) => {
                  handleChange(e.target.value, "requestTicketType");
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <LabelFormCustom title="Priority" />
              <Select
                options={[
                  {
                    label: "High",
                    value: "high",
                  },
                  {
                    label: "Medium",
                    value: "medium",
                  },
                  {
                    label: "Low",
                    value: "low",
                  },
                ]}
                fullWidth
                size="medium"
                placeholder="Select Status"
                value={formTicket.status}
                showPlaceholder={true}
                onChange={(e) => {
                  handleChange(e.target.value, "status");
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FileUpload />
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
                // push(TICKET_CREATE_PATH);
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
          </Stack>
        </Box>
      </Stack>
    </Wrapper>
  );
};

export default CreateTicket;
