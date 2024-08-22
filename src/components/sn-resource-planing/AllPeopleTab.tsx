"use client";

import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { Button, Input } from "components/shared";
import { NS_RESOURCE_PLANNING } from "constant/index";
import dayjs from "dayjs";
import useTheme from "hooks/useTheme";
import ClockIcon from "icons/ClockIcon";
import SearchIcon from "icons/SearchIcon";
import ServiceIcon from "icons/ServiceIcon";
import { isEmpty } from "lodash";
import { useTranslations } from "next-intl";
import React, {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IBookingListItem } from "store/resourcePlanning/reducer";
import {
  useBookingAll,
  useResourceDate,
} from "store/resourcePlanning/selector";
import EventContents from "./components/EventContents";
import FilterHeader from "./components/FilterHeader";
import ResourceLabel from "./components/ResourceLabel";
import SlotLabelContent from "./components/SlotLabelContent";
import { TAB_TYPE } from "./helper";
import { useFetchBookingAll } from "./hooks/useBookingAll";
import useGetOptions, { useFetchOptions } from "./hooks/useGetOptions";
import CreateBooking from "./modals/CreateBooking";
import EditBooking from "./modals/EditBooking";

export interface IEditState {
  isOpen: boolean;
  bookingId: string;
  isProject: boolean;
}

interface IAllPeopleTabProp {
  setisServicePopup: any;
  setIsWorkload: any;
  isWorkload: Boolean;
  tab: String;
  budgetSelected?: string | null;
  projectSelected?: string | null;
  isSmSmaller?: boolean;
}

const AllPeopleTab = ({
  setisServicePopup,
  setIsWorkload,
  isWorkload,
  tab,
  projectSelected,
  budgetSelected,
  isSmSmaller,
}: IAllPeopleTabProp) => {
  const resourceT = useTranslations<string>(NS_RESOURCE_PLANNING);
  const calendarRef = React.useRef<FullCalendar>(null);

  const { bookingAll, bookingAllFilter, setBookingAllFilter, isLoading } =
    useBookingAll();
  const { selectedDate, updateDate } = useResourceDate();
  const [resources, setResources] = React.useState<IBookingListItem[]>([]);
  const [selectedDateRange, setSelectedDateRange] = React.useState<Date[]>([]);
  const [selectedResource, setSelectedResource] = React.useState<string[]>([]);
  const [isOpenCreate, setIsOpenCreate] = React.useState(false);
  const [serviceId, setServiceId] = React.useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const { palette, isDarkMode } = useTheme();
  const [parentResource, setParentResource] = React.useState<string>("");
  const { updateBooking, loading } = useBookingAll();

  const [isOpenEdit, setIsOpenEdit] = React.useState<IEditState>({
    isOpen: false,
    bookingId: "",
    isProject: true,
  });

  const generateDateRange = () => {
    const start_date = dayjs(bookingAllFilter?.start_date);
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
  useFetchOptions();
  useFetchBookingAll();

  React.useEffect(() => {
    let delay;
    if (bookingAll) {
      setResources(bookingAll);
      delay = setTimeout(() => {
        setSelectedResource([...bookingAll?.map((item) => item.id)]);
      }, 500);
    } else {
      setSelectedResource([]);
    }

    calendarRef.current?.getApi().refetchResources();
    return () => clearTimeout(delay);
  }, [bookingAll]);

  React.useEffect(() => {
    if (
      !isEmpty(bookingAllFilter) &&
      dayjs(bookingAllFilter?.start_date).isValid() &&
      dayjs(bookingAllFilter?.end_date).isValid()
    ) {
      generateDateRange();
    }
  }, [bookingAllFilter?.start_date, bookingAllFilter?.end_date]);

  const totalhour = useMemo(() => {
    return resources.reduce((total, item) => {
      return total + item.total_hour;
    }, 0);
  }, [JSON.stringify(resources)]);

  const handleEventChange =
    (calendarRef: React.RefObject<FullCalendar>, isResize: boolean) =>
    async ({ event, revert }) => {
      const { type, service_id, bookingID, user_id, ...restData } =
        event.extendedProps;

      if (isResize && type === "campaign") return revert();
      if (type === "campaign") {
        // Campaign has been moved, compute diff and update each steps
        if (!calendarRef.current) return null;
      } else {
        // Step has been resized or move, update the campaign date
        if (!calendarRef.current) return null;
        const dateRange = event._instance.range;
        await updateBooking(
          {
            ...restData,
            user_id: user_id,
            end_date: dayjs(dateRange.end).format("YYYY-MM-DD"),
            start_date: dayjs(dateRange.start).format("YYYY-MM-DD"),
            booking_type: restData.eventType || restData.booking_type,
            time_off_type: restData.time_off_type,
            service_id: service_id,
          },
          bookingID,
        ).catch(() => revert());
        return null;
      }
    };

  // Toggle the resource
  const handleCollapseToggle = useCallback(
    (itemId: string) => {
      if (selectedResource.includes(itemId)) {
        setSelectedResource(
          selectedResource.filter((id) => id !== itemId && !id.includes("end")),
        );
      } else {
        setSelectedResource([...selectedResource, itemId]);
      }
      const collapseButton = document.querySelectorAll(
        `td[data-resource-id="${itemId}"][role="gridcell"] > div > div > span.fc-datagrid-expander`,
      ) as NodeListOf<HTMLElement>;
      if (collapseButton[0]) collapseButton[0].click();
    },
    [selectedResource],
  );

  // Convert resource bookings to event content for render
  const getEvents = useCallback(
    () =>
      resources
        ?.map(
          ({ id, bookings, fullname }) =>
            bookings.map((props) => {
              const {
                id: eventId,
                start_date: from,
                end_date: to,
                booking_type,
                allocation,
                position,
                allocation_type,
                total_hour,
                time_off_type,
                user_id,
                project,
                service_id,
                project_id,
              } = props;
              return {
                resourceId:
                  (project_id && `${user_id}.${project_id}`) || eventId,
                start: dayjs(from).toDate(),
                end: dayjs(to).toDate(),
                allDay: true,
                type: "step",
                campaignId: id,
                position,
                name: fullname,
                allocation,
                user_id: eventId,
                project: project,
                allocation_type,
                total_hour,
                avatarUrl: project?.avatar?.link,
                time_off_type,
                service_id: service_id,
                eventType: booking_type,
                eventId,
              };
            }),

          // TODO: remove if the label has no info
          // .concat([
          //   {
          //     resourceId: id,
          //     start: dayjs(bookingAllFilter?.start_date).toDate(),
          //     end: dayjs(bookingAllFilter?.end_date).toDate(),
          //     allDay: true,
          //     type: "campaign",
          //     campaignId: id,
          //     name: fullname,
          //     position: {},
          //     allocation: 0,
          //     allocation_type: "",
          //     total_hour: 0,
          //     eventType: RESOURCE_EVENT_TYPE.PROJECT_BOOKING,
          //     eventId: id,
          //   },
          // ]),
        )
        .flat(),
    [resources],
  );

  // convert the resource to resource content for render
  const getResources = useCallback(() => {
    const result = resources?.map((resource) => {
      const resourceEvent = {
        ...resource,
        user_id: resource.id,
        children: resource?.bookings.map((booking) => ({
          id:
            (booking?.project_id &&
              `${booking.user_id}.${booking?.project_id}`) ||
            booking?.id,
          name: booking?.project?.name,
          type: "step",
          eventType: booking?.booking_type,
          note: booking?.note,
          position: booking?.position,
          allocation: booking?.allocation,
          allocation_type: booking?.allocation_type,
          total_hour: booking?.total_hour,
          project: booking?.project,
          time_off_type: booking?.time_off_type,
          user_id: booking?.user_id,
          avatarUrl: booking.project?.owner?.avatar?.link,
          service_id: booking?.service_id,
        })),
      };
      if (resourceEvent.children?.length !== 0) {
        resourceEvent.children.push({
          id: `${resource.id}.end`,
          name: "",
          allocation: 0,
          total_hour: 0,
          allocation_type: "",
          eventType: "",
          note: "",
          position: {},
          time_off_type: undefined,
          service_id: "",
          project: undefined,
          avatarUrl: "",
          user_id: resource.id,
          type: "end",
        });
      }
      return resourceEvent;
    });
    return result;
  }, [resources]);

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
      maxHeight: "65vh!important",
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
  const mapResours = () => {
    const items: any = [];
    mappedResources.map((item: any) => {
      items.push({
        id: item.id,
        fullName: item.fullname,
        total_hour: item.total_hour,
      });
    });
    return items;
  };

  const mapEvent = () => {
    const items: any = [];
    mappedResources.map((item: any) =>
      item.bookings.map((ite: any) =>
        items.push({
          ...ite,
          resourceId: ite.user_id,
          start: ite.start_date,
          end: ite.end_date,
          bookingID: ite.id,
        }),
      ),
    );

    return items;
  };

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

  function getWeekDates(year, weekNumber) {
    const simple = new Date(year, 0, 1 + (weekNumber - 1) * 7);
    const dayOfWeek = simple.getDay();
    const ISOweekStart = simple;
    if (dayOfWeek <= 4)
      ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    const startOfWeek = new Date(ISOweekStart);
    const endOfWeek = new Date(ISOweekStart);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return { startOfWeek, endOfWeek };
  }
  function getMonthNamesForWeek(weekDates) {
    const startMonth = weekDates.startOfWeek.getMonth();
    const endMonth = weekDates.endOfWeek.getMonth();
    if (startMonth === endMonth) {
      return [monthNames[startMonth]];
    } else {
      return [monthNames[startMonth], monthNames[endMonth]];
    }
  }
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart: any = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }
  const currentWeekNumber = getWeekNumber(currentDate);
  const nextWeekNumber = currentWeekNumber + 1;
  const currentWeekDates = getWeekDates(currentYear, currentWeekNumber);
  const nextWeekDates = getWeekDates(currentYear, nextWeekNumber);
  const currentWeekMonths = getMonthNamesForWeek(currentWeekDates);
  const nextWeekMonths = getMonthNamesForWeek(nextWeekDates);

  const handleEventReceive = (eventInfo) => {
    const dateRange = eventInfo?.event?._instance?.range;

    const user_id = eventInfo?.event?._def?.resourceIds?.[0];
    const service_id = eventInfo?.draggedEl?.id;

    setParentResource(user_id || "");
    const start_date = dayjs(dateRange?.start).toDate();

    const end_date = dayjs(dateRange?.end).toDate();
    // if (!resource) return;
    setSelectedDateRange([start_date, end_date]);
    setServiceId(service_id);
    setIsOpenCreate(true);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      setBookingAllFilter({ ...bookingAllFilter, search_key: searchValue });
    }
  };

  const handleChangePosition = (position: string) => {
    setBookingAllFilter({ ...bookingAllFilter, position: position });
  };

  const handleChangeWorkingHour = (working_sort: "asc" | "desc") => {
    setBookingAllFilter({ ...bookingAllFilter, working_sort: working_sort });
  };

  const draggableEl = document.getElementById("external-events") as any;

  useEffect(() => {
    if (draggableEl)
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          const id = eventEl.dataset.id;
          const title = eventEl.getAttribute("title");
          console.log("title", title);

          return {
            id: id,
            title: title,
            booking_type: "SERVICE",
            create: true,
          };
        },
      });
  }, [draggableEl]);

  return (
    <Stack direction="column" rowGap={2}>
      <FilterHeader
        type={TAB_TYPE.ALL}
        setisServicePopup={setisServicePopup}
        setIsWorkload={setIsWorkload}
        tab={tab}
        handleChangePosition={handleChangePosition}
        handleChangeWorkingHour={handleChangeWorkingHour}
        bookingAllFilter={bookingAllFilter}
      />
      {isSmSmaller && (
        <Stack flexDirection={"row"} padding={"0px 20px"}>
          <Button
            sx={{
              display: "flex",
              alignItems: "center",
              mr: 2,
              borderRadius: "50px",
              background: "#F7F7FD",
              color: "#0575E6",
              width: "fit-content",
              fontSize: 13,
              gap: 1,
            }}
            onClick={() => setIsWorkload((prev: Boolean) => !prev)}
          >
            <ClockIcon sx={{ width: 14, height: 14 }} />
            Workload
          </Button>

          <Button
            sx={{
              marginLeft: "auto",
              backgroundColor: "transparent",
              color: "primary.main",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "rgba(0, 123, 255, 0.1)",
                borderRadius: "100px",
              },
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
            onClick={() => {
              setisServicePopup((prev: Boolean) => !prev);
            }}
          >
            <ServiceIcon sx={{ width: 14, height: 14 }} />
            Choose Service
          </Button>
        </Stack>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          position: "relative",
          top: "5px",
        }}
      >
        <div style={{ width: "1294px", display: "flex" }}>
          <p style={{ width: "50%", textAlign: "center", margin: 0 }}>
            {currentWeekMonths.join("-")}
          </p>
          <p style={{ width: "50%", textAlign: "center", margin: 0 }}>
            {nextWeekMonths.join("-")}
          </p>
        </div>
      </div>
      <Box
        sx={{
          ...defaultStyle,
          overflowX: "scroll",
          "& .fc-theme-standard td:last-child": {
            borderBottom: "none!important",
          },
          // "& .fc-theme-standard td:nth-last-child(2)": {
          //   border: "none!important",
          // },
          padding: "20px",
          paddingTop: 0,
        }}
      >
        <FullCalendar
          ref={calendarRef}
          plugins={[resourceTimelinePlugin, interactionPlugin]}
          initialView="resourceTimeline"
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          resourceAreaWidth={194}
          resourceOrder="from"
          weekends={true}
          editable={true}
          eventResourceEditable={true}
          eventDurationEditable={true}
          headerToolbar={false}
          nowIndicator={true}
          selectMirror={true}
          selectable={true}
          eventDragStart={(arg) => {
            const { event } = arg;
            if (event.extendedProps.type === "campaign") {
              return false;
            }
          }}
          duration={{ weeks: 2 }}
          select={(arg) => {
            const { startStr, endStr, resource, view } = arg;
            if (resource?._resource.extendedProps.type === "end") {
              view.calendar.unselect();
              return;
            }

            setParentResource(
              resource?._resource.parentId || resource?._resource.id || "",
            );
            const start_date = dayjs(startStr).toDate();

            const end_date = dayjs(endStr).subtract(1, "day").toDate();
            // if (!resource) return;
            setSelectedDateRange([start_date, end_date]);
            setIsOpenCreate(true);
          }}
          slotDuration={{
            days: 1,
          }}
          // resources={mappedResources}
          // events={mappedEvents}
          resources={mapResours()}
          events={mapEvent()}
          slotLabelContent={(arg) => {
            // Content label for each slot on calendar
            return <SlotLabelContent arg={arg} />;
          }}
          resourceAreaHeaderClassNames="custom-header"
          resourceAreaHeaderContent={(resrouce) => {
            return (
              // <ResourceHeaderContent
              //   resource={resrouce}
              //   totalhour={totalhour}
              // />
              <Input
                endNode={<SearchIcon />}
                placeholder="USER"
                onKeyDown={onKeyDown}
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
              />
            );
          }}
          resourceLabelContent={({ resource, view }) => {
            const parentResource = resources.find(
              (item) => item.id === resource._resource.parentId,
            );

            if (parentResource?.bookings.length === 0) {
              return;
            }

            // if (resource._resource.extendedProps.type === "end") {
            //   return (
            //     <Button
            //       variant="text"
            //       startIcon={<PlusIcon />}
            //       sx={{
            //         px: 2,
            //         py: 1,
            //         color: "success.main",
            //       }}
            //       // startIcon={<AddIcon />}
            //       onClick={() => {
            //         setIsOpenCreate(true);
            //         setParentResource(resource._resource.extendedProps.user_id);
            //       }}
            //     >
            //       {resourceT("schedule.action.addBooking")}
            //     </Button>
            //   );
            // }
            const bookings = parentResource
              ? [...parentResource?.bookings]
              : [];

            const isLastItem =
              bookings.pop()?.id === resource._resource.id ||
              bookings.length === 0;

            let totalBookingHours = 0;
            if (!resource._resource.parentId) {
              totalBookingHours =
                resources.find((item) => item.id === resource._resource.id)
                  ?.total_hour || 0;
            }
            // Content on the resource as a label
            return (
              <ResourceLabel
                handleCollapseToggle={handleCollapseToggle}
                resource={resource}
                resources={resources}
                isLastItem={isLastItem}
                selectedResource={selectedResource}
                totalhour={totalBookingHours}
                setParentResource={setParentResource}
                setIsOpenCreate={setIsOpenCreate}
                isWorkload={isWorkload}
              />
            );
          }}
          eventContent={({ event }) => {
            // Content on calendar

            return (
              <EventContents
                event={event}
                setIsOpenEdit={setIsOpenEdit}
                isWorkload={isWorkload}
              />
            );
          }}
          stickyFooterScrollbar={true}
          eventResize={handleEventChange(calendarRef, true)}
          eventDrop={handleEventChange(calendarRef, false)}
          droppable={true}
          eventReceive={handleEventReceive}
        />
      </Box>
      <CreateBooking
        onClose={() => {
          setSelectedDateRange([]);
          setIsOpenCreate(false);
        }}
        open={isOpenCreate}
        resourceId={parentResource}
        selectedDateRange={selectedDateRange}
        budgetSelected={budgetSelected}
        projectSelected={projectSelected}
        serviceId={serviceId}
      />

      {/* TODO: wait for confirm the edit function */}
      <EditBooking
        isProject={isOpenEdit.isProject}
        bookingId={isOpenEdit.bookingId}
        onClose={() =>
          setIsOpenEdit({
            isOpen: false,
            isProject: true,
            bookingId: "",
          })
        }
        open={isOpenEdit.isOpen}
      />
    </Stack>
  );
};

export default AllPeopleTab;
