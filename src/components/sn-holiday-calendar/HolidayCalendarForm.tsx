"use client";
import { useCallback, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {
  FieldArray,
  FormikErrors,
  FormikProps,
  getIn,
} from "formik";
import { useTranslations } from "next-intl";

import { NS_COST_RATE, NS_COMMON } from "constant/index";
import {
  NewInput as Input,
  NewSelect as Select,
  NewDatePicker as DatePicker,
} from "components/shared";
import useToggle from "hooks/useToggle";
import { HolidayCalendar } from "store/holidayCalendar/reducer";

//type FormHolidayItem = Partial<Pick<HolidayItem, "year" | "items">>
// type FormHolidayItem = {
//   year: string;
//   items: {
//     name: string;
//     date: string;
//   }
// }
export type FormHolidayCalendar = Pick<HolidayCalendar, "id" | "name" | "country" | "province" | "company" | "list">
// & {
//   list: FormHolidayItem[];
// }

export type HolidayCalendarFormProps = FormikProps<FormHolidayCalendar> & {
  isEdit?: boolean;
}

const HolidayCalendarForm = ({
  isEdit = false,
  values,
  errors,
  touched,
  isSubmitting,
  setFieldValue,
  setFieldTouched,
  handleSubmit,
  handleChange,
  handleBlur,
  resetForm,
}: HolidayCalendarFormProps) => {
  const commonT = useTranslations(NS_COMMON);
  const costRateT = useTranslations(NS_COST_RATE);

  const [shouldReset, setShouldResetOn, setShouldResetOff ] = useToggle(false);

  const touchedError = useCallback((key: string) => {
    const error = getIn(errors, key);
    const touch = getIn(touched, key);

    return error && touch ? error : undefined;
  }, [errors, touched]);

  const touchedErrors = useMemo(() => {
    return Object.entries(errors).reduce(
      (
        out: FormikErrors<FormHolidayCalendar>,
        [key, error],
      ) => {
        if (touched[key]) {
          out[key] = error;
        }
        return out;
      },
      {},
    );
  }, [touched, errors]);

  useEffect(() => {
    if (isEdit) {
      setShouldResetOn();
    } else if (!isEdit && shouldReset) {
      resetForm();
      setShouldResetOff();
    }
  }, [isEdit, shouldReset, setShouldResetOn, setShouldResetOff, resetForm])

  const currentListIdx = useMemo(() => values.list.findIndex(l => l.id === values["year"]), [values]);

  const isSubmitDisabled = useMemo(
    () => !!Object.values(touchedErrors)?.length || isSubmitting,
    [touchedErrors, isSubmitting],
  );

  const handleChangeDate = (name: string, newDate?: Date) => {
    setFieldValue(name, newDate ? newDate : null);
    setFieldTouched(name, true);
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
    >
      <Grid
        container
        my={2}
        columnSpacing={3}
        rowSpacing={{
          xs: 2,
          sm: 3,
        }}
      >

        <Grid item xs={12} sm={4}>
          <Select
            options={[
              { label: "Viet Nam", value: "vietnam" },
              { label: "Japan", value: "japan" },
            ]}
            title="Country"
            fullWidth
            name="country"
            disabled={!isEdit}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.country}
            error={commonT(touchedError("country"), {
              name: costRateT("empty.form.country"),
            })}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Select
            options={values.list.map(l => ({ label: l.year.toString(), value: l.id }))}
            title="Year"
            fullWidth
            name="year"
            disabled={!isEdit}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values["year"]}
            error={commonT(touchedError("year"), {
              name: costRateT("empty.form.year"),
            })}
          />
        </Grid>

      </Grid>

            <Grid
              container
              columnSpacing={3}
              rowSpacing={{
                xs: 2,
                sm: 3,
              }}
            >
              {currentListIdx > -1
                ? values.list[currentListIdx].items.map((_, idx) => (
                  <Grid key={idx} container item xs={12}>

                    <Grid item xs={12} sm={4}>
                      <Input
                        fullWidth
                        name={`list[${currentListIdx}].items[${idx}].name`}
                        disabled={!isEdit}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.list[currentListIdx].items[idx].name}
                        error={commonT(touchedError(`list[${currentListIdx}].items[${idx}].name`), {
                          name: costRateT("empty.form.note"),
                        })}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <DatePicker
                        fullWidth
                        name={`list[${currentListIdx}].items[${idx}].date`}
                        disabled={!isEdit}
                        onChange={handleChangeDate}
                        onBlur={handleBlur}
                        value={values.list[currentListIdx].items[idx].date}
                        error={commonT(touchedError(`list[${currentListIdx}].items[${idx}].date`), {
                          name: costRateT("empty.form.endDate"),
                        })}
                      />
                    </Grid>

                  </Grid>
                ))
                : <></>
              }

            </Grid>
    </Box>
  );
};

export default HolidayCalendarForm;
