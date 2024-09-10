import { Button, Stack, Typography } from "@mui/material";
import { NS_TICKET } from "constant/index";
import SortIcon from "icons/SortIcon";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import CustomDropdown from "../drop-down/CustomDropdown";
import CommentActivity from "./comment/comment-activity";
import EmailActivity from "./email/email-activity";
import HistoryActivity from "./history/history-activity";
export enum TypeSort {
  OLDEST = "OLDEST",
  NEWEST = "NEWEST",
}
const listTypeActivity = ["All", "Comments", "History", "Email"];
const ActivityTemplate = () => {
  const [activityIdx, setActivityIdx] = useState<string>("All");
  const [typeSort, setTypeSort] = useState<TypeSort>(TypeSort.NEWEST);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const t = useTranslations(NS_TICKET);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("");

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (value) => {
    setActivityIdx(value);
    setSelectedActivity(value);
    setIsOpen(false);
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack justifyContent={"center"} alignItems={"start"} gap={"12px"}>
      <Typography sx={{ fontWeight: 600, fontSize: 20 }}>
        {t("ticketDetail.activity.activity")}
      </Typography>
      <Stack
        justifyContent={"space-between"}
        alignItems={"center"}
        flexDirection={"row"}
        style={{ width: "100%" }}
      >
        {/* desktop */}

        <Stack
          justifyContent={"start"}
          alignItems={"center"}
          flexDirection={"row"}
          gap={"12px"}
          display={{ xs: "none", sm: "flex", md: "flex" }}
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

        {/* mobile  */}

        <Stack display={{ xs: "block", sm: "none", md: "none" }}>
          <div style={{ position: "relative", width: 170 }}>
            <div
              onClick={handleToggle}
              style={{
                background: "#F5F5F5",
                padding: "4px 14px",
                borderRadius: "100px",
                fontSize: "13px",
                fontWeight: 700,
                color: "#172B4D",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>
                {selectedActivity
                  ? ` ${t(`ticketDetail.activity.show`)} : ${t(
                      `ticketDetail.activity.${selectedActivity}`,
                    )}`
                  : t(`ticketDetail.activity.show`)}
              </span>
              <span
                style={{ marginLeft: "8px", fontSize: "12px", color: "#aaa" }}
              >
                {isOpen ? "▲" : "▼"}
              </span>
            </div>
            {isOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#FFFFFF",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                  zIndex: 1,
                  maxHeight: "200px",
                  overflowY: "auto",
                  marginTop: "4px",
                }}
              >
                {listTypeActivity.map((it, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelect(it)}
                    style={{
                      padding: "8px 14px",
                      cursor: "pointer",
                      backgroundColor:
                        selectedActivity === it ? "#D9F0FD" : "#FFFFFF",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#172B4D",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {t(`ticketDetail.activity.${it}`)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Stack>

        <Stack
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"row"}
          gap={"2px"}
        >
          <Typography>
            {typeSort === TypeSort.NEWEST
              ? `${t("ticketDetail.activity.newest")}`
              : `${t("ticketDetail.activity.oldest")}`}{" "}
            {t("ticketDetail.activity.first")}
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

const RenderActivity = ({
  activityIdx,
}: {
  activityIdx: string;
}): React.JSX.Element => {
  if (!activityIdx) return <></>;
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

export default ActivityTemplate;
