import { Stack } from "@mui/material";
import { formErrorCode } from "api/formErrorCode";
import { DialogLayoutProps } from "components/DialogLayout";
import FormLayout from "components/FormLayout";
import { Input } from "components/shared";
import { DataAction } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, NS_COMMON, NS_COMPANY } from "constant/index";
import { ErrorResponse } from "constant/types";
import { FormikErrors, useFormik } from "formik";
import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import { useSnackbar } from "store/app/selectors";
import { PositionData, ProjectTypeData } from "store/company/actions";
import { getMessageErrorByAPI } from "utils/index";
import * as Yup from "yup";

type FormProps = {
  initialValues: ProjectTypeData;
  type: DataAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: ProjectTypeData) => Promise<any>;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

const Form = (props: FormProps) => {
  const { initialValues, type, onSubmit: onSubmitProps, ...rest } = props;
  const { onAddSnackbar } = useSnackbar();
  const commonT = useTranslations(NS_COMMON);
  const companyT = useTranslations(NS_COMPANY);

  const label = useMemo(() => {
    switch (type) {
      case DataAction.CREATE:
        return commonT("createNew");
      case DataAction.UPDATE:
        return commonT("update");
      default:
        return "";
    }
  }, [commonT, type]);

  const onSubmit = async (values: ProjectTypeData) => {
    try {
      const newItem = await onSubmitProps(values);

      if (newItem) {
        onAddSnackbar(
          companyT("projectTypes.notification.success", { label }),
          "success",
        );
        props.onClose();
      } else {
        throw AN_ERROR_TRY_AGAIN;
      }
    } catch (error) {
      if (
        (error as ErrorResponse)["code"] === formErrorCode.INVALID_DATA &&
        (error as ErrorResponse)["message"]
      ) {
        formik.setFieldError("name", "form.error.existed");
      } else {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      }
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit,
  });

  const touchedErrors = useMemo(() => {
    return Object.entries(formik.errors).reduce(
      (out: FormikErrors<PositionData>, [key, error]) => {
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

  const newInput = {
    // height: "65px",
    ".MuiInputBase-root": {
      ".MuiAutocomplete-endAdornment":{right:"21px"},
      background:
        " linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)!important",
      padding: "9px!important",
      paddingRight: "22px !important",
      borderRadius: "100px!important",
      border: "none!important",
      mt: "35px",
      fontSize: "16px!important",
      // height:"38px",
      ".MuiInputBase-input": { p: "0 10px!important",margin:"0!important" },
      svg: {
        borderRadius: "50px",
        border: "0.2px solid #5C5C5C",
        fontSize: "16px",
        color: "black",
        "&:hover": { color: "black" },
      },
      ".MuiChip-root": {
        color: "#0575e6",
        padding: "5px",
        svg: {
          border: "0.2px solid transparent",
          color: "white",
          background: " #0575e6",
        },
      },
    },
    "label.MuiInputLabel-root": {
      left: 0,
      fontSize: "13px",
      transform: "translate(0, 16px) scale(1)",
    },
  };

  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", lg: 500 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 500 },
        minHeight: "auto",
        ".MuiDialogTitle-root": { border: "none" },
        ".MuiDialogActions-root": {
          justifyContent: "center",
          border: "none",
          ".MuiButtonBase-root": {
            "&:last-child": {
              background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
              color: "white",
              borderRadius: "100px",
            },
            "&:first-child": {
              background: "white",
              color: "#14B9E5",
              border: "1px solid #14B9E5",
              borderRadius: "100px",
            },
          },
        },
      }}
      label={`${label} ${companyT("projectTypes.key")}`}
      submitting={formik.isSubmitting}
      disabled={disabled}
      onSubmit={formik.handleSubmit}
      {...rest}
    >
      <Stack spacing={2} py={3}>
        <Input
          sx={newInput}
          title={companyT("projectTypes.form.title.name")}
          name="name"
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values?.name}
          error={commonT(touchedErrors?.name, {
            name: companyT("projectTypes.form.title.name"),
          })}
          rootSx={sxConfig.input}
        />
      </Stack>
    </FormLayout>
  );
};

export default memo(Form);

export const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("form.error.required"),
});

const sxConfig = {
  input: {
    height: 56,
  },
};
