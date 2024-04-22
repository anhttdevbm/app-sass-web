import { ContentData } from "store/content/reducer";
import {
  Grid,
  Stack,
  TextField,
  Typography
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

type FormProps = {
  initialValues: ContentData[];
  type: DataAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: ContentData[]) => Promise<any>;
  titleForm: string;
  name: string,

} & Omit<DialogLayoutProps, "children" | "onSubmit">;

const Form = (props: FormProps) => {
  const contentT = useTranslations(NS_CONTENTS);
  const commonT = useTranslations(NS_COMMON);
  const { initialValues, type, titleForm, name, onSubmit: onSubmitProps, ...rest } = props;
  const { onAddSnackbar } = useSnackbar();

  const onSubmit = async (values: ContentData[]) => {
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
    formik.setFieldValue(`[${index}].title`, nameValue)
  };

  const handleChangeDescription = (event, index) => {
    const nameValue = event.target.value;    
    formik.setFieldValue(`[${index}].description`, nameValue)
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
          { initialValues.map((item, index) => {
            return (
              <Grid
                container 
                spacing={2}
                sx={{
                  py: "10px"
                }}
                key={index}
              >
                <Grid item xs={12} md={12}>
                  <Typography variant="h3" component="h2">
                    {`${props.name} ${index + 1}`}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="title-"
                    label={contentT("tableList.title")}
                    fullWidth
                    size="small"
                    focused
                    color="secondary"
                    name={`${initialValues[index].title}`}
                    value={`${formik.values[index].title}`}
                    onChange={(e) => {
                      handleChangeTitle(e, index);
                      formik.handleChange(e);
                    }}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="outlined-multiline-static"
                    label={contentT("tableList.description")}
                    fullWidth
                    multiline
                    size="small"
                    rows={4}
                    focused
                    color="secondary"
                    name={`${initialValues[index].description}`}
                    value={`${formik.values[index].description}`}
                    onChange={(e) => {
                      handleChangeDescription(e, index);
                      formik.handleChange(e);
                    }}
                    onBlur={formik.handleBlur}
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