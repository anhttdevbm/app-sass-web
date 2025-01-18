import {
  Box,
  Stack
} from "@mui/material";
import { client, Endpoint } from "api";
import { DialogLayoutProps } from "components/DialogLayout";
import FormLayout from "components/FormLayout";
import {
  DatePicker,
  Input,
  InputNumber,
  Select
} from "components/shared";
import Upload from "components/sn-projects/components/Upload";
import { DataAction } from "constant/enums";
import {
  AN_ERROR_TRY_AGAIN,
  DATE_FORMAT_FORM,
  NS_COMMON,
  NS_PROJECT
} from "constant/index";
import { FormikErrors, useFormik } from "formik";
import ChevronCircleIcon from "icons/ChevronCircleIcon";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "store/app/selectors";
import { useEmployeeOptions, useProjectTypes } from "store/company/selectors";
import {
  useCurrencyOptions,
  usePositionOptions,
  useProjectTypeOptions,
} from "store/global/selectors";
import { ProjectData } from "store/project/actions";
import {
  formatDate,
  getMessageErrorByAPI,
  hasValue
} from "utils/index";
import * as Yup from "yup";
import { SelectMembers, SelectTypeProject } from "./components";
import { Member } from "./components/helpers";

export type ProjectDataForm = Omit<ProjectData, "members" | "avatar"> & {
  members?: Member[];
  avatar?: string | File;
};

type FormProps = {
  initialValues: ProjectDataForm;
  type: DataAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: ProjectData) => Promise<any>;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

const Form = (props: FormProps) => {
  const { initialValues, type, onSubmit: onSubmitProps, ...rest } = props;
  const { onAddSnackbar } = useSnackbar();
  const {
    isFetching: projectTypeOptionsIsFetching,
    totalPages: projectTypeOptionsTotalPages,
    pageIndex: projectTypeOptionsPageIndex,
    options: projectTypeOptions,
    onGetOptions: onGetProjectTypeOptions,
    pageSize: projectTypeOptionsPageSize,
  } = useProjectTypeOptions();
  const {
    isFetching: currencyOptionsIsFetching,
    totalPages: currencyOptionsTotalPages,
    pageIndex: currencyOptionsPageIndex,
    options: currencyOptions,
    onGetOptions: onGetCurrencyOptions,
    pageSize: currencyOptionsPageSize,
  } = useCurrencyOptions();
  const { options: positionOptions } = usePositionOptions();
  const {
    options: employeeOptions,
    onGetOptions,
    isFetching,
    filters,
    pageSize,
    pageIndex,
    totalPages,
  } = useEmployeeOptions();
  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);

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

  const onEndReached = () => {
    if (isFetching || (totalPages && pageIndex >= totalPages)) return;
    onGetOptions({ ...filters, pageSize, pageIndex: pageIndex + 1 });
  };
  const dispatch = useDispatch();

  const onSubmit = async (values: ProjectDataForm) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dataParsed: any = { ...values };
      if (dataParsed?.start_date) {
        dataParsed.start_date = formatDate(
          dataParsed.start_date,
          DATE_FORMAT_FORM,
        );
      }
      if (values?.end_date) {
        dataParsed.end_date = formatDate(dataParsed.end_date, DATE_FORMAT_FORM);
      }
      // if (values?.owner) {
      //   const newMembers = [...(dataParsed?.members ?? [])];
      //   if (newMembers.every((item) => item.id !== values.owner)) {
      //     const mem = employeeOptions.find(
      //       (item) => item.value === values.owner,
      //     );
      //     if (mem) {
      //       newMembers.push({ id: mem.value as string, fullname: mem.label });
      //       dataParsed.members = newMembers;
      //     }
      //   }
      // }
      if (dataParsed?.members?.length) {
        dataParsed.members = dataParsed.members.map(
          ({ fullname, ...rest }) => rest,
        );
      }
      if (values["avatar"] && values["avatar"] instanceof File) {
        const logoUrl = await client.uploadFileV2(Endpoint.UPLOAD_FILE_V2, values["avatar"]);
        console.log(logoUrl);
        dataParsed["avatar"] = logoUrl;
      } else {
        delete dataParsed["avatar"];
      }

      if (hasValue(initialValues?.expected_cost)) {
        dataParsed["expected_cost"] = dataParsed["expected_cost"] ?? null;
      }
      if (hasValue(initialValues?.working_hours)) {
        dataParsed["working_hours"] = dataParsed["working_hours"] ?? null;
      }
      if (hasValue(initialValues?.currency)) {
        dataParsed["currency"] = dataParsed["currency"] ?? null;
      }

      // format type project
      dataParsed["type_project"] = formik.values.type_project?.value ?? null;

      const newItem = await onSubmitProps(dataParsed);

      if (newItem) {
        onAddSnackbar(
          projectT("list.notification.success", { label }),
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
      (out: FormikErrors<ProjectDataForm>, [key, error]) => {
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

  const onChangeDate = (name: string, newDate?: Date) => {
    formik.setFieldValue(name, newDate ? newDate.getTime() : null);
    formik.setFieldTouched(name, true);

    // Fix validate failed when change network
    let timeout: NodeJS.Timeout | null = null;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      formik.validateForm();
    }, 50);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeField = (name: string, newValue?: any) => {
    formik.setFieldValue(name, newValue);
  };

  const onProjectTypeOptionsEndReached = () => {
    if (
      projectTypeOptionsIsFetching ||
      (projectTypeOptionsTotalPages &&
        projectTypeOptionsPageIndex >= projectTypeOptionsTotalPages)
    )
      return;
    onGetOptions({
      pageSize: projectTypeOptionsPageSize,
      pageIndex: projectTypeOptionsPageIndex + 1,
    });
  };

  const onCurrencyOptionsEndReached = () => {
    if (
      currencyOptionsIsFetching ||
      (currencyOptionsTotalPages &&
        currencyOptionsPageIndex >= currencyOptionsTotalPages)
    )
      return;
    onGetOptions({
      pageSize: currencyOptionsPageSize,
      pageIndex: currencyOptionsPageIndex + 1,
    });
  };

  const onChangeSearch = (name: string, newValue?: string | number) => {
    onGetOptions({ pageIndex: 1, pageSize: 20, [name]: newValue });
  };

  const onGetEmployeeOptions = () => {
    onGetOptions({ pageIndex: 1, pageSize: 20 });
  };

  useEffect(() => {
    onGetProjectTypeOptions({ pageSize: 50000 });
  }, [onGetProjectTypeOptions]);

  useEffect(() => {
    onGetCurrencyOptions({ pageIndex: 1, pageSize: 20 });
  }, [onGetCurrencyOptions]);

  useEffect(() => {
    onGetOptions({ pageIndex: 1, pageSize: 20 });
  }, [onGetOptions]);
  const { onCreateProjectType } = useProjectTypes();

  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw -24px)", sm: 700 },
        maxWidth: { xs: "calc(100vw -24px)", sm: 700 },
        maxHeight: "calc(calc(var(--vh, 1vh) * 100) - 24px)",
        "& .MuiButton-primary": {
          px: 7,
          background:
            "linear-gradient(90deg, rgba(41,242,155,1) 0%, rgba(1,160,250,1) 100%)",
          borderRadius: "2rem",
        },
        "& .MuiButton-primaryOutlined": {
          px: 7,
          color: "dodgerblue",
          bgcolor: "white",
        },
      }}
      label={`${label} ${projectT("list.key")}`}
      submitting={formik.isSubmitting}
      disabled={disabled}
      onSubmit={formik.handleSubmit}
      {...rest}
    >
      <Stack spacing={2} py={3}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Upload
            name="avatar"
            value={formik.values?.avatar}
            onChange={onChangeField}
          />
          <Stack flex={1}>
            <Input
              title={projectT("list.form.title.name")}
              name="name"
              required
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.name}
              error={commonT(touchedErrors.name, {
                name: projectT("list.form.title.name"),
                max: MAX_NAME_CHARACTERS,
              })}
              titleSx={{
                "& .MuiFormLabel-asterisk.MuiInputLabel-asterisk::after": {
                  content: '"*"',
                },
                left: -14,
                color: "text.primary",
                fontWeight: 600,
              }}
              rootSx={{
                py: 0.75,
                px: 1,
                mt: 3,
                borderRadius: "2rem",
              }}
            />
          </Stack>
        </Stack>
        <Stack direction={{ sm: "row" }} spacing={2}>
          <Select
            options={employeeOptions}
            title={commonT("assigner")}
            name="owner"
            hasAvatar
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.owner}
            error={commonT(touchedErrors?.owner, { name: commonT("assigner") })}
            fullWidth
            onEndReached={onEndReached}
            onChangeSearch={onChangeSearch}
            SelectProps={{
              IconComponent: () => (
                <ChevronCircleIcon
                  sx={{ fontSize: 20, color: "transparent" }}
                />
              ),
            }}
            searchProps={{
              value: filters?.email,
              placeholder: commonT("searchBy", { name: "email" }),
            }}
            onOpen={onGetEmployeeOptions}
            sx={sxConfig.input}
            titleSx={{
              top: -14,
              left: -14,
              color: "text.primary",
              fontWeight: 600,
            }}
            rootSx={{
              p: 0.75,
              mt: 2.5,
              borderRadius: "2rem",
            }}
          />
          <div style={{ width: "100%" }}>
            <SelectTypeProject
              onChange={(option) =>
                formik.setFieldValue("type_project", option)
              }
              value={formik.values?.type_project}
            />
          </div>
        </Stack>
        <SelectMembers
          name="members"
          value={formik.values?.members}
          onChange={onChangeField}
          ignoreId={formik.values?.owner}
        />
        <Stack direction={{ sm: "row" }} spacing={2}>
          <DatePicker
            title={commonT("form.title.startDate")}
            name="start_date"
            onChange={onChangeDate}
            onBlur={formik.handleBlur}
            value={formik.values?.start_date}
            error={commonT(touchedErrors?.start_date, {
              name: commonT("form.title.startDate"),
            })}
            fullWidth
            sx={sxConfig.input}
            titleSx={{
              left: -14,
              color: "text.primary",
              fontWeight: 600,
            }}
            rootSx={{
              px: 1,
              py: 0.75,
              mt: 3,
              borderRadius: "2rem",
            }}
          />
          <DatePicker
            title={commonT("form.title.endDate")}
            name="end_date"
            onChange={onChangeDate}
            onBlur={formik.handleBlur}
            value={formik.values?.end_date}
            error={commonT(touchedErrors?.end_date, {
              name: commonT("form.title.endDate"),
              name2: commonT("form.title.startDate"),
            })}
            fullWidth
            sx={sxConfig.input}
            titleSx={{
              left: -14,
              color: "text.primary",
              fontWeight: 600,
            }}
            rootSx={{
              px: 1,
              py: 0.75,
              mt: 3,
              borderRadius: "2rem",
            }}
          />
        </Stack>
        <Stack direction={{ sm: "row" }} alignItems="center" spacing={2}>
          <Box flex={1}>
            <InputNumber
              title={projectT("list.form.title.estimatedCost")}
              name="expected_cost"
              onChange={onChangeField}
              onBlur={formik.handleBlur}
              value={formik.values?.expected_cost}
              error={commonT(touchedErrors?.expected_cost, {
                name: projectT("list.form.title.estimatedCost"),
              })}
              numberType="integer"
              negative={false}
              sx={{
                ...sxConfig.input,
                width: "65%",
              }}
              titleSx={{
                left: -14,
                color: "text.primary",
                fontWeight: 600,
              }}
              rootSx={{
                py: 0.5,
                px: 1,
                mt: 3,
                borderRadius: "2rem 0 0 2rem",
              }}
            />
            <Select
              options={currencyOptions}
              title={projectT("list.form.title.currency")}
              name="currency"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={
                formik.values?.currency ?? currencyOptions?.[0]?.value ?? "USD"
              }
              error={commonT(touchedErrors?.currency, {
                name: projectT("list.form.title.currency"),
              })}
              onEndReached={onCurrencyOptionsEndReached}
              SelectProps={{
                IconComponent: () => (
                  <ChevronCircleIcon
                    sx={{ fontSize: 20, color: "transparent" }}
                  />
                ),
              }}
              sx={{
                ...sxConfig.input,
                width: "35%",
              }}
              titleSx={{
                left: -14,
                color: "text.primary",
                fontWeight: 600,
              }}
              rootSx={{
                px: 0.5,
                py: 1,
                mt: 3,
                borderRadius: "0 2rem 2rem 0",
              }}
            />
          </Box>
          <InputNumber
            title={projectT("list.form.title.estimatedWorkingHours")}
            name="working_hours"
            onChange={onChangeField}
            onBlur={formik.handleBlur}
            value={formik.values?.working_hours}
            error={commonT(touchedErrors?.working_hours, {
              name: projectT("list.form.title.estimatedWorkingHours"),
            })}
            fullWidth
            numberType="integer"
            sx={{
              ...sxConfig.input,
              flex: 1,
            }}
            titleSx={{
              left: -14,
              color: "text.primary",
              fontWeight: 600,
            }}
            rootSx={{
              py: 0.5,
              px: 1,
              mt: 3,
              borderRadius: "2rem",
            }}
          />
        </Stack>
        <Stack direction={{ xs: "column-reverse", sm: "row" }} spacing={2}>
          <Input
            title={commonT("form.title.description")}
            name="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.description}
            error={commonT(touchedErrors?.description, {
              name: commonT("form.title.description"),
            })}
            fullWidth
            multiline
            sx={{ flex: 1, mt: { xs: 2, sm: 0 } }}
            titleSx={{
              left: -14,
              color: "text.primary",
              fontWeight: 600,
            }}
            rootSx={{
              mt: 3,
              borderRadius: "1rem",
            }}
          />
        </Stack>
      </Stack>
    </FormLayout>
  );
};

export default memo(Form);

const MAX_NAME_CHARACTERS = 50;

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("form.error.required")
    .max(MAX_NAME_CHARACTERS, "form.error.overMax"),
  description: Yup.string(),
  owner: Yup.string(),
  // type_project: Yup.string(),
  start_date: Yup.number(),
  end_date: Yup.number().min(Yup.ref("start_date"), "form.error.gte"),
  // expected_cost: Yup.number().min(0, "form.error.nonNegative"),
  // working_hours: Yup.number().min(0, "form.error.nonNegative"),
});

export const sxConfig = {
  input: {
    height: 56,
  },
};
