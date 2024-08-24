import { yupResolver } from "@hookform/resolvers/yup";
import {
  CircularProgress,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import SelectController from "components/SelectController";
import { Button } from "components/shared";
import TextFieldInput from "components/shared/TextFieldInput";
import TextFieldSelect from "components/shared/TextFieldSelect";
import CustomDateRangePicker from "components/sn-resource-planing/components/CustomDateRangePicker";
import useGetOptions from "components/sn-resource-planing/hooks/useGetOptions";
import { useGetTimeOffOptions } from "components/sn-sales/hooks/useGetTimeOffOptions";
import Textarea from "components/sn-time-tracking/components/Textarea";
import {
  RESOURCE_ALLOCATION_TYPE,
  RESOURCE_ALLOCATION_UNIT,
  RESOURCE_EVENT_TYPE,
} from "constant/enums";
import { NS_COMMON, NS_RESOURCE_PLANNING } from "constant/index";
import dayjs from "dayjs";
import useTheme from "hooks/useTheme";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Control, Controller, useForm } from "react-hook-form";
import { IBookingItem } from "store/resourcePlanning/reducer";
import { useBookingAll } from "store/resourcePlanning/selector";
import { useGetSchemas } from "../Schemas";
interface IProps {
  open: boolean;
  onClose(): void;
  bookingId: string;
}

const TimeOffTab = ({ open, onClose, bookingId }: IProps) => {
  const [isFocusAllocation, setIsFocusAllocation] = useState(false);
  const { palette } = useTheme();
  const commonT = useTranslations(NS_COMMON);
  const resourceT = useTranslations(NS_RESOURCE_PLANNING);
  const { loading, updateBooking } = useBookingAll();
  const { timeOffOptions } = useGetTimeOffOptions();
  const { positionOptions, projectOptions } = useGetOptions();
  const { bookingAll } = useBookingAll();
  const { schemaTimeOff } = useGetSchemas();

  const bookingEvent: IBookingItem = useMemo(() => {
    const booking =
      bookingAll
        .find((item) => item.bookings.find((i) => i.id === bookingId))
        ?.bookings.find((i) => i.id === bookingId) || ({} as IBookingItem);
    if (booking.booking_type !== RESOURCE_EVENT_TYPE.TIME_OF_BOOKING) {
      return {} as IBookingItem;
    }
    return booking;
  }, [JSON.stringify(bookingAll)]);

  const {
    control: controlTimeOff,
    handleSubmit: handleSubmitTimeOff,
    reset: resetTimeOff,
    formState: { errors: errorsTimeOff },
  } = useForm({
    resolver: yupResolver(schemaTimeOff),
    defaultValues: {
      categoryTimeOff: bookingEvent?.time_off_type || "",
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

  useEffect(() => {
    if (!open) {
      resetTimeOff();
    }
  }, [open]);

  const onSubmitTimeOff = async (data) => {
    await updateBooking(
      {
        ...data,
        user_id: bookingEvent?.user_id,
        booking_type: RESOURCE_EVENT_TYPE.TIME_OF_BOOKING,
        start_date: dayjs(data.dateRange.startDate).format("YYYY-MM-DD"),
        end_date: dayjs(data.dateRange.endDate).format("YYYY-MM-DD"),
        time_off_type: data.categoryTimeOff,
        position: positionOptions[0].value,
        allocation_type: data.allocation_type,
        project_id: projectOptions[0].value,
      },
      bookingEvent.id,
    ).then(() => {
      onClose();
    });
  };

  return (
    <Grid2 container spacing={2} sx={{ pt: 1, mb: 0 }}>
      <Grid2 xs={12}>
        <SelectController
          name="categoryTimeOff"
          control={controlTimeOff as unknown as Control}
          listOptions={timeOffOptions}
          label={resourceT("form.selectTimeOffCategory")}
          required
          sx={{
            borderRadius: "100px",
            background:
              "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "#EFEFEF",
            },
          }}
        />
      </Grid2>
      <Grid2 container xs={12}>
        <Grid2 xs={12} md={12}>
          <Controller
            name="dateRange"
            control={controlTimeOff}
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
                    errorsTimeOff.dateRange?.startDate?.message ||
                    errorsTimeOff.dateRange?.endDate?.message
                  }
                  sx={{
                    width: "100%",
                    background:
                      "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
                    borderRadius: "100px",
                    ".MuiBox-root": {
                      borderColor: "#EFEFEF",
                      borderRadius: "100px",
                      height: 56,
                      display: "block",
                      padding: "16px 12px",
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
        <Grid2 xs={12} md={12}>
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
              control={controlTimeOff}
              render={({ field }) => (
                <TextFieldInput
                  placeholder="8h"
                  sx={{
                    "& > .MuiBox-root": {
                      background: "transparent",
                    },
                    flex: "1 1 0%",
                    ".MuiInputBase-input": {
                      height: 32,
                    },
                  }}
                  type="number"
                  error={!!errorsTimeOff.allocation?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="allocation_type"
              control={controlTimeOff}
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
                    },
                    "& .MuiInputBase-root": {
                      background: "transparent",
                      color: "#00000080",
                    },
                  }}
                  options={[
                    {
                      label: RESOURCE_ALLOCATION_UNIT.HOUR,
                      value: RESOURCE_ALLOCATION_TYPE.HOUR,
                    },
                    {
                      label: RESOURCE_ALLOCATION_UNIT.HOUR_PER_DAY,
                      value: RESOURCE_ALLOCATION_TYPE.HOUR_PER_DAY,
                    },
                    {
                      label: RESOURCE_ALLOCATION_UNIT.PERCENTAGE,
                      value: RESOURCE_ALLOCATION_TYPE.PERCENTAGE,
                    },
                  ]}
                  onFocus={() => setIsFocusAllocation(true)}
                  onBlur={() => setIsFocusAllocation(false)}
                />
              )}
            />
          </Stack>
          {errorsTimeOff.allocation?.message && (
            <FormHelperText
              sx={{ color: "rgba(246, 78, 96, 1)", marginLeft: "18px" }}
            >
              {errorsTimeOff.allocation?.message}
            </FormHelperText>
          )}
        </Grid2>
      </Grid2>
      <Grid2 xs={12}>
        <Typography color={"#4D4D4D"} fontSize={13} pb={2} fontWeight={700}>
          {resourceT("form.note")}
        </Typography>
        <Controller
          name="note"
          control={controlTimeOff}
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
            onClick={handleSubmitTimeOff(onSubmitTimeOff)}
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
  );
};

export default TimeOffTab;
