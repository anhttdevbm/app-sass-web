import { Box, MenuList, Stack, Typography } from "@mui/material";
import FormLayout from "components/FormLayout";
import { Checkbox, DatePicker, Select } from "components/shared";
import { NS_BUDGETING, NS_COMMON } from "constant/index";
import { Option } from "constant/types";
import moment from "moment";
import { useTranslations } from "next-intl";
import { TRecurring } from "../Recurring";
import { Controller, useForm } from "react-hook-form";
import { TRecurringAdd, useBudgetRecurringAdd } from "queries/budgeting/recurring";
import { useEffect } from "react";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import { useParams } from "next/navigation";

type Props = {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  recurringData?: TRecurring | null;
};

const defaultValues: TRecurring = {
  recurring: "",
  from: "",
  to: "",
  copyPO: false,
  budgetId: ""
};

export const ModalAddRecurring = ({ 
  open, 
  onClose, 
  recurringData, 
  refetch = () => {}, 
}: Props) => {
  const budgetT = useTranslations(NS_BUDGETING);
  const commonT = useTranslations(NS_COMMON);
  const recurringAdd = useBudgetRecurringAdd();
  const { onAddSnackbar } = useSnackbar();
  const { id } = useParams();

  const templateSelectData: Option[] = [
    { label: budgetT("dialogRecurring.recurringIntervalWeekly"), value: "weekly" },
    { label: budgetT("dialogRecurring.recurringIntervalBiweekly"), value: "biweekly" },
    { label: budgetT("dialogRecurring.recurringIntervalMonthly"), value: "monthly" },
    { label: budgetT("dialogRecurring.recurringIntervalQuarterly"), value: "quarterly" },
    { label: budgetT("dialogRecurring.recurringIntervalSemiannually"), value: "semiannually" },
    { label: budgetT("dialogRecurring.recurringIntervalAnnually"), value: "annually" }
  ];

  const { register, control, handleSubmit, setValue, reset, watch } =
    useForm<TRecurring>({
      defaultValues: recurringData || defaultValues,
    });

  const sxInput = {
    height: 58,
    "& input": {
      color: ({ palette }) => `${palette.grey[900]}!important`,
    },
  };

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
      return;
    }

    if (recurringData) {
      reset(recurringData);
    }
  }, [open, JSON.stringify(recurringData)]);

  const onSubmit = async (formValue: TRecurring) => {
    try {
      const data = {
        recurring: formValue.recurring,
        from: formValue.from ? moment(formValue.from).format("YYYY-MM-DD") : "",
        to: formValue.to ? moment(formValue.to).format("YYYY-MM-DD") : "",
        copyPO: formValue.copyPO,
        budgetId: id || ""
      } as TRecurringAdd;

      recurringAdd.mutate(data, {
        onSuccess() {
          onAddSnackbar("Create time successful", "success");
          reset(defaultValues);
          refetch();
        },
        onError(error) {
          onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
        },
      });
    } catch (err) {
      onAddSnackbar(getMessageErrorByAPI(err, commonT), "error");
    } finally {
      onClose();
    }
  };

  return (
    <FormLayout
      label={budgetT("dialogRecurring.titleModalAdd")}
      pending={false}
      submitWhenEnter={false}
      open={open}
      onClose={onClose}
      cancelText={budgetT("dialogRecurring.cancelBtnText")}
      submitText={budgetT("dialogRecurring.addBtnText")}
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        overflow: 'visible !important',
        '& .MuiDialogContent-root': {
          overflow: 'visible !important',
          maxHeight: '510px',
          '& .MuiStack-root': { overflow: 'visible !important' }
        }
      }}
    >
      <Stack overflow="auto">
        <Box py={2}>
          <MenuList component={Stack} spacing={2}>
            <Select
              options={templateSelectData}
              title={budgetT("dialogRecurring.recurringInterval")}
              name="recurring"
              rootSx={sxInput}
              fullWidth
              onChange={(e) => {
                setValue("recurring", e.target.value);
              }}
              value={watch("recurring")}
            />
            <Stack gap={2} direction="row" sx={{ '& .react-datepicker-popper': { zIndex: 999 }}}>
            <Controller
                  control={control}
                  name="from"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      title={budgetT("dialog.date")}
                      rootSx={sxInput}
                      fullWidth
                      name="from"
                      value={value}
                      onChange={(_: string, newDate: Date | undefined) => {
                        onChange(newDate ? moment(newDate).format() : "");
                      }}
                      pickerProps={{ autoComplete: "off" }}
                    />
                  )}
                />
              <Controller
                  control={control}
                  name="to"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      title={budgetT("dialog.date")}
                      rootSx={sxInput}
                      fullWidth
                      name="to"
                      value={value}
                      onChange={(_: string, newDate: Date | undefined) => {
                        onChange(newDate ? moment(newDate).format() : "");
                      }}
                      pickerProps={{ autoComplete: "off" }}
                    />
                  )}
                />
            </Stack>
            <Stack direction="row">
              <Checkbox id="copyPo" />
              <Typography
                component="label"
                htmlFor="copyPo"
                ml={1}
                sx={{ cursor: "pointer" }}
              >
                {budgetT("dialogRecurring.copy")}
              </Typography>
            </Stack>
          </MenuList>
        </Box>
      </Stack>
    </FormLayout>
  );
};
