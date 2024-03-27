import { Stack, Card } from "@mui/material";
import { DialogLayoutProps } from "components/DialogLayout";
import FormLayout from "components/FormLayout";
import { AN_ERROR_TRY_AGAIN, NS_COMMON, NS_COMPANY } from "constant/index";
import { FormikErrors, useFormik, useField } from "formik";
import { memo, useEffect, useMemo, useState } from "react";
import { useAuth, useSnackbar } from "store/app/selectors";
import * as Yup from "yup";
import { getMessageErrorByAPI } from "utils/index";
import { DataAction } from "constant/enums";
import { Button, Input, Text } from "components/shared";
import { ClientCompanyData } from "store/company/actions";
import { EMAIL_REGEX } from "constant/regex";
import { usePositionOptions } from "store/global/selectors";
import { useTranslations } from "next-intl";
import AvatarUpload from "./AvatarUpload";
import PlusIcon from "icons/PlusIcon";

type FormProps = {
  initialValues: FormTypes;
  type: DataAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: FormTypes) => Promise<any>;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

const INITIAL_VALUES = {
  code: "",
  name: "",
  tax_code: "",
  zip_code: "",
  address: "",
  phone: "",
  email: "",
  avatar: "",
  website: "",
  status: false,
  created_time: "",
  contact: {
    name: "",
    position: "",
    address: "",
    phone: "",
    email: "",
    avatar: [],
    website: "",
  },
};

type FormTypes = typeof INITIAL_VALUES//  & { avatar?: File };

const Form = (props: FormProps) => {
  const { initialValues, type, onSubmit: onSubmitProps, ...rest } = props;
  const { onAddSnackbar } = useSnackbar();
  const companyT = useTranslations(NS_COMPANY);
  const commonT = useTranslations(NS_COMMON);
  const [isShowContact, setShowContact] = useState<boolean>(false);

  const { onGetOptions, isFetching, totalPages, pageIndex, pageSize } =
    usePositionOptions();

  const onSubmit = async (values: FormTypes) => {
    try {
      const newItem = await onSubmitProps(values);
      if (newItem) {
      onAddSnackbar(
        companyT("clientCompany.notification.success"),
        "success",
      );
      props.onClose();
      } else {
      throw AN_ERROR_TRY_AGAIN;
      }
          
    } catch (error) {
        
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
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
      (out: FormikErrors<FormTypes>, [key, error]) => {
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

  const onEndReached = () => {
    if (isFetching || (totalPages && pageIndex >= totalPages)) return;
    onGetOptions({ pageSize, pageIndex: pageIndex + 1 });
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const onChangeField = (name: string, newValue?: any) => {
    formik.setFieldValue(name, newValue);
  };

  const onShowContact = () => setShowContact(true);

  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", lg: 880 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 900 },
        minHeight: "auto",
        gap: "24px",
      }}
      label={`${companyT("clientCompany.form.title.name")}`}
      submitting={formik.isSubmitting}
      disabled={disabled}
      onSubmit={formik.handleSubmit}
      submitText={companyT("clientCompany.create")}
      {...rest}
    >
      <Stack direction="row" gap={3}>
        <Stack>
          <AvatarUpload
            name="avatar"
            value={formik.values?.avatar}
            onChange={onChangeField}
          />
        </Stack>
        <Stack width="100%" display="flex" flexDirection="column" gap={2.5}>
          <Input
            title={companyT("clientCompany.companyName")}
            name="name"
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.name}
            error={commonT(touchedErrors?.name, {
              name: "Company name",
            })}
            disabled={type === DataAction.UPDATE}
            rootSx={sxConfig.input}
          />

          <Stack display="flex" flexDirection="row" gap={2}>
            <Input
              title={companyT("clientCompany.taxCode")}
              name="tax_code"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.tax_code}
              disabled={type === DataAction.UPDATE}
              rootSx={sxConfig.input}
              sx={{ width: "100%" }}
            />
            <Input
              title={companyT("clientCompany.address")}
              name="address"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.address}
              disabled={type === DataAction.UPDATE}
              rootSx={sxConfig.input}
              sx={{ width: "100%" }}
            />
          </Stack>
          <Stack display="flex" flexDirection="row" gap={2}>
            <Input
              title={companyT("clientCompany.zipCode")}
              name="zip_code"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.zip_code}
              disabled={type === DataAction.UPDATE}
              rootSx={sxConfig.input}
              sx={{ width: "100%" }}
            />
            <Input
              title="Email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.email}
              disabled={type === DataAction.UPDATE}
              rootSx={sxConfig.input}
              error={commonT(touchedErrors?.email, {
                name: "Email",
              })}
              sx={{ width: "100%" }}
            />
          </Stack>

          <Input
            title="Website"
            name="website"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.website}
            disabled={type === DataAction.UPDATE}
            rootSx={sxConfig.input}
          />

          <Button
            size="small"
            sx={{
              height: 20,
              minHeight: 24,
              display: "flex",
              width: "fit-content",
              padding: "0px",
            }}
            variant="text"
            startIcon={<PlusIcon color="primary" />}
            onClick={onShowContact}
          >
            <Text variant="h6" color="primary">
              {"Add contact"}
            </Text>
          </Button>

          {isShowContact && (
            <Card
              variant="outlined"
              sx={{
                padding: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
              }}
            >
              <Stack display="flex" flexDirection="row" gap={2}>
                <Input
                  title={commonT("fullName")}
                  name="contact.name"
                  required
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values?.contact?.name}
                  disabled={type === DataAction.UPDATE}
                  error={commonT(touchedErrors?.contact?.name, {
                    name: "Full name",
                  })}
                  rootSx={sxConfig.input}
                  sx={{ width: "100%" }}
                />
                <Input
                  title={commonT("position")}
                  name="contact.position"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values?.contact?.position}
                  disabled={type === DataAction.UPDATE}
                  rootSx={sxConfig.input}
                  sx={{ width: "100%" }}
                />
              </Stack>
              <Stack display="flex" flexDirection="row" gap={2}>
                <Input
                  title={commonT("phone")}
                  name="contact.phone"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values?.contact?.phone}
                  disabled={type === DataAction.UPDATE}
                  rootSx={sxConfig.input}
                  sx={{ width: "100%" }}
                />
                <Input
                  title="Email"
                  name="contact.email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values?.contact?.email}
                  disabled={type === DataAction.UPDATE}
                  rootSx={sxConfig.input}
                  error={commonT(touchedErrors?.contact?.email, {
                    name: "Email",
                  })}
                  sx={{ width: "100%" }}
                />
              </Stack>
              <Stack display="flex" flexDirection="row" gap={2}>
                <Input
                  title={companyT("clientCompany.address")}
                  name="contact.address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values?.contact?.address}
                  disabled={type === DataAction.UPDATE}
                  rootSx={sxConfig.input}
                  sx={{ width: "100%" }}
                />
                <Input
                  title="Website"
                  name="contact.website"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values?.contact?.website}
                  disabled={type === DataAction.UPDATE}
                  rootSx={sxConfig.input}
                  sx={{ width: "100%" }}
                />
              </Stack>
            </Card>
          )}
        </Stack>
      </Stack>
    </FormLayout>
  );
};

export default memo(Form);

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("form.error.required"),
  email: Yup.string().trim().matches(EMAIL_REGEX, "form.error.invalid"),
  contact: Yup.object().shape({
    name: Yup.string().required("form.error.required"),
    email: Yup.string().trim().matches(EMAIL_REGEX, "form.error.invalid"),
  })
});

const sxConfig = {
  input: {
    height: 56,
  },
};
