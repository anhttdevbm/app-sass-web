import { Divider, Stack } from "@mui/material";
import { Button, Input, Text } from "components/shared";
import {
  ClientCompany,
  Contact,
  IAvatar,
} from "components/sn-client-companies/type";
import { AN_ERROR_TRY_AGAIN, NS_COMMON, NS_COMPANY } from "constant/index";
import { EMAIL_REGEX } from "constant/regex";
import { FormikErrors, useFormik } from "formik";
import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import * as Yup from "yup";
import AvatarUpload from "./AvatarUpload";

type FormProps = {
  initialValues?: ClientCompany;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: ClientCompany) => Promise<any>;
};

export const INITIAL_VALUES: ClientCompany = {
  code: "COM1z",
  name: "",
  tax_code: "",
  zip_code: "",
  address: "",
  phone: "",
  email: "",
  avatar: [],
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

const EditForm = (props: FormProps) => {
  const { initialValues, onSubmit: onSubmitProps, ...rest } = props;
  const { onAddSnackbar } = useSnackbar();
  const companyT = useTranslations(NS_COMPANY);
  const commonT = useTranslations(NS_COMMON);

  const onSubmit = async (values: ClientCompany) => {
    try {
      const newItem = await onSubmitProps(values);
      if (newItem) {
        onAddSnackbar(
          companyT("clientCompany.notification.success", {
            label: commonT("update"),
          }),
          "success",
        );
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

  const onSubmitForm = () => formik?.submitForm();

  return (
    <Stack sx={{ overflowY: "auto" }}>
      <Stack
        direction="column"
        gap={3}
        sx={{ overflowY: "auto", paddingRight: 2 }}
      >
        <Text variant="h5">{companyT("clientCompany.generalInformation")}</Text>
        <Stack direction="column">
          <Stack
            direction="row"
            sx={{ alignItems: "flex-start", width: "fit-content" }}
          >
            <AvatarUpload
              name="files"
              value={
                formik.values?.files ||
                (Array.isArray(formik.values?.avatar) &&
                !!formik.values?.avatar?.length
                  ? (formik.values?.avatar[0] as IAvatar)?.link
                  : "")
              }
              onChange={onChangeField}
            />
          </Stack>
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

          <Divider sx={{ borderColor: "grey.100" }} />
          <Text variant="h5">{companyT("clientCompany.contact")}</Text>

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
        </Stack>
      </Stack>
      <Button
        type="submit"
        variant="primary"
        size="extraSmall"
        sx={{
          marginY: 4,
          width: "fit-content",
          mx: "auto",
          height: 40,
          px: ({ spacing }) => `${spacing(3)}!important`,
          py: ({ spacing }) => `${spacing(1.5)}!important`,
        }}
        onClick={onSubmitForm}
      >
        {companyT("clientCompany.formUpdate.submit")}
      </Button>
    </Stack>
  );
};

export default memo(EditForm);

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
