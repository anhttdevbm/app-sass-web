import { useCallback, useMemo } from "react";
import {
  FormikConfig,
  FormikValues,
  getIn,
  useFormik as useFormikLib,
} from "formik";

export function useFormik<Values extends FormikValues = FormikValues>(
  props: FormikConfig<Values>,
) {
  const formik = useFormikLib(props);
  const {
    errors,
    touched,
    values,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
  } = formik;

  const touchedError = useCallback(
    (key: string) => {
      const error = getIn(errors, key);
      const touch = getIn(touched, key);
      return error && touch ? error : undefined;
    },
    [errors, touched],
  );

  const isSubmitDisabled = useMemo(
    () =>
      !!Object.keys(values)
        .map((key) => touchedError(key))
        .filter((v) => !!v).length || isSubmitting,
    [values, touchedError, isSubmitting],
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
    touchedError,
    isSubmitDisabled,
    handleChangeDate,
  };
}
