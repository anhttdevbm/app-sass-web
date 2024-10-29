import { Box, Stack, Typography } from "@mui/material";
import { MyTimeSheet } from "store/timeTracking/reducer";
import { inter } from "./CalendarTracking.styles";
import { formatHoursToHHMM } from "components/sn-time-tracking/components/helper";
import moment from "moment";

interface IProps {
  data: MyTimeSheet[];
}

export default function MobileListSheet({ data }: IProps) {
  return (
    <Stack flex={1} gap="12px">
      {data.length > 0 ? (
        data.map((item) => (
          <Box
            key={item.id}
            sx={{
              backgroundColor: "#FAFAFA",
              borderRadius: "12px",
              px: "20px",
              py: "12px",
              "& p": {
                fontSize: "14px",
                lineHeight: "22px",
                color: "neutral.700",
                fontFamily: inter.style.fontFamily,
              },
              "& > div": {
                display: "flex",
                justifyContent: "space-between",
              },
              rowGap: "12px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box>
              <Typography>Date</Typography>
              <Typography>{item.day}</Typography>
            </Box>
            <Box>
              <Typography>Project name</Typography>
              <Typography
                color={
                  item.project?.name ? "#0575E6 !important" : "red !important"
                }
              >
                {item.project?.name || "Break time"}
              </Typography>
            </Box>
            <Box>
              <Typography>Type</Typography>
              <Typography
                color={
                  item.project?.name ? "#0575E6 !important" : "red !important"
                }
              >
                {item.type}
              </Typography>
            </Box>
            <Box>
              <Typography>Time</Typography>
              <Typography
                color={
                  item.project?.name ? "#0575E6 !important" : "red !important"
                }
              >
                {formatHoursToHHMM(item.duration || 0)}
              </Typography>
            </Box>
            <Box>
              <Typography>Creation time</Typography>
              <Typography>
                {moment(item.start_time).format("L HH:mm")}
              </Typography>
            </Box>
          </Box>
        ))
      ) : (
        <Typography textAlign="center">Không có dữ liệu</Typography>
      )}
    </Stack>
  );
}
