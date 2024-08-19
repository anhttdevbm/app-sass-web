import React from "react";

import { TabContext, TabPanel } from "@mui/lab";
import { DialogContent } from "@mui/material";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
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
        <TabContext value={isProject ? "1" : "2"}>
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
