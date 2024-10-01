"use client";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { FormikErrors, useFormik } from "formik";
import { useTranslations } from "next-intl";
import { memo, useMemo, useState } from "react";
import * as Yup from "yup";

import { NewButton as Button, NewInput as Input } from "components/shared";
import { Permission } from "constant/enums";
import { NS_ACCOUNT, NS_COMMON } from "constant/index";
// import useBreakpoint from "hooks/useBreakpoint";
import dayjs from "dayjs";
import useToggle from "hooks/useToggle";
import CopyIcon from "icons/NewCopyIcon";
import OutlineEditIcon from "icons/OutlineEditIcon";
import { useDispatch } from "react-redux";
import { UpdateUserInfoData } from "store/app/actions";
import { useAuth, useSnackbar } from "store/app/selectors";
import { AppDispatch } from "store/configureStore";
import { getRequestUpgradePayment } from "store/payment/actions";
import { getDataFromKeys, getMessageErrorByAPI } from "utils/index";
import { useEmployeeDetailContext } from "./EmployeeDetailContext";
import ConfirmToRequest from "./components/ConfirmToRequest";

const EmployeeDetailForm = () => {
  const { user } = useAuth();
  const commonT = useTranslations(NS_COMMON);
  const accountT = useTranslations(NS_ACCOUNT);
  // const { isSmSmaller } = useBreakpoint();
  const dispatch = useDispatch<AppDispatch>();

  const { type, employee, onUpdateUserInfo } = useEmployeeDetailContext();
  const [isEdit, onEditTrue, onEditFalse] = useToggle();
  const { onAddSnackbar } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const isAdmin = useMemo(
    () => user?.roles.includes(Permission.AM),
    [user?.roles],
  );

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
  const onSubmitConfirmToRequest = async () => {
    try {
      const result = await dispatch(getRequestUpgradePayment());
      if (result?.payload?.success) {
        onAddSnackbar("Request Success", "success");
      } else {
        onAddSnackbar("Already sent a payment request!", "error");
      }
      setOpenModal(false);
    } catch (error) {
      onAddSnackbar("Request Error", "error");
      setOpenModal(false);
    }
  };

  const initialValues = useMemo(
    () => ({
      ...getDataFromKeys(employee, Object.keys(INITIAL_VALUES)),
    }),
    [employee],
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
          rowSpacing={2}
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
              value={employee["username"]}
              endNode={
                <Button
                  sx={{ color: "#0575E6" }}
                  size="small"
                  aria-label="copy"
                  onClick={() => {
                    navigator.clipboard.writeText(employee["username"]);
                  }}
                  startIcon={<CopyIcon />}
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
              value={employee.email}
              tooltip={
                isEdit
                  ? accountT("accountInformation.notAllowUpdate", {
                      name: "Email",
                    })
                  : undefined
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              rootSx={sxConfig.input}
              title="Package"
              fullWidth
              name="package"
              disabled
              value={employee.packageName}
              // tooltip={
              //   isEdit
              //     ? accountT("accountInformation.notAllowUpdate", {
              //         name: "Email",
              //       })
              //     : undefined
              // }
              endNode={
                <Button
                  sx={{ color: "#0575E6" }}
                  size="small"
                  onClick={() => setOpenModal(true)}
                >
                  Request upgrade
                </Button>
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Input
              rootSx={sxConfig.input}
              title="Expiration date"
              fullWidth
              name="expirationDate"
              disabled
              value={dayjs(employee?.expiration_date).format("D MMMM, YYYY")}
              // tooltip={
              //   isEdit
              //     ? accountT("accountInformation.notAllowUpdate", {
              //         name: "Email",
              //       })
              //     : undefined
              // }
            />
          </Grid>
          <Grid
            container
            item
            xs={12}
            justifyContent="center"
            my={{ xs: 5, sm: 6 }}
          >
            {type === "SELF" && !isEdit ? (
              <Button
                onClick={onEditTrue}
                variant="secondaryOutlined"
                startIcon={<OutlineEditIcon />}
                sx={{
                  ...sxConfig.button,
                  "&.MuiButton-sizeMedium": {
                    px: 10,
                    py: 1,
                  },
                }}
              >
                {accountT("accountInformation.changeInformation")}
              </Button>
            ) : null}
            {isEdit ? (
              <>
                <Button
                  disabled={disabled}
                  pending={formik.isSubmitting}
                  sx={{
                    ...sxConfig.button,
                    "&.MuiButton-sizeMedium": {
                      px: 10,
                      py: 1,
                    },
                  }}
                  variant="primary"
                  type="submit"
                >
                  {commonT("form.save")}
                </Button>
              </>
            ) : null}
          </Grid>
        </Grid>
      </Box>
      <ConfirmToRequest
        open={openModal}
        title="Confirm to Request Upgrade"
        question="Are you sure to request upgrade?"
        onClose={() => setOpenModal(false)}
        onSubmit={onSubmitConfirmToRequest}
      />
    </>
  );
};

export default memo(EmployeeDetailForm);

const INITIAL_VALUES = {
  fullname: "",
  phone: "",
  address: "",
};

const validationSchema = Yup.object().shape({
  fullname: Yup.string()
    .trim()
    .required("form.error.required")
    .min(6, "form.error.min"),
  // phone: Yup.string().trim().matches(VN_PHONE_REGEX, "form.error.invalid"),
});

const sxConfig = {
  input: {
    height: 52,
    "& input": {
      color: ({ palette }) => `${palette.grey[900]}!important`,
    },
  },
  button: {
    minWidth: 150,
  },
};