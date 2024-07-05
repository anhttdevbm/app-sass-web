"use client";

import { Stack } from "@mui/material";
import { Button, Input, Text } from "components/shared";
import { memo, useMemo } from "react";
import { useAuth, useSnackbar, useUserInfo } from "store/app/selectors";
import * as Yup from "yup";
import { useFormik, FormikErrors } from "formik";
import { getMessageErrorByAPI } from "utils/index";
import { ChangePasswordData } from "store/app/actions";
import { formErrorCode } from "api/formErrorCode";
import { ErrorResponse } from "constant/types";
import { NS_ACCOUNT, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import { HOME_PATH } from "constant/paths";
import useBreakpoint from "hooks/useBreakpoint";
import FixedLayout from "components/FixedLayout";

const ChangePassword = ({ prevPath }: { prevPath?: string }) => {
  const { onChangePassword } = useUserInfo();
  const { onSignOut } = useAuth();
  const commonT = useTranslations(NS_COMMON);
  const accountT = useTranslations(NS_ACCOUNT);
  const { isSmSmaller } = useBreakpoint();

  const { onAddSnackbar } = useSnackbar();
  const { back, push } = useRouter();

  const onSubmit = async (values: ChangePasswordData) => {
    try {
      const isSuccess = await onChangePassword(values);
      if (isSuccess === true) {
        onAddSnackbar(
          accountT("changePassword.notification.changeSuccess"),
          "success",
        );
        formik.resetForm();
        onSignOut();
      }
    } catch (error) {
      if ((error as ErrorResponse)["code"] === formErrorCode.INVALID_DATA) {
        formik.setFieldError("old_password", "form.error.incorrect");
      } else {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      }
    }
  };

  const onCancel = () => {
    formik.resetForm();
    if (prevPath) {
      back();
    } else {
      push(HOME_PATH);
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
    <FixedLayout flex={1}>
      <Stack
        flex={1}
        justifyContent="center"
        alignItems="center"
        spacing={3}
        maxWidth={({ spacing }) => ({
          xs: `calc(100vw - ${spacing(3 * 2)})`,
          sm: 340,
        })}
        alignSelf="center"
        width="100%"
        py={3}
        component="form"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <Text variant="subtitle1" fontWeight={700}>
          {accountT("changePassword.title")}
        </Text>
        <Input
          rootSx={sxConfig.input}
          fullWidth
          title={accountT("changePassword.form.title.oldPassword")}
          name="old_password"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values?.old_password}
          error={commonT(touchedErrors?.old_password, {
            name: accountT("changePassword.form.title.oldPassword"),
          })}
          required
        />
        <Input
          rootSx={sxConfig.input}
          fullWidth
          title={accountT("changePassword.form.title.newPassword")}
          name="new_password"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values?.new_password}
          error={commonT(touchedErrors?.new_password, {
            name: accountT("changePassword.form.title.newPassword"),
            name2: accountT("changePassword.form.title.oldPassword"),
            min: 6,
            max: 30,
          })}
          required
        />
        <Input
          rootSx={sxConfig.input}
          fullWidth
          title={accountT("changePassword.form.title.confirmNewPassword")}
          name="renew_password"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values?.renew_password}
          error={commonT(touchedErrors?.renew_password, {
            name: accountT("changePassword.form.title.confirmNewPassword"),
            min: 6,
            max: 30,
          })}
          required
        />

        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          alignItems="center"
          spacing={{ xs: 2, sm: 3 }}
          width="100%"
        >
          <Button
            type="button"
            onClick={onCancel}
            sx={sxConfig.button}
            variant="primaryOutlined"
            size={isSmSmaller ? "medium" : "small"}
            fullWidth
          >
            {commonT("form.cancel")}
          </Button>
          <Button
            disabled={disabled}
            pending={formik.isSubmitting}
            sx={{ ...sxConfig.button }}
            variant="primary"
            size={isSmSmaller ? "medium" : "small"}
            type="submit"
            fullWidth
          >
            {commonT("form.confirm")}
          </Button>
        </Stack>
      </Stack>
    </FixedLayout>
  );
};

export default memo(ChangePassword);

const INITIAL_VALUES = {
  old_password: "",
  new_password: "",
  renew_password: "",
};

export const validationSchema = Yup.object().shape({
  old_password: Yup.string().trim().required("form.error.required"),
  new_password: Yup.string()
    .trim()
    .required("form.error.required")
    .min(6, "form.error.minAndMax")
    .max(30, "form.error.minAndMax")
    .test("is-diff-old-pass", "form.error.notSame", (value, { parent }) => {
      if (value && parent["old_password"] && value === parent["old_password"])
        return false;
      return true;
    }),
  renew_password: Yup.string()
    .oneOf([Yup.ref("new_password"), ""], "form.error.confirmNotMatch")
    .required("form.error.required"),
});

const sxConfig = {
  input: {
    height: 58,
    "& input": {
      color: ({ palette }) => `${palette.grey[900]}!important`,
    },
  },
  button: {
    minWidth: 150,
  },
};
