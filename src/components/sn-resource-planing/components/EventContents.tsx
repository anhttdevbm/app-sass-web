import { EventApi } from "@fullcalendar/core";
import { Stack, Typography } from "@mui/material";
import {
  RESOURCE_ALLOCATION_UNIT,
  RESOURCE_ALLOCATION_TYPE,
  RESOURCE_EVENT_TYPE,
} from "constant/enums";
import dayjs from "dayjs";
import React from "react";
import useGetMappingTime from "../hooks/useGetMappingTime";
import { IEditState } from "../AllPeopleTab";
import BlueArrowIcon from "icons/BlueArrowIcon";
import RedArrowIcon from "icons/RedArrowIcon";
import GrayArrowIcon from "icons/GrayArrowIcon";
import { useTranslations } from "next-intl";
import { NS_RESOURCE_PLANNING } from "constant/index";
import { Tooltip } from "components/shared";
import useTheme from "hooks/useTheme";

interface IEventContentsProps {
  event: EventApi;
  setIsOpenEdit: (editState: IEditState) => void;
  isWorkload: Boolean;
}
const EventContents = ({
  event,
  setIsOpenEdit,
  isWorkload,
}: IEventContentsProps) => {
  const {
    booking_type,
    allocation_type,
    allocation,
    bookingID,
    time_off_type,
    project,
    total_hour,
  } = event.extendedProps;

  const { mappedTimeSymbol } = useGetMappingTime();
  const { palette, isDarkMode } = useTheme();
  const resourceT = useTranslations(NS_RESOURCE_PLANNING);
  const checkEventType = (value) => {
    switch (value) {
      case RESOURCE_EVENT_TYPE.PROJECT_BOOKING:
        return {
          icon: <BlueArrowIcon width={16} height={16} />,
          color: "#3699FFCC",
          background: "#408DFB",
        };
      case RESOURCE_EVENT_TYPE.TIME_OF_BOOKING:
        return {
          icon: <RedArrowIcon width={16} height={16} />,
          color: "rgba(246, 78, 96, 0.80);",
          background: "#CB4251",
        };
      default:
        return {
          icon: <GrayArrowIcon width={16} height={16} />,
          color: "#BABCC6",
          background: "none",
        };
    }
  };

  const checkedEventType = checkEventType(booking_type);
  const day = dayjs(event.end).diff(dayjs(event.start), "days");

  let unit;
  switch (allocation_type) {
    case RESOURCE_ALLOCATION_UNIT.HOUR_PER_DAY:
      unit = mappedTimeSymbol[RESOURCE_ALLOCATION_TYPE.HOUR_PER_DAY];
      break;
    case RESOURCE_ALLOCATION_UNIT.HOUR:
      unit = " " + mappedTimeSymbol[RESOURCE_ALLOCATION_TYPE.HOUR];
      break;
    default:
      unit = mappedTimeSymbol[RESOURCE_ALLOCATION_TYPE.PERCENTAGE];
      break;
  }

  return (
    <>
      {!isWorkload && (
        <Stack
          className="fc-event-title fc-sticky"
          direction="row"
          sx={{
            border: `1px solid ${checkedEventType.color}`,
            display: "flex!important",
            width: 1,
            borderRadius: 1,
            alignItems: "start",
            justifyContent: "start",
            background: checkedEventType.background,
            // height: "80px",
            flexDirection: "column",
          }}
          onClick={() => {
            setIsOpenEdit({
              isOpen: true,
              isProject: booking_type === RESOURCE_EVENT_TYPE.PROJECT_BOOKING,
              bookingId: bookingID,
            });
          }}
        >
          {/* {checkedEventType.icon} */}
          <Typography sx={{ color: "FFFFFF", fontSize: "10px" }}>
            {time_off_type ? resourceT("form.timeOffType.sick") : ""}
          </Typography>
          <Typography sx={{ color: "FFFFFF", fontSize: "10px" }}>
            {project?.name}
          </Typography>
          <Tooltip
            title={resourceT("schedule.time.eventTime", {
              day: isNaN(day) ? 1 : day,
              allocation,
              unit,
            })}
          >
            <Typography
              sx={{
                fontWeight: 400,
                color: "black",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                px: 1,
                mr: 0,
                width: "100%",
                textAlign: "end",
                fontSize: "11px",
                background: "#FFFFFF",
                borderRadius: "5px",
                marginBottom: "5px",
              }}
            >
              {resourceT("schedule.time.eventTime", {
                day: isNaN(day) ? 8 : day,
                allocation,
                unit,
              })}
            </Typography>
          </Tooltip>

          {/* <Stack
        sx={{
          transform: "rotate(180deg)",
        }}
      >
        {checkedEventType.icon}
      </Stack> */}
        </Stack>
      )}
      {isWorkload &&
        (booking_type === RESOURCE_EVENT_TYPE.PROJECT_BOOKING &&
        total_hour >= 8 ? (
          <h2
            style={{
              color: "black",
              background: "red",
              textAlign: "center",
              margin: 0,
              height: "100px",
              display: "flex",
              alignItems: "center ",
              justifyContent: "center",
              backgroundColor: "#33FFFF",
            }}
          >
            8
          </h2>
        ) : (
          ""
        ))}
    </>
  );
};

export default EventContents;
