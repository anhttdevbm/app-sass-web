import { Box, MenuList, Stack, Typography } from "@mui/material";
import FormLayout from "components/FormLayout";
import { Checkbox, DatePicker, Select } from "components/shared";
import { NS_BUDGETING } from "constant/index";
import { Option } from "constant/types";
import moment from "moment";
import { useTranslations } from "next-intl";
import { TRecurring } from "../Recurring";
import { Controller, useForm } from "react-hook-form";

type Props = {
  open: boolean;
  onClose: () => void;
  recurringData?: TRecurring | null;
};

const defaultValues: TRecurring = {
  inteval: "",
  start_date: "",
  end_date: "",
  copy: false,
};

export const ModalAddRecurring = ({ open, onClose, recurringData }: Props) => {
  const budgetT = useTranslations(NS_BUDGETING);

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

  return (
    <FormLayout
      label={budgetT("dialogRecurring.titleModalAdd")}
      pending={false}
      submitWhenEnter={false}
      open={open}
      onClose={onClose}
      cancelText={budgetT("dialogRecurring.cancelBtnText")}
      submitText={budgetT("dialogRecurring.addBtnText")}
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
              name="recurringInterval"
              rootSx={sxInput}
              fullWidth
              value=""
            />
            <Stack gap={2} direction="row" sx={{ '& .react-datepicker-popper': { zIndex: 999 }}}>
            <Controller
                  control={control}
                  name="start_date"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      title={budgetT("dialog.date")}
                      rootSx={sxInput}
                      fullWidth
                      name="start_date"
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
                  name="end_date"
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      title={budgetT("dialog.date")}
                      rootSx={sxInput}
                      fullWidth
                      name="end_date"
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
              <Checkbox id="copyPoNumber" />
              <Typography
                component="label"
                htmlFor="copyPoNumber"
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
