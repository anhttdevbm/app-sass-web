import { useMemo } from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { FormikErrors, useFormik } from "formik";
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
  } from "components/shared";
import { useSnackbar } from "store/app/selectors";
import { NewCostRate } from "store/costRate/actions";
import { useCostRate } from "store/costRate/selectors";
import { getMessageErrorByAPI } from "utils/index";

const INITIAL_VALUES = {
  type: "",
  cost_per_month: 0,
  currency: "",
  working_hours: [0, 0, 0, 0, 0, 0, 0],
  total_hours: 0,
  holiday_calendar: "",
  note: "",
}

const CostRateForm = ({ onCancel, onConfirm }) => {
  const commonT = useTranslations(NS_COMMON);
  const costRateT = useTranslations(NS_COST_RATE);
  const { onAddSnackbar } = useSnackbar();
  const { handleAddNewCostRate } = useCostRate();

  const onSubmit = async (values: NewCostRate) => {
    try {
      await handleAddNewCostRate(values);
      onAddSnackbar(
        costRateT("empty.notification.addSuccess"),
        "success",
      );
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  const initialValues = useMemo(
    () => ({
      ...INITIAL_VALUES
    }),
    [],
  ) as NewCostRate;

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit,
  });

  const touchedErrors = useMemo(() => {
    return Object.entries(formik.errors).reduce(
      (
        out: FormikErrors<NewCostRate>,
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
          />
        </Grid>

        <Grid item xs={12} sm={2}>
        </Grid>
        <Grid item xs={12} sm={10}>
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
            <Button variant="primary" type="submit">Confirm</Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}

export default CostRateForm;
