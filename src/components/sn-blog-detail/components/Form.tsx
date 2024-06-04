import {
  Box,
  Grid,
  Stack,
  Typography
} from "@mui/material";
import { DialogLayoutProps } from "components/DialogLayout";
import FormLayout from "components/FormLayout";
import { Input } from "components/shared";
import UploadFile from "components/shared/UploadFile";
import { DataAction } from "constant/enums";
import {
  AN_ERROR_TRY_AGAIN,
  NS_BLOG,
  NS_COMMON
} from "constant/index";
import { FormikErrors, useFormik } from "formik";
import JoditEditor from "jodit-react";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { UnprivilegedEditor } from "react-quill";
import slugify from "slugify";
import { useSnackbar } from "store/app/selectors";
import { useCategoryBlog } from "store/blog-category/selectors";
import { BlogFormData, TagData } from "store/blog/actions";
import { useBlogs } from "store/blog/selectors";
import { getMessageErrorByAPI } from "utils/index";
import * as Yup from "yup";
import SelectCategoriescomplete from "./SelectCategories";
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
  const [content, setContent] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [data, setData] = useState<any | undefined>(undefined);
  const blogFormTranslatePrefix = "blogForm";
  const [backgroundChanged, setBackgroundChanged] = useState(false);
  const { listBlogTag, onGetListTag } = useBlogs();
  const [tags, setTags] = useState<TagData[]>([]);
  const { items, onGetOptions: onGetCategoryOptions } = useCategoryBlog();
  useEffect(() => {
    onGetListTag();
    onGetCategoryOptions({ pageIndex: 1, pageSize: 50 });
  }, [onGetCategoryOptions, onGetListTag]);

  const editor = useRef(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config: any = {
    placeholder: blogT("blogForm.content"),
    readonly: false,
    height: 400
  };

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
    const uniqueData = Array.from(new Set(data.map((item) => item.tag))).map(
      (tag) => ({ tag }),
    );
    formik.setFieldValue(
      "tag",
      uniqueData.map((item) => item.tag),
    );
  };

  const onEnter = (value) => {
    // console.log(value);
    if (!value) return;
    if (tags == null || tags.length == 0) {
      setTags(listBlogTag);
    }
    const itemValues = formik.values?.tag ?? [];
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
    // console.log(name);
    if (name === "backgroundUpload") {
      // console.log("vào đây nhé");
      setBackgroundChanged(true);
    }
  };
  const onSelectCategory = (data) => {
    const mappingData = data.map((item) => item.id);
    formik.setFieldValue("category", mappingData);
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
    setFiles(files);
    // Update listDataFile

    // Update the value of attachments in formik
    formik.setFieldValue("attachments", data);
    formik.setFieldValue("attachmentsUpload", files);
  };

  const onSubmit = async (values: BlogFormData) => {
    try {
      if (backgroundChanged) {
        // console.log(values.background);
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
              <SelectCategoriescomplete
                items={items}
                label={blogT("blogForm.category")}
                sx={sxConfig}
                onSelect={(e, data) => onSelectCategory(data)}
                value={formik.values.category?.map((tag) => ({
                  id: tag,
                }))}
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
          <Stack>
            <JoditEditor
                ref={editor}
                value={formik.values.content || formik.initialValues.content || ''}
                config={config}
                onBlur={(newContent) => {
                  setContent(newContent); 
                  formik.setFieldValue("content", newContent);
                }}
                onChange={newContent => {
                  setContent(newContent);
                  formik.setFieldValue("content", newContent);
                }}
            />
            {/* <EditorView
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
            </EditorView> */}
          </Stack>
          <Box border={1} borderColor="divider">
            <Typography variant="h6" sx={{ padding: 2 }}>
              {blogT("blogForm.meta")} 
            </Typography>
            <Stack sx={{ padding: 2 }}>
              <Input
                fullWidth
                name="meta_title"
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
                value={formik.values?.meta_title}
                rootSx={sxConfig.input}
                error={
                  commonT(touchedErrors?.meta_title, {
                    name: blogT("blogForm.meta_title"),
                  })
                    ? "error"
                    : undefined
                }
                helperText={commonT(touchedErrors?.meta_title, {
                  name: blogT("blogForm.meta_title"),
                })}
                title={blogT(`${blogFormTranslatePrefix}.meta_title`)}
              />
              <Input
                fullWidth
                name="meta_description"
                onChange={(e) => {
                  formik.handleChange(e);
                }}
                onBlur={formik.handleBlur}
                value={formik.values?.meta_description}
                rootSx={sxConfig.input}
                error={
                  commonT(touchedErrors?.meta_description, {
                    name: blogT("blogForm.meta_description"),
                  })
                    ? "error"
                    : undefined
                }
                helperText={commonT(touchedErrors?.meta_description, {
                  name: blogT("blogForm.meta_description"),
                })}
                title={blogT(`${blogFormTranslatePrefix}.meta_description`)}
              />
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </FormLayout>
  );
};

export default memo(Form);

const sxConfig = {
  input: {
    height: 56,
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};
export const validationSchema = Yup.object().shape({
  title: Yup.string().required("form.error.required"),
  slug: Yup.string().required("form.error.required"),
  content: Yup.string().required("form.error.required"),
  backgroundUpload: Yup.object().required("form.error.required"),
  attachments: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required("form.error.required"),
      }),
    )
    .min(1, "form.error.required"),
  category: Yup.array().of(Yup.string()).min(1, "form.error.required"),
  tag: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required("form.error.required"),
      }),
    )
    .min(1, "form.error.required"),
  short_description: Yup.string().required("form.error.required"),
});
