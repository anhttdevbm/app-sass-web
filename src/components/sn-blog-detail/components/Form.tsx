import { Autocomplete, Button, Checkbox, FormControlLabel, Grid, Stack, TextField } from "@mui/material";
import { DialogLayoutProps } from "components/DialogLayout";
import FormLayout from "components/FormLayout";
import { Input, Upload } from "components/shared";
import { DataAction } from "constant/enums";
import { ACCESS_TOKEN_STORAGE_KEY, AN_ERROR_TRY_AGAIN, NS_BLOG, NS_COMMON } from "constant/index";
import { FormikErrors, useFormik } from "formik";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useAuth, useSnackbar } from "store/app/selectors";
import { BlogData, BlogFormData, TagData } from "store/blog/actions";
import { getMessageErrorByAPI } from "utils/index";
import * as Yup from "yup";
import { UnprivilegedEditor } from "react-quill";
import UploadFile from "components/shared/UploadFile";
import { useCategoryBlog } from "store/blog-category/selectors";
import SelectMultiple from "./SelectMultiple";
import EditorView from "./EditorView";
import { useBlogs } from "store/blog/selectors";
import SelectCategoriescomplete from "./SelectCategories";
import slugify from 'slugify';

type FormProps = {
  initialValues: BlogFormData;
  type: DataAction;
  onSubmit: (values: BlogFormData) => Promise<any>;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

const Form = (props: FormProps) => {
  const { initialValues, type, onSubmit: onSubmitProps, ...rest } = props;
  const { onAddSnackbar } = useSnackbar();
  const blogT = useTranslations(NS_BLOG);
  const commonT = useTranslations(NS_COMMON);
  const editorRef = useRef<UnprivilegedEditor | undefined>();
  const [content, setContent] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [data, setData] = useState<any | undefined>(undefined);
  const blogFormTranslatePrefix = "blogForm";
  const [backgroundChanged, setBackgroundChanged] = useState(false);
  const { listBlogTag,onGetListTag:onGetTagsOptions } = useBlogs();
  const [tags, setTags] = useState<TagData[]>([]);
  const {
    items,
    onGetOptions: onGetCategoryOptions,
  } = useCategoryBlog();
  useEffect(() => {
    onGetCategoryOptions({ pageIndex: 1, pageSize: 50 });
  }, [onGetCategoryOptions]);
  
  useEffect(() => {
    setTags(listBlogTag);
  }, [onGetTagsOptions, listBlogTag]);

  // set value
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

  const handleChangeName = (event) => {
    const nameValue = event.target.value;
    const slugValue = slugify(nameValue, {
      lower: true,
      remove: /[*+~.()'"!:@]/g, // Loại bỏ các ký tự đặc biệt không mong muốn
    });
  
    formik.setFieldValue("title", nameValue);
    formik.setFieldValue("slug", slugValue);
  };

  const onSelect = (data) => {
    console.log("Selected Data:", data);
    formik.setFieldValue("tag", data.map((item) => item.tag));
  };

  const onEnter = (value) => {
    console.log("Entered Value:", value);
    if (!value) return;

    const tags = formik.values?.tag ?? [];
    const isExisted = listBlogTag.find((item) => item.tag === value);

    if (isExisted) {
      onSelect([...tags, isExisted]);
    } else {
      const newTagOption = {
        tag: value,
      };
      setTags((prevListBlogTag) => [...prevListBlogTag, newTagOption]);
      onSelect([...tags, newTagOption]);
    }
  };


  const onChangeField = (name: string, newValue?: any) => {
    formik.setFieldValue(name, newValue);
    console.log(name);
    if (name === "backgroundUpload") {
      console.log("vào đây nhé");
      setBackgroundChanged(true);
    }
  };
  const onSelectCategory = (data) => {
    const mappingData = data.map((item) => item.id);
    formik.setFieldValue("category", mappingData);
  };
  const onChangeContent = (value: string, delta, _, editor: UnprivilegedEditor) => {
    const isEmpty = value === "<p><br></p>";
    setContent(isEmpty ? "" : value);
    editorRef.current = editor;
    formik.setFieldValue("content", isEmpty ? "" : value);
  };

  const onChangeAttactment = (files: File[], data: string[]) => {
    setFiles(files);
    // Update listDataFile

    // Update the value of attachments in formik
    formik.setFieldValue("attachments", data);
    formik.setFieldValue("attachmentsUpload", files);
  };


  const onSubmit = async (values: BlogFormData) => {
    try {

      if (backgroundChanged) {
        console.log(values.background);
      } else {
        values.backgroundUpload = undefined;
      }
      const newItem = await onSubmitProps(values);
      if (newItem) {
        onAddSnackbar(
          blogT("blogForm.notification.success", { label }),
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
    enableReinitialize: true,
    validationSchema,
    onSubmit,
  });


  const touchedErrors = useMemo(() => {
    return Object.entries(formik.errors).reduce(
      (out: FormikErrors<BlogFormData>, [key, error]) => {
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
        minWidth: { xs: "calc(100vw -24px)", sm: 1000 },
        maxWidth: { xs: "calc(100vw -24px)", sm: 700 },
        maxHeight: "calc(calc(var(--vh, 1vh) * 100) - 24px)",
      }}
      label={`${label} ${blogT("blogForm.key")}`}
      submitting={formik.isSubmitting}
      disabled={disabled}
      onSubmit={formik.handleSubmit}
      {...rest}
    >
      <Grid container spacing={2}>
        <Grid item xs={5} marginTop={1}>
          <Stack>
            <Stack style={{ marginBottom: 5 }}>
              <Input
                fullWidth
                name="title"
                required
                onChange={(e) => {
                  handleChangeName(e);
                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
                value={formik.values?.title}
                rootSx={sxConfig.input}
                error={commonT(touchedErrors?.title, {
                  name: blogT("blogForm.title"),
                }) ? 'error' : undefined}
                helperText={commonT(touchedErrors?.title, {
                  name: blogT("blogForm.title"),
                })}
                title={blogT(`${blogFormTranslatePrefix}.title`)}
              />
            </Stack>
            <Stack style={{ marginBottom: 4 }}>
              <Input
                fullWidth
                name="slug"
                required
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values?.slug}
                rootSx={sxConfig.input}
                title={blogT(`${blogFormTranslatePrefix}.slug`)}
                error={commonT(touchedErrors?.slug, {
                  name: blogT("blogForm.slug"),
                }) ? 'error' : undefined}
                helperText={commonT(touchedErrors?.slug, {
                  name: blogT("blogForm.slug"),
                })}
              />
            </Stack>
            <Stack>
              <SelectCategoriescomplete items={items} label={blogT("blogForm.category")}
                sx={sxConfig}
                onSelect={(e, data) => onSelectCategory(data)}
                value={formik.values.category?.map((tag) => ({
                  id : tag
                })) }
              />
            </Stack>
            <Stack style={{ marginBottom: 4, marginTop: 2 }}>
              <SelectMultiple
                limitTags={3}
                options={tags}
                onSelect={(e, data) => onSelect(data)}
                onEnter={onEnter}
                label={blogT("blogForm.tag")}
                sx={sxConfig}
                value={formik.values.tag?.map((tag) => ({ tag }))}
              />
            </Stack>
            <UploadFile
              title={blogT("blogForm.background")}
              name="backgroundUpload"
              value={formik.values?.backgroundUpload}
              onChange={onChangeField}
            />
          </Stack>
        </Grid>
        <Grid item xs={7} marginTop={1}>
          <Stack style={{ marginBottom: 4 }}>
            <Input
              fullWidth
              name="short_description"
              required
              onChange={(e) => {
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              value={formik.values?.short_description}
              rootSx={sxConfig.input}
              error={commonT(touchedErrors?.short_description, {
                name: blogT("blogForm.short_description"),
              }) ? 'error' : undefined}
              helperText={commonT(touchedErrors?.short_description, {
                name: blogT("blogForm.short_description"),
              })}
              title={blogT(`${blogFormTranslatePrefix}.short_description`)}
            />
          </Stack>
          <Stack height={300}>
            <EditorView
              hasAttachment
              placeholder={blogT("blogForm.content")}
              onChange={onChangeContent}
              onChangeFiles={onChangeAttactment}
              value={formik.values.content}
              files={formik.values.attachmentsUpload}
              dataFile={formik.values.attachments as string[]}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mt={2}
              ></Stack>
            </EditorView>
          </Stack>
        </Grid>
      </Grid>
    </FormLayout>
  );
};

export default memo(Form);

const sxConfig = {
  input: {
    height: 56,
  },
};
export const validationSchema = Yup.object().shape({
  title: Yup.string().required('form.error.required'),
  slug: Yup.string().required('form.error.required'),
  content: Yup.string().required('form.error.required'),
  category: Yup.array()
    .of(Yup.string())
    .min(1, 'form.error.required'),
  tag: Yup.array().of(Yup.string()),
  short_description: Yup.string().required("form.error.required"),
});
