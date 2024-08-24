import { Stack } from "@mui/material";
import { DialogLayoutProps } from "components/DialogLayout";
import FormLayout from "components/FormLayout";
import {
  NS_DOCS,
  NS_PROJECT,
} from "constant/index";
import { FormikErrors, useFormik } from "formik";
import { memo, useMemo } from "react";
import { useSnackbar } from "store/app/selectors";
import * as Yup from "yup";
import { getMessageErrorByAPI } from "utils/index";
import { DataAction } from "constant/enums";
import { Input } from "components/shared";
import { PositionData } from "store/company/actions";
import { useTranslations } from "next-intl";
import { TaskListData } from "store/project/actions";

export interface IFormUpdateDoc {
  name: string;
}

type FormProps = {
  initialValues: IFormUpdateDoc;
  type: DataAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: IFormUpdateDoc) => Promise<any>;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

const UpdateFormDoc = (props: FormProps) => {
  const { initialValues, type, onSubmit: onSubmitProps, ...rest } = props;
  const { onAddSnackbar } = useSnackbar();
  const docsT = useTranslations(NS_DOCS);
  const projectT = useTranslations(NS_PROJECT);

  const label = useMemo(() => {
    switch (type) {
      case DataAction.UPDATE:
        return docsT("expandBtn.rename");
      default:
        return "";
    }
  }, [docsT, type]);

  const onSubmit = async (values: Omit<TaskListData, "project">) => {
    try {
      await onSubmitProps(values);
      props.onClose();
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, docsT), "error");
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
      {}
    );
  }, [formik.touched, formik.errors]);

  const disabled = useMemo(
    () => !!Object.values(touchedErrors)?.length || formik.isSubmitting,
    [touchedErrors, formik.isSubmitting]
  );

  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", lg: 500 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 500 },
        minHeight: "auto",
      }}
      label={`${label} ${docsT("extendBtn.rename")}`}
      submitting={formik.isSubmitting}
      disabled={disabled}
      onSubmit={formik.handleSubmit}
      // zIndex={1200}
      {...rest}
    >
      <Stack spacing={2} py={3}>
        <Input
          title={docsT("extendBtn.rename")}
          name="name"
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values?.name}
          error={docsT(touchedErrors?.name, {
            name: docsT("errorInputRename"),
          })}
          rootSx={sxConfig.input}
        />
      </Stack>
    </FormLayout>
  );
};

export default memo(UpdateFormDoc);

export const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("form.error.required"),
});

const sxConfig = {
  input: {
    height: 56,
  },
};
