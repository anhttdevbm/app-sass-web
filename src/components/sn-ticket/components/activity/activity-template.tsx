import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import CommentActivity from "./comment/comment-activity";
import EmailActivity from "./email/email-activity";
import HistoryActivity from "./history/history-activity";
import SortIcon from "public/images/ticket/sortIcon.svg";
import CustomDropdown from "../drop-down/CustomDropdown";
import { useTranslations } from "next-intl";
import { NS_TICKET } from "constant/index";
export enum TypeSort {
  OLDEST = "OLDEST",
  NEWEST = "NEWEST",
}
const listTypeActivity = ["All", "Comments", "History", "Email"];
const ActivityTemplate = () => {
  const [activityIdx, setActivityIdx] = useState<string>("All");
  const [typeSort, setTypeSort] = useState<TypeSort>(TypeSort.NEWEST);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const t = useTranslations(NS_TICKET)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const RenderActivity = ({ activityIdx }: { activityIdx: string }) => {
    switch (activityIdx) {
      case "All":
        return <></>;
      case "Comments":
        return <CommentActivity />;
      case "Email":
        return <EmailActivity />;
      case "History":
        return <HistoryActivity />;
      default:
        return <></>;
    }
  };

  return (
    <Stack justifyContent={"center"} alignItems={"start"} gap={"12px"}>
      <Typography sx={{ fontWeight: 600, fontSize: 20 }}>{t("ticketDetail.activity.activity")}</Typography>
      <Stack
        justifyContent={"space-between"}
        alignItems={"center"}
        flexDirection={"row"}
        style={{ width: "100%" }}
      >
        <Stack
          justifyContent={"start"}
          alignItems={"center"}
          flexDirection={"row"}
          gap={"12px"}
        >
          <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#172B4D" }}>
            {t("ticketDetail.activity.show")}
          </Typography>
          {listTypeActivity.map((it: string, index: number) => (
            <button
              type="button"
              onClick={() => {
                setActivityIdx(it);
              }}
              style={{
                background: it === activityIdx ? "#D9F0FD" : "#F5F5F5",
                padding: "4px 14px",
                width: "fit-content",
                borderRadius: "100px",
                height: "28px",
                fontSize: "13px",
                fontWeight: 700,
                color: "#172B4D",
                border: "none",
                cursor: "pointer",
              }}
              key={index}
            >

              {t(`ticketDetail.activity.${it}`)}
            </button>
          ))}
        </Stack>
        <Stack
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"row"}
          gap={"2px"}
        >
          <Typography>
            {typeSort === TypeSort.NEWEST ? `${t("ticketDetail.activity.newest")}` : `${t("ticketDetail.activity.oldest")}`} {t("ticketDetail.activity.first")}
          </Typography>
          <CustomDropdown
            anchorEl={anchorEl}
            handleClick={handleClick}
            handleClose={handleClose}
            icon={<SortIcon />}
            placement="bottom-start"
          >
            <>
              <Button
                fullWidth
                onClick={() => {
                  setTypeSort(TypeSort.NEWEST);
                  setAnchorEl(null);
                }}
              >
                <Typography style={{ color: "#000", fontSize: "12px" }}>
                  {t("ticketDetail.activity.newest")}
                </Typography>
              </Button>
              <Button
                fullWidth
                onClick={() => {
                  setTypeSort(TypeSort.OLDEST);
                  setAnchorEl(null);
                }}
              >
                <Typography style={{ color: "#000", fontSize: "12px" }}>
                  {t("ticketDetail.activity.oldest")}
                </Typography>
              </Button>
            </>
          </CustomDropdown>
        </Stack>
      </Stack>
      <RenderActivity activityIdx={activityIdx} />
    </Stack>
  );
};

export default ActivityTemplate;
