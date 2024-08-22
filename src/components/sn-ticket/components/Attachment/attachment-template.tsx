import { Box, Button, Stack, Typography } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectTicketDetailData } from "store/ticket/selectors";
import DownloadIcon from "public/images/ticket/downloadIcon.svg";
import Link from "next/link";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popper from "@mui/material/Popper";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import React, { useCallback, useState } from "react";
import ListView from "./list-view/ListView";
import TableView from "./table-view/TableView";

const AttachmentTemplate = () => {
  const data = useSelector(selectTicketDetailData);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isListView, setIsListView] = useState<boolean>(false);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const downloadAllImages = useCallback(async (imageUrls) => {
    try {
      for (let i = 0; i < imageUrls.length; i++) {
        const response = await fetch(imageUrls[i]?.link);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        // Generate a custom filename with the .jpg extension
        const filename = `${imageUrls[i]?.nameFile}.jpg`;
        a.download = filename;

        // Trigger the download
        document.body.appendChild(a);
        a.click();

        // Clean up
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to download images:", error);
    }
  }, []);

  return (
    <Stack justifyContent={"center"} alignItems={"flex-start"}>
      <Stack
        flexDirection={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        gap={"20px"}
      >
        <Stack
          flexDirection={"row"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          gap={"10px"}
        >
          <Typography sx={{ fontWeight: 600, fontSize: 20 }}>
            Attachment
          </Typography>
          <Stack
            sx={{
              width: "30px",
              height: 17,
              borderRadius: "100px",
              background: "#0575E6",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography sx={{ fontWeight: 400, fontSize: 10, color: "#fff" }}>
              {data?.lstFile?.length ?? 0}
            </Typography>
          </Stack>
        </Stack>
        <ClickAwayListener onClickAway={handleClose}>
          <div onClick={handleClick} style={{ cursor: "pointer" }}>
            <MoreVertIcon />
            <Popper id={id} open={open} anchorEl={anchorEl}>
              <Stack
                justifyContent={"center"}
                alignItems={"center"}
                gap={"10px"}
                sx={{ border: 1, p: 1, bgcolor: "background.paper" }}
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  fullWidth
                  onClick={() => {
                    downloadAllImages(data?.lstFile);
                    setAnchorEl(null);
                  }}
                >
                  <Typography style={{ color: "#000", fontSize: "12px" }}>
                    Download all
                  </Typography>
                </Button>
                <Button
                  fullWidth
                  onClick={() => {
                    setIsListView((prev) => !prev);
                    setAnchorEl(null);
                  }}
                >
                  <Typography style={{ color: "#000", fontSize: "12px" }}>
                    {isListView
                      ? "Switch to list view"
                      : "Switch to strip view"}
                  </Typography>
                </Button>
              </Stack>
            </Popper>
          </div>
        </ClickAwayListener>
      </Stack>
      {isListView ? (
        <ListView downloadAllImages={downloadAllImages} />
      ) : (
        <TableView />
      )}
    </Stack>
  );
};
export default AttachmentTemplate;
