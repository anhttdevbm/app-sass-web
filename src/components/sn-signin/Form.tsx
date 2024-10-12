"use client";

import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack
} from "@mui/material";
import { formErrorCode } from "api/formErrorCode";
import Link from "components/Link";
import { Button, Input } from "components/shared";
import { AN_ERROR_TRY_AGAIN, NS_AUTH, NS_COMMON } from "constant/index";
import { FORGOT_PASSWORD_PATH } from "constant/paths";
import { EMAIL_REGEX } from "constant/regex";
import { ErrorResponse } from "constant/types";
import { FormikErrors, useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { memo, useEffect, useMemo, useState } from "react";
import { SigninData } from "store/app/actions";
import { useAuth, useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import * as Yup from "yup";

const Form = () => {
  const { onSignin } = useAuth();
  const { onAddSnackbar } = useSnackbar();
  const { push } = useRouter();
  const authT = useTranslations(NS_AUTH);
  const commonT = useTranslations(NS_COMMON);
  const [rememberAccount, setRememberAccount] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      formik.setFieldValue("email", savedEmail);
      setRememberAccount(true);
    }
  }, []);

  const onSubmit = async (values: SigninData) => {
    try {
      const newData = await onSignin(values);

      if (newData) {
        onAddSnackbar(authT("signin.notification.signinSuccess"), "success");
        if (rememberAccount) {
          localStorage.setItem("rememberedEmail", values.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }
      } else {
        throw AN_ERROR_TRY_AGAIN;
      }
    } catch (error) {
      if (
        (error as ErrorResponse)["code"] ===
        formErrorCode.WRONG_EMAIL_OR_PASSWORD
      ) {
        onAddSnackbar(
          authT("signin.notification.emailOrPasswordWrong"),
          "error",
        );
      } else if (
        (error as ErrorResponse)["code"] === formErrorCode.NOT_FOUND_EMAIL
      ) {
        formik.setFieldError("email", "form.error.notExist");
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
      (out: FormikErrors<SigninData>, [key, error]) => {
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
      component="form"
      width="100%"
      mt={2}
      onSubmit={formik.handleSubmit}
      noValidate
    >
      <Stack overflow="auto" spacing={2}>
        <Input
          rootSx={sxConfig.input}
          fullWidth
          title="Email or Username"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values?.email}
          error={commonT(touchedErrors?.email, { name: "Email" })}
        />
        <Input
          rootSx={sxConfig.input}
          sx={{ mt: 1 }}
          fullWidth
          title={authT("common.form.title.password")}
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
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <FormControlLabel
            sx={{
              fontSize: 14,
            }}
            control={
              <Checkbox
                disableRipple
                checked={rememberAccount}
                onChange={(e) => setRememberAccount(e.target.checked)}
              />
            }
            label={authT("signin.rememberAccount")}
          />
          <Box>
            <Link
              sx={{
                fontSize: 14,
                alignSelf: "flex-end",
                "&:hover": {
                  color: "#3699FF",
                },
              }}
              href={FORGOT_PASSWORD_PATH}
              color="#3699FF"
              underline="none"
            >
              {authT("signin.forgotPassword")}
            </Link>
          </Box>
        </Stack>
      </Stack>

      <Button
        type="submit"
        disabled={disabled}
        sx={{
          mt: 2,
          borderRadius: "4px",
          background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
          "&:hover": {
            background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
          },
        }}
        fullWidth
        pending={formik.isSubmitting}
      >
        {authT("signin.key")}
      </Button>
    </Stack>
  );
};

export default memo(Form);

const INITIAL_VALUES = {
  email: "",
  password: "",
};

export const validationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .required("form.error.required")
    .matches(EMAIL_REGEX, "form.error.invalid"),
  password: Yup.string()
    .trim()
    .required("form.error.required")
    .min(6, "form.error.minAndMax")
    .max(30, "form.error.minAndMax"),
});

const sxConfig = {
  input: {
    height: 58,
  },
};
