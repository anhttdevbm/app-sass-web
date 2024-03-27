import React, { useState, useEffect, useMemo, useCallback } from "react";

import {
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Tab,
  Tooltip,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
import { useTranslations } from "next-intl";
import { NS_COMMON, NS_RESOURCE_PLANNING } from "constant/index";
import ProjectTab from "./ProjectTab";
import TimeOffTab from "./TimeoffTab";
import Title from "./Title";
interface IProps {
  open: boolean;
  onClose(): void;
  bookingId: string;
  isProject: boolean;
}

const EditBooking: React.FC<IProps> = ({
  open,
  onClose,
  bookingId,
  isProject,
}) => {
  const [activeTabs, setActiveTabs] = useState(isProject ? "1" : "2");
  const resourceT = useTranslations(NS_RESOURCE_PLANNING);
  const commonT = useTranslations(NS_COMMON);
  useEffect(() => {
    if (open) {
      setActiveTabs(isProject ? "1" : "2");
    }
  }, [isProject, open]);
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTabs(newValue);
  };

  const _renderMain = () => {
    return (
      <DialogContent
        sx={{
          "&.MuiDialogContent-root": {
            pb: "0px!important",
          },
          position: "relative",
          overflowX: "auto ",
        }}
      >
        <TabContext value={activeTabs}>
          {/* <TabList
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
              position: "sticky",
            }}
          >
            <Tab
              label={resourceT("form.project")}
              value="1"
              sx={{
                fontSize: "14px",
                lineHeight: "16px",
                fontWeight: 600,
                color: "gray.300",
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
          </TabList> */}
          <TabPanel
            value="1"
            sx={{
              p: 0,
            }}
          >
            <ProjectTab bookingId={bookingId} open={open} onClose={onClose} />
          </TabPanel>
          <TabPanel
            value="2"
            sx={{
              p: 0,
              mb: 0,
              mt: 0,
            }}
          >
            <TimeOffTab open={open} onClose={onClose} bookingId={bookingId} />
          </TabPanel>
        </TabContext>
      </DialogContent>
    );
  };

  return (
    <DefaultPopupLayout
      title={<Title bookingId={bookingId} onClose={onClose} />}
      content={_renderMain()}
      open={open}
      onClose={onClose}
      sx={{
        maxWidth: "576px",
        "& > .MuiStack-root": {
          height: "100px",
          alignItems: "flex-start",
        },
      }}
    />
  );
};

export default EditBooking;
