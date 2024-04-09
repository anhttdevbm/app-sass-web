import {
  Grid,
  Stack,
  TextField,
  Typography,
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
import { TagData, UnlockValueData } from "store/content/reducer";
import SelectTagMultiple from "./SelectMultiple";

type FormProps = {
  initialValues: UnlockValueData[];
  type: DataAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: UnlockValueData[]) => Promise<any>;
  titleForm: string;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

type FeatureData = {
  feature: string[]
}

interface UnlockValueFormData extends UnlockValueData {
  items: any | TagData[],
}

const Form = (props: FormProps) => {
  const contentT = useTranslations(NS_CONTENTS);
  const commonT = useTranslations(NS_COMMON);
  const { initialValues, type, titleForm, onSubmit: onSubmitProps, ...rest } = props;
  const [features, setFeatures] = useState<UnlockValueFormData[]>([]);
  const { onAddSnackbar } = useSnackbar();

  const onSubmit = async (values: UnlockValueData[]) => {
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

  const listFeatures = useMemo(() => {
    const features =  initialValues.map((item) => {
      const tags = item.features.map((tag) => ({ tag }))
      return {
        items: tags
      }
    })
    return features
  }, [initialValues])

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit,
  });

  const handleChangeName = (event, index) => {
    const nameValue = event.target.value;    
    formik.setFieldValue(`[${index}].name`, nameValue)
  };

  const handleChangeTag = (event, index) => {
    const nameValue = event.target.value;    
    formik.setFieldValue(`[${index}].tag`, nameValue)
  };

  const handleChangeMonthly = (event, index) => {
    const nameValue = event.target.value;    
    formik.setFieldValue(`[${index}].monthly`, nameValue)
  };

  const handleChangeYearly = (event, index) => {
    const nameValue = event.target.value;    
    formik.setFieldValue(`[${index}].yearly`, nameValue)
  };

  const handleChangeDescription = (event, index) => {
    const nameValue = event.target.value;    
    formik.setFieldValue(`[${index}].description`, nameValue)
  };

  const onSelect = (data, index) => {           
    const uniqueData = Array.from(new Set(data.map((item) => item.tag))).map(
      (tag) => ({ tag }),
    );

    formik.setFieldValue(
      `[${index}].features`,
      uniqueData.map(item => item.tag)
    );
  };

  const onEnter = (value, index) => {    
    if (!value) return;
    if (features == null || features.length == 0) {
      setFeatures(listFeatures as UnlockValueFormData[]);
    }
    const itemValues = formik.values[index].features ?? [];
    
    const isExisted = itemValues.find((item) => item == value);

    if (isExisted) {
      const updatedTags = itemValues.map((tag) => ({ tag }));
      onSelect([...updatedTags, { tag: value }], index);
      
    } else {      
      const newTagOption = {
        tag: value,
      };
      // setFeatures((prevListBlogTag) => [...prevListBlogTag, newTagOption]);
      setFeatures((prevListFeature) => {
        const newListFeature = [...prevListFeature]
        return newListFeature.map((e, k) => {
          if (k == index) {
            e.items = [...e.items, newTagOption]
          }
          return {
            ...e
          }
        })
      })
      const updatedTags = itemValues.map((tag) => ({ tag }));
      onSelect([...updatedTags, { tag: value }], index);
    }
  };

  const onDelete = (data, index) => {        
    const uniqueData = Array.from(new Set(data.map((item) => item.tag))).map(
      (tag) => ({ tag }),
    );

    formik.setFieldValue(
      `[${index}].features`,
      uniqueData.map(item => item.tag)
    );
  }

  useEffect(() => {
    setFeatures(listFeatures as UnlockValueFormData[])
  }, [listFeatures])

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
                sx={{ py: '20px' }}
              >
                <Grid item xs={12} md={12}>
                  <Typography variant="h4">
                    {contentT("pricing.unlock_unbeatable_value")} {`${index + 1}`}
                  </Typography>
                </Grid>
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
                  <TextField
                    id="title-"
                    label={contentT("tableList.tag")}
                    fullWidth
                    size="small"
                    focused
                    color="secondary"
                    name={`${initialValues[index].tag}`}
                    value={`${formik.values[index].tag}`}
                    onChange={(e) => {
                      handleChangeTag(e, index);
                      formik.handleChange(e);
                    }}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="title-"
                    label={contentT("tableList.monthly")}
                    fullWidth
                    size="small"
                    focused
                    color="secondary"
                    name={`${initialValues[index].monthly}`}
                    value={`${formik.values[index].monthly}`}
                    onChange={(e) => {
                      handleChangeMonthly(e, index);
                      formik.handleChange(e);
                    }}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="title-"
                    label={contentT("tableList.yearly")}
                    fullWidth
                    size="small"
                    focused
                    color="secondary"
                    name={`${initialValues[index].yearly}`}
                    value={`${formik.values[index].yearly}`}
                    onChange={(e) => {
                      handleChangeYearly(e, index);
                      formik.handleChange(e);
                    }}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <SelectTagMultiple
                    items={
                      features[index]?.items.length > 0 && features[index]?.items !== undefined ? features[index]?.items : listFeatures[index]?.items
                    }
                    label={contentT("tableList.features")}
                    onSelect={(e, data, index) => onSelect(data, index)}
                    onEnter={onEnter}
                    handleDelete={(data, index) => onDelete(data, index)}
                    indexArray={index}
                    value={formik.values[index].features?.map((tag) => ({ tag }))}
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
                    rows={4}
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