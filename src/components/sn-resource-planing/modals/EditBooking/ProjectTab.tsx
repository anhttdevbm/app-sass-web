import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Typography,
  Collapse,
  Stack,
  useTheme,
  CircularProgress,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Textarea from "components/sn-time-tracking/Component/Textarea";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CustomDateRangePicker from "components/sn-resource-planing/components/CustomDateRangePicker";
import TextFieldInput from "components/shared/TextFieldInput";
import ArrowDownIcon from "icons/ArrowDownIcon";
import _ from "lodash";
import { useTranslations } from "next-intl";
import { NS_COMMON, NS_RESOURCE_PLANNING } from "constant/index";
import { Button } from "components/shared";
import useGetOptions from "components/sn-resource-planing/hooks/useGetOptions";
import { useBookingAll } from "store/resourcePlanning/selector";
import dayjs from "dayjs";
import { BookingData } from "store/resourcePlanning/action";
import { RESOURCE_ALLOCATION_TYPE, RESOURCE_EVENT_TYPE } from "constant/enums";
import { IBookingItem } from "store/resourcePlanning/reducer";
import TextFieldSelect, {
  IOptionStructure,
} from "components/shared/TextFieldSelect";
import { useGetSchemas } from "../Schemas";
import { useCalculateDetail } from "components/sn-resource-planing/hooks/useCalculateDetail";
import TextStatus from "components/TextStatus";
import { formatNumber } from "utils/index";

interface IProps {
  open: boolean;
  onClose(): void;
  bookingId: string;
}

const ProjectTab = ({ open, onClose, bookingId }: IProps) => {
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [isFocusAllocation, setIsFocusAllocation] = useState(false);

  const { palette } = useTheme();
  const { projectOptions, timeOptions, salesOptions } = useGetOptions();
  const { bookingAll, updateBooking, loading } = useBookingAll();
  const { schemaProject } = useGetSchemas();

  const commonT = useTranslations(NS_COMMON);
  const resourceT = useTranslations(NS_RESOURCE_PLANNING);

  const bookingEvent: IBookingItem = useMemo(() => {
    const booking =
      bookingAll
        .find((item) => item.bookings.find((i) => i.id === bookingId))
        ?.bookings.find((i) => i.id === bookingId) || ({} as IBookingItem);
    if (booking.booking_type !== RESOURCE_EVENT_TYPE.PROJECT_BOOKING) {
      return {} as IBookingItem;
    }
    return booking;
  }, [JSON.stringify(bookingAll)]);

  const {
    control: controlProject,
    handleSubmit: handleSubmitProject,
    // setValue: setValueProject,
    // clearErrors: clearErrorsProject,
    watch: watchProject,
    reset: resetProject,

    formState: { errors: errorsProject },
  } = useForm({
    resolver: yupResolver(schemaProject),
    defaultValues: {
      project_id: bookingEvent?.project_id || "",
      sale_id: bookingEvent?.sale_id || "",
      dateRange: {
        startDate: bookingEvent?.start_date
          ? dayjs(bookingEvent?.start_date).toDate()
          : undefined,
        endDate: bookingEvent?.end_date
          ? dayjs(bookingEvent?.end_date).toDate()
          : undefined,
      },
      user_id: bookingEvent?.user_id,
      allocation: bookingEvent?.allocation || 1,
      allocation_type:
        bookingEvent?.allocation_type || RESOURCE_ALLOCATION_TYPE.HOUR,
      note: bookingEvent?.note || "",
    },
    mode: "all",
  });

  const { workedTime, estimate, leftToSchedule, scheduledTime } =
    useCalculateDetail(
      watchProject("sale_id"),
      watchProject("project_id"),
      bookingEvent.user_id,
      bookingEvent.user_id,
    );
  // console.log(bookingEvent, "bookingEvent");
  const onSubmitProject = async (data) => {
    const cleanData: BookingData = {
      ...data,
      user_id: bookingEvent?.user_id,
      start_date: dayjs(data.dateRange.startDate).format("YYYY-MM-DD"),
      end_date: dayjs(data.dateRange.endDate).format("YYYY-MM-DD"),
      booking_type: RESOURCE_EVENT_TYPE.PROJECT_BOOKING,
    };
    await updateBooking(cleanData, bookingId).then(() => {
      onClose();
    });
  };
  useEffect(() => {
    if (!open) {
      resetProject();
    }
  }, [open]);

  return (
    <>
      <Grid2 container spacing={2} sx={{ pt: 1, mb: 0 }}>
        {/* <Grid2 xs={12}>
        <Controller
          name="project_id"
          defaultValue={bookingEvent?.project_id}
          control={controlProject}
          render={({ field }) => (
            <TextFieldSelect
              helperText={errorsProject.project_id?.message}
              error={!!errorsProject.project_id?.message}
              required
              options={projectOptions}
              label={resourceT("form.project")}
              {...field}
            />
          )}
        />
      </Grid2> */}
        <Grid2 xs={12}>
          <Controller
            name="sale_id"
            control={controlProject}
            render={({ field }) => (
              <TextFieldSelect
                value={field.value}
                onChange={(event) => field.onChange(event.target.value)}
                helperText={errorsProject.sale_id?.message}
                error={!!errorsProject.sale_id?.message}
                required
                options={salesOptions as IOptionStructure[]}
                label={resourceT("form.services")}
                sx={{
                  overflow: "hidden",
                  "& .Muibox-root .MuiBox-root": {
                    overflow: "hidden",
                    justifyContent: "space-between",
                    maxWidth: "90%",
                  },
                  "& .MuiStack-root": {
                    width: "90%",
                  },
                  "& .MuiSelect-select": {
                    pr: "16px!important",
                  },
                }}
              />
            )}
          />
        </Grid2>
        <Grid2 xs={12} md={6}>
          <Controller
            name="dateRange"
            control={controlProject}
            render={({ field }) => (
              <CustomDateRangePicker
                required
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                }}
                label={resourceT("form.dateRange")}
                placeholder=""
                errorMessage={
                  errorsProject.dateRange?.startDate?.message ||
                  errorsProject.dateRange?.endDate?.message
                }
              />
            )}
          />
        </Grid2>
        <Grid2 xs={12} md={6}>
          <Stack
            direction="row"
            sx={{
              ".text-field-input-container, .text-field-select-container": {
                border: `1px solid transparent`,
                transition: "border-color 0.3s ease",
              },
              border: `1px solid ${
                isFocusAllocation ? palette.primary.main : "transparent"
              }`,
              "&:focus-within": {
                borderColor: palette.primary.main,
              },
            }}
          >
            <Controller
              name="allocation"
              control={controlProject}
              render={({ field }) => (
                <TextFieldInput
                  label={resourceT("form.allocation")}
                  placeholder="8h"
                  sx={{
                    "& > .MuiBox-root": {
                      borderRadius: 0,
                      borderRight: "1px solid #BABCC6",
                    },
                  }}
                  type="number"
                  helperText={errorsProject.allocation?.message}
                  error={!!errorsProject.allocation?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="allocation_type"
              control={controlProject}
              render={({ field }) => (
                <TextFieldSelect
                  value={field.value}
                  onChange={(event) => {
                    field.onChange(event.target.value);
                  }}
                  placeholder=""
                  options={timeOptions}
                  onFocus={() => setIsFocusAllocation(true)}
                  onBlur={() => setIsFocusAllocation(false)}
                />
              )}
            />
          </Stack>
        </Grid2>
        <Grid2 xs={12}>
          <Controller
            name="note"
            control={controlProject}
            render={({ field }) => {
              return <Textarea {...field} label={resourceT("form.note")} />;
            }}
          />
        </Grid2>

        <Grid2 xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => setIsShowDetail(!isShowDetail)}
          >
            <TextStatus
              sx={{
                p: "4px 10px",
                background: "#FFECEC",
                color: "#F64E60",
                fontSize: 12,
                fontWeight: 600,
                lineHeight: "18px",
                width: "max-content",
              }}
              text=""
              color={leftToSchedule > 0 ? "success" : "error"}
            >
              {formatNumber(leftToSchedule, { numberOfFixed: 0 }) || 0}h{" "}
              {resourceT("form.leftToSchedule").toLowerCase()}
            </TextStatus>
            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Typography
                sx={{
                  color: "#666666",
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: "18px",
                  width: "max-content",
                }}
              >
                {resourceT("form.detail")}
              </Typography>
              <ArrowDownIcon
                width={16}
                height={16}
                sx={{
                  transform: isShowDetail ? "rotate(-90deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              />
            </Box>
          </Box>
          <Collapse
            in={isShowDetail}
            sx={{
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
                mt: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  lineHeight: "22px",
                  fontWeight: 400,
                  color: "#666666",
                  display: "block",
                }}
              >
                {resourceT("form.estimate")}
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  lineHeight: "18px",
                  fontWeight: 600,
                  color: "#212121",
                  display: "block",
                }}
              >
                {formatNumber(estimate, { numberOfFixed: 0 })}h
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  lineHeight: "22px",
                  fontWeight: 400,
                  color: "#666666",
                  display: "block",
                }}
              >
                {resourceT("form.work")}
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  lineHeight: "18px",
                  fontWeight: 600,
                  color: "#212121",
                  display: "block",
                }}
              >
                {formatNumber(workedTime, { numberOfFixed: 0 })}h
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  lineHeight: "22px",
                  fontWeight: 400,
                  color: "#666666",
                  display: "block",
                }}
              >
                {resourceT("form.schedule")}
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  lineHeight: "18px",
                  fontWeight: 600,
                  color: "#212121",
                  display: "block",
                }}
              >
                {formatNumber(scheduledTime, { numberOfFixed: 0 })}h
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  lineHeight: "22px",
                  fontWeight: 400,
                  color: "#666666",
                }}
              >
                {resourceT("form.leftToSchedule")}
              </Typography>
              <Typography
                sx={{
                  fontSize: 14,
                  lineHeight: "18px",
                  fontWeight: 600,
                  color: leftToSchedule > 0 ? "green" : "#F64E60",
                }}
              >
                {formatNumber(leftToSchedule, { numberOfFixed: 0 })}h
              </Typography>
            </Box>
          </Collapse>
        </Grid2>
        <Grid2
          xs={12}
          sx={{
            position: "sticky",
            bottom: 0,
            pb: 2,
            pt: 1,
            backgroundColor: "background.paper",
          }}
        >
          <Stack direction="row" justifyContent="center" gap={3}>
            <Button
              variant="primaryOutlined"
              size="medium"
              onClick={onClose}
              sx={{
                width: 150,
                height: 40,
              }}
            >
              {commonT("form.cancel")}
            </Button>
            <Button
              sx={{
                width: 160,
                height: 40,
              }}
              variant="contained"
              onClick={handleSubmitProject(onSubmitProject)}
            >
              {loading ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                resourceT("form.editBooking")
              )}
            </Button>
          </Stack>
        </Grid2>
      </Grid2>
    </>
  );
};

export default ProjectTab;
