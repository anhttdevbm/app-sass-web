"use client";

import { memo, useMemo } from "react";
import { Stack } from "@mui/material";
import AppLogo from "components/AppLogo";
import { Button, Input, Text } from "components/shared";
import { useAuth, useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import { useRouter } from "next-intl/client";
import * as Yup from "yup";
import { useFormik, FormikErrors } from "formik";
import { SIGNIN_PATH } from "constant/paths";
import { useParams } from "next/navigation";
import { NS_AUTH, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import SwitchLanguage from "components/SwitchLanguage";
import SwitchTheme from "components/SwitchTheme";
import { formErrorCode } from "api/formErrorCode";
import { ErrorResponse } from "constant/types";

const Reset = () => {
  const { onResetPassword, onSignOut } = useAuth();
  const { onAddSnackbar } = useSnackbar();
  const { push } = useRouter();
  const authT = useTranslations(NS_AUTH);
  const commonT = useTranslations(NS_COMMON);

  const params = useParams();
  const token = useMemo(() => params.token, [params.token]) as string;

  const onSubmit = async (values: typeof INITIAL_VALUES) => {
    try {
      await onResetPassword({ password: values.password, token });
      onSignOut();
      onAddSnackbar(authT("reset.notification.resetSuccess"), "success");
      push(SIGNIN_PATH);
    } catch (error) {
      if ((error as ErrorResponse)["code"] === formErrorCode.INVALID_DATA) {
        onAddSnackbar(authT("reset.notification.linkWrong"), "error");
      } else {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      }
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema,
    enableReinitialize: true,
    onSubmit,
  });

  const touchedErrors = useMemo(() => {
    return Object.entries(formik.errors).reduce(
      (out: FormikErrors<typeof INITIAL_VALUES>, [key, error]) => {
        if (formik.touched[key]) {
          out[key] = error;
        }
        return out;
      },
      {},
    );
  }, [formik.touched, formik.errors]);

  const disabled = useMemo(
    () => !!Object.values(touchedErrors)?.length || formik.isSubmitting,
    [touchedErrors, formik.isSubmitting],
  );

  return (
    <Stack
      flex={1}
      height="calc(var(--vh, 1vh) * 100)"
      width="100vw"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        m={{ xs: 2, sm: 8 }}
        justifyContent="center"
        alignItems="center"
        bgcolor="background.paper"
        p={3}
        flex={{ sm: 1 }}
        width={({ spacing }) => ({
          xs: `calc(100vw - ${spacing(2 * 2)})`,
          sm: `calc(100vw - ${spacing(8 * 2)})`,
        })}
        height={({ spacing }) => ({
          xs: "fit-content",
          sm: `calc(calc(var(--vh, 1vh) * 100) - ${spacing(8 * 2)})`,
        })}
        sx={{
          overflowX: "hidden",
        }}
        maxHeight={{ xs: "fit-content", sm: "100%" }}
        borderRadius={2}
        overflow="auto"
        position="relative"
      >
        <Stack
          direction="row"
          alignItems="center"
          position="absolute"
          top={16}
          right={16}
          spacing={{ xs: 1, sm: 2 }}
          zIndex={10}
        >
          <SwitchLanguage />
          <SwitchTheme />
        </Stack>

        <Stack
          minWidth={340}
          maxWidth={340}
          justifyContent="center"
          alignItems="center"
          component="form"
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <AppLogo width={188} />
          <Text variant="h3" textAlign="center" mt={3} mb={5}>
            {authT("reset.title")}
          </Text>

          <Input
            rootSx={sxConfig.input}
            fullWidth
            title={authT("reset.form.title.newPassword")}
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.password}
            error={commonT(touchedErrors?.password, {
              name: authT("common.form.title.password"),
              min: 6,
              max: 30,
            })}
            required
          />
          <Input
            rootSx={sxConfig.input}
            sx={{ mt: 3 }}
            fullWidth
            title={authT("common.form.title.confirmPassword")}
            name="rePassword"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.rePassword}
            error={commonT(touchedErrors?.rePassword, {
              name: authT("common.form.title.confirmPassword"),
            })}
            required
          />

          <Button
            type="submit"
            disabled={disabled}
            variant="primary"
            sx={{ mt: 3, minHeight: 48 }}
            fullWidth
            pending={formik.isSubmitting}
          >
            {commonT("form.confirm")}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default memo(Reset);

const INITIAL_VALUES = {
  password: "",
  rePassword: "",
};

export const validationSchema = Yup.object().shape({
  password: Yup.string()
    .trim()
    .required("form.error.required")
    .min(6, "form.error.minAndMax")
    .max(30, "form.error.minAndMax"),
  rePassword: Yup.string()
    .oneOf([Yup.ref("password"), ""], "form.error.confirmNotMatch")
    .required("form.error.required"),
});

const sxConfig = {
  input: {
    backgroundColor: "grey.50",
    height: 58,
  },
};
