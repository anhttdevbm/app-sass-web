import {
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { DataAction } from "constant/enums";
import { DialogLayoutProps } from "components/DialogLayout";
import { memo } from "react";
import FormLayout from "components/FormLayout";
import { NS_CONTENTS, NS_COMMON, AN_ERROR_TRY_AGAIN } from "constant/index";
import { useTranslations } from "next-intl";
import { FormikErrors, useFormik } from "formik";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import Box from '@mui/material/Box';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { ChangeEvent, useMemo, useRef, useState, useEffect } from "react";
import UploadFile from "./UploadFile";
import { PromoteData } from "store/content/reducer";

type FormProps = {
  initialValues: PromoteData;
  type: DataAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: PromoteData) => Promise<any>;
  titleForm: string;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

const Form = (props: FormProps) => {
  const contentT = useTranslations(NS_CONTENTS);
  const commonT = useTranslations(NS_COMMON);
  const { initialValues, type, titleForm, onSubmit: onSubmitProps, ...rest } = props;
  const { onAddSnackbar } = useSnackbar();

  const onSubmit = async (values: PromoteData) => {
    try {
      const items = await onSubmitProps(values);
      
      if (items) {
        onAddSnackbar(
          contentT("home.notification.updateSuccess"),
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
    onSubmit,
  });

  const handleChangeTitle = (event, index) => {
    const nameValue = event.target.value;    
    formik.setFieldValue(`items[${index}].title`, nameValue)
  };
  
  const handleChangeLink = (event, index, name) => {
    const nameValue = event.target.value;    
    formik.setFieldValue(`items[${index}].${name}`, nameValue)
  };

  const handleChangeDescription = (event, index) => {
    const nameValue = event.target.value;    
    formik.setFieldValue(`items[${index}].description`, nameValue)
  };

  const onChangeField = (name: string, newValue?: File | string, index?: number) => {
    if (typeof index === 'undefined') {
      formik.setFieldValue(`${name}`, newValue);
    } else {
      formik.setFieldValue(`items[${index}].${name}`, newValue);
    }
  };

  return (
    <>
      <FormLayout
        sx={{
          minWidth: { xs: "calc(100vw - 24px)", lg: 900 },
          maxWidth: { xs: "calc(100vw - 24px)", sm: 1200 },
          minHeight: "auto",
          color: "black",
        }}
        label={props.titleForm}
        onSubmit={formik.handleSubmit}
        submitting={formik.isSubmitting}
        {...rest}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        </Box>
        <Grid
          container 
          spacing={3} 
          sx={{
            py: "10px"
          }}
        >
          <Grid item xs={12} md={12}>
            <UploadFile
              title={contentT("tableList.image")}
              name="imageUpload"
              value={formik.values?.imageUpload ? formik.values?.imageUpload : formik.values?.image?.link}
              onChange={onChangeField}
              />
            </Grid>
          </Grid>
        { initialValues.items.map((item, index) => {
          return (
            <Grid
              key={index}
              container 
              spacing={3} 
              sx={{
                py: "10px"
              }}>
              <Grid item xs={12} md={12}>
                <TextField
                  id="title-"
                  label={contentT("tableList.title")}
                  fullWidth
                  size="small"
                  focused
                  color="secondary"
                  name={`${initialValues.items[index].title}`}
                  value={`${formik.values.items[index].title}`}
                  onChange={(e) => {
                    handleChangeTitle(e, index);
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="title-"
                  label={contentT("tableList.link")}
                  fullWidth
                  size="small"
                  focused
                  color="secondary"
                  name={`${initialValues.items[index].linkCTA}`}
                  value={`${formik.values.items[index].linkCTA}`}
                  onChange={(e) => {
                    handleChangeLink(e, index, 'linkCTA');
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="title-"
                  label={contentT("tableList.link")}
                  fullWidth
                  size="small"
                  focused
                  color="secondary"
                  name={`${initialValues.items[index].linkCTA2}`}
                  value={`${formik.values.items[index].linkCTA2}`}
                  onChange={(e) => {
                    handleChangeLink(e, index, 'linkCTA2');
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  id="title-"
                  label={contentT("tableList.description")}
                  fullWidth
                  size="small"
                  focused
                  multiline
                  rows={8}
                  color="secondary"
                  name={`${initialValues.items[index].description}`}
                  value={`${formik.values.items[index].description}`}
                  onChange={(e) => {
                    handleChangeDescription(e, index);
                    formik.handleChange(e);
                  }}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <UploadFile
                  title={contentT("tableList.image")}
                  name="imageUpload"
                  value={formik.values.items[index]?.imageUpload ? formik.values.items[index]?.imageUpload : formik.values.items[index]?.image?.link}
                  index={index}
                  onChange={onChangeField}
                  />
              </Grid>
            </Grid>
          )
        }) }
      </FormLayout>
    </>
  )
}

export default memo(Form);