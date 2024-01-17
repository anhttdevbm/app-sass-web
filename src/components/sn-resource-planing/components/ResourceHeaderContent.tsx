import { ColHeaderContentArg, ResourceApi } from "@fullcalendar/resource";
import { Grid, Typography } from "@mui/material";
import { NS_RESOURCE_PLANNING } from "constant/index";
import { useTranslations } from "next-intl";
import React, { memo } from "react";
import { formatNumber, formatNumberHourToTime } from "utils/index";
import { useGetTotalScheduleTime } from "../hooks/useCalculateDetail";

interface IProps {
  resource: ColHeaderContentArg;
  totalhour: number;
}

const ResourceHeaderContent = ({ totalhour }: IProps) => {
  const { totalScheduleAll, totalScheduleTime } = useGetTotalScheduleTime();
  const resourceT = useTranslations(NS_RESOURCE_PLANNING);
  const totalSchedulePerLeft = (totalhour / totalScheduleAll) * 100;
  // Header content on the resource table
  return (
    <Grid
      container
      gap={{
        xs: 2,
        md: 1,
      }}
      sx={{ width: 1, backgroundColor: "grey.50", minWidth: 550 }}
    >
      <Grid item xs={4} md={5} />
      <Grid item xs={1} md={2}>
        <Typography sx={{ ...textHeadStyle, color: "#666" }}>
          {resourceT("schedule.resourceHeader.available")}
        </Typography>
        <Typography sx={{ ...textHeadStyle, fontWeight: 600 }}>
          {formatNumber(totalScheduleAll, {
            numberOfFixed: 0,
          })}{" "}
          h
        </Typography>
      </Grid>
      <Grid item xs={1} md={2}>
        <Typography sx={{ ...textHeadStyle, color: "#666" }}>
          {resourceT("schedule.resourceHeader.schedule")}
        </Typography>
        <Typography sx={{ ...textHeadStyle, fontWeight: 600 }}>
          {formatNumber(totalhour, { numberOfFixed: 0 })}h
          {/* {formatNumber(totalhour, { numberOfFixed: 2 })}h */}
        </Typography>
      </Grid>
      <Grid item xs={1} md={2}>
        <Typography sx={{ ...textHeadStyle, color: "#666" }}>
          {`${resourceT("schedule.resourceHeader.schedule")}/${resourceT(
            "schedule.resourceHeader.available",
          )}`}
        </Typography>
        <Typography sx={{ ...textHeadStyle, fontWeight: 600 }}>
          {formatNumber(totalSchedulePerLeft, {
            numberOfFixed: 2,
            suffix: "%",
          })}
        </Typography>
      </Grid>
    </Grid>
  );
};
const textHeadStyle = {
  fontSize: "14px",
  fontWeight: 400,
};
export default memo(ResourceHeaderContent);
