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
}
const EventContents = ({ event, setIsOpenEdit }: IEventContentsProps) => {
  const { eventType, allocation_type, allocation, eventId } =
    event.extendedProps;
  const { mappedTimeSymbol } = useGetMappingTime();
  const { palette, isDarkMode } = useTheme();
  const resourceT = useTranslations(NS_RESOURCE_PLANNING);
  const checkEventType = (value) => {
    switch (value) {
      case RESOURCE_EVENT_TYPE.PROJECT_BOOKING:
        return {
          icon: <BlueArrowIcon width={16} height={16} />,
          color: "#3699FFCC",
          background: "#EBF5FF",
        };
      case RESOURCE_EVENT_TYPE.TIME_OF_BOOKING:
        return {
          icon: <RedArrowIcon width={16} height={16} />,
          color: "rgba(246, 78, 96, 0.80);",
          background: "#FEEDED",
        };
      default:
        return {
          icon: <GrayArrowIcon width={16} height={16} />,
          color: "#BABCC6",
          background: "none",
        };
    }
  };

  const checkedEventType = checkEventType(eventType);
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
    <Stack
      className="fc-event-title fc-sticky"
      direction="row"
      sx={{
        border: `1px solid ${checkedEventType.color}`,
        display: "flex!important",
        width: 1,
        borderRadius: 1,
        alignItems: "center",
        justifyContent: "space-between",
        background: checkedEventType.background,
      }}
      onClick={() =>
        setIsOpenEdit({
          isOpen: true,
          isProject: eventType === RESOURCE_EVENT_TYPE.PROJECT_BOOKING,
          bookingId: eventId,
        })
      }
    >
      {checkedEventType.icon}
      <Tooltip
        title={resourceT("schedule.time.eventTime", {
          day: isNaN(day) ? 1 : day,
          allocation,
          unit,
        })}
      >
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 400,
            color: isDarkMode ? palette.grey[600] : palette.grey[300],
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            px: 1,
            mr: "auto",
          }}
        >
          {resourceT("schedule.time.eventTime", {
            day: isNaN(day) ? 1 : day,
            allocation,
            unit,
          })}
        </Typography>
      </Tooltip>

      <Stack
        sx={{
          transform: "rotate(180deg)",
        }}
      >
        {checkedEventType.icon}
      </Stack>
    </Stack>
  );
};

export default EventContents;
