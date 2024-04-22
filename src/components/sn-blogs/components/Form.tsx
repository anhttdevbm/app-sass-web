import {
  Autocomplete,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
} from "@mui/material";
import { DialogLayoutProps } from "components/DialogLayout";
import FormLayout from "components/FormLayout";
import { Input, Upload } from "components/shared";
import { DataAction } from "constant/enums";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  AN_ERROR_TRY_AGAIN,
  NS_BLOG,
  NS_COMMON,
} from "constant/index";
import { FormikErrors, useFormik } from "formik";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useAuth, useSnackbar } from "store/app/selectors";
import { BlogData, BlogFormData, TagData } from "store/blog/actions";
import { getMessageErrorByAPI } from "utils/index";
import * as Yup from "yup";
import { UnprivilegedEditor } from "react-quill";
import UploadFile from "components/shared/UploadFile";
import SelectMultiple from "./SelectMultiple";
import { useCategoryBlog } from "store/blog-category/selectors";
import CustomAutocomplete from "./SelectCategories";
import Editor from "./Editor";
import { useBlogs } from "store/blog/selectors";
import slugify from "slugify";
import SelectTagMultiple from "./SelectMultiple";

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
  const { listBlogTag, onGetListTag } = useBlogs();
  const [content, setContent] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [data, setData] = useState<any | undefined>(undefined);
  const [tags, setTags] = useState<TagData[]>([]);
  const blogFormTranslatePrefix = "blogForm";
  const { items, onGetOptions: onGetCategoryOptions } = useCategoryBlog();

  useEffect(() => {
    onGetListTag();
    onGetCategoryOptions({ pageIndex: 1, pageSize: 50 });
  }, [onGetCategoryOptions, onGetListTag]);

  const onSubmit = async (values: BlogFormData) => {
    try {
      const newItem = await onSubmitProps(formik.values);
      if (newItem) {
        onAddSnackbar(
          blogT("blogForm.notification.success", { label }),
          "success",
        );
        props.onClose();
      } else {
        onAddSnackbar(blogT(AN_ERROR_TRY_AGAIN), "error");
      }
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      // console.log(error)
    }
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  // set value
  const onChangeBackGround = (event) => {
    const selectedFile = event.target.files[0];
    formik.setFieldValue("background", selectedFile);
  };
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    // Your custom logic with the file
    if (selectedFile) {
      alert(
        `Selected File: ${selectedFile.name}, Size: ${selectedFile.size} bytes`,
      );
    } else {
      alert("No file selected");
    }

    // If you want to update formik values
    formik.setFieldValue("background", selectedFile);

    // Or if you want to see the updated formik values
    alert(JSON.stringify(formik.values));
  };

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
    console.log(data);
    
    const uniqueData = Array.from(new Set(data.map((item) => item.tag))).map(
      (tag) => ({ tag }),
    );
    formik.setFieldValue(
      "tag",
      uniqueData.map((item) => item.tag),
    );
  };
  const onSelectCategory = (data) => {
    const mappingData = data.map((item) => item.id);
    formik.setFieldValue("category", mappingData);
  };

  const onEnter = (value) => {
    if (!value) return;
    if (tags == null || tags.length == 0) {
      setTags(listBlogTag);
    }
    const itemValues = formik.values?.tag ?? [];
    console.log(itemValues);
    
    const isExisted = itemValues.find((item) => item == value);
    

    if (isExisted) {
      const updatedTags = itemValues.map((tag) => ({ tag }));
      onSelect([...updatedTags, { tag: value }]);
    } else {
      const newTagOption = {
        tag: value,
      };
      setTags((prevListBlogTag) => [...prevListBlogTag, newTagOption]);
      const updatedTags = itemValues.map((tag) => ({ tag }));
      onSelect([...updatedTags, { tag: value }]);
    }
  };

  const onChangeField = (name: string, newValue?: any) => {    
    formik.setFieldValue(name, newValue);
    setData(newValue);
  };

  const onChangeContent = (
    value: string,
    delta,
    _,
    editor: UnprivilegedEditor,
  ) => {
    const isEmpty = value === "<p><br></p>";
    setContent(isEmpty ? "" : value);
    editorRef.current = editor;
    formik.setFieldValue("content", isEmpty ? "" : value);
  };

  const onChangeAttactment = (files: File[], data: string[]) => {
    // console.log(data);
    setFiles(files);
    // formik.setFieldValue("attachmentsUpload", fileLoaded);
    formik.setFieldValue("attachments", data);
  };
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
                error={
                  commonT(touchedErrors?.title, {
                    name: blogT("blogForm.title"),
                  })
                    ? "error"
                    : undefined
                }
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
                error={
                  commonT(touchedErrors?.slug, {
                    name: blogT("blogForm.slug"),
                  })
                    ? "error"
                    : undefined
                }
                helperText={commonT(touchedErrors?.slug, {
                  name: blogT("blogForm.slug"),
                })}
              />
            </Stack>
            <Stack>
              <CustomAutocomplete
                items={items}
                label={blogT("blogForm.category")}
                sx={sxConfig}
                onSelect={(e, data) => onSelectCategory(data)}
              />
            </Stack>
            <Stack style={{ marginBottom: 4, marginTop: 2 }}>
              <SelectTagMultiple
                items={
                  tags.length > 0 && tags !== undefined ? tags : listBlogTag
                }
                label={blogT("blogForm.tag")}
                sx={sxConfig}
                onSelect={(e, data) => onSelect(data)}
                onEnter={onEnter}
              />
            </Stack>
            <UploadFile
              title={blogT("blogForm.background")}
              name="backgroundUpload"
              value={formik.values?.backgroundUpload}
              onChange={onChangeField}
              required={true}
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
              error={
                commonT(touchedErrors?.short_description, {
                  name: blogT("blogForm.short_description"),
                })
                  ? "error"
                  : undefined
              }
              helperText={commonT(touchedErrors?.short_description, {
                name: blogT("blogForm.short_description"),
              })}
              title={blogT(`${blogFormTranslatePrefix}.short_description`)}
            />
          </Stack>
          <Stack height={300}>
            <Editor
              hasAttachment
              placeholder={blogT("blogForm.content")}
              onChange={onChangeContent}
              onChangeFiles={onChangeAttactment}
              value={content}
              files={files}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mt={2}
              ></Stack>
            </Editor>
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
  title: Yup.string().required("form.error.required"),
  slug: Yup.string().required("form.error.required"),
  content: Yup.string().required("form.error.required"),
  backgroundUpload: Yup.mixed().required("form.error.required"),
  attachments: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required("form.error.required"),
      }),
    )
    .min(1, "form.error.required"),
  category: Yup.array().of(Yup.string()).min(1, "form.error.required"),
  tag: Yup.array().of(Yup.string()),
  short_description: Yup.string().required("form.error.required"),
});
