import { ResourceApi } from "@fullcalendar/resource";
import { Box, Grid, Stack, Typography } from "@mui/material";
import Avatar from "components/Avatar";
import { RESOURCE_EVENT_TYPE } from "constant/enums";
import ArrowDownIcon from "icons/ArrowDownIcon";
import PlusIcon from "icons/PlusIcon";
import React, { memo, useEffect, useMemo } from "react";
import { formatNumber } from "utils/index";
import { isEmpty, includes } from "lodash";
import { useTranslations } from "next-intl";
import { NS_COMMON, NS_RESOURCE_PLANNING } from "constant/index";
import { IBookingItem, IBookingListItem } from "store/resourcePlanning/reducer";
import {
  useCalculateDetail,
  useGetTotalScheduleTime,
} from "../hooks/useCalculateDetail";
import { useGetTimeOffOptions } from "components/sn-sales/hooks/useGetTimeOffOptions";
import { useProject, useProjects } from "store/project/selectors";
import { useAuth } from "store/app/selectors";
import { useEmployees } from "store/company/selectors";
import { useFetchDetail } from "../hooks/useFetchDetail";
import { Button } from "components/shared";
interface IResourceLabelProps {
  resource: ResourceApi;
  resources: IBookingListItem[] | IBookingItem[];
  setIsOpenCreate: (value: boolean) => void;
  selectedResource: string[];
  totalhour: number;
  isLastItem: boolean;
  isMybooking?: boolean;
  setParentResource: (value: string) => void;
  handleCollapseToggle: (id: string) => void;
}
const ResourceLabel = ({
  resource,
  resources,
  setIsOpenCreate,
  setParentResource,
  isLastItem,
  isMybooking,
  handleCollapseToggle,
  totalhour,
  selectedResource,
}: IResourceLabelProps) => {
  const {
    name,
    company,
    type,
    fullname,
    position,
    eventType,
    note,
    project,
    user_id,
    bookings: parentBookings,
  } = resource._resource.extendedProps;
  console.log(position);

  const commonT = useTranslations(NS_COMMON);
  const resourceT = useTranslations(NS_RESOURCE_PLANNING);

  const { totalLeftToSchedule } = useGetTotalScheduleTime();
  const { timeOffOptions } = useGetTimeOffOptions();
  const { user } = useAuth();
  const { projectDetail, userDetail } = useFetchDetail(project?.id, user_id);
  const isActive = useMemo(
    () => includes(selectedResource, resource._resource.id),
    [selectedResource],
  );
  const handleOpenCreate = () => {
    setIsOpenCreate(true);
    setParentResource(
      resource._resource.extendedProps.user_id || resource._resource.id,
    );
  };

  const timeOffType = useMemo(() => {
    if (eventType === RESOURCE_EVENT_TYPE.TIME_OF_BOOKING) {
      return timeOffOptions.find(
        (item) => resource._resource.extendedProps.time_off_type === item.value,
      )?.label;
    }
    return "";
  }, [timeOffOptions]);

  const schedulePerLeft =
    (totalhour / totalLeftToSchedule[resource._resource.id]) * 100;

  const ownerAvatar = user?.avatar?.link;

  const avatarUrl = useMemo(() => {
    if (eventType === RESOURCE_EVENT_TYPE.PROJECT_BOOKING) {
      return projectDetail?.avatar?.link;
    }
    if (user_id === user?.id || isMybooking) {
      return ownerAvatar;
    }
    return userDetail?.avatar?.link;
  }, [projectDetail, project?.id, user, userDetail]);

  const isAddbutton = useMemo(() => {
    return (isActive && parentBookings?.length === 0) || !isActive;
  }, [isActive, parentBookings, isMybooking]);

  if (type === "step") {
    return (
      <Grid
        container
        direction="column"
        gap={1}
        alignItems="flex-start"
        sx={{
          width: 1,
          py: 2,
          "&:hover": {
            background: "#E1F0FFB2",
          },
        }}
      >
        <Grid
          item
          xs={2}
          sx={{
            px: 1,
            display: "flex",
            alignItems: "center",
            columnGap: 1,
          }}
        >
          <Avatar src={avatarUrl} size={36} />
          <Stack direction={"column"}>
            <Typography sx={{ fontSize: 14, lineBreak: "auto", width: 1 }}>
              {eventType === RESOURCE_EVENT_TYPE.PROJECT_BOOKING
                ? name
                : timeOffType}
            </Typography>
            <Typography sx={{ fontSize: 12, lineBreak: "auto", width: 1 }}>
              {position?.name}
            </Typography>
          </Stack>
        </Grid>
        {/* {isLastItem && (
          <Button
            variant="text"
            startIcon={<PlusIcon />}
            sx={{
              color: "success.main",
            }}
            // startIcon={<AddIcon />}
            onClick={() => handleOpenCreate()}
          >
            {resourceT("schedule.action.addBooking")}
          </Button>
        )} */}
        <Grid item xs={5} />
      </Grid>
    );
  }
  return (
    <Grid
      container
      sx={{
        "&:hover": {
          background: "#E1F0FFB2",
        },
        overflowX: "auto",
        minWidth: 550,
      }}
    >
      <Grid
        item
        xs={12}
        sx={{
          width: 1,
          py: 2,
          cursor: "pointer",
        }}
        onClick={() => {
          handleCollapseToggle(resource._resource.id);
        }}
      >
        <Grid
          container
          gap={{
            xs: 2,
            md: 1,
          }}
        >
          <Grid
            item
            xs={4}
            md={5}
            sx={{
              px: 1,
              display: "flex",
              alignItems: "center",
              columnGap: 1,
            }}
          >
            <Stack
              direction={"row"}
              gap={{
                xs: 1,
              }}
              sx={{
                position: "relative",
                zIndex: "10",
              }}
            >
              <Avatar size={32} src={avatarUrl} />
              <Box>
                <Typography sx={{ fontSize: 14 }} fontWeight={600}>
                  {fullname}
                </Typography>
                <Typography sx={{ color: "#666666", fontSize: 14 }}>
                  {company}
                </Typography>
              </Box>
              {/* <ArrowDownIcon
                color="inherit"
                fontSize="inherit"
                sx={{
                  fontSize: "12px",
                  mt: "6px",
                  width: "20px",
                  ml: {
                    xs: 1,
                    md: 0,
                  },
                  transform: isActive ? "rotate(-90deg)" : "rotate(-180deg)",
                  transitionDelay: "all ease 0.25s",
                }}
              /> */}
            </Stack>
          </Grid>
        </Grid>

        <Grid item xs={1} md={2}>
          <Typography
            sx={{
              ...textHeadStyle,
              textAlign: "center",
              display: "flex",
              justifyContent: "space-between",
              gap: "80px",
            }}
          >
            <Typography sx={{ fontSize: "13px", marginTop: "5px" }}>
              Avaiable
            </Typography>
            {formatNumber(totalLeftToSchedule[resource._resource.id], {
              numberOfFixed: 0,
            })}{" "}
            h
          </Typography>
        </Grid>
        <Grid item xs={1} md={2}>
          <Typography
            sx={{
              ...textHeadStyle,
              textAlign: "center",
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <Typography sx={{ fontSize: "13px" }}>
              Schedule{" ("}
              {formatNumber(schedulePerLeft, { numberOfFixed: 2, suffix: "%" })}
              {")"}
            </Typography>
            {formatNumber(totalhour, { numberOfFixed: 0, suffix: "h" })}
          </Typography>
        </Grid>
        {/* {isAddbutton && (
          <Button
            variant="text"
            sx={{
              // display: isAddbutton ? "flex" : "none",
              mt: 2,
              color: "success.main",
              px: 2,
              py: 1,
            }}
            startIcon={<PlusIcon />}
            onClick={() => handleOpenCreate()}
          >
            {resourceT("schedule.action.addBooking")}
          </Button>
        )} */}
      </Grid>
    </Grid>
  );
};

const textHeadStyle = {
  fontSize: "14px",
  fontWeight: 400,
};

export default memo(ResourceLabel);
