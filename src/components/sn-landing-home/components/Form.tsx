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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { ChangeEvent, useMemo, useRef, useState, useEffect } from "react";
import UploadFile from "components/shared/UploadFile";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

type FormProps = {
  initialValues: ExploreData[];
  type: DataAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: ExploreData[]) => Promise<any>;
  titleForm: string;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

const Form = (props: FormProps) => {
  const contentT = useTranslations(NS_CONTENTS);
  const commonT = useTranslations(NS_COMMON);
  const { initialValues, type, titleForm, onSubmit: onSubmitProps, ...rest } = props;
  const { onAddSnackbar } = useSnackbar();
  const [tab, setTab] = useState('1');

  const onSubmit = async (values: ExploreData[]) => {
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

  const handleChangeTitle = (event, index) => {
    const nameValue = event.target.value;    
    formik.setFieldValue(`[${index}].title`, nameValue)
  };

  const handleChangeTabName = (event, index) => {
    const nameValue = event.target.value;    
    formik.setFieldValue(`[${index}].tab_name`, nameValue)
  };

  const handleChangeLink = (event, index) => {
    const nameValue = event.target.value;    
    formik.setFieldValue(`[${index}].linkCTA`, nameValue)
  };

  const handleChangeDescription = (event, index) => {
    const nameValue = event.target.value;    
    formik.setFieldValue(`[${index}].description`, nameValue)
  };

  const onChangeField = (name: string, newValue?: File | string, index?: number) => {
    formik.setFieldValue(`[${index}].${name}`, newValue);
  };

  const tabLists = useMemo(() => {
    if (!props.initialValues.length) return []
    return props.initialValues.map(e => e.tab_name)
  }, [props.initialValues])

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
        <TabContext value={tab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tab}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="basic tabs example"
            >
              { tabLists.map((item , index) => {
                return (
                  <Tab sx={{ color: "grey.400", fontSize: 13 }} key={`${index+1}`} label={item} value={`${index+1}`} />
                )
              }) }
            </Tabs>
          </Box>
          { initialValues.map((item, index) => {
            return (
              <TabPanel value={`${index + 1}`} key={index}>
                <Grid container spacing={3}>
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
                      id="outlined-required"
                      label={contentT("tableList.tab_name")}
                      fullWidth
                      size="small"
                      focused
                      color="secondary"
                      name={`${initialValues[index].tab_name}`}
                      value={`${formik.values[index].tab_name}`}
                      onChange={(e) => {
                        handleChangeTabName(e, index);
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
                      name={`${initialValues[index].linkCTA}`}
                      value={`${formik.values[index].linkCTA}`}
                      onChange={(e) => {
                        handleChangeLink(e, index);
                        formik.handleChange(e);
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <UploadFile
                      title={contentT("tableList.image")}
                      name="imageUpload"
                      value={formik.values[index]?.imageUpload ? formik.values[index]?.imageUpload : formik.values[index]?.image?.link}
                      index={index}
                      onChange={onChangeField}
                      />
                  </Grid>
                  <Grid item xs={12} md={12}>
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
              </TabPanel>
            )
          }) }
        </TabContext>
      </FormLayout>
    </>
  )
}

export default memo(Form);