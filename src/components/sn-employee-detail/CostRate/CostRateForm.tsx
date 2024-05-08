import { memo, useCallback, useEffect, useMemo } from "react";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import MuiInput, { InputProps as MuiInputProps } from "@mui/material/Input";
import MuiInputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import { useTranslations } from "next-intl";

import { NS_COST_RATE, NS_COMMON } from "constant/index";
import { DataStatus } from "constant/enums";
import { Option } from "constant/types";
import Link from "components/Link";
import {
  NewButton as Button,
  NewInput as Input,
  NewSelect as Select,
  NewDatePicker as DatePicker,
  Text,
} from "components/shared";
import { useFormik } from "hooks/useFormik";
import AddCircleGradientIcon from "icons/AddCircleGradientIcon";
import { useSnackbar } from "store/app/selectors";
import { NewCostRate, UpdateCostRate } from "store/employeeDetail/actions";
import { useCostRate } from "store/employeeDetail/selectors";
import { useHolidayCalendar } from "store/holidayCalendar/selectors";
import { getDataFromKeys, getMessageErrorByAPI } from "utils/index";

type CostRateForm = Omit<NewCostRate, "working_hours"> & {
  working_hours: {
    mon: number;
    tue: number;
    wed: number;
    thu: number;
    fri: number;
    sat: number;
    sun: number;
  };
};

const CostRateForm = ({
  costRateId,
  onCancel,
}: {
  costRateId: string;
  onCancel: () => void;
}) => {
  const commonT = useTranslations(NS_COMMON);
  const costRateT = useTranslations(NS_COST_RATE);

  const { onAddSnackbar } = useSnackbar();
  const { selectCostRate, handleAddNewCostRate, handleUpdateCostRate } =
    useCostRate();

  const {
    status: holidayCalendarStatus,
    holidayCalendars,
    handleGetAllHolidayCalendar,
  } = useHolidayCalendar();

  const holidayCalendarOptions: Option[] = holidayCalendars.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const onSubmit = useCallback(
    async (values: CostRateForm) => {
      try {
        const data = {
          ...values,
          working_hours: [
            values.working_hours.mon,
            values.working_hours.tue,
            values.working_hours.wed,
            values.working_hours.thu,
            values.working_hours.fri,
            values.working_hours.sat,
            values.working_hours.sun,
          ],
        };
        if (costRateId.length > 0) {
          await handleUpdateCostRate({
            ...data,
            id: costRateId,
          } as UpdateCostRate);
          onAddSnackbar(
            costRateT("empty.notification.updateSuccess"),
            "success",
          );
        } else {
          await handleAddNewCostRate(data as NewCostRate);
          onAddSnackbar(costRateT("empty.notification.addSuccess"), "success");
        }
        onCancel();
      } catch (error) {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      }
    },
    [
      commonT,
      onCancel,
      costRateId,
      costRateT,
      handleAddNewCostRate,
      handleUpdateCostRate,
      onAddSnackbar,
    ],
  );

  const initialValues = useMemo(() => {
    if (costRateId.length > 0) {
      const costRateToEdit = selectCostRate(costRateId);
      if (!costRateToEdit) {
        onAddSnackbar("Error!", "error");
        return {};
      }
      return {
        ...getDataFromKeys(costRateToEdit, [
          "type",
          "cost_per_month",
          "currency",
          "start_date",
          "end_date",
          "holiday_calendar",
          "note",
          "over_head",
        ]),
        working_hours: {
          mon: costRateToEdit?.working_hours[0] ?? 8,
          tue: costRateToEdit?.working_hours[1] ?? 8,
          wed: costRateToEdit?.working_hours[2] ?? 8,
          thu: costRateToEdit?.working_hours[3] ?? 8,
          fri: costRateToEdit?.working_hours[4] ?? 8,
          sat: costRateToEdit?.working_hours[5] ?? 0,
          sun: costRateToEdit?.working_hours[6] ?? 0,
        },
      };
    } else {
      return {
        type: "",
        cost_per_month: 0,
        currency: "",
        total_hours: 0,
        holiday_calendar: "",
        note: "",
        working_hours: {
          mon: 8,
          tue: 8,
          wed: 8,
          thu: 8,
          fri: 8,
          sat: 0,
          sun: 0,
        },
        over_head: true,
      };
    }
  }, [costRateId, onAddSnackbar, selectCostRate]) as CostRateForm;

  const formik = useFormik({
    initialValues,
    onSubmit,
    enableReinitialize: true,
  });

  useEffect(() => {
    if (holidayCalendarStatus === DataStatus.IDLE) {
      handleGetAllHolidayCalendar();
    }
  }, [holidayCalendarStatus, handleGetAllHolidayCalendar]);

  return (
    <>
      <Grid
        container
        columnSpacing={3}
        rowSpacing={{
          xs: 2,
          sm: 3,
        }}
        pb={3}
        component="form"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <Grid item xs={12} sm={4}>
          <Select
            options={[
              { label: "Monthly", value: "MONTHLY" },
              { label: "Weekly", value: "WEEKLY" },
            ]}
            title={costRateT("empty.form.type")}
            fullWidth
            name="type"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.type}
            error={commonT(formik.touchedError("type"), {
              name: costRateT("empty.form.type"),
            })}
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Input
            title={costRateT("empty.form.costPerMonth")}
            fullWidth
            name="cost_per_month"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.cost_per_month}
            error={commonT(formik.touchedError("cost_per_month"), {
              name: costRateT("empty.form.costPerMonth"),
            })}
            endNode={<Text sx={{ mr: 1 }}>$</Text>}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <Select
            options={[
              { label: "USD ($)", value: "USD" },
              { label: "VNĐ (đ)", value: "VND" },
            ]}
            title={costRateT("empty.form.currency")}
            fullWidth
            name="currency"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.currency}
            error={commonT(formik.touchedError("currency"), {
              name: costRateT("empty.form.currency"),
            })}
          />
        </Grid>

        <Grid item xs={12}>
          <Stack
            direction="row"
            sx={{
              pb: 2,
              overflowX: "scroll",
              overflowY: "visible",
              "&::scrollbar": { height: 4 },
              "&::-webkit-scrollbar": { height: 4 },
            }}
          >
            {daysOfWeekKeys.map((day) => (
              <WorkingHoursBlock
                key={day}
                title={costRateT(`empty.form.${day}`)}
                fullWidth
                name={`working_hours.${day}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.working_hours[day]}
                error={!!formik.touchedError("working_hours.day")}
              />
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} sm={4}>
          <DatePicker
            title={costRateT("empty.form.startDate")}
            fullWidth
            name="start_date"
            onChange={formik.handleChangeDate}
            onBlur={formik.handleBlur}
            value={formik.values?.start_date}
            error={commonT(formik.touchedError("start_date"), {
              name: costRateT("empty.form.startDate"),
            })}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <DatePicker
            title={costRateT("empty.form.endDate")}
            fullWidth
            name="end_date"
            onChange={formik.handleChangeDate}
            onBlur={formik.handleBlur}
            value={formik.values?.end_date}
            error={commonT(formik.touchedError("end_date"), {
              name: costRateT("empty.form.endDate"),
            })}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Select
            options={holidayCalendarOptions}
            lastNode={
              <Link href="/holiday-calendar" sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 2,
                py: 1,
                textDecoration: "none",
              }}>
                <AddCircleGradientIcon/>
                <Text pl={1} fontSize={14}>Add new holiday calendar</Text>
              </Link>
            }
            title={costRateT("empty.form.holidayCalendar")}
            fullWidth
            name="holiday_calendar"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.holiday_calendar}
            error={commonT(formik.touchedError("holiday_calendar"), {
              name: costRateT("empty.form.holidayCalendar"),
            })}
          />
        </Grid>

        <Grid item xs={12}>
          <NoteInput
            title={costRateT("empty.form.note")}
            fullWidth
            name="note"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.note}
            error={
              !!commonT(formik.touchedError("note"), {
                name: costRateT("empty.form.note"),
              })
            }
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControlLabel
            label={costRateT("empty.form.overhead")}
            labelPlacement="start"
            sx={{
              "& .MuiFormControlLabel-label": {
                fontSize: "13px",
                fontWeight: 500,
                color: "#4D4D4D",
              },
            }}
            control={
              <Switch
                size="small"
                name="overhead"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values?.over_head}
                value={formik.values?.over_head}
                sx={(theme) => ({
                  ml: "16px",
                  width: "37px",
                  height: "20px",
                  padding: 0,
                  "& .MuiSwitch-thumb": {
                    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
                    width: "12px",
                    height: "12px",
                    borderRadius: "999px",
                    transition: theme.transitions.create(["width"], {
                      duration: 150,
                    }),
                  },
                  "& .MuiSwitch-switchBase": {
                    "&.Mui-checked": {
                      transform: "translateX(16px)",
                      color: "#fff",
                      "& + .MuiSwitch-track": {
                        opacity: 1,
                        backgroundColor: "#0575E6",
                      },
                    },
                  },
                  "& .MuiSwitch-track": {
                    borderRadius: "999px",
                    opacity: 1,
                    backgroundColor: "grey.300",
                  },
                  "& .MuiTouchRipple-root": {
                    display: "none",
                  },
                  "&:active": {
                    "& .MuiSwitch-thumb": {
                      width: "15px",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      transform: "translateX(13px)",
                    },
                  },
                })}
              />
            }
          />
        </Grid>

        <Grid item xs={12} sm={8}>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            justifyContent={{
              sm: "end",
            }}
            spacing={3}
          >
            <Button variant="primaryOutlined" onClick={() => onCancel()}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={formik.isSubmitDisabled}
            >
              Confirm
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default CostRateForm;

const WorkingHoursBlock = memo(function WorkingHoursBlock({
  title,
  fullWidth,
  name,
  onChange,
  onBlur,
  value,
  error,
}: MuiInputProps) {
  return (
    <FormControl
      sx={{
        display: "flex",
        py: "7px",
        flexDirection: "column",
        flex: "0 0 129px",
        width: "129px",
        height: "146px",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "12px",
        background:
          value === 0
            ? "linear-gradient(45deg, hsla(0, 0%, 91%, 0.41), hsla(180, 19%, 87%, 1))"
            : "#D9F0FD",
        "&:not(:first-of-type)": {
          ml: "14px",
        },
      }}
    >
      <MuiInputLabel sx={{ display: "none" }}>{title}</MuiInputLabel>
      <Text
        sx={{
          fontSize: "20px",
          fontWeight: 600,
          color: "#4D4D4D",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      <MuiInput
        fullWidth={fullWidth}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        error={error}
        sx={{
          backgroundColor: "transparent",
          fontSize: "39px",
          fontWeight: 600,
          color: value === 0 ? "#4D4D4D" : "#0575E6",
          width: "1ch",
          textAlign: "center",
          border: "none",
          "&::before, &::after": {
            display: "none",
          },
        }}
      />
      <Text
        sx={{
          fontSize: "20px",
          fontWeight: 600,
          color: "#4D4D4D",
          textAlign: "center",
        }}
      >
        Hour (s)
      </Text>
    </FormControl>
  );
});

const NoteInput = memo(function NoteInput({
  title,
  fullWidth,
  name,
  onChange,
  onBlur,
  value,
  error,
}: MuiInputProps) {
  return (
    <>
      <FormControl
        sx={{
          width: "100%",
          borderRadius: 3,
          border: "1px solid transparent",
          background: `linear-gradient(#fff, #fff) padding-box,
                       linear-gradient(90deg, #2AF598 0%, #009EFD 100%)`,
        }}
      >
        <MuiInputLabel
          htmlFor={`cost-rate-${name}`}
          sx={{
            px: 4,
            pt: 2,
            pb: 1,
            position: "static",
            maxWidth: "initial",
            color: "#333333",
            fontSize: 20,
            fontWeight: 600,
            transform: "initial",
            transition: "initial",
            "&.Mui-focused": {
              color: "#333333",
            },
            "&+.MuiInputBase-root": {
              mt: 0,
            },
          }}
        >
          {title}
        </MuiInputLabel>
        <MuiInput
          id={`cost-rate-${name}`}
          fullWidth={fullWidth}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          error={error}
          sx={{
            px: 4,
            pb: 2,
            mt: 0,
            "&:before": {
              display: "none",
            },
            "&:after": {
              display: "none",
            },
          }}
        />
      </FormControl>
    </>
  );
});

const daysOfWeekKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
