import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import { DialogContent, Tab, Box, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import ProjectTab from "./ProjectTab";
import DialogLayout from "components/DialogLayout";
import { useTranslations } from "next-intl";
import { NS_RESOURCE_PLANNING } from "constant/index";
import TimeOffTab from "./TimeoffTab";
import { useBookingAll } from "store/resourcePlanning/selector";

interface IProps {
  open: boolean;
  onClose(): void;
  selectedDateRange?: Date[];
  resourceId: string;
}

const CreateBooking: React.FC<IProps> = ({
  open,
  onClose,
  resourceId,
  selectedDateRange,
}) => {
  const [activeTabs, setActiveTabs] = useState("1");
  const { bookingAll, isLoading } = useBookingAll();
  const resourceT = useTranslations(NS_RESOURCE_PLANNING);
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTabs(newValue);
  };
  const handleOnClose = () => {
    setActiveTabs("1");
    onClose();
  };
  return (
    <DialogLayout
      renderHeader={
        <Box sx={{ display: "flex", alignItems: "center" }}>
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
      sx={{ width: 600, minHeight: 500 }}
    >
      <DialogContent
        sx={{
          "&.MuiDialogContent-root": {
            pb: "0px!important",
          },
          position: "relative",
        }}
      >
        <TabContext value={activeTabs}>
          <TabList
            onChange={handleTabChange}
            sx={{
              "& .MuiTabs-flexContainer": {
                gap: "16px",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
              },
              "& .MuiTab-root": {
                textTransform: "unset",
                fontSize: "16px",
                lineHeight: "20px",
                fontWeight: 600,
                color: "rgba(153, 153, 153, 1)",
                "&.active": {
                  color: "#3699FF",
                },
              },
            }}
          >
            <Tab
              label={resourceT("form.project")}
              value="1"
              sx={{
                fontSize: "14px",
                color: "gray.300",
                lineHeight: "16px",
                fontWeight: 600,
                px: "32px",
                py: "14px",
              }}
            />
            <Tab
              label={resourceT("form.timeoff")}
              value="2"
              sx={{
                fontSize: "14px",
                lineHeight: "16px",
                color: "gray.300",
                fontWeight: 600,
              }}
            />
          </TabList>
          <TabPanel value="1" sx={{ p: 0 }}>
            <ProjectTab
              onClose={handleOnClose}
              open={open}
              resourceId={resourceId}
              userId={resourceId}
              selectedDateRange={selectedDateRange}
            />
          </TabPanel>
          <TabPanel value="2" sx={{ p: 0 }}>
            <TimeOffTab
              onClose={handleOnClose}
              open={open}
              selectedDateRange={selectedDateRange}
              resourceId={resourceId}
            />
          </TabPanel>
        </TabContext>
      </DialogContent>
    </DialogLayout>
  );
};

export default CreateBooking;
