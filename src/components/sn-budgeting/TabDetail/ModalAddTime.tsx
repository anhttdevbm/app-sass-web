/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MenuList, Stack } from "@mui/material";
import FormLayout from "components/FormLayout";
import { DatePicker, Input, Select } from "components/shared";
import Textarea from "components/sn-time-tracking/Component/Textarea";
import { NS_BUDGETING, NS_COMMON } from "constant/index";
import moment from "moment";
import { useTranslations } from "next-intl";
import { TBudgetTimeAdd, TBudgetTimeUpdate, useBudgetTimeAdd, useBudgetTimeUpdate } from "queries/budgeting/time-range";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI, uuid } from "utils/index";
import { TTimeRanges } from "./Time";
import { useParams } from "next/navigation";
import { TBudgetService } from "../BudgetDetail";
import { ReactDatePickerProps } from "react-datepicker";
import { DateTimePicker } from "components/shared/DatePicker";
import _ from "lodash";

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
    };

    if (timeData) {
      reset(timeData);
    }
  }, [open, JSON.stringify(timeData)]);

  useEffect(() => {
    setValue("service", serviceId || "");
  }, [serviceId]);

  useEffect(() => {
    if (watch('startTime') && watch('endTime')) {
      const gap = moment(watch('endTime')).diff(moment(watch('startTime')), 'minutes');
      if (gap > 0) {
        setValue('timeRanges', gap / 60);
      }
    }
  }, [watch('startTime'), watch('endTime')]);

  const onSubmit = async (formValue: TTimeRanges) => {
    try {
      const data = {
        budget: id || "",
        services: formValue.service,
        note: formValue.note,
        timeRanges: formValue.timeRanges,
        billableTime: formValue.billableTime,
        date: formValue.date ? moment(formValue.date).format("YYYY-MM-DD") : ""
      } as TBudgetTimeAdd;
  
      if (!!timeData) {
        data['id'] = formValue.docId || "";
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

  return (
    <FormLayout
      label={!!timeData ? budgetT("dialog.titleModalUpdate") : budgetT("dialog.titleModalAdd")}
      pending={false}
      submitWhenEnter={false}
      open={open}
      onClose={onClose}
      cancelText={budgetT("dialog.cancelBtnText")}
      submitText={!!timeData ? budgetT("dialog.updateBtnText") : budgetT("dialog.addBtnText")}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack overflow="auto">
        <MenuList component={Stack} spacing={2}>
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value } }) => (
              <DatePicker
                title={budgetT("dialog.date")}
                rootSx={sxInput}
                fullWidth
                name="date"
                value={value}
                onChange={(_: string, newDate: Date | undefined) => {
                  onChange(newDate ? moment(newDate).format() : "");
                }}
              />
            )}
          />

          <Select
            options={services.map((service: TBudgetService) => ({
              value: _.get(service, 'id', ''),
              label: _.get(service, 'name', ''),
            }))}
            title={budgetT("dialog.service")}
            name="service"
            rootSx={sxInput}
            fullWidth
            onChange={(e) => {
              setValue("service", e.target.value);
            }}
            disabled={!!serviceId}
            value={watch("service")}
          />

          <Controller
            control={control}
            name="timeRanges"
            render={({ field: { onChange, value } }) => (
              <Input
                rootSx={sxInput}
                title={budgetT("dialog.timeRanger")}
                fullWidth
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Stack gap={2} direction="row">
            <Controller
              control={control}
              name="startTime"
              render={({ field: { onChange, value } }) => (
                <DateTimePicker
                  title={budgetT("dialog.startTime")}
                  name="startTime"
                  value={value}
                  fullWidth
                  onChange={(_: string, newDate: Date | undefined) => {
                    onChange(newDate ? moment(newDate).format() : "");
                  }}
                  pickerProps={
                    {
                      dateFormat: "h:mm aa",
                      timeIntervals: 1,
                      showTimeSelect: true,
                      showTimeSelectOnly: true,
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
                  title={budgetT("dialog.endTime")}
                  name="endTime"
                  value={value}
                  fullWidth
                  onChange={(_: string, newDate: Date | undefined) => {
                    onChange(newDate ? moment(newDate).format() : "");
                  }}
                  pickerProps={
                    {
                      dateFormat: "h:mm aa",
                      timeIntervals: 1,
                      showTimeSelect: true,
                      showTimeSelectOnly: true,
                    } as ReactDatePickerProps
                  }
                />
              )}
            />
          </Stack>
          <Textarea label={budgetT("dialog.note")} {...register("note")} />
        </MenuList>
      </Stack>
    </FormLayout>
  );
};
