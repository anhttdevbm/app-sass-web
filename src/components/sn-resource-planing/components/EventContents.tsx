import { EventApi } from "@fullcalendar/core";
import { Stack, Typography } from "@mui/material";
import {
  RESOURCE_ALLOCATION_TYPE,
  RESOURCE_ALLOCATION_UNIT,
  RESOURCE_EVENT_TYPE,
} from "constant/enums";
import { NS_RESOURCE_PLANNING } from "constant/index";
import dayjs from "dayjs";
import useTheme from "hooks/useTheme";
import BlueArrowIcon from "icons/BlueArrowIcon";
import GrayArrowIcon from "icons/GrayArrowIcon";
import ProjectBookingIcon from "icons/ProjectBookingIcon";
import SickLeaveIcon from "icons/SickLeaveIcon";
import { useTranslations } from "next-intl";
import { IEditState } from "../AllPeopleTab";
import useGetMappingTime from "../hooks/useGetMappingTime";

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
          icon: <ProjectBookingIcon width={16} height={16} />,
          color: "#000000",
          background: "#408DFB",
          backgroundTitle: "#091E420F",
          backgroundContent: "#FFFFFFCC",
        };
      case RESOURCE_EVENT_TYPE.TIME_OF_BOOKING:
        return {
          icon: <SickLeaveIcon sx={{ width: 14, height: 14 }} />,
          color: "#000000",
          background: "#CB4251",
          backgroundTitle: "#091E420F",
          backgroundContent: "#FFFFFFCC",
        };
      case "SERVICE":
        return {
          icon: <BlueArrowIcon sx={{ width: 14, height: 14, fontSize: 14 }} />,
          color: "#3699FFCC",
          background: "#408DFB",
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
      // unit = " " + mappedTimeSymbol[RESOURCE_ALLOCATION_TYPE.HOUR];
      unit = "h";
      break;
    default:
      unit = mappedTimeSymbol[RESOURCE_ALLOCATION_TYPE.PERCENTAGE];
      break;
  }

  return (
    <>
      {!isWorkload ? (
        <Stack
          className="fc-event-title fc-sticky"
          direction="row"
          sx={{
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
          <Stack
            display={"flex"}
            flexDirection={"row"}
            width={"100%"}
            gap={"3px"}
          >
            <div>{checkedEventType.icon}</div>
            {time_off_type && (
              <Typography
                sx={{
                  color: "FFFFFF",
                  fontSize: "10px",
                  paddingTop: "2px",
                  paddingRight: "2px",
                }}
              >
                {resourceT("form.timeOffType.sick")}
              </Typography>
            )}
            {booking_type && (
              <Stack display={"flex"}>
                <Typography
                  sx={{
                    color: "FFFFFF",
                    fontSize: "10px",
                    paddingTop: "2px",
                    paddingRight: "2px",
                  }}
                >
                  {project?.company}
                </Typography>
                <Typography
                  sx={{
                    color: "FFFFFF",
                    fontSize: "7px",
                    paddingTop: "2px",
                    paddingRight: "2px",
                  }}
                >
                  {project?.name}
                </Typography>
              </Stack>
            )}
          </Stack>

          <Stack
            sx={{
              background: checkedEventType.backgroundTitle,
              padding: "4px 2px 4px 8px",
              marginTop: time_off_type ? "10px" : 0,
              float: "right",
              borderRadius: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 9,
                width: "fit-content",
                background: checkedEventType.backgroundContent,
                color: checkedEventType.color,
                paddingLeft: "2px",
                paddingRight: "2px",
                borderRadius: 1,
              }}
            >
              {booking_type === "SERVICE"
                ? resourceT("schedule.action.addBooking")
                : resourceT("schedule.time.eventTime", {
                    day: isNaN(day) ? 1 : day,
                    allocation,
                    unit,
                  })}
            </Typography>
          </Stack>

          {/* <Stack
        sx={{
          transform: "rotate(180deg)",
        }}
      >
        {checkedEventType.icon}
      </Stack> */}
        </Stack>
      ) : (
        booking_type === RESOURCE_EVENT_TYPE.PROJECT_BOOKING && (
          <h2
            style={{
              color: "white",
              textAlign: "center",
              margin: 0,
              height: "60px",
              display: "flex",
              alignItems: "center ",
              justifyContent: "center",
              background:
                "linear-gradient(180deg, rgba(255, 192, 203, 0) 0%, #57D9A3 0%)",
            }}
          >
            <div
              style={{
                background: "#00875A",
                fontSize: 11,
                minWidth: 20,
                height: 20,
                padding: 2,
                borderRadius: 3,
              }}
            >
              {total_hour}
            </div>
          </h2>
        )
      )}
    </>
  );
};

export default EventContents;
