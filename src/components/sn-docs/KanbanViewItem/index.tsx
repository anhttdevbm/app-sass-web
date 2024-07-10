import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LockIcon from "@mui/icons-material/Lock";
import Box from "@mui/material/Box";
import { NS_DOCS } from "constant/index";
import { useTranslations } from "next-intl";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import MoveArrowIcon from "icons/MoveArrowIcon";
import { IKanbanViewDocItem } from "../KanbanViewDocList";
import dayjs from "dayjs";

export default function KanbanViewItem({
  itemKanban,
}: {
  itemKanban: IKanbanViewDocItem;
}) {
  console.log("itemKanban", itemKanban);
  const docsT = useTranslations(NS_DOCS);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRenameDoc = () => {
    setAnchorEl(null);
  };

  const handleMoveDoc = () => {
    setAnchorEl(null);
  };

  const handleDuplicateDoc = () => {
    setAnchorEl(null);
  };

  const handleDeleteDoc = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      sx={{
        width: 344,
        height: 238,
        borderRadius: 4,
      }}
    >
      <CardHeader
        sx={{
          bgcolor: itemKanban.groupInfo ? "#14B9E5" : "#E6F1FD",
          height: 54,
          color: "common.white",
        }}
        avatar={
          itemKanban.groupInfo ? (
            <Avatar
              alt={itemKanban.groupInfo?.avatar.name}
              src={itemKanban.groupInfo?.avatar.link}
              sx={{ height: 25, width: 25 }}
              aria-label="avatar-header"
            />
          ) : (
            <Box display="flex" alignItems="center" gap={0.5} color="grey.400">
              <Typography>No Project</Typography>
              <LockIcon
                sx={{
                  width: 12,
                  height: 12,
                }}
              />
            </Box>
          )
        }
        action={
          <>
            <IconButton
              aria-label="settings"
              sx={{
                padding: 0,
                marginRight: 1,
                "&:hover": { bgcolor: "transparent" },
              }}
              onClick={(event) => {
                event.stopPropagation();
                handleClick(event);
              }}
            >
              <MoreHoriz
                sx={{ color: "common.white", height: 18, width: 18 }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              PaperProps={{
                sx: {
                  width: 193,
                },
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                onClick={handleRenameDoc}
              >
                <ContentPasteGoIcon
                  sx={{ height: 15, width: 15, color: "grey.400" }}
                />{" "}
                {docsT("extendBtn.rename")}
              </MenuItem>
              <MenuItem
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                onClick={handleMoveDoc}
              >
                <MoveArrowIcon
                  sx={{ height: 15, width: 15, color: "grey.400" }}
                />{" "}
                {docsT("extendBtn.move")}
              </MenuItem>
              <MenuItem
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
                onClick={handleDuplicateDoc}
              >
                <ContentCopyIcon
                  sx={{ height: 15, width: 15, color: "grey.400" }}
                />{" "}
                {docsT("extendBtn.duplicate")}
              </MenuItem>
              <MenuItem
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "#DE360E",
                }}
                onClick={handleDeleteDoc}
              >
                <DeleteOutlineIcon sx={{ height: 15, width: 15 }} />{" "}
                {docsT("extendBtn.delete")}
              </MenuItem>
            </Menu>
          </>
        }
        title={
          itemKanban.groupInfo
            ? `${itemKanban.groupInfo.name} #${
                itemKanban.groupInfo?.number ?? 0
              }`
            : ""
        }
      />
      <CardContent sx={{ paddingTop: 0.5, paddingX: 2.5, height: 184 }}>
        <Box display="flex" flexDirection="column" gap={0.5}>
          <Typography
            color="text.primary"
            fontSize={20}
            variant="h3"
            fontWeight={600}
            sx={{ fontWeight: "bold" }}
          >
            {itemKanban?.docs[0].avatar.name}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              alt={itemKanban?.docs[0].created_by?.avatar.name}
              src={itemKanban?.docs[0].created_by?.avatar.link}
              sx={{ bgcolor: "#ddd5d5", height: 18, width: 18 }}
              aria-label="avatar-content"
            />
            <Typography variant="body1">
              {(itemKanban?.docs[0].owner?.fullname ||
                itemKanban?.docs[0].created_by?.fullname) &&
                docsT("ownedBy")}
            </Typography>
            <Typography variant="body1" sx={{ color: "#0575E6" }}>
              {itemKanban?.docs[0].owner?.fullname ??
                itemKanban?.docs[0].created_by?.fullname ??
                "--"}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="body1"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                lineHeight: "1.5",
              }}
            >
              {itemKanban.groupInfo?.description}
            </Typography>
          </Box>
          {itemKanban.groupInfo?.updated_time && (
            <Box
              display="flex"
              alignItems="center"
              paddingTop={1}
              gap={0.5}
              sx={{ color: "grey.300" }}
            >
              <AccessTimeIcon sx={{ height: 16, width: 16 }} />
              <Typography variant="body1" paddingLeft={1} fontSize={12}>
                {dayjs(itemKanban.groupInfo?.updated_time).format(
                  "MMMM D, YYYY",
                )}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
