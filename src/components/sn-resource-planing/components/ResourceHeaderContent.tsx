import { ColHeaderContentArg } from "@fullcalendar/resource";
import { Grid, Typography } from "@mui/material";
import { NS_RESOURCE_PLANNING } from "constant/index";
import { useTranslations } from "next-intl";
import { memo } from "react";
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
      sx={{
        width: "600px",
        height: "100%",
        minHeight: "44px",
        borderBottom: "1px solid #091E4224",
      }}
      gridTemplateColumns={"repeat(10, minmax(0, 1fr))"}
      display={"grid"}
    >
      <Grid item xs={1} md={2} gridColumn={"span 5 / span 5"}>
        <Typography
          sx={{
            ...textHeadStyle,
            textAlign: "left",
            paddingLeft: "10px",
            paddingTop: "11px",
            color: "#757383",
            fontWeight: 500,
          }}
        >
          {resourceT("schedule.resourceHeader.service")}
        </Typography>
      </Grid>
      <Grid
        item
        xs={1}
        md={2}
        gridColumn={"span 3 / span 3"}
        sx={{
          borderLeft: "1px solid #091E4224",
          paddingTop: "11px",
        }}
      >
        <Typography
          sx={{
            ...textHeadStyle,
            color: "#757383",
            fontWeight: 500,
            textAlign: "right",
            paddingLeft: "10px",
          }}
        >
          {resourceT("schedule.resourceHeader.user")}
        </Typography>
      </Grid>
      <Grid
        sx={{
          borderLeft: "1px solid #091E4224",
        }}
        item
        xs={1}
        md={2}
        gridColumn={"span 2 / span 2"}
        marginRight={4}
      >
        <Typography
          sx={{
            ...textHeadStyle,
            color: "#757383",
            fontWeight: 500,
            textAlign: "left",
            paddingLeft: "10px",
            paddingTop: "11px",
          }}
        >
          {resourceT("schedule.resourceHeader.startDate")}
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
