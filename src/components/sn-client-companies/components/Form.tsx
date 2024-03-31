import { Card, Stack } from "@mui/material";
import { DialogLayoutProps } from "components/DialogLayout";
import FormLayout from "components/FormLayout";
import { Button, Input, Text } from "components/shared";
import { ClientCompany, Contact } from "components/sn-client-companies/type";
import { DataAction } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, NS_COMMON, NS_COMPANY } from "constant/index";
import { EMAIL_REGEX } from "constant/regex";
import { FormikErrors, useFormik } from "formik";
import PlusIcon from "icons/PlusIcon";
import { useTranslations } from "next-intl";
import { memo, useMemo, useState } from "react";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import * as Yup from "yup";
import AvatarUpload from "./AvatarUpload";

type FormProps = {
  initialValues?: ClientCompany;
  type: DataAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: ClientCompany) => Promise<any>;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

export const INITIAL_VALUES: ClientCompany = {
  code: "COM1z",
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
    avatar: undefined,
    website: "",
  },
};

const Form = (props: FormProps) => {
  const { initialValues, type, onSubmit: onSubmitProps, ...rest } = props;
  const { onAddSnackbar } = useSnackbar();
  const companyT = useTranslations(NS_COMPANY);
  const commonT = useTranslations(NS_COMMON);
  const [isShowContact, setShowContact] = useState<boolean>(false);

  const onSubmit = async (values: ClientCompany) => {
    try {
      const newItem = await onSubmitProps(values);
      if (newItem) {
        onAddSnackbar(
          companyT("clientCompany.notification.success", {
            label:
              type === DataAction.CREATE
                ? commonT("createNew")
                : commonT("update"),
          }),
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
    initialValues: initialValues || INITIAL_VALUES,
    validationSchema,
    enableReinitialize: true,
    onSubmit,
  });

  const touchedErrors = useMemo(() => {
    return Object.entries(formik.errors).reduce(
      (out: FormikErrors<ClientCompany>, [key, error]) => {
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

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const onChangeField = (name: string, newValue?: any) => {
    formik.setFieldValue(name, newValue);
  };

  const onShowContact = () => {
    setShowContact(true);
    formik?.setFieldValue("isShowContact", true);
  };

  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", lg: 880 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 900 },
        minHeight: "auto",
        gap: "24px",
      }}
      label={
        type === DataAction.CREATE
          ? companyT("clientCompany.form.title.name")
          : companyT("clientCompany.formUpdate.title")
      }
      submitting={formik.isSubmitting}
      disabled={disabled}
      onSubmit={formik.handleSubmit}
      submitText={
        type === DataAction.CREATE
          ? companyT("clientCompany.create")
          : companyT("clientCompany.formUpdate.submit")
      }
      {...rest}
    >
      <Stack direction="row" gap={3}>
        <Stack>
          <AvatarUpload
            name="avatar"
            value={
              typeof formik.values?.avatar === "string"
                ? formik.values?.avatar
                : ""
            }
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
              name: companyT("clientCompany.companyName"),
            })}
            rootSx={sxConfig.input}
          />

          <Stack display="flex" flexDirection="row" gap={2}>
            <Input
              title={companyT("clientCompany.taxCode")}
              name="tax_code"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.tax_code}
              rootSx={sxConfig.input}
              sx={{ width: "100%" }}
            />
            <Input
              title={companyT("clientCompany.address")}
              name="address"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.address}
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
              rootSx={sxConfig.input}
              sx={{ width: "100%" }}
            />
            <Input
              title="Email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.email}
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
                  error={commonT(touchedErrors?.contact, {
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
                  rootSx={sxConfig.input}
                  sx={{ width: "100%" }}
                />
                <Input
                  title="Email"
                  name="contact.email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values?.contact?.email}
                  rootSx={sxConfig.input}
                  error={commonT((touchedErrors?.contact as Contact)?.email, {
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
                  rootSx={sxConfig.input}
                  sx={{ width: "100%" }}
                />
                <Input
                  title="Website"
                  name="contact.website"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values?.contact?.website}
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
  contact: Yup.object()
    .shape({
      name: Yup.string().test(
        "required",
        "form.error.required",
        (value, context) => {
          if (
            !!context?.from?.length &&
            context?.from[1]?.value["isShowContact"]
          ) {
            return !!value?.length;
          }
          return true;
        },
      ),
      email: Yup.string().trim().matches(EMAIL_REGEX, "form.error.invalid"),
    })
    .nullable(),
});

const sxConfig = {
  input: {
    height: 56,
  },
};
