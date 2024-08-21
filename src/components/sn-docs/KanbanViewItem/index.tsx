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
import { useDocs } from "store/docs/selectors";
import { CardActionArea } from "@mui/material";
import { useProject } from "store/project/selectors";

export default function KanbanViewItem({
  itemKanban,
}: {
  itemKanban: IViewDocItem;
}) {
  const docsT = useTranslations(NS_DOCS);
  const { redirectDetailDoc } = useDocs();
  console.log("itemKanban", itemKanban);
  return (
    <>
      {itemKanban?.docs?.map((item) => (
        <Card
          key={item.id}
          sx={(theme) => ({
            borderRadius: 4,
            [theme.breakpoints.up("md")]: {
              width: 344,
              height: 238,
            },
            [theme.breakpoints.down("md")]: {
              minHeight: 238,
            },
          })}
        >
          <CardActionArea onClick={() => redirectDetailDoc(item.id)}>
            <CardHeader
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: itemKanban.groupInfo ? "#14B9E5" : "#E6F1FD",
                height: 54,
                color: "common.white",
                "&.MuiCardHeader-action": {
                  height: "100% !important",
                },
              }}
              avatar={
                itemKanban.groupInfo ? (
                  <Avatar
                    alt={itemKanban.groupInfo.avatar.name}
                    src={itemKanban.groupInfo.avatar.link}
                    sx={{ height: 25, width: 25 }}
                    aria-label="avatar-header"
                  />
                ) : (
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={0.5}
                    color="grey.400"
                    sx={{ cursor: "pointer" }}
                  >
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
                <Box display="flex" sx={{ height: "100%" }}>
                  <ActionMoreListDoc />
                </Box>
              }
              title={
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{ cursor: "pointer" }}
                  gap={1}
                  onClick={() => redirectDetailDoc(item.id)}
                >
                  <Typography
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 1,
                      lineHeight: "1.5",
                    }}
                  >
                    {itemKanban.groupInfo ? itemKanban.groupInfo.name : ""}
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
                  sx={{
                    fontWeight: "bold",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    lineHeight: "1.5",
                  }}
                >
                  {item.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar
                    alt={item.created_by?.avatar.name}
                    src={item.created_by?.avatar.link}
                    sx={{ bgcolor: "#ddd5d5", height: 18, width: 18 }}
                    aria-label="avatar-content"
                  />
                  <Typography variant="body1">
                    {(item.owner?.fullname || item.created_by?.fullname) &&
                      docsT("ownedBy")}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#0575E6" }}>
                    {item.owner?.fullname ?? item.created_by?.fullname ?? "--"}
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
                    {item.description ?? itemKanban?.groupInfo?.description}
                  </Typography>
                </Box>
                {item.updated_time && (
                  <Box
                    display="flex"
                    alignItems="center"
                    paddingTop={1}
                    gap={0.5}
                    sx={{ color: "grey.300" }}
                  >
                    <AccessTimeIcon sx={{ height: 16, width: 16 }} />
                    <Typography variant="body1" paddingLeft={1} fontSize={12}>
                      Updated {dayjs(item.updated_time).format("MMMM D, YYYY")}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </>
  );
}
