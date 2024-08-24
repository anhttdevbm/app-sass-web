/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from "@hookform/resolvers/yup";
import { Add } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AttachmentIcon from "@mui/icons-material/Attachment";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Collapse,
  Grid,
  IconButton,
  MenuList,
  Stack,
  Typography,
} from "@mui/material";
import FormLayout from "components/FormLayout";
import { DatePicker, Input, Select } from "components/shared";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import useGetEmployeeOptions from "components/sn-sales/hooks/useGetEmployeeOptions";
import Textarea from "components/sn-time-tracking/components/Textarea";
import { ExpenseStatus } from "constant/enums";
import { FILE_ACCEPT, NS_BUDGETING, NS_COMMON } from "constant/index";
import { User } from "constant/types";
import FileCsvIcon from "icons/FileCsvIcon";
import FileDocIcon from "icons/FileDocIcon";
import FileExcelIcon from "icons/FileExcelIcon";
import FileIcon from "icons/FileIcon";
import FilePdfIcon from "icons/FilePdfIcon";
import _ from "lodash";
import moment from "moment";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
  useBudgetExpenseAdd,
  useBudgetExpenseUpdate,
  useBudgetUploadFile,
} from "queries/budgeting/expense";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuth, useSnackbar } from "store/app/selectors";
import { TBudgetExpense } from "store/expense/actions";
import { useCurrencyOptions } from "store/global/selectors";
import { niceBytes } from "utils/extension";
import { getMessageErrorByAPI } from "utils/index";
import * as yup from "yup";
import { TBudgetService, budgetDetailRef } from "../../BudgetDetail";
import InputLabelWrapper from "../InputLabelWrapper";

type Props = {
  open: boolean;
  onClose: () => void;
  expenseData?: TBudgetExpense | null;
  services: any[];
  serviceId: string;
};

interface TExpenseAddForm {
  date: string;
  owner: string;
  service: string;
  qty: number;
  cost: number | string;
  currency: string;
  totalCost: string | number;
  markup: string | number;
  description?: string;
  reimbursement?: string;
  reimbursementDate?: string;
  dueDate: Date;
  paymentDate: Date;
  vendor: string;
  status: ExpenseStatus;
  attachment: string;
  uploadFile?: any;
}

const defaultValues: TExpenseAddForm = {
  date: "",
  owner: "",
  service: "",
  qty: 0,
  cost: 0,
  currency: "",
  totalCost: 0,
  markup: 0,
  description: "",
  reimbursement: "no",
  status: ExpenseStatus.UNPAID,
  attachment: "",
  dueDate: new Date(),
  paymentDate: new Date(),
  vendor: "",
};

const sxInput = {
  height: 45,
  "& input": {
    color: ({ palette }) => `${palette.grey[900]}!important`,
  },
  border: "1px solid",
  borderColor: "grey.200",
};

export const ModalExpense = ({
  open,
  onClose,
  expenseData,
  services = [],
  serviceId,
}: Props) => {
  const budgetT = useTranslations(NS_BUDGETING);
  const commonT = useTranslations(NS_COMMON);
  const { id } = useParams();
  const { user } = useAuth();

  const budgetExpenseAdd = useBudgetExpenseAdd();
  const budgetExpenseUpdate = useBudgetExpenseUpdate();
  const budgetUploadFile = useBudgetUploadFile();

  const { onAddSnackbar } = useSnackbar();

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const [isShowReimbursement, setIsShowReimbursement] =
    useState<boolean>(false);
  const [isShowPayment, setIsPayment] = useState<boolean>(true);

  const {
    employeeOptions,
    employeeIsFetching,
    onEndReachedEmployeeOptions,
    onSearchEmployee,
  } = useGetEmployeeOptions();

  const { options: currencyOptions, onGetOptions: onGetCurrencyOptions } =
    useCurrencyOptions();

  const { control, handleSubmit, watch, setValue, reset } = useForm<
    TExpenseAddForm | any
  >({
    defaultValues: expenseData || defaultValues,
    resolver: yupResolver(
      yup.object({
        date: yup.string().required("Date is required"),
        owner: yup.string().required("Owner is required"),
        service: yup.string().required("Service is required"),
        qty: yup
          .number()
          .required("Quantity is required")
          .positive("Quantity must be positive"),
        cost: yup
          .number()
          .required("Cost is required")
          .positive("Cost must be positive"),
        currency: yup.string().required("Please select a currency"),
        totalCost: yup
          .number()
          .required("Total cost is required")
          .positive("Total cost must be positive"),
        billable: yup
          .number()
          .required("Total cost is required")
          .positive("Billable cost must be positive"),
        dueDate: yup.date().required("Due date is required"),
        paymentDate: yup.date().required("Payment date is required"),
        vendor: yup.string().required("Please select a vendor"),
      }),
    ),
  });

  const userInfo = useMemo(() => {
    const dataUser = {
      email: user?.email,
      id: user?.id,
      fullname: user?.fullname,
      avatar: user?.avatar,
      roles: user?.roles,
      company: user?.company,
      phone: user?.phone,
      taxCode: user?.taxCode,
      address: user?.address,
      country: user?.country,
    } as User;
    return dataUser;
  }, [user]);

  const fileIcon = useMemo(() => {
    const extension = _.last(_.get(watch("uploadFile"), "name", "").split("."));
    switch (extension) {
      case "pdf":
        return <FilePdfIcon sx={{ fontSize: 40 }} />;
      case "doc":
      case "docx":
        return <FileDocIcon sx={{ fontSize: 40 }} />;
      case "xls":
      case "xlsx":
        return <FileExcelIcon sx={{ fontSize: 40 }} />;
      case "csv":
        return <FileCsvIcon sx={{ fontSize: 40 }} />;
      default:
        return <FileIcon sx={{ fontSize: 40 }} />;
    }
  }, [watch("uploadFile")]);

  useEffect(() => {
    onGetCurrencyOptions({ pageIndex: 1, pageSize: 100 });
  }, []);

  useEffect(() => {
    if (!_.isEmpty(expenseData)) {
      reset({
        date: _.get(expenseData, "date", null),
        owner: _.get(expenseData, "owner.id", ""),
        service: _.get(expenseData, "serviceId", ""),
        billable: _.get(expenseData, "billable", 0),
        qty: _.get(expenseData, "qty", 0),
        cost: _.get(expenseData, "cost", 0),
        currency: _.get(expenseData, "currency", "USD"),
        totalCost: _.get(expenseData, "totalCost", 0),
        markup: _.get(expenseData, "markup", 0),
        description: _.get(expenseData, "description", 0),
        reimbursement: _.get(expenseData, "reimbursement.reimbursement", "no"),
        reimbursementDate: _.get(
          expenseData,
          "reimbursement.reimbursementDate",
          null,
        ),
        dueDate: _.get(expenseData, "payment.dueDate", null),
        paymentDate: _.get(expenseData, "payment.paymentDate", null),
        vendor: _.get(expenseData, "payment.vendor", "USD"),
        status: _.get(expenseData, "status", ExpenseStatus.UNPAID),
        attachment: _.get(expenseData, "attachment", ""),
      });
    }
  }, [expenseData]);

  useEffect(() => {
    setValue("service", serviceId || "");
  }, [serviceId]);

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
    }
  }, [open]);

  const onSubmit = async (formValue: TExpenseAddForm) => {
    const data: any = {
      date: formValue.date
        ? moment(_.get(formValue, "date")).format("YYYY-MM-DD")
        : null,
      owner: formValue?.owner || "",
      service: formValue?.service || "",
      budget: id || "",
      qty: Number(_.get(formValue, "qty", 0)),
      cost: Number(_.get(formValue, "cost", 0)),
      currency: formValue?.currency || "",
      totalCost: Number(_.get(formValue, "totalCost", 0)),
      markup: Number(_.get(formValue, "totalCost", 0)),
      billable: Number(_.get(formValue, "billable", 0)),
      description: formValue.description || "",
      company: userInfo.company,
      reimbursement: {
        reimbursement: _.get(formValue, "reimbursement", "no"),
        reimbursementDate: formValue?.reimbursementDate
          ? moment(_.get(formValue, "reimbursementDate")).format("YYYY-MM-DD")
          : null,
      },
      payment: {
        dueDate: formValue.dueDate
          ? moment(_.get(formValue, "dueDate")).format("YYYY-MM-DD")
          : null,
        paymentDate: formValue.paymentDate
          ? moment(_.get(formValue, "paymentDate")).format("YYYY-MM-DD")
          : null,
        vendor: formValue.vendor || "",
      },
      status: ExpenseStatus.PAID,
      attachment: formValue.attachment,
    };

    if (!_.isEmpty(expenseData)) {
      data["id"] = _.get(expenseData, "id", "");
      budgetExpenseUpdate.mutateAsync(data, {
        onSuccess: () => {
          onAddSnackbar("Update expense successful", "success");
          budgetDetailRef.current?.budgetGetExpenseRefetch();
          onClose();
        },
        onError(error) {
          onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
        },
      });
    } else {
      budgetExpenseAdd.mutateAsync(data, {
        onSuccess: () => {
          onAddSnackbar("Create expense successful", "success");
          budgetDetailRef.current?.budgetGetExpenseRefetch();
          onClose();
        },
        onError(error) {
          onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
        },
      });
    }
  };

  const onSearchMember = (name: string, value = "") => {
    onSearchEmployee(name, value);
  };

  const onGetEmployeeOptions = () => {
    onEndReachedEmployeeOptions();
  };

  const onChooseFile = () => {
    inputFileRef?.current?.click();
  };

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = event?.target?.files;
    if (!files) return;
    if (FILE_ACCEPT.includes(files[0].type)) {
      budgetUploadFile.mutateAsync(files[0], {
        onSuccess: (res: any) => {
          setValue("attachment", _.get(res, "data.object", ""));
          setValue("uploadFile", {
            id: _.get(res, "data.object", ""),
            link: _.get(res, "data.download", ""),
            name: files[0].name,
            size: niceBytes(files[0].size),
          });
        },
      });
    } else {
      onAddSnackbar(commonT("notification.imageTypeInvalid"), "error");
    }
  };

  const handleRemoveFile = (file) => {
    setValue("attachment", "");
    setValue("uploadFile", null);
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
    },
  };

  return (
    <FormLayout
      label={
        !_.isEmpty(expenseData)
          ? budgetT("dialogExpense.titleModalDetail")
          : budgetT("dialogExpense.titleModalAdd")
      }
      pending={false}
      submitWhenEnter={false}
      bottomProps={{
        sx: {
          justifyContent: "flex-end",
        },
      }}
      open={open}
      onClose={onClose}
      cancelText={budgetT("dialogExpense.cancelBtnText")}
      submitText={
        !_.isEmpty(expenseData)
          ? budgetT("dialogExpense.updateBtnText")
          : budgetT("dialogExpense.createBtnText")
      }
      onSubmit={handleSubmit(onSubmit)}
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
          justifyContent: "center",
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
    >
      <Stack overflow="auto">
        <MenuList component={Stack} spacing={2}>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Stack gap={1} direction="row" flexWrap="wrap">
                <Box
                  sx={{
                    flex: 1,
                    "& .MuiInputBase-root.MuiOutlinedInput-root": {
                      height: "50px",
                      backgroundColor: "transparent !important",
                      borderColor: "#99999970 !important",
                    },
                  }}
                >
                  <InputLabelWrapper label={budgetT("dialogExpense.date")}>
                    <Controller
                      control={control}
                      name="date"
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <DatePicker
                          rootSx={sxInput}
                          name="date"
                          value={value}
                          fullWidth
                          autoComplete="off"
                          error={error?.message}
                          onChange={(_: string, newDate: Date | undefined) => {
                            onChange(newDate ? moment(newDate).format() : "");
                          }}
                          pickerProps={{
                            autoComplete: "off",
                          }}
                        />
                      )}
                    />
                  </InputLabelWrapper>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <InputLabelWrapper
                    label={budgetT(`tabExpenses.newExpenseForm.owner`)}
                  >
                    <Controller
                      control={control}
                      name="owner"
                      render={({ field, fieldState: { error } }) => (
                        <Select
                          onChangeSearch={(_, newValue) =>
                            onSearchMember(field.name, newValue as string)
                          }
                          autoComplete="off"
                          error={error?.message}
                          fullWidth
                          options={employeeOptions}
                          onEndReached={onEndReachedEmployeeOptions}
                          sx={{
                            "& .MuiInputBase-root.MuiOutlinedInput-root": {
                              backgroundColor: "transparent !important",
                              py: "12px",
                              borderColor: "#99999970 !important",
                            },
                          }}
                          pending={employeeIsFetching}
                          onOpen={onGetEmployeeOptions}
                          {...field}
                        />
                      )}
                    />
                  </InputLabelWrapper>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <InputLabelWrapper label={budgetT("dialogExpense.service")}>
                <Controller
                  control={control}
                  name="service"
                  render={({ field, fieldState: { error } }) => (
                    <Select
                      options={services.map((service: TBudgetService) => ({
                        value: _.get(service, "id", ""),
                        label: _.get(service, "name", ""),
                      }))}
                      error={error?.message}
                      rootSx={sxInput}
                      fullWidth
                      autoComplete="off"
                      disabled={!!serviceId}
                      sx={{
                        "& .MuiInputBase-root.MuiOutlinedInput-root": {
                          backgroundColor: "transparent !important",
                          py: "12px",
                          borderColor: "#99999970 !important",
                        },
                      }}
                      {...field}
                    />
                  )}
                />
              </InputLabelWrapper>
            </Grid>

            <Grid item xs={12}>
              <Stack gap={2} direction="row">
                <Stack gap={2} direction="row" width={"50%"}>
                  <InputLabelWrapper
                    label={budgetT("dialogExpense.qty")}
                    sx={{ width: "50%" }}
                  >
                    <Controller
                      control={control}
                      name="qty"
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <Input
                          rootSx={sxInput}
                          fullWidth
                          value={value}
                          error={error?.message}
                          autoComplete="off"
                          onChange={onChange}
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                        />
                      )}
                    />
                  </InputLabelWrapper>

                  <InputLabelWrapper
                    label={budgetT("dialogExpense.cost")}
                    sx={{ width: "50%" }}
                  >
                    <Controller
                      control={control}
                      name="cost"
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <Input
                          rootSx={sxInput}
                          fullWidth
                          value={value}
                          error={error?.message}
                          onChange={onChange}
                          autoComplete="off"
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          sx={{
                            "& .MuiInputBase-root.MuiOutlinedInput-root": {
                              backgroundColor: "transparent !important",
                              borderColor: "#99999970 !important",
                            },
                          }}
                        />
                      )}
                    />
                  </InputLabelWrapper>
                </Stack>
                <Stack direction="row" width={"50%"}>
                  <InputLabelWrapper
                    label={budgetT("dialogExpense.currency")}
                    sx={{ width: "60%" }}
                  >
                    <Controller
                      control={control}
                      name="currency"
                      render={({ field, fieldState: { error } }) => (
                        <Select
                          error={error?.message}
                          fullWidth
                          options={_.map(currencyOptions || [], (currency) => ({
                            ...currency,
                            label: `${currency.label} ${
                              CURRENCY_SYMBOL[currency.value]
                            }`,
                            value: currency.value,
                          }))}
                          autoComplete="off"
                          sx={{
                            "& .MuiInputBase-root.MuiOutlinedInput-root": {
                              backgroundColor: "transparent !important",
                              py: "12px",
                              borderColor: "#99999970 !important",
                            },
                          }}
                          {...field}
                        />
                      )}
                    />
                  </InputLabelWrapper>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              {_.isEmpty(expenseData) ? (
                <Stack gap={1} direction="row" flexWrap="wrap">
                  <Box
                    sx={{
                      flex: 1,
                      "& .MuiInputBase-root.MuiOutlinedInput-root": {
                        height: "50px",
                        backgroundColor: "transparent !important",
                        borderColor: "#99999970 !important",
                      },
                    }}
                  >
                    <InputLabelWrapper
                      label={budgetT("dialogExpense.totalCost")}
                    >
                      <Controller
                        control={control}
                        name="totalCost"
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Input
                            rootSx={sxInput}
                            fullWidth
                            value={value}
                            error={error?.message}
                            onChange={onChange}
                            autoComplete="off"
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                            sx={{
                              "& .MuiInputBase-root.MuiOutlinedInput-root": {
                                backgroundColor: "transparent !important",
                                borderColor: "#99999970 !important",
                              },
                            }}
                          />
                        )}
                      />
                    </InputLabelWrapper>
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      "& .MuiInputBase-root.MuiOutlinedInput-root": {
                        height: "50px",
                        backgroundColor: "transparent !important",
                        borderColor: "#99999970 !important",
                      },
                    }}
                  >
                    <InputLabelWrapper
                      label={budgetT("dialogExpense.billable")}
                    >
                      <Controller
                        control={control}
                        name="billable"
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Input
                            rootSx={sxInput}
                            fullWidth
                            value={value}
                            error={error?.message}
                            onChange={onChange}
                            autoComplete="off"
                            type="number"
                            InputProps={{
                              endAdornment: watch("currency"),
                              inputProps: { min: 0 },
                            }}
                            sx={{
                              "& .MuiInputBase-root.MuiOutlinedInput-root": {
                                backgroundColor: "transparent !important",
                                borderColor: "#99999970 !important",
                              },
                            }}
                          />
                        )}
                      />
                    </InputLabelWrapper>
                  </Box>
                </Stack>
              ) : (
                <Stack gap={2} direction="row">
                  <Stack
                    gap={2}
                    direction="row"
                    width={"50%"}
                    alignItems="center"
                  >
                    <InputLabelWrapper
                      label={budgetT("dialogExpense.totalCost")}
                      sx={{ width: "50%" }}
                    >
                      <Controller
                        control={control}
                        name="totalCost"
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Input
                            rootSx={sxInput}
                            fullWidth
                            value={value}
                            error={error?.message}
                            onChange={onChange}
                            autoComplete="off"
                            sx={{
                              "& .MuiInputBase-root.MuiOutlinedInput-root": {
                                backgroundColor: "transparent !important",
                                borderColor: "#99999970 !important",
                              },
                            }}
                          />
                        )}
                      />
                    </InputLabelWrapper>

                    <Add sx={{ width: "10%" }} color="disabled" />
                    <InputLabelWrapper
                      label={budgetT("dialogExpense.markup")}
                      sx={{ width: "40%" }}
                    >
                      <Controller
                        control={control}
                        name="markup"
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Input
                            rootSx={sxInput}
                            fullWidth
                            value={value}
                            error={error?.message}
                            onChange={(e) => {
                              setValue("markup", e?.target?.value);
                              onChange(e);
                              const billable =
                                (Number(e?.target?.value || 0) *
                                  Number(watch("totalCost"))) /
                                  100 +
                                Number(watch("totalCost"));
                              setValue("billable", billable);
                            }}
                            autoComplete="off"
                            InputProps={{
                              endAdornment: "%",
                            }}
                            sx={{
                              "& .MuiInputBase-root.MuiOutlinedInput-root": {
                                backgroundColor: "transparent !important",
                                borderColor: "#99999970 !important",
                              },
                            }}
                          />
                        )}
                      />
                    </InputLabelWrapper>
                  </Stack>
                  <Stack direction="row" width={"50%"} alignItems="center">
                    <ArrowForwardIcon sx={{ width: "10%" }} color="disabled" />
                    <InputLabelWrapper
                      label={budgetT("dialogExpense.totalBillable")}
                      sx={{ width: "90%" }}
                    >
                      <Controller
                        control={control}
                        name="billable"
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <Input
                            rootSx={sxInput}
                            fullWidth
                            value={value}
                            error={error?.message}
                            onChange={onChange}
                            InputProps={{
                              endAdornment: watch("currency"),
                            }}
                            autoComplete="off"
                            sx={{
                              "& .MuiInputBase-root.MuiOutlinedInput-root": {
                                backgroundColor: "transparent !important",
                                borderColor: "#99999970 !important",
                              },
                            }}
                          />
                        )}
                      />
                    </InputLabelWrapper>
                  </Stack>
                </Stack>
              )}
            </Grid>

            <Grid item xs={12} sx={{ position: "relative", mt: 1 }}>
              <InputLabelWrapper
                label={budgetT("dialogExpense.description")}
                sx={{ "& label.MuiFormLabel-root": { display: "none" } }}
              >
                <Controller
                  control={control}
                  name="description"
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <Textarea
                        fullWidth
                        value={value}
                        error={!!error?.message}
                        minRows={6}
                        onChange={onChange}
                        autoComplete="off"
                        sx={{
                          backgroundColor: "gray.50",
                          "& .MuiFormControl-root.MuiTextField-root": {
                            border: "1px solid #99999970 !important",
                            borderRadius: "4px",
                          },
                          "& > *": {
                            backgroundColor: "transparent !important",
                          },
                        }}
                      />
                    </>
                  )}
                />

                <IconButton
                  sx={{
                    position: "absolute",
                    right: 20,
                    bottom: 30,
                    borderRadius: "4px !important",
                    backgroundColor: "#f5f5f5",
                    p: "4px !important",
                    border: "1px solid #99999970 !important",
                    "&:hover": {
                      backgroundColor: "#f4f4f4",
                    },
                  }}
                  onClick={onChooseFile}
                >
                  <AttachmentIcon />
                </IconButton>
              </InputLabelWrapper>
            </Grid>

            <Grid item xs={12}>
              {!_.isEmpty(watch("uploadFile")) && (
                <Box width="100%">
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ border: "1px solid #99999970", px: 2, py: 1 }}
                  >
                    <Stack direction="row" alignItems="center" gap={1}>
                      {fileIcon}
                      <Typography>
                        {_.get(watch("uploadFile"), "name", "")}
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="center">
                      <Typography sx={{ mr: 1 }}>
                        {_.get(watch("uploadFile"), "size", "")}
                      </Typography>

                      <IconButton
                        onClick={() => handleRemoveFile(watch("uploadFile"))}
                      >
                        <ClearIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Box>
              )}

              <Box
                type="file"
                accept={FILE_ACCEPT.join(", ")}
                component="input"
                display="none"
                onChange={onChangeFile}
                ref={inputFileRef}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sx={{
                background: "#f7f9fc",
                mt: 2,
                borderRadius: "4px",
                border: "1px solid #99999970",
                cursor: "pointer",
                p: 2,
              }}
            >
              <Stack
                justifyContent="space-between"
                gap={1}
                alignItems="center"
                direction="row"
                onClick={() => setIsShowReimbursement(!isShowReimbursement)}
              >
                <Typography>
                  {budgetT("dialogExpense.reimbursement")}
                </Typography>
                {isShowReimbursement ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </Stack>
              <Collapse in={isShowReimbursement} timeout="auto" unmountOnExit>
                <Stack gap={1} direction="row" flexWrap="wrap" sx={{ pt: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <InputLabelWrapper
                      label={budgetT(`dialogExpense.reimbursement`)}
                    >
                      <Controller
                        control={control}
                        name="reimbursement"
                        render={({ field, fieldState: { error } }) => (
                          <Select
                            error={error?.message}
                            fullWidth
                            options={[
                              { label: "Yes", value: "yes" },
                              { label: "No", value: "no" },
                            ]}
                            autoComplete="off"
                            onEndReached={onEndReachedEmployeeOptions}
                            sx={{
                              "& .MuiInputBase-root.MuiOutlinedInput-root": {
                                backgroundColor: "#ffffff !important",
                                py: "12px",
                                borderColor: "#99999970 !important",
                              },
                            }}
                            pending={employeeIsFetching}
                            onOpen={onGetEmployeeOptions}
                            defaultValue="no"
                            {...field}
                          />
                        )}
                      />
                    </InputLabelWrapper>
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      "& .MuiInputBase-root.MuiOutlinedInput-root": {
                        height: "50px",
                        backgroundColor: "#ffffff !important",
                        borderColor: "#99999970 !important",
                      },
                    }}
                  >
                    <InputLabelWrapper
                      label={budgetT("dialogExpense.reimbursementDate")}
                    >
                      <Controller
                        control={control}
                        name="reimbursementDate"
                        render={({ field: { onChange, value } }) => (
                          <DatePicker
                            rootSx={sxInput}
                            name="reimbursementDate"
                            value={value}
                            fullWidth
                            autoComplete="off"
                            disabled={watch("reimbursement") === "no"}
                            onChange={(
                              _: string,
                              newDate: Date | undefined,
                            ) => {
                              onChange(newDate ? moment(newDate).format() : "");
                            }}
                          />
                        )}
                      />
                    </InputLabelWrapper>
                  </Box>
                </Stack>
              </Collapse>
            </Grid>

            <Grid
              item
              xs={12}
              sx={{
                background: "#f7f9fc",
                mt: 2,
                borderRadius: "4px",
                border: "1px solid #99999970",
                cursor: "pointer",
                p: 2,
              }}
            >
              <Stack
                justifyContent="space-between"
                gap={1}
                alignItems="center"
                direction="row"
                onClick={() => setIsPayment(!isShowPayment)}
              >
                <Typography>{budgetT("dialogExpense.payment")}</Typography>
                {isShowPayment ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </Stack>
              <Collapse in={isShowPayment} timeout="auto" unmountOnExit>
                <Stack gap={1} direction="row" flexWrap="wrap" sx={{ pt: 2 }}>
                  <Box
                    sx={{
                      flex: 1,
                      "& .MuiInputBase-root.MuiOutlinedInput-root": {
                        height: "50px",
                        backgroundColor: "#ffffff !important",
                        borderColor: "#99999970 !important",
                      },
                    }}
                  >
                    <InputLabelWrapper label={budgetT("dialogExpense.dueDate")}>
                      <Controller
                        control={control}
                        name="dueDate"
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <DatePicker
                            rootSx={sxInput}
                            name="dueDate"
                            value={value}
                            error={error?.message}
                            fullWidth
                            autoComplete="off"
                            onChange={(
                              _: string,
                              newDate: Date | undefined,
                            ) => {
                              onChange(newDate ? moment(newDate).format() : "");
                            }}
                          />
                        )}
                      />
                    </InputLabelWrapper>
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      "& .MuiInputBase-root.MuiOutlinedInput-root": {
                        height: "50px",
                        backgroundColor: "#ffffff !important",
                        borderColor: "#99999970 !important",
                      },
                    }}
                  >
                    <InputLabelWrapper
                      label={budgetT("dialogExpense.paymentDate")}
                    >
                      <Controller
                        control={control}
                        name="paymentDate"
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <DatePicker
                            rootSx={sxInput}
                            name="paymentDate"
                            value={value}
                            error={error?.message}
                            autoComplete="off"
                            fullWidth
                            onChange={(
                              _: string,
                              newDate: Date | undefined,
                            ) => {
                              onChange(newDate ? moment(newDate).format() : "");
                            }}
                          />
                        )}
                      />
                    </InputLabelWrapper>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <InputLabelWrapper label={budgetT(`dialogExpense.vendor`)}>
                      <Controller
                        control={control}
                        name="vendor"
                        render={({ field, fieldState: { error } }) => (
                          <Select
                            error={error?.message}
                            fullWidth
                            options={currencyOptions}
                            autoComplete="off"
                            onEndReached={onEndReachedEmployeeOptions}
                            sx={{
                              "& .MuiInputBase-root.MuiOutlinedInput-root": {
                                backgroundColor: "#ffffff !important",
                                py: "12px",
                                borderColor: "#99999970 !important",
                              },
                            }}
                            pending={employeeIsFetching}
                            onOpen={onGetEmployeeOptions}
                            defaultValue="no"
                            {...field}
                          />
                        )}
                      />
                    </InputLabelWrapper>
                  </Box>
                </Stack>
              </Collapse>
            </Grid>
          </Grid>
        </MenuList>
      </Stack>
    </FormLayout>
  );
};
