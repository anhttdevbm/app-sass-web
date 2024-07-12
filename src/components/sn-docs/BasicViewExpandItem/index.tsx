import { Box, Stack, IconButton, Avatar, Tooltip } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import Typography from "@mui/material/Typography";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { IDocItem } from "../KanbanViewDocList";
import dayjs from "dayjs";
import { NS_DOCS } from "constant/index";
import { useTranslations } from "next-intl";

export default function BasicViewExpandItem({
  expandedItem,
}: {
  expandedItem: IDocItem;
}) {
  const docsT = useTranslations(NS_DOCS);

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems={{ md: "center" }}
      padding={{ md: 2 }}
      borderBottom={0.5}
      borderColor="#EFEFEF"
      paddingBottom={{ xs: 1 }}
    >
      <Box display="flex" width={{ xs: "100%", md: "40%" }} alignItems="center" >
        <IconButton color="inherit" aria-label="menu">
          <DescriptionIcon
            sx={{ color: "primary.main", height: 16, width: 16 }}
          />
        </IconButton>
        <Typography variant="h6">{expandedItem?.name ?? "--"}</Typography>
      </Box>
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap={{ xs: 0.5 , md: 4 }}
        width={{ xs: "100%", md: "50%"}}
        sx={{ color: "grey.900" }}
        alignItems={{ md: "center" }}
        paddingLeft={{ xs: 1 }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ width: "50%", color: "grey.700" }}
        >
          <Avatar
            sx={{ height: 18, width: 18 }}
            alt={expandedItem?.avatar.name}
            src={expandedItem?.created_by?.avatar.link}
          />
          {expandedItem?.created_by ? (
            <>
              <Typography whiteSpace={{ xs: "nowrap" }} variant="body2">{docsT("createdBy")}</Typography>
              <Typography whiteSpace={{ xs: "nowrap" }} variant="body2" sx={{ fontWeight: 600 }}>
                {expandedItem?.created_by?.fullname}
              </Typography>
            </>
          ) : (
            <Typography variant="body2">--</Typography>
          )}
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ color: "grey.700" }}
        >
          <AccessTimeIcon sx={{ height: 16, width: 16 }} />
          <Typography variant="body2">
            {dayjs(expandedItem?.updated_time).format("MMMM D, YYYY")}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ width: "10%" }}></Box>
    </Stack>
  );
}
