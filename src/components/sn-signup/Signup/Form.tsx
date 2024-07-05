"use client";

import { memo, useMemo } from "react";
import { Stack } from "@mui/material";
import { Button, Input } from "components/shared";
import * as Yup from "yup";
import { AN_ERROR_TRY_AGAIN, NS_AUTH, NS_COMMON } from "constant/index";
import { useFormik, FormikErrors } from "formik";
import { SignupData } from "store/app/actions";
import { EMAIL_REGEX, VN_PHONE_REGEX } from "constant/regex";
import { cleanObject, getMessageErrorByAPI } from "utils/index";
import { useSnackbar, useAuth } from "store/app/selectors";
import { AvatarUpload } from "./components";
import { formErrorCode } from "api/formErrorCode";
import { ErrorResponse } from "constant/types";
import { Endpoint, client } from "api";
import { useTranslations } from "next-intl";

const Form = () => {
  const { onSignup } = useAuth();
  const { onAddSnackbar } = useSnackbar();
  const authT = useTranslations(NS_AUTH);
  const commonT = useTranslations(NS_COMMON);

  const onSubmit = async (values: FormTypes) => {
    try {
      const newData = { ...values } as SignupData;
      if (values?.avatar) {
        const avatarUrl = await client.upload(
          Endpoint.SIGNUP_UPLOAD,
          values.avatar,
        );
        newData["avatar"] = [avatarUrl];
      }
      if (newData["rePassword"]) {
        delete newData["rePassword"];
      }

      await onSignup(newData);
    } catch (error) {
      if ((error as ErrorResponse)["code"] === formErrorCode.REGISTERED_EMAIL) {
        formik.setFieldError("email", "form.error.existed");
      } else {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      }
    }
  };

  const formik = useFormik<FormTypes>({
    initialValues: INITIAL_VALUES,
    validationSchema,
    enableReinitialize: true,
    onSubmit,
  });

  const onChangeAvatar = (newFile?: File) => {
    formik.setFieldValue("avatar", newFile);
  };

  const touchedErrors = useMemo(() => {
    return Object.entries(formik.errors).reduce(
      (
        out: FormikErrors<SignupData & { rePassword: string }>,
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

  const disabled = useMemo(
    () => !!Object.values(touchedErrors)?.length || formik.isSubmitting,
    [touchedErrors, formik.isSubmitting],
  );

  return (
    <Stack
      flex={1}
      component="form"
      width="100%"
      maxHeight="100%"
      mt={3}
      onSubmit={formik.handleSubmit}
      spacing={3}
      overflow="hidden"
      noValidate
    >
      <Stack flex={1} overflow="auto" spacing={3}>
        <Input
          rootSx={sxConfig.input}
          fullWidth
          title={authT("signup.form.title.fullName")}
          name="fullname"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values?.fullname}
          error={commonT(touchedErrors?.fullname, {
            name: authT("signup.form.title.fullName"),
            min: 6,
          })}
          required
        />
        <Input
          rootSx={sxConfig.input}
          fullWidth
          title={authT("signup.form.title.phone")}
          name="phone"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values?.phone}
          error={commonT(touchedErrors?.phone, {
            name: authT("signup.form.title.phone"),
          })}
        />
        <Input
          rootSx={sxConfig.input}
          fullWidth
          title="Email"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values?.email}
          error={commonT(touchedErrors?.email, { name: "Email" })}
          required
        />
        <Input
          rootSx={sxConfig.input}
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
          required
        />
        <Input
          rootSx={sxConfig.input}
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
        <AvatarUpload value={formik.values?.avatar} onChange={onChangeAvatar} />
      </Stack>

      <Button
        type="submit"
        disabled={disabled}
        variant="primary"
        fullWidth
        pending={formik.isSubmitting}
      >
        {authT("signup.key")}
      </Button>
    </Stack>
  );
};

export default memo(Form);

const INITIAL_VALUES = {
  fullname: "",
  phone: "",
  email: "",
  password: "",
  rePassword: "",
};

type FormTypes = typeof INITIAL_VALUES & { avatar?: File };

export const validationSchema = Yup.object().shape({
  fullname: Yup.string()
    .trim()
    .required("form.error.required")
    .min(6, "form.error.min"),
  // phone: Yup.string().trim().matches(VN_PHONE_REGEX, "form.error.invalid"),
  email: Yup.string()
    .trim()
    .required("form.error.required")
    .matches(EMAIL_REGEX, "form.error.invalid"),
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
    height: 58,
  },
};
