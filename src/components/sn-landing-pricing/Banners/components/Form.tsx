import { ExploreData } from "store/content/reducer";
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
import { ContentData } from "store/content/reducer";

type FormProps = {
  initialValues: ContentData;
  type: DataAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: ContentData) => Promise<any>;
  titleForm: string;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

const Form = (props: FormProps) => {
  const contentT = useTranslations(NS_CONTENTS);
  const commonT = useTranslations(NS_COMMON);
  const { initialValues, type, titleForm, onSubmit: onSubmitProps, ...rest } = props;
  const { onAddSnackbar } = useSnackbar();

  const onSubmit = async (values: ContentData) => {
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

  const handleChangeTitle = (event) => {
    const nameValue = event.target.value;    
    formik.setFieldValue("title", nameValue)
  };

  const handleChangeDescription = (event) => {
    const nameValue = event.target.value;    
    formik.setFieldValue("description", nameValue)
  };

  const handleChangeLink = (event) => {
    const nameValue = event.target.value;    
    formik.setFieldValue("linkCTA", nameValue)
  };

  const onChangeField = (name: string, newValue?: File | string) => {    
    formik.setFieldValue(`${name}`, newValue);
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
              }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="title-"
                    label={contentT("tableList.title")}
                    fullWidth
                    size="small"
                    focused
                    color="secondary"
                    name={`${initialValues.title}`}
                    value={`${formik.values.title}`}
                    onChange={(e) => {
                      handleChangeTitle(e);
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
                      name={`${initialValues.linkCTA}`}
                      value={`${formik.values.linkCTA}`}
                      onChange={(e) => {
                        handleChangeLink(e);
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
                    multiline
                    rows={8}
                    focused
                    color="secondary"
                    name={`${initialValues.description}`}
                    value={`${formik.values.description}`}
                    onChange={(e) => {
                      handleChangeDescription(e);
                      formik.handleChange(e);
                    }}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <UploadFile
                    title={contentT("tableList.image")}
                    name="imageUpload"
                    value={formik.values?.imageUpload ? formik.values?.imageUpload : formik.values?.image?.link}
                    onChange={onChangeField}
                    />
                </Grid>
            </Grid>
      </FormLayout>
    </>
  )
}

export default memo(Form);