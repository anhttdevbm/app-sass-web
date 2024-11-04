import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { CardActionArea } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { inter } from "components/sn-time-tracking/CalendarTracking/CalendarTracking.styles";
import { NS_DOCS } from "constant/index";
import dayjs from "dayjs";
import { LockDocIcon } from "icons/LockDocIcon";
import { useTranslations } from "next-intl";
import { useDocs } from "store/docs/selectors";
import ActionMoreListDoc from "../ActionMoreListDoc";
import { IViewDocItem } from "../KanbanViewDocList";

export default function KanbanViewItem({
  itemKanban,
}: {
  itemKanban: IViewDocItem;
}) {
  const docsT = useTranslations(NS_DOCS);
  const { redirectDetailDoc } = useDocs();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "24px",
        px: "80px",
        width: "100%",
      }}
    >
      {itemKanban?.docs?.map((item) => (
        <Card
          key={item.id}
          sx={{
            boxShadow: "none",
            borderRadius: "12px",
            border: "1px solid #EFEFEF",
          }}
        >
          <CardActionArea>
            <CardHeader
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: itemKanban.groupInfo ? "#14B9E5" : "#E6F1FD",
                height: 54,
                color: "common.white",
                "& .MuiCardHeader-action": {
                  height: "100% !important",
                  m: 0,
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
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontFamily: inter.style.fontFamily,
                        color: "neutral.400",
                        fontWeight: "700",
                      }}
                    >
                      No Project
                    </Typography>
                    <LockDocIcon
                      sx={{
                        width: 16,
                        height: 16,
                      }}
                    />
                  </Box>
                )
              }
              action={
                itemKanban.groupInfo ? (
                  <ActionMoreListDoc docItem={item} />
                ) : (
                  <ActionMoreListDoc
                    docItem={item}
                    style={{ colorIcon: "#666666" }}
                  />
                )
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
                    fontWeight="bold"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 1,
                      lineHeight: "1.5",
                    }}
                  >
                    {itemKanban.groupInfo
                      ? `${itemKanban.groupInfo.name} #${itemKanban.groupInfo.number}`
                      : ""}
                  </Typography>
                  {/* <GroupIcon
                    sx={{
                      width: 16,
                      height: 16,
                      color: itemKanban.groupInfo ? "#fff" : "#666666",
                    }}
                  /> */}
                </Box>
              }
            />
            <CardContent
              sx={{ paddingTop: 0.5, paddingX: 2.5 }}
              onClick={() => redirectDetailDoc(item.id)}
            >
              <Box display="flex" flexDirection="column" gap={0.5}>
                <Typography
                  color="text.primary"
                  fontSize={20}
                  variant="h3"
                  sx={{
                    fontWeight: "600",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    lineHeight: "1.5",
                    fontFamily: inter.style.fontFamily,
                    color: "#222",
                  }}
                >
                  {item.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar
                    alt={item.created_by?.fullname}
                    src={item.created_by?.avatar}
                    sx={{ bgcolor: "#ddd5d5", height: 18, width: 18 }}
                    aria-label="avatar-content"
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: inter.style.fontFamily,
                      fontSize: "13px",
                      color: "neutral.400",
                    }}
                  >
                    {(item.owner?.fullname || item.created_by?.fullname) &&
                      docsT("ownedBy")}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#0575E6",
                      fontSize: "13px",
                      fontFamily: inter.style.fontFamily,
                    }}
                  >
                    {item.owner?.fullname ?? item.created_by?.fullname ?? "--"}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3,
                      lineHeight: "1.5",
                      fontFamily: inter.style.fontFamily,
                      color: "neutral.700",
                      fontWeight: "700",
                    }}
                  >
                    {item.description ?? itemKanban?.groupInfo?.description}
                  </Typography>
                </Box>
                {item.updated_time && (
                  <Box
                    display="flex"
                    alignItems="center"
                    paddingTop={0.5}
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
    </Box>
  );
}
