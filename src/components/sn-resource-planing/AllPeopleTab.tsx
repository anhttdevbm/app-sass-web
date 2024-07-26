"use client";

import FullCalendar from "@fullcalendar/react";
import React, { use, useCallback, useEffect, useMemo, useState } from "react";
import {
  IBookingAllFitler,
  updateBookingResource,
} from "store/resourcePlanning/action";
import { DEFAULT_BOOKING_ALL_FILTER, TAB_TYPE } from "./helper";
import dayjs from "dayjs";
import { isEmpty } from "lodash";
import { Box } from "@mui/system";
import { CircularProgress, Grid, Stack, Typography } from "@mui/material";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import TimeHeader from "./components/TimeHeader";
import {
  useBookingAll,
  useResourceDate,
} from "store/resourcePlanning/selector";
import { NS_RESOURCE_PLANNING } from "constant/index";
import { useTranslations } from "next-intl";
import CreateBooking from "./modals/CreateBooking";
import { useFetchBookingAll } from "./hooks/useBookingAll";
import useGetOptions, { useFetchOptions } from "./hooks/useGetOptions";
import useGetMappingTime from "./hooks/useGetMappingTime";
import ResourceLabel from "./components/ResourceLabel";
import EventContents from "./components/EventContents";
import { IBookingListItem } from "store/resourcePlanning/reducer";
import FilterHeader from "./components/FilterHeader";
import ResourceHeaderContent from "./components/ResourceHeaderContent";
import SlotLabelContent from "./components/SlotLabelContent";
import useTheme from "hooks/useTheme";
import EditBooking from "./modals/EditBooking";
import PlusIcon from "icons/PlusIcon";
import { Button } from "components/shared";
import { Search } from "components/Filters";
import { Input } from "components/shared";
import SearchIcon from "icons/SearchIcon";

export interface IEditState {
  isOpen: boolean;
  bookingId: string;
  isProject: boolean;
}

interface IAllPeopleTabProp {
  setisServicePopup: any;
  setIsWorkload: any;
  isWorkload: Boolean;
}

const AllPeopleTab = ({
  setisServicePopup,
  setIsWorkload,
  isWorkload,
}: IAllPeopleTabProp) => {
  const resourceT = useTranslations<string>(NS_RESOURCE_PLANNING);
  const [filters, setFilters] = React.useState<IBookingAllFitler>(
    DEFAULT_BOOKING_ALL_FILTER,
  );
  const prevFilters = React.useRef<IBookingAllFitler>(
    DEFAULT_BOOKING_ALL_FILTER,
  );
  prevFilters.current = filters;

  const { bookingAll, bookingAllFilter, setBookingAllFilter, isLoading } =
    useBookingAll();
  const { selectedDate, updateDate } = useResourceDate();
  const [resources, setResources] = React.useState<IBookingListItem[]>([]);
  const [selectedDateRange, setSelectedDateRange] = React.useState<Date[]>([]);
  const calendarRef = React.useRef<FullCalendar>(null);
  const [selectedResource, setSelectedResource] = React.useState<string[]>([]);
  const [isOpenCreate, setIsOpenCreate] = React.useState(false);
  const { palette, isDarkMode } = useTheme();
  const [parentResource, setParentResource] = React.useState<string>("");
  const { updateBooking, loading } = useBookingAll();

  const [isOpenEdit, setIsOpenEdit] = React.useState<IEditState>({
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
  useFetchOptions();
  useFetchBookingAll();

  useEffect(() => {
    if (filters) {
      setBookingAllFilter(filters);
      setSelectedResource([]);
    }
  }, [filters]);

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
      !isEmpty(filters) &&
      dayjs(filters?.start_date).isValid() &&
      dayjs(filters?.end_date).isValid()
    ) {
      generateDateRange();
    }
  }, [filters?.start_date, filters?.end_date]);

  const totalhour = useMemo(() => {
    return resources.reduce((total, item) => {
      return total + item.total_hour;
    }, 0);
  }, [JSON.stringify(resources)]);

  const handleEventChange =
    (calendarRef: React.RefObject<FullCalendar>, isResize: boolean) =>
    async ({ event, revert }) => {
      const { type, campaignId, saleId, ...restData } = event.extendedProps;
      if (isResize && type === "campaign") return revert();
      if (type === "campaign") {
        // Campaign has been moved, compute diff and update each steps
        if (!calendarRef.current) return null;
      } else if (type === "step") {
        // Step has been resized or move, update the campaign date
        if (!calendarRef.current) return null;
        const dateRange = event._instance.range;
        await updateBooking(
          {
            ...restData,
            user_id: campaignId,
            end_date: dayjs(dateRange.end).format("YYYY-MM-DD"),
            start_date: dayjs(dateRange.start).format("YYYY-MM-DD"),
            booking_type: restData.eventType,
            time_off_type: restData.time_off_type,
            sale_id: saleId,
          },
          restData.eventId,
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
                sale_id,
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
                saleId: sale_id,
                eventType: booking_type,
                eventId,
              };
            }),

          // TODO: remove if the label has no info
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
          saleId: booking?.sale_id,
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
          saleId: "",
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
  console.log(mappedResources);

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
  console.log(mappedResources);
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

  return (
    <Stack direction="column" rowGap={2}>
      <FilterHeader
        type={TAB_TYPE.ALL}
        setisServicePopup={setisServicePopup}
        setIsWorkload={setIsWorkload}
      />
      {/* <TimeHeader
        filters={filters}
        setFilters={setFilters}
        calendarRef={calendarRef}
      /> */}
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
          headerToolbar={{
            start: "",
            center: "title",
            end: "",
          }}
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
              <Input endNode={<SearchIcon />} placeholder="USER" />
            );
          }}
          resourceLabelContent={({ resource, view }) => {
            console.log(resource);

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
              />
            );
          }}
          eventContent={({ event }) => {
            // Content on calendar
            console.log(event);

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
        />
        {/* <FullCalendar
          plugins={[resourceTimelinePlugin, interactionPlugin]}
          initialView="resourceTimeline"
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          resourceAreaWidth={194}
          resourceOrder="from"
          weekends={true}
          editable={true}
          eventResourceEditable={true}
          eventDurationEditable={true}
          headerToolbar={{
            start: "",
            center: "title",
            end: "",
          }}
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
          slotLabelContent={(arg) => {
            // Content label for each slot on calendar
            return <SlotLabelContent arg={arg} />;
          }}
          resourceAreaHeaderContent={(resrouce) => {
            return (
              // <ResourceHeaderContent
              //   resource={resrouce}
              //   totalhour={totalhour}
              // />
              <Input endNode={<SearchIcon />} placeholder="USER" />
            );
          }}
          resources={mapResours()}
          events={mapEvent()}
          resourceLabelContent={(e) => {
            return (
              <div
                onClick={() => {
                  handleCollapseToggle(e.resource._resource.id);
                }}
              >
                <h4>{e.resource._resource.extendedProps.fullName}</h4>;
              </div>
            );
          }}
          eventContent={(e) => {
            return (
              <h3 style={{ color: "black" }} onClick={()=>{
                setIsOpenEdit({
                  isOpen: true,
                  isProject: eventType === RESOURCE_EVENT_TYPE.PROJECT_BOOKING,
                  bookingId: eventId,
                });
              }}>
                {e.event._def.extendedProps.note}
              </h3>
            );
          }}
        /> */}
      </Box>
      <CreateBooking
        onClose={() => {
          setSelectedDateRange([]);
          setIsOpenCreate(false);
        }}
        open={isOpenCreate}
        resourceId={parentResource}
        selectedDateRange={selectedDateRange}
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
