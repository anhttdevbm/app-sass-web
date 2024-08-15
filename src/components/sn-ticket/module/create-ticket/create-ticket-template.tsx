"use client";
import { Box, Grid, Typography } from "@mui/material";
import { Input, Select } from "components/shared";
import LabelFormCustom from "components/sn-ticket/form/LabelFormCustom";
import MinHeightTextarea from "components/sn-ticket/form/MinHeightTextarea";
import Wrapper from "components/Wrapper";
import { useState } from "react";
import styled from "styled-components";

const CreateTicket = () => {
  const [formTicket, setFormTicket] = useState({
    title: "",
    description: "",
    requestTicketType: "",
    status: "",
  });

  return (
    <Wrapper overflow="auto" inFrame>
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
            />
          </Grid>
          <Grid item xs={12}>
            <LabelFormCustom title="Description" required />
            <MinHeightTextarea
              placeholder={"Type ticket description"}
              //   value={formTicket.description}
              //  onChange={handleOnChangeDescription}
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
            />
          </Grid>
        </Grid>
      </Box>
    </Wrapper>
  );
};

export default CreateTicket;
