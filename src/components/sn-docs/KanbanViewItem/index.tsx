import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import LockIcon from "@mui/icons-material/Lock";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { NS_DOCS } from "constant/index";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import ActionMoreListDoc from "../ActionMoreListDoc";
import { IViewDocItem } from "../KanbanViewDocList";

export default function KanbanViewItem({
  itemKanban,
}: {
  itemKanban: IViewDocItem;
}) {
  const docsT = useTranslations(NS_DOCS);

  return (
    <Card
      sx={(theme) => ({
        borderRadius: 4,
        [theme.breakpoints.up('md')]: {
          width: 344,
          height: 238,
        },
        [theme.breakpoints.down('md')]: {
          minHeight: 238,
        }
      })}
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
        action={<ActionMoreListDoc />}
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <Typography>
              {itemKanban.groupInfo
                ? `${itemKanban.groupInfo.name} #${
                    itemKanban.groupInfo?.number ?? 0
                  }`
                : ""}
            </Typography>
            <GroupIcon />
          </Box>
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
            {itemKanban?.docs[0].avatar?.name}
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
                Updated{" "}
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
