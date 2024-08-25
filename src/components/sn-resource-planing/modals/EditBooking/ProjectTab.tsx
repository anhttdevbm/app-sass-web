import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  CircularProgress,
  Collapse,
  FormHelperText,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import SelectController from "components/SelectController";
import { Button } from "components/shared";
import TextFieldInput from "components/shared/TextFieldInput";
import TextFieldSelect, {
  IOptionStructure,
} from "components/shared/TextFieldSelect";
import CustomDateRangePicker from "components/sn-resource-planing/components/CustomDateRangePicker";
import { useCalculateDetail } from "components/sn-resource-planing/hooks/useCalculateDetail";
import useGetOptions from "components/sn-resource-planing/hooks/useGetOptions";
import Textarea from "components/sn-time-tracking/Component/Textarea";
import TextStatus from "components/TextStatus";
import { RESOURCE_ALLOCATION_TYPE, RESOURCE_EVENT_TYPE } from "constant/enums";
import { NS_COMMON, NS_RESOURCE_PLANNING } from "constant/index";
import dayjs from "dayjs";
import ArrowDownIcon from "icons/ArrowDownIcon";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Control, Controller, useForm } from "react-hook-form";
import { BookingData } from "store/resourcePlanning/action";
import { IBookingItem } from "store/resourcePlanning/reducer";
import {
  useBookingAll,
  useGetServiceBudget,
} from "store/resourcePlanning/selector";
import { formatNumber } from "utils/index";
import { useGetSchemas } from "../Schemas";

interface IProps {
  open: boolean;
  onClose(): void;
  bookingId: string;
}

const ProjectTab = ({ open, onClose, bookingId }: IProps) => {
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [isFocusAllocation, setIsFocusAllocation] = useState(false);

  const { palette } = useTheme();
  const { timeOptions } = useGetOptions();
  const { bookingAll, updateBooking, loading } = useBookingAll();
  const { schemaProject } = useGetSchemas();
  const { serviceBudgetOptions } = useGetServiceBudget();

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
      service_id: bookingEvent?.service_id || "",
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
      watchProject("service_id"),
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
      resetProject();
    });
  };

  return (
    <>
      <Grid2 container spacing={2} sx={{ pt: 1, mb: 0 }}>
        <Grid2 xs={12}>
          <SelectController
            name="service_id"
            control={controlProject as unknown as Control}
            listOptions={serviceBudgetOptions as IOptionStructure[]}
            disabled={!watchProject("project_id")}
            label={resourceT("form.services")}
            required
            sx={{
              borderRadius: "100px",
              background:
                "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "#EFEFEF",
              },
            }}
            MenuProps={{
              sx: {
                maxHeight: "400px",
              },
            }}
          />
        </Grid2>
        <Grid2 xs={12} md={6}>
          <Controller
            name="dateRange"
            control={controlProject}
            render={({ field }) => (
              <div>
                <Typography
                  color={"#4D4D4D"}
                  fontSize={13}
                  pb={2}
                  fontWeight={700}
                >
                  {resourceT("form.dateRange")}
                  <span style={{ color: "#FF2C56", paddingLeft: 4 }}>*</span>
                </Typography>
                <CustomDateRangePicker
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  // label={resourceT("form.dateRange")}
                  placeholder=""
                  errorMessage={
                    errorsProject.dateRange?.startDate?.message ||
                    errorsProject.dateRange?.endDate?.message
                  }
                  sx={{
                    width: "100%",
                    background:
                      "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
                    borderRadius: "100px",
                    ".MuiBox-root": {
                      borderColor: "#EFEFEF",
                      borderRadius: "100px",
                      height: 36,
                      display: "block",
                      padding: "4px 12px",
                    },
                    ".MuiSvgIcon-root": {
                      color: "#B3B3B3",
                    },
                  }}
                />
              </div>
            )}
          />
        </Grid2>
        <Grid2 xs={12} md={6}>
          <Typography color={"#4D4D4D"} fontSize={13} pb={2} fontWeight={700}>
            {resourceT("form.allocation")}
            <span style={{ color: "#FF2C56", paddingLeft: 4 }}>*</span>
          </Typography>
          <Stack
            direction="row"
            sx={{
              ".text-field-input-container, .text-field-select-container": {
                border: `1px solid transparent`,
                transition: "border-color 0.3s ease",
              },
              border: `1px solid ${
                isFocusAllocation ? palette.primary.main : "#EFEFEF"
              }`,
              "&:focus-within": {
                borderColor: palette.primary.main,
              },
              background:
                "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
              borderRadius: "100px",
              justifyContent: "space-between",
            }}
          >
            <Controller
              name="allocation"
              control={controlProject}
              render={({ field }) => (
                <TextFieldInput
                  placeholder="8h"
                  sx={{
                    "& > .MuiBox-root": {
                      background: "transparent",
                      height: 36,
                    },
                    flex: "1 1 0%",
                    ".MuiInputBase-input": {
                      height: 36,
                    },
                  }}
                  type="number"
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
                  sx={{
                    "& > .MuiBox-root": {
                      background: "transparent",
                      borderColor: "transparent",
                      height: 36,
                    },
                    "& .MuiInputBase-root": {
                      background: "transparent",
                      color: "#00000080",
                    },
                  }}
                  options={timeOptions}
                  onFocus={() => setIsFocusAllocation(true)}
                  onBlur={() => setIsFocusAllocation(false)}
                />
              )}
            />
          </Stack>
          {errorsProject.allocation?.message && (
            <FormHelperText
              sx={{ color: "rgba(246, 78, 96, 1)", marginLeft: "18px" }}
            >
              {errorsProject.allocation?.message}
            </FormHelperText>
          )}
        </Grid2>
        <Grid2 xs={12}>
          <Typography color={"#4D4D4D"} fontSize={13} pb={2} fontWeight={700}>
            {resourceT("form.note")}
          </Typography>
          <Controller
            name="note"
            control={controlProject}
            render={({ field }) => {
              return (
                <Textarea
                  {...field}
                  sx={{
                    ".MuiFormControl-root, .MuiFormLabel-root": {
                      background:
                        "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
                    },
                    ".MuiInputBase-input, .MuiInputBase-root": {
                      background: "transparent",
                    },
                  }}
                />
              );
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
                borderRadius: 100,
                color: "#0575E6",
                border: "3px solid",
                "border-image-source":
                  "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
              }}
            >
              {commonT("form.cancel")}
            </Button>
            <Button
              sx={{
                width: 160,
                height: 40,
                color: "white",
                borderRadius: 100,
                "&.MuiButton-root": {
                  background:
                    "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                },
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
