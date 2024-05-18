import { useCallback, useMemo } from "react";
import { FormikConfig, FormikValues, useFormik as useFormikLib } from "formik";

export function useFormik<Values extends FormikValues = FormikValues>(
  props: FormikConfig<Values>,
) {
  const formik = useFormikLib(props);
  const { errors, touched, isSubmitting, setFieldValue, setFieldTouched } =
    formik;

  const touchedErrors = useMemo(() => {
    const out = { ...errors };
    Object.keys(out).forEach((k) => {
      if (!touched[k]) {
        delete out[k];
      }
    });
    return out;
  }, [touched, errors]);

  const isSubmitDisabled = useMemo(
    () =>
      !!Object.values(touchedErrors).filter((v) => !!v).length || isSubmitting,
    [touchedErrors, isSubmitting],
  );

  const handleChangeDate = useCallback(
    (name: string, newDate?: Date) => {
      setFieldValue(name, newDate ? newDate : null);
      setFieldTouched(name, true);
    },
    [setFieldValue, setFieldTouched],
  );

  return {
    ...formik,
    touchedErrors,
    isSubmitDisabled,
    handleChangeDate,
  };
}
