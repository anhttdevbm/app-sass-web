import { memo, useMemo } from "react";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import MuiInput, { InputProps as MuiInputProps } from "@mui/material/Input";
import MuiInputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import { FormikProps, FormikErrors } from "formik";
import { useTranslations } from "next-intl";

import {
  NS_COST_RATE,
  NS_COMMON,
} from "constant/index";
import {
  NewButton as Button,
  NewInput as Input,
  NewSelect as Select,
  NewDatePicker as DatePicker,
  Text,
  } from "components/shared";
import { NewCostRate } from "store/employeeDetail/actions";

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
        background: value === 0 ? "linear-gradient(45deg, hsla(0, 0%, 91%, 0.41), hsla(180, 19%, 87%, 1))" : "#D9F0FD",
        "&:not(:first-child)": {
          ml: "14px",
        },
      }}
    >
      <MuiInputLabel sx={{display: "none"}}>{title}</MuiInputLabel>
      <Text
        sx={{
          fontSize: "20px",
          fontWeight: 600,
          color: "#4D4D4D",
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
          color: "#0575E6",
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

export type NewCostRateForm = Omit<NewCostRate, "total_hours" | "working_hours"> & {
  working_hours: {
    mon: number;
    tue: number;
    wed: number;
    thu: number;
    fri: number;
    sat: number;
    sun: number;
  };
  overhead: boolean;
};

export type EditCostRateForm = NewCostRateForm & { id: string; }

type CostRateFormType = {
  formik: FormikProps<NewCostRateForm> | FormikProps<EditCostRateForm>;
  onCancel: () => void;
}

const CostRateForm = ( { formik, onCancel }: CostRateFormType) => {
  const commonT = useTranslations(NS_COMMON);
  const costRateT = useTranslations(NS_COST_RATE);

  const touchedErrors = useMemo(() => {
    return Object.entries(formik.errors).reduce(
      (
        out: FormikErrors<NewCostRateForm>,
        [key, error],
      ) => {
        if (formik.touched[key]) {
          out[key] = error;
        }
        return out;
      },
      {},
    );
  }, [formik.touched, formik.errors]);

  const isSubmitDisabled = useMemo(
    () => !!Object.values(touchedErrors)?.length || formik.isSubmitting,
    [touchedErrors, formik.isSubmitting],
  );

  const handleChangeDate = (name: string, newDate?: Date) => {
    formik.setFieldValue(name, newDate ? newDate : null);
    formik.setFieldTouched(name, true);
  }

  return (
    <>
      <Grid
        container
        columnSpacing={3}
        rowSpacing={{
          xs: 2,
          sm: 3,
        }}
        component="form"
        noValidate
        onSubmit={formik.handleSubmit}
      >

        <Grid item xs={12} sm={4}>
          <Select
            options={[
              { label: "Monthly", value: "monthly" },
              { label: "Weekly", value: "weekly" },
            ]}
            title={costRateT("empty.form.type")}
            fullWidth
            name="type"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.type}
            error={commonT(touchedErrors?.type, {
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
            error={commonT(touchedErrors?.cost_per_month, {
              name: costRateT("empty.form.costPerMonth"),
            })}
            endNode={<Text sx={{mr: 1}}>$</Text>}
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <Select
            options={[
              { label: "USD ($)", value: "usd" },
              { label: "VNĐ (đ)", value: "vnd" },
            ]}
            title={costRateT("empty.form.currency")}
            fullWidth
            name="currency"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.currency}
            error={commonT(touchedErrors?.currency, {
              name: costRateT("empty.form.currency"),
            })}
          />
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" sx={{overflowX: "scroll", overflowY: "visible"}}>
            <WorkingHoursBlock
              title={costRateT("empty.form.mon")}
              fullWidth
              name="working_hours.mon"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.working_hours?.mon}
              error={!!(touchedErrors?.working_hours?.mon)}
            />
            <WorkingHoursBlock
              title={costRateT("empty.form.tue")}
              fullWidth
              name="working_hours.tue"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.working_hours?.tue}
              error={!!(touchedErrors?.working_hours?.tue)}
            />
            <WorkingHoursBlock
              title={costRateT("empty.form.wed")}
              fullWidth
              name="working_hours.wed"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.working_hours?.wed}
              error={!!(touchedErrors?.working_hours?.wed)}
            />
            <WorkingHoursBlock
              title={costRateT("empty.form.thu")}
              fullWidth
              name="working_hours.thu"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.working_hours?.thu}
              error={!!(touchedErrors?.working_hours?.thu)}
            />
            <WorkingHoursBlock
              title={costRateT("empty.form.fri")}
              fullWidth
              name="working_hours.fri"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.working_hours?.fri}
              error={!!(touchedErrors?.working_hours?.fri)}
            />
            <WorkingHoursBlock
              title={costRateT("empty.form.sat")}
              fullWidth
              name="working_hours.sat"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.working_hours?.sat}
              error={!!(touchedErrors?.working_hours?.sat)}
            />
            <WorkingHoursBlock
              title={costRateT("empty.form.sun")}
              fullWidth
              name="working_hours.sun"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.working_hours?.sun}
              error={!!(touchedErrors?.working_hours?.sun)}
            />
          </Stack>
        </Grid>

        <Grid item xs={12} sm={4}>
          <DatePicker
            title={costRateT("empty.form.startDate")}
            fullWidth
            name="start_date"
            onChange={handleChangeDate}
            onBlur={formik.handleBlur}
            value={formik.values?.start_date}
            error={commonT(touchedErrors?.start_date, {
              name: costRateT("empty.form.startDate"),
            })}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <DatePicker
            title={costRateT("empty.form.endDate")}
            fullWidth
            name="end_date"
            onChange={handleChangeDate}
            onBlur={formik.handleBlur}
            value={formik.values?.end_date}
            error={commonT(touchedErrors?.end_date, {
              name: costRateT("empty.form.endDate"),
            })}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Select
            options={[
              { label: "Vietnam", value: "1" },
              { label: "Thailand", value: "2" },
              { label: "Japan", value: "3" },
            ]}
            title={costRateT("empty.form.holidayCalendar")}
            fullWidth
            name="holiday_calendar"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.holiday_calendar}
            error={commonT(touchedErrors?.holiday_calendar, {
              name: costRateT("empty.form.holidayCalendar"),
            })}
          />
        </Grid>

        <Grid item xs={12}>
          <Input
            title={costRateT("empty.form.note")}
            fullWidth
            name="note"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.note}
            error={commonT(touchedErrors?.note, {
              name: costRateT("empty.form.note"),
            })}
            sx={{mb: 6}}
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
                checked={formik.values?.overhead}
                value={formik.values?.overhead}
                sx={(theme) => ({
                  ml: "16px",
                  width: "37px",
                  height: "20px",
                  padding: 0,
                  '& .MuiSwitch-thumb': {
                    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
                    width: "12px",
                    height: "12px",
                    borderRadius: "999px",
                    transition: theme.transitions.create(['width'], {
                      duration: 150,
                    }),
                  },
                  "& .MuiSwitch-switchBase": {
                    "&.Mui-checked": {
                      transform: "translateX(16px)",
                      color: '#fff',
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
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      transform: 'translateX(13px)',
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
            <Button variant="primaryOutlined" onClick={() => onCancel()}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={isSubmitDisabled}>Confirm</Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}

export default CostRateForm;
