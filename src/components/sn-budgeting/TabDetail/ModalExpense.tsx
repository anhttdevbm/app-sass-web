/* eslint-disable @typescript-eslint/no-explicit-any */
import { Add } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Collapse,
  Grid,
  MenuList,
  Stack,
  Typography,
} from "@mui/material";
import FormLayout from "components/FormLayout";
import { DatePicker, Input, Select } from "components/shared";
import Textarea from "components/sn-time-tracking/Component/Textarea";
import { NS_BUDGETING, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuth, useSnackbar } from "store/app/selectors";
import InputLabelWrapper from "./InputLabelWrapper";
import {
  TBudgetExpense, useBudgetExpenseAdd
} from "queries/budgeting/expense";
import moment from "moment";
import useGetEmployeeOptions from "components/sn-sales/hooks/useGetEmployeeOptions";
import * as yup from "yup";
import { ExpenseStatus } from "constant/enums";
import { yupResolver } from "@hookform/resolvers/yup";
import { TBudgetService } from "../BudgetDetail";
import _ from "lodash";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useCurrencyOptions } from "store/global/selectors";
import { useParams } from "next/navigation";
import { User } from "constant/types";
import { getMessageErrorByAPI } from "utils/index";

type Props = {
  open: boolean;
  onClose: () => void;
  expenseData?: TBudgetExpense;
  services: any[];
  serviceId: string;
};

interface AttachmentList {
  link: string;
  name: string;
  object: string;
}

interface TExpenseAddForm {
  date: string;
  owner: string;
  service: string;
  qty: number;
  cost: number | string;
  currency: string;
  totalCost: string | number;
  markUp: string | number;
  description?: string;
  reimbursement?: string;
  reimbursementDate?: string;
  dueDate?: string;
  paymentDate?: string;
  vendor?: string;
  status: ExpenseStatus;
  attachment: AttachmentList[];
}

const defaultValues: TExpenseAddForm = {
  date: "",
  owner: "",
  service: "",
  qty: 0,
  cost: 0,
  currency: "",
  totalCost: 0,
  markUp: 0,
  description: "",
  reimbursement: "no",
  status: ExpenseStatus.UNPAID,
  attachment: [],
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
  const { onAddSnackbar } = useSnackbar();

  const [isShowReimbursement, setIsShowReimbursement] =
    useState<boolean>(false);
  const [isShowPayment, setIsPayment] = useState<boolean>(false);

  const {
    employeeOptions,
    employeeIsFetching,
    onEndReachedEmployeeOptions,
    onSearchEmployee,
  } = useGetEmployeeOptions();

  const { options: currencyOptions, onGetOptions: onGetCurrencyOptions } =
    useCurrencyOptions();

  const { control, handleSubmit, watch } = useForm<any>({
    defaultValues: expenseData || defaultValues,
    resolver: yupResolver(
      yup.object({
        date: yup.string().required("Date is required."),
        owner: yup.string().required("Owner is required."),
      }),
    ),
  });

  useEffect(() => {
    onGetCurrencyOptions({ pageIndex: 1, pageSize: 100 });
  }, []);

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

  const onSubmit = async (formValue: TExpenseAddForm) => {
    const data: any = {
      date: formValue.date
        ? moment(_.get(formValue, "date")).format("YYYY-MM-DD")
        : null,
      owner: formValue?.owner || "",
      service: formValue?.service || "",
      budget: id || "",
      qty: Number(_.get(formValue, 'qty', 0)),
      cost: Number(_.get(formValue, 'cost', 0)),
      currency: formValue?.currency || "",
      totalCost: Number(_.get(formValue, 'totalCost', 0)),
      markup: 1,
      billable: Number(_.get(formValue, 'billable', 0)),
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
      attachment: "",
    };

    budgetExpenseAdd.mutateAsync(data, {
      onSuccess: () => {
        onAddSnackbar("Create expense successful", "success");
        onClose();
      },
      onError(error) {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      },
    });
  };

  const onSearchMember = (name: string, value = "") => {
    onSearchEmployee(name, value);
  };

  const onGetEmployeeOptions = () => {
    onEndReachedEmployeeOptions();
  };

  return (
    <FormLayout
      label={budgetT("dialogExpense.titleModalAdd")}
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
      submitText={budgetT("dialogExpense.createBtnText")}
      onSubmit={handleSubmit(onSubmit)}
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
                      render={({ field: { onChange, value } }) => (
                        <DatePicker
                          rootSx={sxInput}
                          name="date"
                          value={value}
                          fullWidth
                          autoComplete="off"
                          onChange={(_: string, newDate: Date | undefined) => {
                            onChange(newDate ? moment(newDate).format() : "");
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
                    sx={{ width: "40%" }}
                  >
                    <Controller
                      control={control}
                      name="qty"
                      render={({ field: { onChange, value } }) => (
                        <Input
                          rootSx={sxInput}
                          fullWidth
                          value={value}
                          autoComplete="off"
                          onChange={onChange}
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

                  <InputLabelWrapper
                    label={budgetT("dialogExpense.cost")}
                    sx={{ width: "60%" }}
                  >
                    <Controller
                      control={control}
                      name="cost"
                      render={({ field: { onChange, value } }) => (
                        <Input
                          rootSx={sxInput}
                          fullWidth
                          value={value}
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
                          options={currencyOptions}
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
                        render={({ field: { onChange, value } }) => (
                          <Input
                            rootSx={sxInput}
                            fullWidth
                            value={value}
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
                        render={({ field: { onChange, value } }) => (
                          <Input
                            rootSx={sxInput}
                            fullWidth
                            value={value}
                            onChange={onChange}
                            autoComplete="off"
                            InputProps={{
                              endAdornment: watch("currency"),
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
                      <Input
                        rootSx={sxInput}
                        autoComplete="off"
                        onlyContent
                        name="totalCost"
                      />
                    </InputLabelWrapper>

                    <Add sx={{ width: "10%" }} color="disabled" />
                    <InputLabelWrapper
                      label={budgetT("dialogExpense.markup")}
                      sx={{ width: "40%" }}
                    >
                      <Input
                        rootSx={sxInput}
                        autoComplete="off"
                        onlyContent
                        name="markup"
                      />
                    </InputLabelWrapper>
                  </Stack>
                  <Stack direction="row" width={"50%"} alignItems="center">
                    <ArrowForwardIcon sx={{ width: "10%" }} color="disabled" />
                    <InputLabelWrapper
                      label={budgetT("dialogExpense.totalCost")}
                      sx={{ width: "90%" }}
                    >
                      <Input
                        rootSx={sxInput}
                        onlyContent
                        autoComplete="off"
                        name="totalCost"
                      />
                    </InputLabelWrapper>
                  </Stack>
                </Stack>
              )}
            </Grid>

            <Grid item xs={12}>
              <InputLabelWrapper label={budgetT("dialogExpense.description")}>
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, value } }) => (
                    <Textarea
                      fullWidth
                      value={value}
                      minRows={6}
                      onChange={onChange}
                      autoComplete="off"
                      sx={{
                        "& .MuiFormControl-root.MuiTextField-root": {
                          borderColor: "#99999970 !important",
                        },
                        "& > *": {
                          backgroundColor: "transparent !important",
                        },
                      }}
                    />
                  )}
                />
              </InputLabelWrapper>
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
                        render={({ field: { onChange, value } }) => (
                          <DatePicker
                            rootSx={sxInput}
                            name="dueDate"
                            value={value}
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
                        render={({ field: { onChange, value } }) => (
                          <DatePicker
                            rootSx={sxInput}
                            name="paymentDate"
                            value={value}
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
