/* eslint-disable @typescript-eslint/no-explicit-any */
import { Add } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box, Collapse,
  Grid, MenuList,
  Stack,
  Typography
} from "@mui/material";
import FormLayout from "components/FormLayout";
import { DatePicker, Input, Select } from "components/shared";
import Textarea from "components/sn-time-tracking/Component/Textarea";
import { NS_BUDGETING, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "store/app/selectors";
import InputLabelWrapper from "./InputLabelWrapper";
import { TBudgetExpense, useBudgetExpenseAdd } from "queries/budgeting/expense";
import moment from "moment";
import useGetEmployeeOptions from "components/sn-sales/hooks/useGetEmployeeOptions";
import * as yup from "yup";
import { ExpenseStatus } from "constant/enums";
import { yupResolver } from "@hookform/resolvers/yup";
import { TBudgetService } from "../BudgetDetail";
import _ from "lodash";
import { useCurrencyOptions } from "store/global/selectors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

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
  totalBillable: string | number;
  description?: string;
  paymentStatus: string;
  reimbursement?: {
    reimbursement: string;
    reimbursementDate: string;
  };
  payment?: {
    dueDate: string;
    paymentDate: string;
    vendor: string;
  };
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
  totalBillable: 0,
  description: "",
  paymentStatus: "",
  status: ExpenseStatus.UNPAID,
  attachment: [],
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

  const budgetExpenseAdd = useBudgetExpenseAdd();
  const { onAddSnackbar } = useSnackbar();

  const [isShowReimbursement, setIsShowReimbursement] = useState<boolean>(false);
  const [isShowPayment, setIsPayment] = useState<boolean>(false);

  const {
    employeeOptions,
    employeeIsFetching,
    onEndReachedEmployeeOptions,
    onGetEmployeeOptions,
  } = useGetEmployeeOptions();

  const currencyOptions = useCurrencyOptions();

  const { control, handleSubmit, setValue, getValues, watch } = useForm<any>({
    defaultValues: expenseData || defaultValues,
    resolver: yupResolver(
      yup.object({
        date: yup.string().required("Date is required."),
        owner: yup.string().required("Owner is required."),
      }),
    ),
  });

  const onSubmit = async (formValue: TExpenseAddForm) => {
    console.log("formValue", formValue);
  };

  const onSearchMember = (name: string, value = "") => {
    onGetEmployeeOptions({
      pageIndex: 1,
      pageSize: 20,
      email: (value as string) || "",
    });
  };

  const sxInput = {
    height: 45,
    "& input": {
      color: ({ palette }) => `${palette.grey[900]}!important`,
    },
    border: "1px solid",
    borderColor: "grey.200",
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
                          options={_.get(currencyOptions, 'options', [])}
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
                      <Input rootSx={sxInput} onlyContent name="totalCost" />
                    </InputLabelWrapper>

                    <Add sx={{ width: "10%" }} color="disabled" />
                    <InputLabelWrapper
                      label={budgetT("dialogExpense.markup")}
                      sx={{ width: "40%" }}
                    >
                      <Input rootSx={sxInput} onlyContent name="markup" />
                    </InputLabelWrapper>
                  </Stack>
                  <Stack direction="row" width={"50%"} alignItems="center">
                    <ArrowForwardIcon sx={{ width: "10%" }} color="disabled" />
                    <InputLabelWrapper
                      label={budgetT("dialogExpense.totalBillable")}
                      sx={{ width: "90%" }}
                    >
                      <Input rootSx={sxInput} onlyContent name="totalBillable" />
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
                <Typography>
                  {budgetT("dialogExpense.payment")}
                </Typography>
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
                            options={_.get(currencyOptions, 'options', [])}
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
