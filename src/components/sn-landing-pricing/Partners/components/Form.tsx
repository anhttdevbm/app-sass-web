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
import { ArticleData } from "store/content/reducer";

type FormProps = {
  initialValues: ArticleData[];
  type: DataAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: ArticleData[]) => Promise<any>;
  titleForm: string;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

const Form = (props: FormProps) => {
  const contentT = useTranslations(NS_CONTENTS);
  const commonT = useTranslations(NS_COMMON);
  const { initialValues, type, titleForm, onSubmit: onSubmitProps, ...rest } = props;
  const { onAddSnackbar } = useSnackbar();
  const [tab, setTab] = useState('1');

  const onSubmit = async (values: ArticleData[]) => {
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

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const handleChangeName = (event, index) => {
    const nameValue = event.target.value;    
    formik.setFieldValue(`[${index}].name`, nameValue)
  };

  const onChangeField = (name: string, newValue?: File | string, index?: number) => {
    formik.setFieldValue(`[${index}].${name}`, newValue);
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
        { initialValues.map((item, index) => {
          return (
              <Grid
                key={index}
                container 
                spacing={3} 
                sx={{
                  py: "10px"
                }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="title-"
                    label={contentT("tableList.name")}
                    fullWidth
                    size="small"
                    focused
                    color="secondary"
                    name={`${initialValues[index].name}`}
                    value={`${formik.values[index].name}`}
                    onChange={(e) => {
                      handleChangeName(e, index);
                      formik.handleChange(e);
                    }}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <UploadFile
                    title={contentT("tableList.logo")}
                    name="logoUpload"
                    value={formik.values[index]?.logoUpload ? formik.values[index]?.logoUpload : formik.values[index]?.logo?.link}
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