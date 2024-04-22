import {
  CardContent,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DialogLayoutProps } from "components/DialogLayout";
import FormLayout from "components/FormLayout";
import { AN_ERROR_TRY_AGAIN, NS_COMMON, NS_CONTENTS } from "constant/index";
import { FormikErrors, useFormik } from "formik";
import React, { memo, useEffect, useMemo } from "react";
import { useSnackbar } from "store/app/selectors";
import * as Yup from "yup";
import { getMessageErrorByAPI } from "utils/index";
import { DataAction } from "constant/enums";
import { useTranslations } from "next-intl";
import { StartMemberData } from "store/content/reducer";
import UploadFile from "components/shared/UploadFile";

type FormProps = {
  initialValues: StartMemberData;
  type: DataAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: StartMemberData) => Promise<any>;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

const Form = (props: FormProps) => {
  const { initialValues, type, onSubmit: onSubmitProps, ...rest } = props;
  const { onAddSnackbar } = useSnackbar();
  const contentT = useTranslations(NS_CONTENTS);
  const commonT = useTranslations(NS_COMMON);

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

  const onSubmit = async (values: StartMemberData) => {    
    try {
      const newItem = await onSubmitProps(values);
      if (newItem) {
        onAddSnackbar(
          contentT("content_success.notification.success_responsed", { label }),
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
      (out: FormikErrors<StartMemberData>, [key, error]) => {
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

  const handleChangeName = (event) => {
    const nameValue = event.target.value;
    formik.setFieldValue("name", nameValue);
  };

  const handleChangeExperience = (event) => {
    const nameValue = event.target.value;
    formik.setFieldValue("work_experience", nameValue);
  };

  const handleChangeCollege = (event) => {
    const nameValue = event.target.value;
    formik.setFieldValue("college", nameValue);
  };

  const handleChangeEmail = (event) => {
    const nameValue = event.target.value;
    formik.setFieldValue("email", nameValue);
  };

  const handleChangePosition = (event) => {
    const nameValue = event.target.value;
    formik.setFieldValue("position", nameValue);
  };

  const handleChangeLink = (event) => {
    const nameValue = event.target.value;
    formik.setFieldValue("social_link", nameValue);
  };

  const handleChangeDescription = (event) => {
    const nameValue = event.target.value;
    formik.setFieldValue("desciption", nameValue);
  };

  const handleChangeDetail = (event) => {
    const nameValue = event.target.value;
    formik.setFieldValue("detail", nameValue);
  };

  const onChangeField = (name: string, newValue?: any) => {    
    formik.setFieldValue(name, newValue);
  };

  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", lg: 800 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 1200 },
        minHeight: "auto",
        color: "black",
        // overflow: "hidden",
      }}
      label={`${label} ${contentT("aboutUs.title_form")}`}
      onSubmit={formik.handleSubmit}
      disabled={disabled}
      submitting={formik.isSubmitting}
      {...rest}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}></Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="outlined-required"
            label={contentT("aboutUs.startTeamMemberTable.name")}
            fullWidth
            size="small"
            focused
            color="secondary"
            name="name"
            onChange={(e) => {
              handleChangeName(e);
              formik.handleChange(e); // Đảm bảo formik cũng nhận được sự thay đổi
            }}
            onBlur={formik.handleBlur}
            value={formik.values?.name}
            error={
              !!commonT(touchedErrors?.name, {
                name: "name",
              })
            }
            helperText={commonT(touchedErrors?.name, {
              name: contentT("aboutUs.startTeamMemberTable.name"),
            })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="outlined-required"
            label={contentT("aboutUs.startTeamMemberTable.work_experience")}
            fullWidth
            size="small"
            focused
            color="secondary"
            name="work_experience"
            onChange={(e) => {
              handleChangeExperience(e);
              formik.handleChange(e); // Đảm bảo formik cũng nhận được sự thay đổi
            }}
            onBlur={formik.handleBlur}
            value={formik.values?.work_experience}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="outlined-required"
            label={contentT("aboutUs.startTeamMemberTable.college")}
            fullWidth
            size="small"
            focused
            color="secondary"
            name="college"
            onChange={(e) => {
              handleChangeCollege(e);
              formik.handleChange(e); // Đảm bảo formik cũng nhận được sự thay đổi
            }}
            onBlur={formik.handleBlur}
            value={formik.values?.college}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="outlined-required"
            label={contentT("aboutUs.startTeamMemberTable.email")}
            fullWidth
            size="small"
            focused
            color="secondary"
            name="email"
            onChange={(e) => {
              handleChangeEmail(e);
              formik.handleChange(e); // Đảm bảo formik cũng nhận được sự thay đổi
            }}
            onBlur={formik.handleBlur}
            value={formik.values?.email}
            error={
              !!commonT(touchedErrors?.email, {
                name: "email",
              })
            }
            helperText={commonT(touchedErrors?.email, {
              name: contentT("aboutUs.startTeamMemberTable.email"),
            })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="outlined-required"
            label={contentT("aboutUs.startTeamMemberTable.position")}
            fullWidth
            size="small"
            focused
            color="secondary"
            name="position"
            onChange={(e) => {
              handleChangePosition(e);
              formik.handleChange(e); // Đảm bảo formik cũng nhận được sự thay đổi
            }}
            onBlur={formik.handleBlur}
            value={formik.values?.position}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="outlined-required"
            label={contentT("aboutUs.startTeamMemberTable.social_link")}
            fullWidth
            size="small"
            focused
            color="secondary"
            name="social_link"
            onChange={(e) => {
              handleChangeLink(e);
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            value={formik.values?.social_link}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="outlined-required"
            label={contentT("aboutUs.startTeamMemberTable.description")}
            fullWidth
            size="small"
            focused
            color="secondary"
            name="description"
            multiline
            rows={9}
            onChange={(e) => {
              handleChangeDescription(e);
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            value={formik.values?.description}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <UploadFile
            title={contentT("aboutUs.startTeamMemberTable.avatar")}
            name="avatarUpload"
            value={
              type == DataAction.UPDATE 
                ? formik.values?.avatarUpload ? formik.values?.avatarUpload : formik.values?.avatar.link
                : formik.values?.avatarUpload
            }
            onChange={onChangeField}
          />
          
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            id="outlined-required"
            label={contentT("aboutUs.startTeamMemberTable.detail")}
            fullWidth
            size="small"
            focused
            color="secondary"
            name="detail"
            multiline
            rows={4}
            onChange={(e) => {
              handleChangeDetail(e);
              formik.handleChange(e); // Đảm bảo formik cũng nhận được sự thay đổi
            }}
            onBlur={formik.handleBlur}
            value={formik.values?.detail}
          />
        </Grid>
      </Grid>
    </FormLayout>
  );
};

export default memo(Form);

export const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("form.error.required"),
  email: Yup.string().trim().required("form.error.required"),
  // avatarUpload?: Yup.mixed().required("form.error.required"),
});
