/* eslint-disable @typescript-eslint/no-explicit-any */
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  Box,
  ButtonBase,
  FormLabel,
  Grid,
  Grow,
  InputAdornment,
  MenuItem,
  MenuList,
  Popper,
  Stack,
  TextField,
  popoverClasses
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import ConfirmDialog from "components/ConfirmDialog";
import {
  Button,
  IconButton,
  Select,
  Text,
  Tooltip
} from "components/shared";
import { TBudgetService } from "components/sn-budgeting/BudgetDetail";
import useGetOptions from "components/sn-resource-planing/hooks/useGetOptions";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { CellProps } from "components/Table";
import { BudgetServiceBillable, SERVICE_UNIT_OPTIONS } from "constant/enums";
import { NS_BUDGETING } from "constant/index";
import { Option } from "constant/types";
import dayjs, { Dayjs } from "dayjs";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import useToggle from "hooks/useToggle";
import CalendarIcon from "icons/CalendarIcon";
import ChevronCircleIcon from "icons/ChevronCircleIcon";
import PlusIcon from "icons/PlusIcon";
import _ from "lodash";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useFieldArray, useForm } from "react-hook-form";
import { usePositions } from "store/company/selectors";
import { formatNumber, uuid } from "utils/index";
import ServiceItemAction, { Action } from "./ServiceItemAction";
import { serviceSectionRef } from "./ServiceSection";
import { TError, TErrors } from "./ServiceUtil";

type TForm = {
  services: (TBudgetService & {
    estimateTime?: string;
  })[];
};

type Props = {
  fieldIndex: number;
  updateValue: (index: number, services: TBudgetService[]) => void;
  errors: TErrors;
  serviceData: (TBudgetService & { estimateTime?: string })[];
  sectionId: string;
};

const ServiceSectionRow = ({
  fieldIndex,
  updateValue,
  errors,
  serviceData = [],
  sectionId,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [indexWaitDelete, setIndexWaitDelete] = useState<number | null>(null);
  const [isOpenConfirm, openConfirm, closeConfirm] = useToggle();
  const refClickOutSide = useOnClickOutside(() => setAnchorEl(null));
  const { register, control, setValue, watch, getValues } = useForm<TForm>({
    defaultValues: {
      services: [],
    },
  });
  const { onGetPositions } = usePositions();
  const { positionOptions } = useGetOptions();
  const budgetT = useTranslations(NS_BUDGETING);

  const billTypeOptions = [
    {
      label: "Fixed",
      value: BudgetServiceBillable.FIXED,
    },
    {
      label: "Actuals",
      value: BudgetServiceBillable.ACTUALS,
    },
    {
      label: "Non-Billable",
      value: BudgetServiceBillable.NON_BILLABLE,
    },
  ];

  const billingBillable = {
    label: budgetT("dialogExpense.billable"),
    value: BudgetServiceBillable.NON_BILLABLE,
    color: "success.main",
    bgcolor: "success.light",
  };

  const billingNonBillable = {
    label: budgetT("dialogExpense.nonBillable"),
    value: BudgetServiceBillable.NON_BILLABLE,
    color: "error.main",
    bgcolor: "error.light",
  };

  const { fields, append } = useFieldArray({
    name: "services",
    control,
  });

  const headerList: CellProps[] = useMemo(
    () => [
      { value: "", width: 20 },
      {
        value: budgetT("tabService.section.serviceName"),
        align: "center",
        minWidth: 250,
        width: 250,
      },
      {
        value: budgetT("tabService.section.serviceType"),
        align: "center",
        minWidth: 200,
        width: 200,
      },
      {
        value: budgetT("tabService.section.billingType"),
        align: "center",
        minWidth: 200,
        width: 200,
      },
      {
        value: budgetT("tabService.section.unit"),
        align: "center",
        minWidth: 200,
        width: 200,
      },
      {
        value: budgetT("tabService.section.tracking"),
        align: "center",
        minWidth: 160,
        width: 160,
      },
      {
        value: budgetT("tabService.section.estimate"),
        align: "center",
        minWidth: 200,
        width: 200,
      },
      {
        value: budgetT("tabService.section.quantity"),
        align: "center",
        minWidth: 200,
        width: 200,
      },
      {
        value: budgetT("tabService.section.price"),
        align: "center",
        minWidth: 200,
        width: 200,
      },
      {
        value: budgetT("tabService.section.totalBudget"),
        align: "center",
        minWidth: 200,
        width: 200,
      },
      {
        value: "",
        align: "center",
        minWidth: 56,
        width: 56,
      },
    ],
    [],
  );

  const getSxCell = (index: number) => {
    return {
      width: headerList[index]?.width || "0px" + "!important",
      minWidth: headerList[index]?.minWidth || "0px" + "!important",
      maxWidth: headerList[index]?.width || "0px" + "!important",
      p: 1,
    };
  };

  useEffect(() => {
    onGetPositions({});
  }, []);

  useEffect(() => {
    if (serviceData.length === 0) return;

    setValue("services", serviceData);
  }, [JSON.stringify(serviceData)]);

  const createEmptyRow = () => {
    const emptyService = {
      id: uuid(),
      name: "",
      desc: "",
      serviceType: null,
      billType: BudgetServiceBillable.NON_BILLABLE,
      unit: SERVICE_UNIT_OPTIONS.HOUR,
      estimate: 0,
      qty: 0,
      price: 0,
      discount: 0,
      markUp: 0,
      timeTracking: false,
      bookingTracking: false,
      tolBudget: 0,
      isNewService: true,
      sectionId: sectionId,
    };
    append(emptyService);

    updateValue(
      fieldIndex,
      _.concat(watch("services"), [emptyService]) as TBudgetService[],
    );
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
      const newServices = _.filter(
        fields,
        (service) => service.id !== selectedService.id,
      );

      if (!selectedService?.isNewService) {
        serviceSectionRef.current?.setDeletedServices(
          _.get(selectedService, "serviceId", ""),
          fieldIndex,
        );
      }

      setValue("services", newServices);
      setIndexWaitDelete(null);
    }
    cancelConfirmDelete();
  };

  const changeTracking = (
    index: number,
    type: "bookingTracking" | "timeTracking",
  ) => {
    setValue(
      `services.${index}.${type}`,
      !getValues(`services.${index}.${type}`),
    );
    updateValue(fieldIndex, watch("services") as TBudgetService[]);
  };

  const changeTime = (index: number, time: Dayjs | null) => {
    if (!time) {
      setValue(`services.${index}.estimate`, 0);
      setValue(`services.${index}.estimateTime`, "");
      return;
    }
    const hour = time.hour();
    const minute = time.minute();
    setValue(`services.${index}.estimate`, hour * 60 + minute);
    setValue(`services.${index}.estimateTime`, `${hour}:${minute}`);

    updateValue(fieldIndex, watch("services") as TBudgetService[]);
  };

  const changeBilling = (billing: string) => {
    const index = anchorEl?.getAttribute("data-index");
    setValue(`services.${Number(index)}.billType`, billing);
    setAnchorEl(null);
    updateValue(fieldIndex, watch("services") as TBudgetService[]);
  };

  const hasError = (errList: TError[], index: number, name: string) => {
    return !!errList.find(
      (err) => err.fieldName === name && err.itemIndex === index,
    );
  };

  const handleExecActions = (
    action: Action,
    data: { index: number; serviceId: string },
  ) => {
    switch (action) {
      case Action.DELETE:
        openConfirmDelete(data.index);
        break;
      case Action.DUPLICATE:
        const selectedService = _.find(
          fields,
          (service) => service.id === fields[data.index].id,
        );

        if (selectedService) {
          selectedService.id = uuid();
          append(selectedService);

          updateValue(
            fieldIndex,
            _.concat(watch("services"), [selectedService]) as TBudgetService[],
          );
        }
        break;
    }
  };

  return (
    <>
      <Stack
        sx={{
          boxSizing: "border-box",
        }}
        width={"100%"}
      >
        {/* <TableLayoutWithScroll
          headerList={headerList}
          noData={false}
          titleColor="grey.300"
          position="relative"
          containerHeaderProps={{
            sx: {
              maxHeight: { xs: 0, md: undefined },
              minHeight: { xs: 0, md: 40 },
            },
          }}
        > */}
          <Droppable
            droppableId={`sectionList.${sectionId}.${fieldIndex}`}
            type="service"
          >
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  minHeight: 40,
                }}
              >
                {fields.map((service, index) => {
                  const errs = errors[fieldIndex] ?? [];
                  const defautlEstimate = getValues(
                    `services.${index}.estimateTime`,
                  );
                  return (
                    <Draggable
                      draggableId={`${sectionId}.${service.id}.${index}`}
                      index={index}
                      key={service?.id}
                      isDragDisabled={false}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ width: "100%" }}
                        >
                          <Stack
                            direction={{
                              xs: "column",
                              sm: "row",
                            }}
                            // alignItems="center"
                            py={1}
                            sx={{
                              background: "#edebeb", 
                              borderRadius: "24px",  
                              padding: "16px",  
                              width: "100%",   
                              marginBottom: "16px", 
                            }}
                          >
                            <Grid container spacing={2} key={service.id}>
                              <Grid item xs={12}>
                                  {/* <IconButton2
                                  noPadding
                                  {...provided.dragHandleProps}
                                >
                                  <MoveDotIcon />
                                </IconButton2> */}
                                <Grid container spacing={2}>
                                  {/* Row 1 */}
                                  <Grid item xs={3}>
                                    <FormLabel sx={{ color: '#999999', fontWeight: 700, fontSize: '13px' }}>{budgetT("tabService.section.serviceName")}</FormLabel>
                                    <TextField
                                      {...register(`services.${index}.name`)}
                                      size="small"
                                      variant="outlined"
                                      fullWidth
                                      // sx={{
                                      //   maxWidth: "350px !important",
                                      //   "& .MuiOutlinedInput-notchedOutline": {
                                      //     ...(hasError(errs, index, "name") && {
                                      //       borderColor: "error.main",
                                      //     }),
                                      //   },
                                      // }}
                                      sx={{
                                        background: '#FFFFFF',
                                        border: '1px solid #EFEFEF',
                                        borderRadius: 8,
                                        opacity: 1, // Ensure opacity is 1 to make it visible
                                        width: '90%',
                                        '& .MuiOutlinedInput-root': {
                                          padding: 0, // Reset padding to ensure it aligns with your custom padding
                                          '& fieldset': {
                                            border: 'none', // Remove default border
                                          },
                                        },
                                        '& .MuiOutlinedInput-input': {
                                          padding: '10px 20px',
                                          fontWeight: 800,
                                          color: '#4D4D4D', 
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                          border: 'none', // Remove default border
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                          borderColor: 'transparent', // Transparent border on hover
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                          borderColor: 'transparent', // Transparent border when focused
                                        },
                                      }}
                                      autoComplete="off"
                                      onChange={(e) => {
                                        setValue(
                                          `services.${index}.name`,
                                          e?.target?.value || "",
                                        );
                                        updateValue(
                                          index,
                                          watch("services"),
                                        );
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={3}>
                                    <FormLabel sx={{ color: '#999999', fontWeight: 700, fontSize: '13px' }}>{budgetT("tabService.section.serviceType")}</FormLabel>
                                    <Select
                                      size="small"
                                      fullWidth
                                      options={positionOptions as Option[]}
                                      SelectProps={{
                                        IconComponent: () => (
                                          <ChevronCircleIcon
                                            sx={{ fontSize: 20, color: "transparent" }}
                                          />
                                        ),
                                      }}
                                      onChangeValue={(value) => {
                                        setValue(
                                          `services.${index}.serviceType`,
                                          String(value),
                                        );
                                        updateValue(
                                          fieldIndex,
                                          watch("services") as TBudgetService[],
                                        );
                                      }}
                                      value={watch(`services.${index}.serviceType`)}
                                      autoComplete="off"
                                      sx={{
                                        ...sxConfig.input,
                                        minWidth: "160px !important",
                                        [`& .MuiOutlinedInput-notchedOutline`]: {
                                          ...(hasError(errs, index, "type") && {
                                            borderColor: "error.main",
                                          }),
                                        },
                                        "& .MuiInputBase-root ": {
                                          px: 1,
                                          backgroundColor: "background.paper",
                                          fontWeight: 800,
                                        },
                                      }}
                                      titleSx={{
                                        top: -14,
                                        left: -14,
                                        color: "text.primary",
                                        fontWeight: 600,
                                      }}
                                      rootSx={{
                                        p: 0.75,
                                        borderRadius: "2rem",
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={3}>
                                    <FormLabel sx={{ color: '#999999', fontWeight: 700, fontSize: '13px' }}>{budgetT("tabService.section.billType")}</FormLabel>
                                    <Select
                                      size="small"
                                      fullWidth
                                      options={billTypeOptions as Option[]}
                                      onChangeValue={(value) => {
                                        setValue(
                                          `services.${index}.billType`,
                                          String(value),
                                        );
                                        updateValue(
                                          fieldIndex,
                                          watch("services") as TBudgetService[],
                                        );
                                      }}
                                      value={watch(`services.${index}.billType`)}
                                      autoComplete="off"
                                      SelectProps={{
                                        IconComponent: () => (
                                          <ChevronCircleIcon
                                            sx={{ fontSize: 20, color: "transparent" }}
                                          />
                                        ),
                                      }}
                                      sx={{
                                        ...sxConfig.input,
                                        minWidth: "160px !important",
                                        [`& .MuiOutlinedInput-notchedOutline`]: {
                                          ...(hasError(errs, index, "type") && {
                                            borderColor: "error.main",
                                          }),
                                        },
                                        "& .MuiInputBase-root ": {
                                          px: 1,
                                          backgroundColor: "background.paper",
                                        },
                                      }}
                                      titleSx={{
                                        top: -14,
                                        left: -14,
                                        color: "text.primary",
                                        fontWeight: 600,
                                      }}
                                      rootSx={{
                                        p: 0.75,
                                        borderRadius: "2rem",
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={3}>
                                    <FormLabel sx={{ color: '#999999', fontWeight: 700, fontSize: '13px' }}>{budgetT("tabService.section.unit")}</FormLabel>
                                    <Select
                                      size="small"
                                      fullWidth
                                      options={[
                                        {
                                          label: SERVICE_UNIT_OPTIONS.DAY,
                                          value: SERVICE_UNIT_OPTIONS.DAY,
                                        },
                                        {
                                          label: SERVICE_UNIT_OPTIONS.HOUR,
                                          value: SERVICE_UNIT_OPTIONS.HOUR,
                                        },
                                      ]}
                                      onChangeValue={(value) => {
                                        setValue(
                                          `services.${index}.unit`,
                                          String(value),
                                        );
                                        updateValue(
                                          fieldIndex,
                                          watch("services") as TBudgetService[],
                                        );
                                      }}
                                      value={watch(`services.${index}.unit`)}
                                      autoComplete="off"
                                      SelectProps={{
                                        IconComponent: () => (
                                          <ChevronCircleIcon
                                            sx={{ fontSize: 20, color: "transparent" }}
                                          />
                                        ),
                                      }}
                                      sx={{
                                        ...sxConfig.input,
                                        minWidth: "160px !important",
                                        [`& .MuiOutlinedInput-notchedOutline`]: {
                                          ...(hasError(errs, index, "type") && {
                                            borderColor: "error.main",
                                          }),
                                        },
                                        "& .MuiInputBase-root ": {
                                          px: 1,
                                          backgroundColor: "background.paper",
                                        },
                                      }}
                                      titleSx={{
                                        top: -14,
                                        left: -14,
                                        color: "text.primary",
                                        fontWeight: 600,
                                      }}
                                      rootSx={{
                                        p: 0.75,
                                        borderRadius: "2rem",
                                      }}
                                    />
                                  </Grid>
                                  {/* Row 2 */}
                                  <Grid item xs={3}>
                                    <Stack spacing={1}>
                                      <FormLabel sx={{ color: '#999999', fontWeight: 700, fontSize: '13px' }}>{budgetT("tabService.section.tracking")}</FormLabel>
                                      <Stack
                                          gap={1}
                                          direction="row"
                                          justifyContent="flex-start"
                                          alignItems="center"
                                        >
                                          <Box sx={{ 
                                              cursor: "pointer",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              bgcolor: "white", // Background color for the circle
                                              borderRadius: "50%", // Make the background round
                                              width: 40, // Width of the circle
                                              height: 40, // Height of the circle
                                              p: 0.5, // Padding around the icon inside the circle
                                              }}
                                            >
                                            <Tooltip
                                              placement="top"
                                              arrow
                                              title={`Time tracking is ${
                                                !watch(`services.${index}.timeTracking`)
                                                  ? "disable"
                                                  : "enable"
                                              }`}
                                            >
                                              <IconButton
                                                onClick={() =>
                                                  changeTracking(index, "timeTracking")
                                                }
                                              >
                                                <AccessTimeIcon
                                                  sx={{
                                                    color: !watch(
                                                      `services.${index}.timeTracking`,
                                                    )
                                                      ? "grey.300"
                                                      : "secondary.main",
                                                  }}
                                                />
                                              </IconButton>
                                            </Tooltip>
                                          </Box>
                                          <Box sx={{ 
                                              cursor: "pointer",
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              bgcolor: "white", // Background color for the circle
                                              borderRadius: "50%", // Make the background round
                                              width: 40, // Width of the circle
                                              height: 40, // Height of the circle
                                              p: 0.5, // Padding around the icon inside the circle
                                            }}
                                          >
                                            <Tooltip
                                              placement="top"
                                              arrow
                                              title={`Booking tracking is ${
                                                !watch(
                                                  `services.${index}.bookingTracking`,
                                                )
                                                  ? "disable"
                                                  : "enable"
                                              }`}
                                            >
                                              <IconButton
                                                onClick={() =>
                                                  changeTracking(
                                                    index,
                                                    "bookingTracking",
                                                  )
                                                }
                                              >
                                                <CalendarIcon
                                                  sx={{
                                                    color: !watch(
                                                      `services.${index}.bookingTracking`,
                                                    )
                                                      ? "grey.300"
                                                      : "secondary.main",
                                                  }}
                                                />
                                              </IconButton>
                                            </Tooltip>
                                          </Box>
                                      </Stack>
                                    </Stack>
                                  </Grid>
                                  <Grid item xs={3}>
                                    <Stack spacing={1}>
                                      <FormLabel sx={{ color: '#999999', fontWeight: 700, fontSize: '13px' }}>{budgetT("tabService.section.estimate")}</FormLabel>
                                      <TimePicker
                                        disabled={
                                          watch(`services.${index}.billType`) !==
                                            BudgetServiceBillable.FIXED &&
                                          watch(`services.${index}.billType`) !==
                                            BudgetServiceBillable.NON_BILLABLE
                                        }
                                        slotProps={{ textField: { size: "small" } }}
                                        views={["hours", "minutes"]}
                                        format="HH:mm"
                                        defaultValue={
                                          defautlEstimate
                                            ? dayjs(defautlEstimate)
                                            : null
                                        }
                                        sx={{
                                          ...sxConfig.input,
                                          minWidth: "160px !important",
                                          "& .MuiInputBase-input": {
                                            textAlign: "center",
                                            fontWeight: 800,
                                          },
                                          "& .MuiOutlinedInput-notchedOutline": {
                                            ...(hasError(errs, index, "estimate") && {
                                              borderColor: "error.main",
                                            }),
                                          },
                                          "& .MuiInputBase-root": {
                                            px: 1,
                                            backgroundColor: "background.paper",
                                            borderRadius: "20px",
                                          },
                                        }}
                                        onChange={(time: Dayjs | null) =>
                                          changeTime(index, time)
                                        }
                                      />
                                    </Stack>
                                  </Grid>
                                  <Grid item xs={3}>
                                    <FormLabel sx={{ color: '#999999', fontWeight: 700, fontSize: '13px' }}>{budgetT("tabService.section.quantity")}</FormLabel>
                                    <TextField
                                      {...register(`services.${index}.qty`)}
                                      disabled={
                                        watch(`services.${index}.billType`) !==
                                          BudgetServiceBillable.FIXED &&
                                        watch(`services.${index}.billType`) !==
                                          BudgetServiceBillable.ACTUALS
                                      }
                                      size="small"
                                      variant="outlined"
                                      fullWidth
                                      type="number"
                                      // sx={{
                                      //   maxWidth: "350px !important",
                                      //   "& .MuiOutlinedInput-notchedOutline": {
                                      //     ...(hasError(errs, index, "qty") && {
                                      //       borderColor: "error.main",
                                      //     }),
                                      //   },
                                      // }}
                                      sx={{
                                        background: '#FFFFFF',
                                        border: '1px solid #EFEFEF',
                                        borderRadius: 8,
                                        opacity: 1, // Ensure opacity is 1 to make it visible
                                        width: '90%',
                                        '& .MuiOutlinedInput-root': {
                                          padding: 0, // Reset padding to ensure it aligns with your custom padding
                                          '& fieldset': {
                                            border: 'none', // Remove default border
                                          },
                                        },
                                        '& .MuiOutlinedInput-input': {
                                          padding: '10px 20px', 
                                          fontWeight: 800,
                                          color: '#4D4D4D', 
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                          border: 'none', // Remove default border
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                          borderColor: 'transparent', // Transparent border on hover
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                          borderColor: 'transparent', // Transparent border when focused
                                        },
                                      }}
                                      autoComplete="off"
                                      onChange={(e) => {
                                        setValue(
                                          `services.${index}.qty`,
                                          Number(e?.target?.value) || 0,
                                        );
                                        updateValue(
                                          fieldIndex,
                                          watch("services") as TBudgetService[],
                                        );
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={3}>
                                    <FormLabel sx={{ color: '#999999', fontWeight: 700, fontSize: '13px' }}>{budgetT("tabService.section.price")}</FormLabel>
                                    <Stack
                                      direction="row"
                                      alignItems={"center"}
                                      gap={1}
                                    >
                                      <TextField
                                        {...register(`services.${index}.price`)}
                                        disabled={
                                          watch(`services.${index}.billType`) !==
                                            BudgetServiceBillable.FIXED &&
                                          watch(`services.${index}.billType`) !==
                                            BudgetServiceBillable.ACTUALS
                                        }
                                        size="small"
                                        variant="outlined"
                                        fullWidth
                                        type="number"
                                        sx={{
                                          maxWidth: "350px !important",
                                          "& .MuiOutlinedInput-notchedOutline": {
                                            ...(hasError(errs, index, "price") && {
                                              borderColor: "error.main",
                                            }),
                                            border: 'none',
                                          },
                                          background: '#FFFFFF',
                                          border: '1px solid #EFEFEF',
                                          borderRadius: 8,
                                          opacity: 1,
                                          width: '90%',
                                          '& .MuiOutlinedInput-root': {
                                            padding: 0,
                                            '& fieldset': {
                                              border: 'none',
                                            },
                                          },
                                          '& .MuiOutlinedInput-input': {
                                            padding: '10px 20px',
                                            fontWeight: 800,
                                            color: '#4D4D4D', 
                                          },
                                          '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'transparent',
                                          },
                                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'transparent',
                                          },
                                        }}
                                        autoComplete="off"
                                        onChange={(e) => {
                                          setValue(
                                            `services.${index}.price`,
                                            Number(e?.target?.value) || 0,
                                          );
                                          updateValue(
                                            fieldIndex,
                                            watch("services") as TBudgetService[],
                                          );
                                        }}
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              <Box
                                                sx={{
                                                  fontSize: '13px',
                                                  fontWeight: 800,
                                                  lineHeight: '20.43px',
                                                  textAlign: 'center',
                                                  color: '#4D4D4D', 
                                                  padding: '0 10px', 
                                                }}
                                              >
                                                {"USD/" +
                                                  (watch(`services.${index}.unit`) === "hour" ? "hr" : "day")
                                                }
                                              </Box>
                                            </InputAdornment>
                                          ),
                                        }}
                                      />
                                      
                                    </Stack>
                                  </Grid>
                                  {/* Row 3 */}
                                  <Grid item xs={12}>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end', // Align items to the right
                                        alignItems: 'center', // Vertically center the items
                                        gap: '10px', // Add spacing between elements
                                      }}
                                    >
                                      <FormLabel
                                        sx={{
                                          color: '#999999',
                                          fontWeight: 700,
                                          fontSize: '13px',
                                        }}
                                      >
                                        {budgetT("tabService.section.totalBudget")}
                                      </FormLabel>
                                      
                                      <TextField
                                        disabled
                                        size="small"
                                        variant="outlined"
                                        type="number"
                                        sx={{
                                          "& .MuiOutlinedInput-notchedOutline": {
                                            border: 'none',
                                          },
                                          background: '#FFFFFF',
                                          border: '1px solid #EFEFEF',
                                          borderRadius: 8,
                                          opacity: 1,
                                          width: 'auto', // Auto-adjust width
                                          minWidth: '150px', // Minimum width
                                          '& .MuiOutlinedInput-root': {
                                            padding: 0,
                                            '& fieldset': {
                                              border: 'none',
                                            },
                                          },
                                          '& .MuiOutlinedInput-input': {
                                            padding: '10px 20px',
                                            fontWeight: 800,
                                            color: '#4D4D4D',
                                            textAlign: 'right',
                                            '&::placeholder': {
                                              color: '#333333', // Darker color for placeholder
                                              fontWeight: 700, // Bolder font weight for placeholder
                                            },
                                          },
                                          '& .Mui-disabled': {
                                            color: '#000000', // Custom color for disabled text
                                            WebkitTextFillColor: '#000000', // Ensures color is applied in WebKit browsers
                                          },
                                          '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'transparent',
                                          },
                                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'transparent',
                                          },
                                        }}
                                        placeholder={formatNumber(
                                          (watch(`services.${index}.qty`) || 0) *
                                            (watch(`services.${index}.price`) || 0),
                                          {
                                            prefix: CURRENCY_SYMBOL["USD"],
                                            numberOfFixed: 0,
                                          }
                                        )}
                                        autoComplete="off"
                                      />
                                      
                                      <ServiceItemAction
                                        onChangeAction={handleExecActions}
                                        serviceId={service.id}
                                        index={index}
                                      />
                                    </Box>
                                  </Grid>
                                </Grid>
                                </Grid>
                              </Grid>            
                          </Stack>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              </div>
            )}
          </Droppable>
        {/* </TableLayoutWithScroll> */}
        <Box pl={3} mt={1}>
          <Button
            size="small"
            startIcon={<PlusIcon />}
            sx={{ color: "secondary.main" }}
            onClick={createEmptyRow}
          >
            {budgetT("tabService.section.addItem")}
          </Button>
        </Box>
      </Stack>
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
    </>
  );
};

export default ServiceSectionRow;

const sxConfig = {
  input: {
    height: 56,
  },
};