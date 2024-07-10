import { useCallback, useMemo } from "react";
import {
  FormikConfig,
  FormikValues,
  FormikProps,
  getIn,
  useFormik as useFormikLib,
} from "formik";

export function useAdditionalFormikUtils<
  Values extends FormikValues = FormikValues,
>(formikProps: FormikProps<Values>) {
  const { errors, touched, isSubmitting, setFieldValue, setFieldTouched } =
    formikProps;

  const touchedError = useCallback(
    (key: string): string | undefined =>
      getIn(touched, key) ? getIn(errors, key) : undefined,
    [errors, touched],
  );

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
    () => Object.values(errors).length > 0 || isSubmitting,
    [errors, isSubmitting],
  );

  const handleChangeDate = useCallback(
    (name: string, newDate?: Date) => {
      setFieldValue(name, newDate ? newDate : null);
      setFieldTouched(name, true);
    },
    [setFieldValue, setFieldTouched],
  );

  return {
    touchedError,
    touchedErrors,
    isSubmitDisabled,
    handleChangeDate,
  };
}

export function useFormik<Values extends FormikValues = FormikValues>(
  props: FormikConfig<Values>,
) {
  const formik = useFormikLib(props);
  const additionalFormikUtils = useAdditionalFormikUtils(formik);

  return {
    ...formik,
    ...additionalFormikUtils,
  };
}
