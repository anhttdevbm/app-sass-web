import { Stack } from "@mui/material";
import { DialogLayoutProps } from "components/DialogLayout";
import FormLayout from "components/FormLayout";
import {
    AN_ERROR_TRY_AGAIN,
    NS_BLOG,
    NS_COMMON,
    NS_COMPANY,
} from "constant/index";
import { FormikErrors, useFormik } from "formik";
import { memo, useMemo } from "react";
import { useAuth, useSnackbar } from "store/app/selectors";
import * as Yup from "yup";
import { getMessageErrorByAPI } from "utils/index";
import { DataAction } from "constant/enums";
import { Input, Select } from "components/shared";
import { EMAIL_REGEX } from "constant/regex";
import { usePositionOptions } from "store/global/selectors";
import { useTranslations } from "next-intl";
import { CategoryBlogData } from "store/blog-category/reducer";
type FormProps = {
    initialValues: CategoryBlogData;
    type: DataAction;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: (values: CategoryBlogData) => Promise<any>;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

const Form = (props: FormProps) => {
    const { initialValues, type, onSubmit: onSubmitProps, ...rest } = props;
    const { onAddSnackbar } = useSnackbar();
    const blogT = useTranslations(NS_BLOG);
    const commonT = useTranslations(NS_COMMON);

    const { options, onGetOptions, isFetching, totalPages, pageIndex, pageSize } =
        usePositionOptions();

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

    const onSubmit = async (values: CategoryBlogData) => {
        try {
            const newItem = await onSubmitProps(values);
            if (newItem) {
                onAddSnackbar(
                    blogT("blogCategory.notification.success", { label }),
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
            (out: FormikErrors<CategoryBlogData>, [key, error]) => {
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

    const onEndReached = () => {
        if (isFetching || (totalPages && pageIndex >= totalPages)) return;
        onGetOptions({ pageSize, pageIndex: pageIndex + 1 });
    };
    const createSlugFromName = (name) => {
        const slug = name.toLowerCase().replace(/ /g, "-");
        return slug;
    };
    const handleChangeName = (event) => {
        const nameValue = event.target.value;
        // Thực hiện logic để tạo slug từ nameValue
        const slugValue = createSlugFromName(nameValue);
        // Cập nhật giá trị của name và slug trong formik
        formik.setFieldValue("name", nameValue);
        formik.setFieldValue("slug", slugValue);
    };

    return (
        <FormLayout
            sx={{
                minWidth: { xs: "calc(100vw - 24px)", lg: 500 },
                maxWidth: { xs: "calc(100vw - 24px)", sm: 500 },
                minHeight: "auto",
            }}
            label={`${label} ${blogT("blogCategory.key")}`}
            submitting={formik.isSubmitting}
            disabled={disabled}
            onSubmit={formik.handleSubmit}
            {...rest}
        >
            <Stack spacing={2} py={3}>
                <Input
                    title={blogT("blogCategoryForm.name")}
                    name="name"
                    required
                    onChange={(e) => {
                        handleChangeName(e);
                        formik.handleChange(e); // Đảm bảo formik cũng nhận được sự thay đổi
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values?.name}
                    error={commonT(touchedErrors?.name, {
                        name: "Name",
                    })}
                    rootSx={sxConfig.input}
                />
                <Input
                    title={blogT("blogCategoryForm.slug")}
                    name="slug"
                    required
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values?.slug}
                    error={commonT(touchedErrors?.slug, {
                        name: "Slug",
                    })}
                    rootSx={sxConfig.input}
                />

                <Input
                    title={blogT("blogCategoryForm.detail")}
                    name="detail"
                    required
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values?.detail}
                    error={commonT(touchedErrors?.detail, {
                        name: "Detail",
                    })}
                    rootSx={sxConfig.input}
                />
            </Stack>
        </FormLayout>
    );
};

export default memo(Form);

export const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("form.error.required"),
    slug: Yup.string().trim().required("form.error.required"),
});

const sxConfig = {
    input: {
        height: 50,
    },
};
