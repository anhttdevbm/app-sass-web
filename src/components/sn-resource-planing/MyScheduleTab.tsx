import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { ResourceInput } from "@fullcalendar/resource";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { Button } from "components/shared";
import { TIME_OFF_TYPE } from "components/sn-sales/helpers";
import { NS_RESOURCE_PLANNING } from "constant/index";
import dayjs from "dayjs";
import useTheme from "hooks/useTheme";
import PlusIcon from "icons/PlusIcon";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "store/app/selectors";
import { IBookingAllFitler } from "store/resourcePlanning/action";
import { IBookingItem } from "store/resourcePlanning/reducer";
import {
  useBookingAll,
  useMyBooking,
  useResourceDate,
} from "store/resourcePlanning/selector";
import EventContents from "./components/EventContents";
import FilterHeader from "./components/FilterHeader";
import ResourceHeaderContent from "./components/ResourceHeaderContent";
import ResourceLabel from "./components/ResourceLabel";
import SlotLabelContent from "./components/SlotLabelContent";
import TimeHeader from "./components/TimeHeader";
import { DEFAULT_BOOKING_ALL_FILTER, TAB_TYPE } from "./helper";
import { useFetchMyBooking } from "./hooks/useBookingAll";
import useGetOptions from "./hooks/useGetOptions";
import CreateBooking from "./modals/CreateBooking";
import EditBooking from "./modals/EditBooking";

const MyScheduleTab = ({
  setisServicePopup,
  isWorkload,
  setIsWorkload,
  tab,
}: any) => {
  const resourceT = useTranslations<string>(NS_RESOURCE_PLANNING);
  const [filters, setFilters] = React.useState<IBookingAllFitler>(
    DEFAULT_BOOKING_ALL_FILTER,
  );
  const prevFilters = React.useRef<IBookingAllFitler>(
    DEFAULT_BOOKING_ALL_FILTER,
  );
  prevFilters.current = filters;

  const { selectedDate, updateDate } = useResourceDate();
  const { user } = useAuth();
  const { getMyBooking, myBooking, setMyBookingFilter } = useMyBooking();
  const [resources, setResources] = React.useState<IBookingItem[]>([]);
  const calendarRef = React.useRef<FullCalendar>(null);
  const [selectedDateRange, setSelectedDateRange] = React.useState<Date[]>([]);
  const [selectedResource, setSelectedResource] = React.useState<string[]>([]);
  const [isOpenCreate, setIsOpenCreate] = React.useState(false);
  const { palette } = useTheme();
  const [parentResource, setParentResource] = React.useState<string>("");
  const { updateBooking, bookingAll } = useBookingAll();

  const [isOpenEdit, setIsOpenEdit] = React.useState({
    isOpen: false,
    bookingId: "",
    isProject: true,
  });
  const generateDateRange = () => {
    const start_date = dayjs(filters?.start_date);
    const result: Array<Date> = [];
    let currentDate = start_date?.startOf("week").add(0, "day"); // Ngày bắt đầu tuần (chủ nhật)
    const endOfWeek = start_date?.startOf("week").add(6, "day"); // Ngày kết thúc tuần (thứ 2)

    while (
      currentDate.isBefore(endOfWeek) ||
      currentDate.isSame(endOfWeek, "day")
    ) {
      result.push(currentDate.toDate());
      currentDate = currentDate.add(1, "day");
    }

    updateDate({
      dateRange: result,
      selectedDate,
    });
  };

  useFetchMyBooking();

  useEffect(() => {
    if (filters) {
      setMyBookingFilter(filters);
      setSelectedResource([]);
    }
  }, [filters]);

  React.useEffect(() => {
    if (myBooking) {
      setResources(myBooking);
      setSelectedResource([user?.id as string]);
    }
  }, [myBooking]);

  React.useEffect(() => {
    if (
      !isEmpty(filters) &&
      dayjs(filters?.start_date).isValid() &&
      dayjs(filters?.end_date).isValid()
    ) {
      generateDateRange();
    }
  }, [filters?.start_date, filters?.end_date]);

  const handleEventChange =
    (calendarRef: React.RefObject<FullCalendar>, isResize: boolean) =>
    ({ event, revert }) => {
      const { type, saleId, ...restData } = event.extendedProps;
      if (isResize && type === "campaign") return revert();
      if (type === "campaign") {
        // Campaign has been moved, compute diff and update each steps
        if (!calendarRef.current) return null;
      } else if (type === "step") {
        // Step has been resized or move, update the campaign dates
        if (!calendarRef.current) return null;
        const dateRange = event._instance.range;

        updateBooking(
          {
            ...restData,
            end_date: dayjs(dateRange.end).format("YYYY-MM-DD"),
            start_date: dayjs(dateRange.start).format("YYYY-MM-DD"),
            booking_type: restData.eventType,
            time_off_type: restData.time_off_type,
            sale_id: saleId,
            user_id: user?.id,
          },
          restData.eventId,
        );
      }
    };

  const handleCollapseToggle = (itemId: string) => {
    if (selectedResource.includes(itemId)) {
      setSelectedResource(selectedResource.filter((id) => id !== itemId));
    } else {
      setSelectedResource([...selectedResource, itemId]);
    }
    const collapseButton = document.querySelectorAll(
      `td[data-resource-id="${itemId}"][role="gridcell"] > div > div > span.fc-datagrid-expander`,
    ) as NodeListOf<HTMLElement>;
    if (collapseButton[0]) collapseButton[0].click();
  };

  const getEvents = useCallback(
    () =>
      resources.map((props: IBookingItem) => {
        const {
          id: eventId,
          start_date: from,
          end_date: to,
          booking_type,
          allocation,
          position,
          allocation_type,
          sale_id,
          project_id,
          project,
          time_off_type,
          total_hour,
        } = props;

        return {
          resourceId: (project_id && `${user?.id}.${project_id}`) || eventId,
          start: dayjs(from).toDate(),
          end: dayjs(to).toDate(),
          allDay: true,
          type: "step",
          position,
          allocation,
          allocation_type,
          total_hour,
          eventType: booking_type,
          name: project?.name,
          saleId: sale_id,
          time_off_type,
          eventId,
        };
      }) as ResourceInput,
    [JSON.stringify(resources)],
  );
  // TODO: remove if label has no content
  // .concat([
  //   {
  //     resourceId: id,
  //     start: dayjs(filters?.start_date).toDate(),
  //     end: dayjs(filters?.end_date).toDate(),
  //     allDay: true,
  //     type: "campaign",
  //     campaignId: id,
  //     name: fullname,
  //     position: {},
  //     eventType: RESOURCE_EVENT_TYPE.PROJECT_BOOKING,
  //     eventId: id,
  //   },
  // ]),

  const getResources = useCallback(() => {
    const result =
      resources?.map((resource: IBookingItem) => ({
        ...resource,
        name: resource?.project?.name,
        id:
          (resource?.project_id &&
            `${resource.user_id}.${resource?.project_id}`) ||
          resource?.id,
        type: "step",
        eventType: resource?.booking_type,
        // children: resource?.bookings?.map((booking) => ({
        //   id: booking?.id,
        //   name: booking?.project?.name,
        //   type: "step",
        //   eventType: booking?.booking_type,
        //   note: booking?.note,
        //   position: booking?.position,
        // })),
      })) || [];
    if (resources?.length > 0) {
      result.push({
        id: "end",
        name: "",
        allocation: 0,
        allocation_type: "percent",
        booking_type: "project",
        created_time: "",
        note: "",
        eventType: "end",
        end_date: "",
        position: {},
        user_id: "",
        project: {},
        project_id: "",
        sale_id: "",
        start_date: "",
        time_off_type: TIME_OFF_TYPE.OTHER,
        type: "step",
        total_hour: 160,
        _id: "",
      });
    }
    return [
      {
        id: user?.id,
        fullname: user?.fullname,
        company: user?.company,
        total_hour: 160,
        bookings: result,
        children: result,
      },
    ];
  }, [JSON.stringify(resources)]);

  const totalhour = useMemo(() => {
    return resources.reduce((total, item) => {
      return total + item.total_hour;
    }, 0);
  }, [JSON.stringify(resources)]);

  const mappedResources = getResources();

  const mappedEvents = getEvents();

  useGetOptions();

  const defaultStyle = {
    "& .custom-header": {
      "& .fc-scrollgrid-sync-inner": {
        width: "100%!important",
      },
    },
    "& .fc-media-screen": {
      maxHeight: "70vh!important",
    },
    "& .fc-datagrid-cell-cushion": { padding: "0!important" },
    "& .fc-datagrid-cell": {},
    "& .fc-event-resizable": {
      background: "none!important",
      border: "none!important",
    },
    "& .fc-datagrid-cell-frame": {
      // height: "auto!important",
    },
    "& .fc-icon, & .fc-datagrid-expander-placeholder, & .fc-datagrid-expander":
      {
        display: "none!important",
      },
    "& td.fc-day-sun, & td.fc-day-sat": {
      borderBottom: "none!important",
      background: palette.grey[50],
    },
    "& th.fc-day-sun, & th.fc-day-sat": {
      background: palette.grey[50],
    },
  };
  function getFirstAndSecondLetters(name) {
    let parts = name.split(" ");
    let firstLetter = parts[0][0];
    let lastLetter = parts[parts.length - 1][0];
    return firstLetter + lastLetter;
  }
  const projectDumy: any = [];
  bookingAll.map((item) => {
    item.bookings.map((ite) => {
      if (ite.booking_type === "PROJECT_BOOKING") {
        projectDumy.push({
          ...ite,
          fullname: item.fullname,
          backgroundName: `rgba(${Math.floor(Math.random() * 256)},${Math.floor(
            Math.random() * 256,
          )},${Math.floor(Math.random() * 256)},${Math.floor(
            Math.random() * 256,
          )})`,
          id: ite._id,
        });
      }
    });
  });

  let grouped = projectDumy.reduce((acc, item) => {
    let projectId = item.project.id;
    if (!acc[projectId]) {
      acc[projectId] = [];
    }
    acc[projectId].push(item);
    return acc;
  }, {});
  let result: any = Object.values(grouped);
  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result[i].length; j++) {
      let index;
      if (result[i].length < 3) {
        index = 0;
      } else {
        index = Math.ceil(result[i].length / 2);
      }
      if (j === 0) {
        result[i][j].sale = {
          ...result[i][j].sale,
          border: "1px solid #CCCCCC",
        };
      }
      if (j === index) {
        result[i][j].sale = {
          ...result[i][j].sale,
          nameService: result[i][j].sale.name,
        };
      }
      if (j === result[i].length - 1) {
        result[i][j].sale = {
          ...result[i][j].sale,
          borderBottom: "1px solid #CCCCCC",
        };
      }
      if (j !== 0 && j !== result[i].length - 1) {
        result[i][j].sale = {
          ...result[i][j].sale,
          border: "none",
          borderBottom: "none",
        };
      }
      if (j !== index) {
        result[i][j].sale = {
          ...result[i][j].sale,
          nameService: "",
        };
      }
    }
  }

  const mapResours = () => {
    const items: any = [];
    result.map((item: any) => {
      items.push({
        id: item[0].project.id,
        projectName: item[0].project.name,
        children: [...item],
      });
    });
    return items;
  };

  const mapEvent = () => {
    const items: any = [];
    projectDumy.map((item: any) => {
      items.push({
        ...item,
        id: item._id,
        start: item.start_date,
        end: item.end_date,
        resourceId: item._id,
      });
    });
    return items;
  };

  const currentDate = new Date();
  const currentWeekNumber = getWeekNumber(currentDate);
  function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart: any = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  }
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <Stack direction="column" rowGap={2}>
      <FilterHeader
        type={TAB_TYPE.MY}
        setisServicePopup={setisServicePopup}
        setIsWorkload={setIsWorkload}
        tab={tab}
      />
      {/* <TimeHeader
        filters={filters}
        setFilters={setFilters}
        calendarRef={calendarRef}
      /> */}
      <div
        style={{
          display: "flex",
          alignItems: "end",
          flexDirection: "column",
          position: "relative",
          top: "15px",
        }}
      >
        <p
          style={{
            width: "60%",
            textAlign: "center",
            margin: 0,
            border: "1px solid #CCCCCC",
          }}
        >
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </p>
        <div
          style={{
            display: "flex",
            width: "60%",
            justifyContent: "space-around",
          }}
        >
          <p
            style={{
              margin: 0,
              width: "50%",
              textAlign: "center",
              border: "1px solid #CCCCCC	",
            }}
          >
            week {getWeekNumber(currentDate)}
          </p>
          <p
            style={{
              margin: 0,
              width: "50%",
              textAlign: "center",
              border: "1px solid #CCCCCC	",
            }}
          >
            week {currentWeekNumber + 1}
          </p>
        </div>
      </div>
      <Box overflow="scroll" sx={{ ...defaultStyle }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[resourceTimelinePlugin, interactionPlugin]}
          initialView="resourceTimeline"
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          resourceAreaWidth={600}
          resourceOrder="from"
          weekends={true}
          editable={true}
          nowIndicator={true}
          eventResourceEditable={true}
          headerToolbar={false}
          duration={{ weeks: 2 }}
          slotDuration={{
            days: 1,
          }}
          selectable={true}
          // select={(arg) => {
          //   const { startStr, endStr, resource, view } = arg;

          //   if (resource?._resource.extendedProps.type === "end") {
          //     view.calendar.unselect();
          //     return;
          //   }

          //   setParentResource(
          //     resource?._resource.parentId || resource?._resource.id || "",
          //   );
          //   const start_date = dayjs(startStr).toDate();

          //   const end_date = dayjs(endStr).subtract(1, "day").toDate();
          //   setSelectedDateRange([start_date, end_date]);
          //   setIsOpenCreate(true);
          // }}
          // resources={mappedResources as ResourceInput}
          // events={mappedEvents as ResourceInput}
          resources={mapResours()}
          events={mapEvent()}
          slotLabelContent={(arg) => {
            return <SlotLabelContent arg={arg} />;
          }}
          resourceAreaHeaderClassNames="custom-header"
          resourceAreaHeaderContent={(resource) => {
            return (
              <ResourceHeaderContent
                totalhour={totalhour}
                resource={resource}
              />
            );
          }}
          resourceLabelContent={({ resource }) => {
            if (resource._resource.extendedProps.projectName) {
              return (
                <h2
                  style={{
                    borderTop: "1px solid #CCCCCC",
                    paddingLeft: "10px",
                  }}
                >
                  {resource._resource.extendedProps.projectName}
                </h2>
              );
            }
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: resource._resource.extendedProps.sale.border,
                    borderBottom:
                      resource._resource.extendedProps.sale.borderBottom,
                  }}
                >
                  <p
                    style={{
                      width: "20%",
                      color: "black",
                      paddingLeft: "10px",
                    }}
                  >
                    {resource._resource.extendedProps.sale.nameService}
                  </p>
                  <div
                    style={{
                      width: "50%",
                      borderBottom: "1px solid #CCCCCC",
                      borderLeft: "1px solid #CCCCCC",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "right",
                        alignItems: "center",
                        gap: "10px",
                        paddingLeft: "10px",
                      }}
                    >
                      <p
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          background:
                            resource._resource.extendedProps.backgroundName,
                          fontSize: "15px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {getFirstAndSecondLetters(
                          resource._resource.extendedProps.fullname,
                        )}
                      </p>
                      <p>{resource._resource.extendedProps.fullname}</p>
                    </div>
                    <p
                      style={{
                        borderLeft: "1px solid #CCCCCC",
                        margin: "0 10px 0 0",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "0 10px",
                      }}
                    >
                      {resource._resource.extendedProps.start_date}
                    </p>
                  </div>
                </div>
              </>
            );
            // // const bookings = parentResource?.bookings || [];
            // const isLastItem =
            //   resources[resources.length - 1]?.id === resource._resource.id;
            // if (resource._resource.id === "end") {
            //   return (
            //     <Button
            //       variant="text"
            //       startIcon={<PlusIcon />}
            //       sx={{
            //         color: "success.main",
            //       }}
            //       // startIcon={<AddIcon />}
            //       onClick={() => setIsOpenCreate(true)}
            //     >
            //       {resourceT("schedule.action.addBooking")}
            //     </Button>
            //   );
            // }
            // return (
            //   <ResourceLabel
            //     setParentResource={setParentResource}
            //     handleCollapseToggle={handleCollapseToggle}
            //     isLastItem={isLastItem}
            //     resource={resource}
            //     resources={resources}
            //     isMybooking={true}
            //     selectedResource={selectedResource}
            //     setIsOpenCreate={setIsOpenCreate}
            //     totalhour={totalhour}
            //   />
            // );
          }}
          eventContent={({ event }) => {
            const startDate: any = new Date(
              event._def.extendedProps.start_date,
            );
            const endDate: any = new Date(event._def.extendedProps.end_date);
            const oneDay = 24 * 60 * 60 * 1000;
            const numberOfDays = Math.round((endDate - startDate) / oneDay);
            return (
              <div
                style={{
                  backgroundColor: "black",
                  display: "flex",
                  alignItems: "center",
                  padding: "5px 0",
                  gap: "1px",
                  borderRadius: "5px",
                }}
              >
                <span
                  style={{
                    width: "23px",
                    height: "23px",
                    borderRadius: "50%",
                    background: event._def.extendedProps.backgroundName,
                    fontSize: "15px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {getFirstAndSecondLetters(event._def.extendedProps.fullname)}
                </span>
                {numberOfDays > 1 && (
                  <span
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontSize: "11px",
                    }}
                  >
                    {event._def.extendedProps.total_hour}h/day for{" "}
                    {numberOfDays} day
                  </span>
                )}
              </div>
            );
            // return (
            //   <EventContents
            //     event={event}
            //     setIsOpenEdit={setIsOpenEdit}
            //     isWorkload={isWorkload}
            //   />
            // );
          }}
          eventResize={handleEventChange(calendarRef, true)}
          eventDrop={handleEventChange(calendarRef, false)}
        />
      </Box>
      <CreateBooking
        resourceId={parentResource}
        onClose={() => setIsOpenCreate(false)}
        open={isOpenCreate}
        selectedDateRange={selectedDateRange}
      />
      {/* Wait for the edit funcion is confirmed */}
      <EditBooking
        open={isOpenEdit.isOpen}
        bookingId={isOpenEdit.bookingId}
        isProject={isOpenEdit.isProject}
        onClose={() =>
          setIsOpenEdit({
            isOpen: false,
            isProject: true,
            bookingId: "",
          })
        }
      />
    </Stack>
  );
};

export default MyScheduleTab;
