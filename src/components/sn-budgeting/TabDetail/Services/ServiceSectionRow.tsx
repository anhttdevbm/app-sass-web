/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  ButtonBase,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Popper,
  Stack,
  TableRow,
  TextField,
  Tooltip,
  popoverClasses,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { BodyCell, CellProps, TableLayout } from "components/Table";
import { Button, Select, Text } from "components/shared";
import useGetOptions from "components/sn-resource-planing/hooks/useGetOptions";
import CalendarIcon from "icons/CalendarIcon";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { usePositions } from "store/company/selectors";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { useTranslations } from "next-intl";
import { NS_BUDGETING, NS_COMMON } from "constant/index";
import { uuid } from "utils/index";
import PlusIcon from "icons/PlusIcon";
import TrashIcon from "icons/TrashIcon";
import ConfirmDialog from "components/ConfirmDialog";
import useToggle from "hooks/useToggle";
import dayjs, { Dayjs } from "dayjs";
import { TError, TErrors, TSectionData } from "./ServiceUtil";
import { useBudgetSectionDelete } from "queries/budgeting/section-delete";
import { useParams } from "next/navigation";
import { useSnackbar } from "store/app/selectors";
import { serviceSectionRef } from "./ServiceSection";
import _ from "lodash";

type TForm = {
  data: TSectionData[];
};

type Props = {
  fieldIndex: number;
  updateValue: (index: number, data: TSectionData[]) => void;
  errors: TErrors;
  serviceData: any[];
  deletedServices: any[];
};

export const ServiceSectionRow = ({
  fieldIndex,
  updateValue,
  errors,
  serviceData,
  deletedServices,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [indexWaitDelete, setIndexWaitDelete] = useState<number | null>(null);
  const [isOpenConfirm, openConfirm, closeConfirm] = useToggle();
  const refClickOutSide = useOnClickOutside(() => setAnchorEl(null));
  const { register, control, setValue, watch, getValues } = useForm<TForm>();
  const { onGetPositions } = usePositions();
  const { positionOptions } = useGetOptions();
  const budgetSectionDelete = useBudgetSectionDelete();
  const { id: budgetId } = useParams();
  const { onAddSnackbar } = useSnackbar();
  const budgetT = useTranslations(NS_BUDGETING);
  const commonT = useTranslations(NS_COMMON);

  const { fields, append, remove } = useFieldArray({
    name: "data",
    control,
  });

  const headerList: CellProps[] = [
    {
      value: budgetT("tabService.section.serviceName"),
      align: "center",
      width: "220px",
    },
    {
      value: budgetT("tabService.section.serviceType"),
      align: "center",
      width: "120px",
    },
    {
      value: budgetT("tabService.section.billingType"),
      align: "center",
      width: "150px",
    },
    {
      value: budgetT("tabService.section.unit"),
      align: "center",
      width: "100px",
    },
    {
      value: budgetT("tabService.section.tracking"),
      align: "center",
      width: "100px",
    },
    {
      value: budgetT("tabService.section.estimate"),
      align: "center",
      width: "150px",
    },
    {
      value: "",
      align: "center",
      width: "50px",
    },
  ];

  const billingBillable = {
    label: "Billable",
    value: "billable",
    color: "success.main",
    bgcolor: "success.light",
  };

  const billingNonBillable = {
    label: "Non Billable",
    value: "non_billable",
    color: "error.main",
    bgcolor: "error.light",
  };

  useEffect(() => {
    onGetPositions({});
  }, []);

  useEffect(() => {
    const subscription = watch((value) => {
      updateValue(fieldIndex, value.data as TSectionData[]);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (!serviceData) return;
    serviceData.map((service) => {
      const estimate: number = service.estimate;
      const hour = Math.floor(estimate / 60);
      const minute = estimate - hour * 60;

      append({
        id: uuid(),
        name: service.name,
        type: service.serviceType,
        billingType: service.billType,
        unit: service.unit,
        tracking: { time: 0, booking: 0 },
        estimate: dayjs().hour(hour).minute(minute).toString(),
        serviceId: service.id,
      } as any);
    });
  }, [serviceData]);

  const createEmptyRow = () => {
    append({
      id: uuid(),
      name: "",
      type: "",
      billingType: "non_billable",
      unit: "hour",
      tracking: { time: 0, booking: 0 },
      estimate: "",
      isNewService: true,
    });
  };

  const openConfirmDelete = (index: number) => {
    setIndexWaitDelete(index);
    openConfirm();
  };

  const cancelConfirmDelete = () => {
    setIndexWaitDelete(null);
    closeConfirm();
  };

  const acceptDelete = () => {
    if (indexWaitDelete || indexWaitDelete === 0) {
      const selectedService = fields[indexWaitDelete];
      serviceSectionRef.current?.setDeletedServices(
        _.concat(deletedServices, [selectedService]),
      );
      setIndexWaitDelete(indexWaitDelete);
      remove(Number(indexWaitDelete));
    }
    cancelConfirmDelete();
  };

  const changeTracking = (index: number, type: "booking" | "time") => {
    setValue(
      `data.${index}.tracking.${type}`,
      getValues(`data.${index}.tracking.${type}`) === 0 ? 1 : 0,
    );
  };

  const changeTime = (index: number, time: Dayjs | null) => {
    if (!time) {
      setValue(`data.${index}.estimate`, "");
      return;
    }
    const hour = time.hour();
    const minute = time.minute();
    setValue(`data.${index}.estimate`, `${hour}:${minute}`);
  };

  const changeBilling = (billing: string) => {
    const index = anchorEl?.getAttribute("data-index");
    setValue(`data.${Number(index)}.billingType`, billing);
    setAnchorEl(null);
  };

  const hasError = (errList: TError[], index: number, name: string) => {
    return !!errList.find(
      (err) => err.fieldName === name && err.itemIndex === index,
    );
  };

  return (
    <Box>
      <TableLayout
        headerList={headerList}
        noData={false}
        titleColor="grey.300"
        position="relative"
        overflow="visible"
      >
        {fields.map((field, index) => {
          const errs = errors[fieldIndex] ?? [];
          const billStatus =
            watch(`data.${index}.billingType`) === "billable"
              ? billingBillable
              : billingNonBillable;
          const defautlEstimate = getValues(`data.${index}.estimate`);
          return (
            <TableRow key={field.id}>
              <BodyCell sx={{ p: 1 }}>
                <TextField
                  size="small"
                  variant="outlined"
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      ...(hasError(errs, index, "name") && {
                        borderColor: "error.main",
                      }),
                    },
                  }}
                  {...register(`data.${index}.name`)}
                />
              </BodyCell>
              <BodyCell sx={{ p: 1 }}>
                <Select
                  size="small"
                  // options={positionOptions as Option[]}
                  options={[
                    { label: "Dev", value: "Dev" },
                    { label: "QC", value: "QC" },
                    { label: "BA", value: "BA" },
                  ]}
                  onChangeValue={(value) => {
                    setValue(`data.${index}.type`, String(value));
                  }}
                  value={watch(`data.${index}.type`)}
                  sx={{
                    width: "100%",
                    [`& .MuiInputBase-root`]: {
                      px: 1,
                      backgroundColor: "background.paper",
                      pl: 0,
                      gap: 1,
                    },
                    "& .MuiFormHelperText-root": {
                      display: "none",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      ...(hasError(errs, index, "type") && {
                        borderColor: "error.main",
                      }),
                    },
                  }}
                />
              </BodyCell>
              <BodyCell sx={{ p: 1 }}>
                <Stack alignItems="center">
                  <Button
                    size="small"
                    data-index={index}
                    onClick={(e) => {
                      if (Boolean(anchorEl)) {
                        setAnchorEl(null);
                      } else {
                        setAnchorEl(e.currentTarget);
                      }
                    }}
                    sx={{
                      bgcolor: billStatus.bgcolor,
                      color: billStatus.color,
                      "&:hover": { bgcolor: billStatus.bgcolor },
                    }}
                  >
                    {billStatus.label}
                  </Button>
                </Stack>
              </BodyCell>
              <BodyCell sx={{ p: 1 }}>
                <TextField
                  size="small"
                  id="unit"
                  variant="outlined"
                  fullWidth
                  value="hour"
                  disabled
                  inputProps={{ sx: { textAlign: "center" } }}
                />
              </BodyCell>
              <BodyCell sx={{ p: 1 }}>
                <Stack gap={1} direction="row" justifyContent="center">
                  <Box sx={{ cursor: "pointer" }}>
                    <Tooltip
                      placement="top"
                      arrow
                      title={`Time tracking is ${
                        watch(`data.${index}.tracking.time`) === 0
                          ? "disable"
                          : "enable"
                      }`}
                    >
                      <IconButton onClick={() => changeTracking(index, "time")}>
                        <AccessTimeIcon
                          sx={{
                            color:
                              field.tracking.time === 0
                                ? "grey.300"
                                : "secondary.main",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box sx={{ cursor: "pointer" }}>
                    <Tooltip
                      placement="top"
                      arrow
                      title={`Booking tracking is ${
                        watch(`data.${index}.tracking.booking`) === 0
                          ? "disable"
                          : "enable"
                      }`}
                    >
                      <IconButton
                        onClick={() => changeTracking(index, "booking")}
                      >
                        <CalendarIcon
                          sx={{
                            color:
                              field.tracking.booking === 0
                                ? "grey.300"
                                : "secondary.main",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Stack>
              </BodyCell>
              <BodyCell sx={{ p: 1 }}>
                <TimePicker
                  slotProps={{ textField: { size: "small" } }}
                  views={["hours", "minutes"]}
                  format="HH:mm"
                  defaultValue={defautlEstimate ? dayjs(defautlEstimate) : null}
                  sx={{
                    "& .MuiInputBase-input": { textAlign: "center" },
                    "& .MuiOutlinedInput-notchedOutline": {
                      ...(hasError(errs, index, "estimate") && {
                        borderColor: "error.main",
                      }),
                    },
                  }}
                  onChange={(time: Dayjs | null) => changeTime(index, time)}
                />
              </BodyCell>
              <BodyCell>
                <TrashIcon
                  fontSize="medium"
                  sx={{ color: "error.main", cursor: "pointer" }}
                  onClick={() => openConfirmDelete(index)}
                />
              </BodyCell>
            </TableRow>
          );
        })}
      </TableLayout>
      <Box pl={3} mt={1}>
        <Button
          size="small"
          startIcon={<PlusIcon />}
          sx={{ color: "secondary.main" }}
          onClick={createEmptyRow}
        >
          New item
        </Button>
      </Box>
      <Popper
        ref={refClickOutSide}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        sx={{
          [`& .${popoverClasses.paper}`]: {
            backgroundImage: "white",
            minWidth: 150,
            maxWidth: 250,
          },
          zIndex: 1000,
        }}
        transition
        placement={"bottom-end"}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={350}>
            <Stack
              py={1}
              sx={{
                boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.2)",
                border: "1px solid",
                borderTopWidth: 0,
                borderColor: "grey.100",
                borderRadius: 1,
                bgcolor: "background.paper",
              }}
            >
              <MenuList component={Stack} gap={1} sx={{ py: 0 }}>
                {[billingBillable, billingNonBillable].map(
                  (billing, billIndex) => {
                    return (
                      <MenuItem
                        key={`billing_select_${billIndex}`}
                        onClick={() => changeBilling(billing.value)}
                        component={ButtonBase}
                        sx={{
                          width: "100%",
                          py: 1,
                          px: 2,
                        }}
                      >
                        <Text
                          variant="body2"
                          color={billing.color}
                          fontWeight="bold"
                          sx={{
                            bgcolor: billing.bgcolor,
                            px: 2,
                            py: 1,
                            borderRadius: "7px",
                            width: "100%",
                          }}
                        >
                          {billing.label}
                        </Text>
                      </MenuItem>
                    );
                  },
                )}
              </MenuList>
            </Stack>
          </Grow>
        )}
      </Popper>
      <ConfirmDialog
        open={isOpenConfirm}
        onClose={cancelConfirmDelete}
        onSubmit={acceptDelete}
        title={budgetT("delete.titleConfirmDelete")}
        content={budgetT("delete.contentConfirmDelete")}
      />
    </Box>
  );
};
