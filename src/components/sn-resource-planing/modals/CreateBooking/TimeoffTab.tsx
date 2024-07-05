import { yupResolver } from "@hookform/resolvers/yup";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import CustomDateRangePicker from "components/sn-resource-planing/components/CustomDateRangePicker";
import TextFieldInput from "components/shared/TextFieldInput";
import { useEffect, useState } from "react";
import useTheme from "hooks/useTheme";
import { CircularProgress, Stack } from "@mui/material";
import { NS_COMMON, NS_RESOURCE_PLANNING } from "constant/index";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import Textarea from "components/sn-time-tracking/Component/Textarea";
import { Button } from "components/shared";
import { useGetTimeOffOptions } from "components/sn-sales/hooks/useGetTimeOffOptions";
import { useBookingAll } from "store/resourcePlanning/selector";
import {
  RESOURCE_ALLOCATION_TYPE,
  RESOURCE_ALLOCATION_UNIT,
  RESOURCE_EVENT_TYPE,
} from "constant/enums";
import dayjs from "dayjs";
import useGetOptions from "components/sn-resource-planing/hooks/useGetOptions";
import TextFieldSelect from "components/shared/TextFieldSelect";
import { useGetSchemas } from "../Schemas";
interface IProps {
  open: boolean;
  resourceId: string;
  selectedDateRange?: Date[];
  onClose(): void;
}

const TimeOffTab = ({
  open,
  onClose,
  resourceId,
  selectedDateRange,
}: IProps) => {
  const [isFocusAllocation, setIsFocusAllocation] = useState(false);
  const { palette } = useTheme();
  const commonT = useTranslations(NS_COMMON);
  const resourceT = useTranslations(NS_RESOURCE_PLANNING);
  const { createBooking, loading } = useBookingAll();
  const { timeOffOptions } = useGetTimeOffOptions();
  const { positionOptions, projectOptions } = useGetOptions();
  const { schemaTimeOff } = useGetSchemas();

  const {
    control: controlTimeOff,
    handleSubmit: handleSubmitTimeOff,
    // setValue: setValueTimeOff,
    // clearErrors: clearErrorsTimeOff,
    watch: watchTimeOff,
    reset: resetTimeOff,
    formState: { errors: errorsTimeOff },
  } = useForm({
    resolver: yupResolver(schemaTimeOff),
    defaultValues: {
      categoryTimeOff: "",
      dateRange: {
        startDate: selectedDateRange?.[0] || undefined,
        endDate: selectedDateRange?.[1] || undefined,
      },
      allocation: 1,
      allocation_type: RESOURCE_ALLOCATION_TYPE.HOUR,
      note: "",
    },
    mode: "all",
  });

  useEffect(() => {
    if (!open) {
      resetTimeOff();
    }
  }, [open]);

  const onSubmitTimeOff = (data) => {
    createBooking({
      ...data,
      user_id: resourceId,
      booking_type: RESOURCE_EVENT_TYPE.TIME_OF_BOOKING,
      start_date: dayjs(data.dateRange.startDate).format("YYYY-MM-DD"),
      end_date: dayjs(data.dateRange.endDate).format("YYYY-MM-DD"),
      time_off_type: data.categoryTimeOff,
      position: positionOptions[0].value,
      allocation_type: data.allocation_type,
      project_id: projectOptions[0].value,
    });
    onClose();
  };

  return (
    <Grid2 container spacing={2} sx={{ mt: 1 }}>
      <Grid2 xs={12}>
        <Controller
          name="categoryTimeOff"
          control={controlTimeOff}
          render={({ field }) => (
            <TextFieldSelect
              {...field}
              helperText={errorsTimeOff.categoryTimeOff?.message}
              error={!!errorsTimeOff.categoryTimeOff?.message}
              required
              options={timeOffOptions}
              label={resourceT("form.selectTimeOffCategory")}
            />
          )}
        />
      </Grid2>
      <Grid2 container xs={12}>
        <Grid2 xs={12} md={6}>
          <Controller
            name="dateRange"
            control={controlTimeOff}
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
                  errorsTimeOff.dateRange?.startDate?.message ||
                  errorsTimeOff.dateRange?.endDate?.message
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
              control={controlTimeOff}
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
                  helperText={errorsTimeOff.allocation?.message}
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
        </Grid2>
      </Grid2>
      <Grid2 xs={12}>
        <Controller
          name="note"
          control={controlTimeOff}
          render={({ field }) => {
            return (
              <Textarea {...field} label={resourceT("form.note")} required />
            );
          }}
        />
      </Grid2>
      <Grid2 xs={12}>
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
              commonT("form.save")
            )}
          </Button>
        </Stack>
      </Grid2>
    </Grid2>
  );
};

export default TimeOffTab;
