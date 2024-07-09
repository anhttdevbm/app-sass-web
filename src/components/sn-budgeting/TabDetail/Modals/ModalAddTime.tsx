/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MenuList, Stack } from "@mui/material";
import FormLayout from "components/FormLayout";
import { DatePicker, Input, Select } from "components/shared";
import { DateTimePicker } from "components/shared/DatePicker";
import { NS_BUDGETING, NS_COMMON } from "constant/index";
import _ from "lodash";
import moment from "moment";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
  TBudgetTimeAdd,
  TBudgetTimeUpdate,
  useBudgetTimeAdd,
  useBudgetTimeUpdate,
} from "queries/budgeting/time-range";
import { useEffect } from "react";
import { ReactDatePickerProps } from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import { TBudgetService } from "../../BudgetDetail";
import { TTimeRanges } from "../Time";

type Props = {
  services: any[];
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  timeData?: TTimeRanges | null;
  serviceId: string | null;
};

const defaultValues: TTimeRanges = {
  id: "",
  docId: "",
  service: "",
  date: "",
  createdAt: "",
  name: "",
  person: {
    fullname: "",
    avatar: "",
  },
  note: "",
  timeRanges: 0,
  billableTime: 0,
  startTime: null,
  endTime: null,
};

export const ModalAddTime = ({
  open,
  onClose,
  refetch = () => {},
  timeData,
  services = [],
  serviceId,
}: Props) => {
  const budgetT = useTranslations(NS_BUDGETING);
  const commonT = useTranslations(NS_COMMON);
  const { id } = useParams();

  const budgetTimeAdd = useBudgetTimeAdd();
  const budgetTimeUpdate = useBudgetTimeUpdate();
  const { onAddSnackbar } = useSnackbar();

  const sxInput = {
    height: 58,
    "& input": {
      color: ({ palette }) => `${palette.grey[900]}!important`,
    },
  };

  const { register, control, handleSubmit, setValue, reset, watch } =
    useForm<TTimeRanges>({
      defaultValues: timeData || defaultValues,
    });

  useEffect(() => {
    if (!open) {
      reset(defaultValues);
      return;
    }

    if (timeData) {
      reset(timeData);
    }
  }, [open, JSON.stringify(timeData)]);

  useEffect(() => {
    setValue("service", serviceId || "");
  }, [serviceId]);

  useEffect(() => {
    if (watch("startTime") && watch("endTime")) {
      const gap = moment(watch("endTime")).diff(
        moment(watch("startTime")),
        "minutes",
      );
      if (gap > 0) {
        setValue("timeRanges", gap / 60);
      }
    }
  }, [watch("startTime"), watch("endTime")]);

  const onSubmit = async (formValue: TTimeRanges) => {
    try {
      const data = {
        budget: id || "",
        services: formValue.service,
        note: formValue.note,
        timeRanges: formValue.timeRanges,
        billableTime: formValue.billableTime,
        date: formValue.date ? moment(formValue.date).format("YYYY-MM-DD") : "",
      } as TBudgetTimeAdd;

      if (!!timeData) {
        data["id"] = formValue.docId || "";
        budgetTimeUpdate.mutate(data as TBudgetTimeUpdate, {
          onSuccess() {
            onAddSnackbar("Update time successful", "success");
            reset(defaultValues);
            refetch();
          },
          onError(error) {
            onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
          },
        });
      } else {
        budgetTimeAdd.mutate(data, {
          onSuccess() {
            onAddSnackbar("Create time successful", "success");
            reset(defaultValues);
            refetch();
          },
          onError(error) {
            onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
          },
        });
      }
    } catch (err) {
      onAddSnackbar(getMessageErrorByAPI(err, commonT), "error");
    } finally {
      onClose();
    }
  };

  const newInput = {
    // height: "65px",
    ".MuiInputBase-root": {
      ".MuiAutocomplete-endAdornment":{right:"21px"},
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
  const newBorderSVG ={
    ".MuiInputBase-root.MuiOutlinedInput-root":{svg: {
      borderRadius: "50px",
      border: "0.2px solid #5C5C5C",
      fontSize: "16px",
      color: "black",
      "&:hover": { color: "black" },
    },}
      
  }

  return (
    <FormLayout
      label={
        !!timeData
          ? budgetT("dialog.titleModalUpdate")
          : budgetT("dialog.titleModalAdd")
      }
      pending={false}
      submitWhenEnter={false}
      open={open}
      onClose={onClose}
      cancelText={budgetT("dialog.cancelBtnText")}
      submitText={
        !!timeData
          ? budgetT("dialog.updateBtnText")
          : budgetT("dialog.addBtnText")
      }
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        borderRadius:"24px",
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
      <Stack sx={{ overflow: "visible !important" }}>
        <MenuList component={Stack} spacing={2}>
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <DatePicker
                sx={newInput}
                title={budgetT("dialog.date")}
                rootSx={sxInput}
                fullWidth
                name="date"
                value={value}
                onChange={(_: string, newDate: Date | undefined) => {
                  onChange(newDate ? moment(newDate).format() : "");
                }}
                pickerProps={{ autoComplete: "off" }}
              />
            )}
          />

          <Select
            options={services.map((service: TBudgetService) => ({
              value: _.get(service, "id", ""),
              label: _.get(service, "name", ""),
            }))}
            sx={{...newBorderSVG,...newInput}}
            title={budgetT("dialog.service")}
            name="service"
            rootSx={sxInput}
            fullWidth
            onChange={(e) => {
              setValue("service", e.target.value);
            }}
            disabled={!!serviceId}
            value={watch("service")}
            autoComplete="off"
          />

          <Controller
            control={control}
            name="timeRanges"
            render={({ field: { onChange, value } }) => (
              <Input
                sx={{...newBorderSVG,...newInput}}
                rootSx={sxInput}
                title={budgetT("dialog.timeRanger")}
                fullWidth
                value={value}
                onChange={onChange}
                autoComplete="off"
              />
            )}
          />
          <Stack gap={2} direction="row" sx={{ '& .react-datepicker-popper': { zIndex: 999 }}}>
            <Controller
              control={control}
              name="startTime"
              render={({ field: { onChange, value } }) => (
                <DateTimePicker
                  sx={newInput}
                  title={budgetT("dialog.startTime")}
                  name="startTime"
                  value={value}
                  fullWidth
                  onChange={(_: string, newDate: Date | undefined) => {
                    onChange(newDate ? moment(newDate).format() : "");
                  }}
                  pickerProps={
                    {
                      autoComplete: "off",
                      showTimeSelect: true,
                    } as ReactDatePickerProps
                  }
                />
              )}
            />
            <Controller
              control={control}
              name="endTime"
              render={({ field: { onChange, value } }) => (
                <DateTimePicker
                  sx={newInput}
                  title={budgetT("dialog.endTime")}
                  name="endTime"
                  value={value}
                  fullWidth
                  onChange={(_: string, newDate: Date | undefined) => {
                    onChange(newDate ? moment(newDate).format() : "");
                  }}
                  pickerProps={
                    {
                      autoComplete: "off",
                      showTimeSelect: true,
                    } as ReactDatePickerProps
                  }
                />
              )}
            />
          </Stack>

          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, value } }) => (
              <Input
                sx={{...newBorderSVG,...newInput}}
                rootSx={sxInput}
                title={budgetT("dialog.note")}
                fullWidth
                value={value}
                onChange={onChange}
                autoComplete="off"
              />
            )}
          />

          {/* <Controller
              control={control}
              name="note"
              render={({ field: { onChange, value } }) => (
                <Textarea
                  label="Note"
                  fullWidth
                  value={value}
                  minRows={4}
                  onChange={onChange}
                  autoComplete="off"
                  sx={{
                    backgroundColor: 'transparent !important',
                    border: '1px solid #99999970', // Adding a border to the Textarea
                    borderRadius: '4px', // Adding border radius for smoother edges
                    padding: '8px', // Adding some padding inside the Textarea
                    "& .MuiFormControl-root.MuiTextField-root": {
                      borderColor: "#99999970 !important",
                    },
                    "& > *": {
                      backgroundColor: "transparent !important",
                    },
                  }}
                />
              )} 
            {/* /> */}
        </MenuList>
      </Stack>
    </FormLayout>
  );
};
