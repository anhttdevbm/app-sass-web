"use client";

import { memo, useMemo } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { Button, Input, Text } from "components/shared";
import Link from "components/Link";
import { FORGOT_PASSWORD_PATH, JOIN_WORKSPACE_PATH } from "constant/paths";
import * as Yup from "yup";
import { AN_ERROR_TRY_AGAIN, NOTIFY_API_URL, NS_AUTH, NS_COMMON } from "constant/index";
import { useFormik, FormikErrors } from "formik";
import { SigninData } from "store/app/actions";
import { EMAIL_REGEX } from "constant/regex";
import { getMessageErrorByAPI } from "utils/index";
import { useSnackbar, useAuth } from "store/app/selectors";
import { useTranslations } from "next-intl";
import { formErrorCode } from "api/formErrorCode";
import { ErrorResponse } from "constant/types";
import { sessionStorage } from "utils/storage";
import { Permission } from "constant/enums";
import { useRouter } from "next-intl/client";
import GoogleLogo from "public/images/ic-google.svg";
import Image from "next/image";
import useNotification from "hooks/useNotification/useNotification";
import { Endpoint } from "api";
const Form = () => {
  const { onSignin } = useAuth();
  const { onAddSnackbar } = useSnackbar();
  const { push } = useRouter();
  const authT = useTranslations(NS_AUTH);
  const commonT = useTranslations(NS_COMMON);


  const {fcmToken} = useNotification();
  console.log("🚀 ~ Form ~ fcmToken:", fcmToken)
  const onSubmit = async (values: SigninData) => {

    try {
      const newData = await onSignin(values);

      if (newData) {
        onAddSnackbar(authT("signin.notification.signinSuccess"), "success");

        await fetch(`${NOTIFY_API_URL}/${Endpoint.NOTIFY_REGISTER_USER}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: newData?.id,
            token: fcmToken,
          }),
        })

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
      // overflow="hidden"
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
            control={<Checkbox disableRipple />}
            label="Remember password"
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
        // variant="primary"
        fullWidth
        pending={formik.isSubmitting}
      >
        {authT("signin.key")}
      </Button>
      <Button
        sx={{
          mt: 2,
          background:
            "linear-gradient(#fff, #fff) padding-box, linear-gradient(90deg, #2AF598, #009EFD) border-box",
          color: "black",
          border: "1px solid transparent",
          borderRadius: "4px",
        }}
        fullWidth
      >
        <Typography
          sx={{
            color: "#3699FF",
          }}
          mr={2}
          variant="body2"
          gutterBottom
        >
          or login by
        </Typography>{" "}
        <Image src={GoogleLogo} alt="App logo" width={32} />
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
