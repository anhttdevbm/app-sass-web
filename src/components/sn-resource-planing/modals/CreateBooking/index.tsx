import { Box, Button, DialogContent, Typography } from "@mui/material";
import React, { useState } from "react";

import DialogLayout from "components/DialogLayout";
import { NS_RESOURCE_PLANNING } from "constant/index";
import { useTranslations } from "next-intl";
import ProjectTab from "./ProjectTab";
import TimeOffTab from "./TimeoffTab";

interface IProps {
  open: boolean;
  onClose(): void;
  selectedDateRange?: Date[];
  resourceId: string;
  budgetSelected?: string | null;
  projectSelected?: string | null;
  serviceId?: string | null;
}

const CreateBooking: React.FC<IProps> = ({
  open,
  onClose,
  resourceId,
  selectedDateRange,
  budgetSelected,
  projectSelected,
  serviceId,
}) => {
  const [typeBooking, setTypeBooking] = useState<"PROJECT" | "TIME_OFF">(
    "PROJECT",
  );
  const resourceT = useTranslations(NS_RESOURCE_PLANNING);

  const handleOnClose = () => {
    onClose();
  };
  return (
    <DialogLayout
      renderHeader={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #ECECF3",
            height: "60px",
            verticalAlign: "text-top",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: "18px",
              lineHeight: "21px",
              fontWeight: 600,
              mr: "auto",
            }}
          >
            {resourceT("form.createBooking")}
          </Typography>
        </Box>
      }
      open={open}
      onClose={handleOnClose}
      sx={{
        width: 600,
        minHeight: 500,
        bgcolor: "white",
      }}
      rootSx={{
        ".MuiModal-backdrop": {
          backgroundColor: "#FFFFFFB2",
        },
        ".MuiDialog-paper": {
          paddingTop: 0,
          boxShadow: "-4px 10px 30px 0px #0000001A",
          borderRadius: "20px",
        },
      }}
    >
      <DialogContent
        sx={{
          "&.MuiDialogContent-root": {
            pb: "0px!important",
            overflow: "unset",
          },
          position: "relative",

          paddingTop: 0,
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "center", paddingTop: 5 }}
        >
          <div
            style={{
              width: "240px",
              height: "56px",
              display: "flex",
              justifyContent: "space-between",
              border: "1px solid #ECECF3",
              borderRadius: "100px",
              cursor: "pointer",
            }}
          >
            <Button
              style={{
                width: "124px",
                height: "100%",
                borderRadius: "100px",
                background: typeBooking === "PROJECT" ? "#D9F0FD" : "white",
                color: typeBooking === "PROJECT" ? "#045EB8" : "#333333",
                textTransform: "unset",
              }}
              onClick={() => {
                setTypeBooking("PROJECT");
              }}
            >
              Project
            </Button>
            <Button
              style={{
                width: "124px",
                height: "100%",
                borderRadius: "100px",
                background: typeBooking === "TIME_OFF" ? "#D9F0FD" : "none",
                color: typeBooking === "TIME_OFF" ? "#045EB8" : "#333333",
                textTransform: "unset",
              }}
              onClick={() => {
                setTypeBooking("TIME_OFF");
              }}
            >
              Time off
            </Button>
          </div>
        </div>

        {typeBooking === "PROJECT" ? (
          <ProjectTab
            onClose={handleOnClose}
            open={open}
            resourceId={resourceId}
            userId={resourceId}
            selectedDateRange={selectedDateRange}
            budgetSelected={budgetSelected}
            projectSelected={projectSelected}
            serviceId={serviceId}
          />
        ) : (
          <TimeOffTab
            onClose={handleOnClose}
            open={open}
            selectedDateRange={selectedDateRange}
            resourceId={resourceId}
          />
        )}
      </DialogContent>
    </DialogLayout>
  );
};

export default CreateBooking;
