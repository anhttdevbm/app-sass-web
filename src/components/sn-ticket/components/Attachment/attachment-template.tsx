import { Box, Button, Stack, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, { useCallback, useState } from "react";
import ListView from "./list-view/ListView";
import TableView from "./table-view/TableView";
import { useGetTicketDetail } from "queries/ticket/useGetTicket/useGetTicketById";
import CustomDropdown from "../drop-down/CustomDropdown";
import { NS_TICKET } from "constant/index";
import { useTranslations } from "next-intl";

const AttachmentTemplate = () => {
  const t = useTranslations(NS_TICKET)
  const { data: dataTicket } = useGetTicketDetail();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isListView, setIsListView] = useState<boolean>(true);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const downloadAllImages = useCallback(async (imageUrls) => {
    if (!imageUrls || !imageUrls.length) return;
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
    <Stack justifyContent={"center"} alignItems={"flex-start"} gap={"20px"}>
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
            {t("ticketDetail.attachment")}
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
              {dataTicket?.lstFile?.length ?? 0}
            </Typography>
          </Stack>
        </Stack>

        <CustomDropdown
          handleClick={handleClick}
          handleClose={handleClose}
          anchorEl={anchorEl}
          icon={<MoreVertIcon />}
        >
          <>
            <Button
              fullWidth
              onClick={() => {
                downloadAllImages(dataTicket?.lstFile);
                setAnchorEl(null);
              }}
            >
              <Typography style={{ color: "#000", fontSize: "12px" }}>
              {t("ticketDetail.download")}
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
                {isListView ? `${t("ticketDetail.switchList")}` : `${t("ticketDetail.switchStrip")}`}
              </Typography>
            </Button>
          </>
        </CustomDropdown>
      </Stack>
      {isListView ? (
        <ListView downloadAllImages={downloadAllImages} />
      ) : (
        <TableView downloadAllImages={downloadAllImages} />
      )}
    </Stack>
  );
};
export default AttachmentTemplate;
