import { ColHeaderContentArg, ResourceApi } from "@fullcalendar/resource";
import { Grid, Typography } from "@mui/material";
import { NS_RESOURCE_PLANNING } from "constant/index";
import { useTranslations } from "next-intl";
import React, { memo, useCallback, useState } from "react";
import { formatNumber, formatNumberHourToTime } from "utils/index";
import { useGetTotalScheduleTime } from "../hooks/useCalculateDetail";
import { Search } from "components/Filters";
import {
  IBookingAllFitler,
  getMyBookingResource,
} from "store/resourcePlanning/action";
import { DEFAULT_BOOKING_ALL_FILTER, TAB_TYPE } from "../helper";
import { useMyBooking } from "store/resourcePlanning/selector";

interface IProps {
  resource: ColHeaderContentArg;
  totalhour: number;
}

const ResourceHeaderContent = (
  { totalhour }: IProps,
  { type }: { type: TAB_TYPE },
) => {
  const { totalScheduleAll, totalScheduleTime } = useGetTotalScheduleTime();
  const { getMyBooking } = useMyBooking();
  const resourceT = useTranslations(NS_RESOURCE_PLANNING);
  const totalSchedulePerLeft = (totalhour / totalScheduleAll) * 100;
  const [queries, setQueries] = useState<IBookingAllFitler>(
    DEFAULT_BOOKING_ALL_FILTER,
  );
  const onChangeQueries = (name, value) => {
    setQueries((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const onSearch = useCallback(() => {
    const newQueries = { ...queries };
    switch (type) {
      case TAB_TYPE.ALL:
        getMyBookingResource(newQueries);
        break;
      case TAB_TYPE.MY:
        getMyBooking(newQueries);
        break;
    }
  }, [queries, type]);
  // Header content on the resource table
  return (
    <Grid
      container
      gap={{
        xs: 2,
        md: 1,
      }}
      sx={{ width: 1, minWidth: "350px" }}
    >
      <Search
        name="search_key"
        value={queries?.search_key || ""}
        onChange={(name, value) => onChangeQueries(name, value)}
        onEnter={(name, value) => {
          onChangeQueries(name, value);
          onSearch();
        }}
        placeholder={resourceT("schedule.filter.search")}
        sx={{
          maxWidth: "432px",
          height: "32px",
          " .MuiInputBase-root": {
            maxWidth: "295px",
            height: "30px",
          },
          backgroundColor: "#fff",
        }}
      />
      {/* <Grid item xs={4} md={5} /> */}
      {/* <Grid item xs={1} md={2}>
        <Typography sx={{ ...textHeadStyle, color: "#666" }}>
          {resourceT("schedule.resourceHeader.available")}
        </Typography>
        <Typography sx={{ ...textHeadStyle, fontWeight: 600 }}>
          {formatNumber(totalScheduleAll, {
            numberOfFixed: 0,
          })}{" "}
          h
        </Typography>
      </Grid> */}
      {/* <Grid item xs={1} md={2}>
        <Typography sx={{ ...textHeadStyle, color: "#666" }}>
          {resourceT("schedule.resourceHeader.schedule")}
        </Typography>
        <Typography sx={{ ...textHeadStyle, fontWeight: 600 }}>
          {formatNumber(totalhour, { numberOfFixed: 0 })}h
          {formatNumber(totalhour, { numberOfFixed: 2 })}h
        </Typography>
      </Grid> */}
      {/* <Grid item xs={1} md={2}>
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
      </Grid> */}
    </Grid>
  );
};
const textHeadStyle = {
  fontSize: "14px",
  fontWeight: 400,
};
export default memo(ResourceHeaderContent);
