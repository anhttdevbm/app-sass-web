"use client";
import { memo, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { FormikErrors, useFormik } from "formik";
import { useTranslations } from "next-intl";
import * as Yup from "yup";

import {
  NewButton as Button,
  NewInput as Input,
  Text
} from "components/shared";
import {
  AN_ERROR_TRY_RELOAD_PAGE,
  NS_ACCOUNT,
  NS_COMMON,
} from "constant/index";
// import useBreakpoint from "hooks/useBreakpoint";
import useToggle from "hooks/useToggle";
import NewCopyIcon from "icons/NewCopyIcon";
import OutlineEditIcon from "icons/OutlineEditIcon";
import { UpdateUserInfoData } from "store/app/actions";
import { useAuth, useSnackbar, useUserInfo } from "store/app/selectors";
import { getDataFromKeys, getMessageErrorByAPI } from "utils/index";

const EmployeeDetail = () => {
  const { user } = useAuth();
  const { onUpdateUserInfo } = useUserInfo();
  const commonT = useTranslations(NS_COMMON);
  const accountT = useTranslations(NS_ACCOUNT);

  // const { isSmSmaller } = useBreakpoint();

  const [isEdit, onEditTrue, onEditFalse] = useToggle();

  const { onAddSnackbar } = useSnackbar();

  const onSubmit = async (values: UpdateUserInfoData) => {
    try {
      await onUpdateUserInfo(values);
      onEditFalse();
      onAddSnackbar(
        accountT("accountInformation.notification.updateSuccess"),
        "success",
      );
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  // const onCancel = () => {
  //   formik.resetForm();
  //   onEditFalse();
  // };

  const initialValues = useMemo(
    () => ({
      ...getDataFromKeys(user, Object.keys(INITIAL_VALUES)),
    }),
    [user],
  ) as UpdateUserInfoData;

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit,
  });

  const touchedErrors = useMemo(() => {
    return Object.entries(formik.errors).reduce(
      (
        out: FormikErrors<typeof INITIAL_VALUES & { rePassword: string }>,
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

  if (!user) {
    return (
      <Text variant="body2" textAlign="center" fontWeight={600}>
        {commonT(AN_ERROR_TRY_RELOAD_PAGE)}
      </Text>
    );
  }

  return (
    <>
      <Box
        ml={{
          xs: "16px",
          sm: "48px",
        }}
        mr={{
          xs: "16px",
          sm: "32px",
        }}
        flexGrow={1}
      >
        <Grid
          container
          columnSpacing={{
            xs: 0,
            sm: 11,
          }}
          rowSpacing={{
            xs: 2,
            sm: 3,
          }}
          width="100%"
          component="form"
          noValidate
          onSubmit={formik.handleSubmit}
        >

          <Grid item xs={12} sm={6}>
            <Input
              rootSx={sxConfig.input}
              title={commonT("fullName")}
              fullWidth
              name="fullname"
              disabled={!isEdit}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.fullname}
              error={commonT(touchedErrors?.fullname, {
                name: commonT("fullName"),
                min: 6,
              })}
              required={isEdit}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              rootSx={sxConfig.input}
              title="Username"
              fullWidth
              name="username"
              disabled
              value={user?.["username"]}
              endNode={
                <Button
                  sx={{color: '#0575E6'}}
                  aria-label="copy"
                  onClick={() => { navigator.clipboard.writeText(user?.["username"]) }}
                  startIcon={<NewCopyIcon />}
                >
                  Copy
                </Button>
              }
              tooltip={
                isEdit
                  ? accountT("accountInformation.notAllowUpdate", {
                      name: "Username",
                    })
                  : undefined
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              rootSx={sxConfig.input}
              title={commonT("phone")}
              fullWidth
              name="phone"
              disabled={!isEdit}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.phone}
              error={commonT(touchedErrors?.phone, {
                name: commonT("phone"),
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              rootSx={sxConfig.input}
              title={commonT("address")}
              fullWidth
              name="address"
              disabled={!isEdit}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.address}
              error={commonT(touchedErrors?.address, {
                name: commonT("address"),
              })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              rootSx={sxConfig.input}
              title="Email"
              fullWidth
              name="email"
              disabled
              value={user.email}
              tooltip={
                isEdit
                  ? accountT("accountInformation.notAllowUpdate", {
                      name: "Email",
                    })
                  : undefined
              }
            />
          </Grid>

          <Grid container item xs={12} justifyContent="center" my={{xs: 5, sm: 6}}>
            { !isEdit
              ?
                <Button
                  onClick={onEditTrue}
                  variant="secondaryOutlined"
                  startIcon={<OutlineEditIcon />}
                  sx={{
                    ...sxConfig.button,
                    "&.MuiButton-sizeMedium" :{
                      px: "86px",
                      py: "12px",
                    },
                  }}
                >
                  {accountT("accountInformation.changeInformation")}
                </Button>
              : <></>
            }
            { isEdit
              ?
                <>
                  <Button
                    disabled={disabled}
                    pending={formik.isSubmitting}
                    sx={{
                      ...sxConfig.button,
                      "&.MuiButton-sizeMedium" :{
                        px: "86px",
                        py: "12px",
                      },
                    }}
                    variant="primary"
                    type="submit"
                  >
                    {commonT("form.save")}
                  </Button>
                </>
              : <></>
            }
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default memo(EmployeeDetail);

const INITIAL_VALUES = {
  fullname: "",
  phone: "",
  address: "",
};

export const validationSchema = Yup.object().shape({
  fullname: Yup.string()
    .trim()
    .required("form.error.required")
    .min(6, "form.error.min"),
  // phone: Yup.string().trim().matches(VN_PHONE_REGEX, "form.error.invalid"),
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
