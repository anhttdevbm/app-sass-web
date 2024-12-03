import { ResourceApi } from "@fullcalendar/resource";
import { Box, Grid, Stack, Typography } from "@mui/material";
import Avatar from "components/Avatar";
import { useGetTimeOffOptions } from "components/sn-sales/hooks/useGetTimeOffOptions";
import { RESOURCE_EVENT_TYPE } from "constant/enums";
import { NS_COMMON, NS_RESOURCE_PLANNING } from "constant/index";
import { includes } from "lodash";
import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import { useAuth } from "store/app/selectors";
import { IBookingItem, IBookingListItem } from "store/resourcePlanning/reducer";
import { formatNumber } from "utils/index";
import { useGetTotalScheduleTime } from "../hooks/useCalculateDetail";
import { useFetchDetail } from "../hooks/useFetchDetail";

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
  isWorkload?: Boolean;
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
  isWorkload,
}: IResourceLabelProps) => {
   // Lấy thông tin avatar từ resources with id = user_id
  const avatarFromResources = resources.find(
    (item) => item.id === resource._resource.id,
  )?.avatar;
  

  const {
    name,
    company,
    type,
    fullName,
    position,
    eventType,
    note,
    project,
    user_id,
    bookings: parentBookings,
    role,
    avatar = avatarFromResources, // Thêm avatar từ resources
  } = resource._resource.extendedProps;
  // console.log("resource._resource.extendedProps", resource._resource.extendedProps);
  

  const commonT = useTranslations(NS_COMMON);
  const resourceT = useTranslations(NS_RESOURCE_PLANNING);

  const { totalLeftToSchedule } = useGetTotalScheduleTime();
  const { timeOffOptions } = useGetTimeOffOptions();
  const { user } = useAuth();
  const { projectDetail, userDetail } = useFetchDetail(project?.id, user_id);
  const isActive = useMemo(
    () => includes(selectedResource, resource._resource.id),
    [resource._resource.id, selectedResource],
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

  const ownerAvatar = user?.avatar;

  const avatarUrl = useMemo(() => {
    if (eventType === RESOURCE_EVENT_TYPE.PROJECT_BOOKING) {
      return projectDetail?.avatar;
    }
    if (user_id === user?.id || isMybooking) {
      return ownerAvatar;
    }
    return userDetail?.avatar;
  }, [eventType, user_id, user?.id, isMybooking, userDetail, projectDetail?.avatar, ownerAvatar]);

  const isAddbutton = useMemo(() => {
    return (isActive && parentBookings?.length === 0) || !isActive;
  }, [isActive, parentBookings]);


  return (
    <Grid
      container
      sx={{
        "&:hover": {
          background: "#E1F0FFB2",
        },
        overflowX: "auto",
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
              <Avatar src={avatar} size={32} />

              <Box>
                <Typography
                  sx={{ fontSize: 14 }}
                  fontWeight={isWorkload ? 400 : 600}
                >
                  {fullName}
                </Typography>
                <Typography sx={{ color: "#666666", fontSize: 14 }}>
                  {role}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {!isWorkload && (
          <>
            <Grid item maxWidth={"100%"} pl={1} paddingRight={2}>
              <Stack
                sx={{
                  ...textHeadStyle,
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  color: "#666666",
                  flexDirection: "row",
                }}
              >
                <Typography sx={{ fontSize: "13px", marginTop: "5px" }}>
                  {resourceT("schedule.resourceHeader.available")}
                </Typography>
                <Typography color={"#212121"} fontSize={13}>
                  {formatNumber(totalLeftToSchedule[resource._resource.id], {
                    numberOfFixed: 0,
                  })}{" "}
                  h
                </Typography>
              </Stack>
            </Grid>
            <Grid item maxWidth={"100%"} pl={1} paddingRight={2}>
              <Stack
                sx={{
                  ...textHeadStyle,
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                  color: "#666666",
                  flexDirection: "row",
                  fontSize: "13px",
                }}
              >
                <Typography fontSize={13}>
                  {resourceT("schedule.resourceHeader.schedule")}
                  {" ("}
                  {formatNumber(schedulePerLeft, {
                    numberOfFixed: 2,
                    suffix: "%",
                  })}
                  {")"}
                </Typography>
                <Typography color={"#212121"} fontSize={13}>
                  {formatNumber(totalhour, { numberOfFixed: 0, suffix: "h" })}
                </Typography>
              </Stack>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
};

const textHeadStyle = {
  fontSize: "14px",
  fontWeight: 400,
};

export default memo(ResourceLabel);
