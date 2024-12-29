/* eslint-disable @typescript-eslint/no-explicit-any */
import { MenuList, Stack } from "@mui/material";
import { DialogLayoutProps } from "components/DialogLayout";
import FormLayout from "components/FormLayout";
import { Input, Select } from "components/shared";
import { DateTimePicker } from "components/shared/DatePicker";
import useGetOptions from "components/sn-resource-planing/hooks/useGetOptions";
import { DATE_FORMAT_FORM, NS_COMMON, NS_PROJECT } from "constant/index";
import { FormikErrors, useFormik } from "formik";
import moment from "moment";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useSnackbar } from "store/app/selectors";
import { useClientCompanies, useEmployeeOptions } from "store/company/selectors";
import { TBudgetCreateParam, TBudgetListQueries } from "store/project/budget/action";
import { useBudgets } from "store/project/budget/selector";
import { useProjects } from "store/project/selectors";
import { formatDate, getMessageErrorByAPI } from "utils/index";
import * as Yup from "yup";

type Props = Omit<DialogLayoutProps, "children" | "onSubmit"> & {
  open: boolean;

  onClose: () => void;

  onAddSnackbar: (message: string, severity?: "error" | "success" | "info" | "warning", expiredIn?: number) => void;

  onGetBudget: (queries?: TBudgetListQueries) => Promise<void>;

  projectId?: string;

  selectedBudget: TBudgetCreateParam;
};

const ModalAddBudget = (props: Props) => {
  const { ...rest } = props;

  //log selectedBudget
  console.log("selectedBudget", props.selectedBudget);

  const bodyModalRef = useRef<HTMLDivElement>(null);
  const [defaultHeightBodyModal, setDefaultHeightBodyModal] =
    useState<number>(0);

  const projectId: string = props.projectId ?? "";

  const { onAddSnackbar } = useSnackbar();
  const projectT = useTranslations(NS_PROJECT);
  const commonT = useTranslations(NS_COMMON);
  const projectBudget = useBudgets();
  const { items: clientCompanies, onGetClientCompanies } = useClientCompanies();

  const {
    options: employeeOptions,
    onGetOptions: onGetEmployeeOptions,
    isFetching,
    filters,
    pageSize,
    pageIndex,
    totalPages,
  } = useEmployeeOptions();

  const { items: projects, onGetProjects } = useProjects();
  const { projectOptions } = useGetOptions();

  useEffect(() => {
    if (!rest.open) {
      formik.resetForm();
      return;
    }
    onGetClientCompanies({});

    if (!projects || projects.length === 0) {
      onGetProjects({});
    }
  }, [onGetClientCompanies, onGetProjects, projects, rest.open]);

  useEffect(() => {
    setTimeout(() => {
      if (!bodyModalRef.current) return;
      const heightBodyModal = bodyModalRef.current?.offsetHeight ?? 0;
      setDefaultHeightBodyModal(heightBodyModal);
    }, 300);
  }, [bodyModalRef.current, rest.open]);

  const onSubmit = async (param: TBudgetCreateParam) => {
    if (param.start_date) {
      param.start_date = formatDate(param.start_date, DATE_FORMAT_FORM);
    }
    if (param.end_date) {
      param.end_date = formatDate(param.end_date, DATE_FORMAT_FORM);
    }

    if (moment(param.start_date).isAfter(param.end_date)) {
      formik.setFieldError(
        "start_date",
        "The start date must be after the end date",
      );
      return;
    }

    try {
      if (props.selectedBudget.id) {
        await projectBudget.update(props.selectedBudget.id, param);
        onAddSnackbar(projectT("budget.updateBudgetSuccess"), "success");
        props.onClose();
        projectBudget.get();
        return;
      } else {
        await projectBudget.create(param);
        onAddSnackbar(projectT("budget.createBudgetSuccess"), "success");
        props.onClose();
        projectBudget.get();
      }
      projectBudget.get();
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  const onChangeDate = (name: string, newDate?: Date) => {
    formik.setFieldValue(name, newDate ? newDate.getTime() : null);
    formik.setFieldTouched(name, true);
    setTimeout(() => {
      formik.validateForm();
    }, 50);
  };

  const onEndReached = () => {
    if (isFetching || (totalPages && pageIndex >= totalPages)) return;
    onGetEmployeeOptions({ ...filters, pageSize, pageIndex: pageIndex + 1 });
  };

  const toggleFocusInputDate = async (isFocus = false) => {
    if (window["timeoutAnimation"]) {
      clearTimeout(window["timeoutAnimation"]);
    }
    const timeAnimation = 300; // ms
    const timeWaitReadyElement = 100; //ms

    window["timeoutAnimation"] = setTimeout(() => {
      if (!bodyModalRef.current) return;

      const optAnimate = {
        duration: timeAnimation,
        easing: "ease-in-out",
        iterations: 1,
      };

      const offsetHeight = bodyModalRef.current.offsetHeight;
      const scrollHeight = bodyModalRef.current.scrollHeight;

      let fromHeight: string;
      let toHeight: string;

      if (isFocus) {
        if (offsetHeight === scrollHeight) return;
        fromHeight = defaultHeightBodyModal + "px";
        toHeight = scrollHeight + "px";
      } else {
        fromHeight = offsetHeight + "px";
        toHeight = defaultHeightBodyModal + "px";
      }

      bodyModalRef.current.animate(
        { height: [fromHeight, toHeight] },
        optAnimate,
      );

      bodyModalRef.current!.style.height = toHeight;
    }, timeWaitReadyElement);
  };


  const initialValues: TBudgetCreateParam = {
    project_id: props.selectedBudget?.project_id || "",
    name: props.selectedBudget?.name || "",
    owner: props.selectedBudget?.owner || "",
    client: props.selectedBudget?.client || "",
    start_date: "",

    end_date: props.selectedBudget?.end_date || "",
  };


  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("form.error.required"),
    owner: Yup.string().trim().required("form.error.required"),
    client: Yup.string().trim().required("form.error.required"),
    project_id: Yup.string().required("form.error.required"),
    // start_date: Yup.number().min(Yup.ref("start_date"), "form.error.gte"),
    // end_date: Yup.number().min(Yup.ref("start_date"), "form.error.gte"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit,
  });

  const touchedErrors = useMemo(() => {
    return Object.entries(formik.errors).reduce(
      (out: FormikErrors<TBudgetCreateParam>, [key, error]) => {
        if (formik.touched[key]) {
          out[key] = error;
        }
        return out;
      },
      {},
    );
  }, [formik.touched, formik.errors]);

  const sxInput = {
    height: "auto",
    "& input": {
      color: ({ palette }) => `${palette.grey[900]}!important`,
    },
  };

  const newInput = {
    // height: "65px",
    ".MuiInputBase-root": {
      ".MuiAutocomplete-endAdornment": { right: "21px" },
      background:
        " linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)!important",
      padding: "9px!important",
      paddingRight: "22px !important",
      borderRadius: "100px!important",
      border: "none!important",
      mt: "35px",
      fontSize: "16px!important",
      // height:"38px",
      ".MuiInputBase-input": { p: "0 10px!important" },

      ".MuiChip-root": {
        color: "#0575e6",
        padding: "5px",
        svg: {
          border: "0.2px solid transparent",
          color: "white",
          background: " #0575e6",
        },
      },
    },
    "label.MuiInputLabel-root": {
      left: 0,
      fontSize: "13px",
      transform: "translate(0, 16px) scale(1)",
    },
  };
  const newBorderSVG = {
    ".MuiInputBase-root.MuiOutlinedInput-root": {
      svg: {
        borderRadius: "50px",
        border: "0.2px solid #5C5C5C",
        fontSize: "16px",
        color: "black",
        "&:hover": { color: "black" },
      },
    }

  }


  return (
    <FormLayout
      label={
        props.selectedBudget?.id
          ? projectT("budget.action.editBudgetTitleModal")
          : projectT("budget.action.addBudgetTitleModal")
      }
      onSubmit={formik.handleSubmit}
      pending={false}
      submitWhenEnter={false}
      bodyFlex={0}
      sx={{
        borderRadius: "24px",
        minWidth: { xs: "calc(100vw - 24px)", lg: 500 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 500 },
        minHeight: "auto",
        // overflow: "visible !important",
        // "& .MuiDialogContent-root": {
        //   overflow: "visible !important",
        //   "& .MuiStack-root": { overflow: "visible !important" },
        // },
        ".MuiDialogTitle-root": { border: "none" },
        ".MuiDialogActions-root": {
          justifyContent: "end",
          border: "none",
          ".MuiButtonBase-root": {
            "&:last-child": {
              background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
              color: "white",
              borderRadius: "100px",
            },
            "&:first-child": {
              background: "white",
              color: "#14B9E5",
              border: "1px solid #14B9E5",
              borderRadius: "100px",
            },
          },
        },
      }}
      {...rest}
    >
      <Stack ref={bodyModalRef} sx={{ overflow: "visible !important" }}>
        <MenuList component={Stack} spacing={2} sx={{ overflow: "visible" }}>
          {!props.projectId && (
            <Select
              sx={{ ...newBorderSVG, ...newInput }}
              options={projectOptions}
              title={projectT("budget.form.project_id")}
              name="project_id"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values?.project_id}
              error={commonT(touchedErrors?.project_id, {
                name: projectT("budget.form.project_id"),
              })}
              rootSx={sxInput}
              fullWidth
              autoComplete="off"
            />
          )}
          <Input
            sx={{ ...newBorderSVG, ...newInput }}
            rootSx={sxInput}
            title={projectT("budget.form.name")}
            fullWidth
            name="name"
            disabled={false}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.name}
            error={commonT(touchedErrors?.name, {
              name: projectT("budget.form.name"),
            })}
            autoComplete="off"
          />
          <Select
            sx={{ ...newBorderSVG, ...newInput }}
            options={clientCompanies.map((c) => ({
              label: c.name,
              value: c.id ?? "",
            }))}
            title={"Client"}
            name="client"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.client}
            error={commonT(touchedErrors?.client, {
              name: projectT("budget.form.client"),
            })}
            onChangeSearch={(_, newValue) =>
              onGetEmployeeOptions({
                pageIndex: 1,
                pageSize: 20,
                email: (newValue as string) || "",
              })
            }
            rootSx={sxInput}
            fullWidth
            autoComplete="off"
          />
          <Stack
            direction={{ sm: "row" }}
            spacing={2}
            sx={{ "& .react-datepicker-popper": { zIndex: 999 } }}
          >
            <DateTimePicker
              sx={newInput}
              title={projectT("budget.form.start_date")}
              name="start_date"
              onChange={onChangeDate}
              onBlur={formik.handleBlur}
              value={formik.values?.start_date}
              error={commonT(touchedErrors?.start_date, {
                name: projectT("budget.form.start_date"),
              })}
              onClickEndNode={() => toggleFocusInputDate(true)}
              rootSx={sxInput}
              fullWidth
              pickerProps={{
                onFocus() {
                  toggleFocusInputDate(true);
                },
                onBlur() {
                  toggleFocusInputDate(false);
                },
                onClickOutside() {
                  toggleFocusInputDate(false);
                },
                autoComplete: "off",
              }}
            />
            <DateTimePicker
              title={projectT("budget.form.end_date")}
              name="end_date"
              onChange={onChangeDate}
              onBlur={formik.handleBlur}
              value={formik.values?.end_date}
              error={commonT(touchedErrors?.end_date, {
                name: projectT("budget.form.end_date"),
              })}
              rootSx={sxInput}
              fullWidth
              onClickEndNode={() => toggleFocusInputDate(true)}
              sx={{
                mt: { xs: 2, sm: 0 },
                ...newInput,
              }}
              pickerProps={{
                onFocus() {
                  toggleFocusInputDate(true);
                },
                onBlur() {
                  toggleFocusInputDate(false);
                },
                onClickOutside() {
                  toggleFocusInputDate(false);
                },
                autoComplete: "off",
              }}
            />
          </Stack>
          <Select
            sx={{ ...newBorderSVG, ...newInput }}
            options={employeeOptions}
            title={projectT("budget.form.owner")}
            name="owner"
            hasAvatar
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.owner}
            error={commonT(touchedErrors?.owner, {
              name: projectT("budget.form.owner"),
            })}
            rootSx={sxInput}
            fullWidth
            onEndReached={onEndReached}
            onChangeSearch={(name: string, newValue?: string | number) =>
              onGetEmployeeOptions({
                pageIndex: 1,
                pageSize: 20,
                [name]: newValue,
              })
            }
            searchProps={{
              value: filters?.email,
              placeholder: commonT("searchBy", { name: "email" }),
            }}
            onOpen={() => onGetEmployeeOptions({ pageIndex: 1, pageSize: 20 })}
            autoComplete="off"
          />
        </MenuList>
      </Stack>
    </FormLayout>
  );
};

export default memo(ModalAddBudget);
