import {
  CardContent,
  Grid,
  Input,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DialogLayoutProps } from "components/DialogLayout";
import FormLayout from "components/FormLayout";
import { AN_ERROR_TRY_AGAIN, NS_COMMON, NS_APPLICANTS } from "constant/index";
import { FormikErrors, useFormik } from "formik";
import { memo, useMemo, useState } from "react";
import { useSnackbar } from "store/app/selectors";
import * as Yup from "yup";
import { getMessageErrorByAPI } from "utils/index";
import { DataAction } from "constant/enums";
import { useTranslations } from "next-intl";
import { ApplicantData, MailData } from "store/career/action";
import SelectMailMultiple from "./SelectMailMultiple";

type FormProps = {
  initialValues: ApplicantData;
  type: DataAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: ApplicantData) => Promise<any>;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

const Form = (props: FormProps) => {
  const { initialValues, type, onSubmit: onSubmitProps, ...rest } = props;
  const { onAddSnackbar } = useSnackbar();
  const applicantT = useTranslations(NS_APPLICANTS);
  const commonT = useTranslations(NS_COMMON);
  const [mails, setMails] = useState<MailData[]>([]);

  const label = useMemo(() => {
    switch (type) {
      case DataAction.UPDATE:
        // alert("")
        return commonT("update");
      default:
        return "";
    }
  }, [commonT, type]);

  const onSubmit = async (values: ApplicantData) => {
    try {
      const newItem = await onSubmitProps(values);
      // console.log("Đã Vào đây");
      // console.log(newItem);
      if (newItem) {
        onAddSnackbar(
          applicantT("Applicant_success.notification.success_responsed"),
          "success",
        );
        // console.log("Đã vào đây");
        props.onClose();
      } else {
        // console.log("Đã Vào Đây Lỗi");
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
    onSubmit
  });

  const onSelect = (data) => {
    const uniqueData = Array.from(new Set(data.map(item => item.mail))).map(mail => ({ mail }));
    formik.setFieldValue("forward_email", uniqueData.map((item) => item.mail));
  };

  const onEnter = (value) => {
    if (!value) return;
    const itemValues = formik.values?.forward_email ?? [];
    const isExisted = itemValues.find((item) => item == value);

    if (isExisted) {
      const updatedTags = itemValues.map(mail => ({ mail }));
      onSelect([...updatedTags, { mail: value }]);
    } else {
      const newMailOption = {
        mail: value,
      };
      setMails((prevListMail) => [...prevListMail, newMailOption]);
      const updatedMails = itemValues.map(mail => ({ mail }));
      onSelect([...updatedMails, { mail: value }]);
    }
  };

  const touchedErrors = useMemo(() => {
    return Object.entries(formik.errors).reduce(
      (out: FormikErrors<ApplicantData>, [key, error]) => {
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
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", lg: 800 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 500 },
        minHeight: "auto",
      }}
      label={`${applicantT("form_Applicant.label_form_update")}`}
      onSubmit={formik.handleSubmit}
      disabled={disabled}
      submitting={formik.isSubmitting}
      {...rest}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {initialValues.name}
            </Typography>
            <Typography sx={{ mb: 1 }} variant="body2" color="#212121">
              {applicantT("applicantTable.phone")}: {initialValues.phone}
            </Typography>
            <Typography sx={{ mb: 1 }} variant="body2" color="#424242">
              {applicantT("applicantTable.email")}: {initialValues.email}
            </Typography>
            <hr />
            <Stack>
              <Typography sx={{ mb: 1 }} color="#424242">
                {applicantT("applicantTable.mailBcc")}
              </Typography>
              <SelectMailMultiple
                items={mails}
                sx={sxConfig}
                onSelect={(e, data) => onSelect(data)}
                onEnter={onEnter}
                value={formik.values.forward_email?.map((mail) => ({ mail }))}
              />
              <Typography sx={{ mb: 1 }} color="#424242" variant="h5">
                {applicantT("applicantTable.subject")}:
              </Typography>
              <Input
                title={applicantT("applicantTable.subject")}
                name="title"
                required
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values?.title}
                color="secondary"
              />
            </Stack>
            <Typography
              variant="body2"
              color="#212121"
              style={{ paddingTop: 7 }}
            >
              {applicantT("applicantTable.content")}: {initialValues.content}
            </Typography>
          </CardContent>
        </Grid>
        <Grid item xs={12} md={7}>
          <Stack spacing={2} py={3}>
            <TextField
              id="outlined-multiline-static"
              label={applicantT("form_Applicant.responsed_content")}
              multiline
              focused
              color="secondary"
              required
              name="responsed_content"
              rows={4}
              placeholder={applicantT("form_Applicant.placeholder")}
              value={formik.values?.responsed_content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                !!commonT(touchedErrors?.responsed_content, {
                  name: "responsed_content",
                })
              }
              helperText={commonT(touchedErrors?.responsed_content, {
                name: applicantT("form_Applicant.responsed_content"),
              })}
            />
          </Stack>
        </Grid>
      </Grid>
    </FormLayout>
  );
};

export default memo(Form);

export const validationSchema = Yup.object().shape({
  responsed_content: Yup.string().trim().required("form.error.required"),
});

const sxConfig = {
  padding: '10px',
  input: {
    height: 56,
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};
