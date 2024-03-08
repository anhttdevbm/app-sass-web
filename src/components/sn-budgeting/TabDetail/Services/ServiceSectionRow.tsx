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
import { BodyCell, CellProps } from "components/Table";
import {
  Button,
  Select,
  Text,
  IconButton as IconButton2,
} from "components/shared";
import useGetOptions from "components/sn-resource-planing/hooks/useGetOptions";
import CalendarIcon from "icons/CalendarIcon";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { usePositions } from "store/company/selectors";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { useTranslations } from "next-intl";
import { NS_BUDGETING } from "constant/index";
import { uuid } from "utils/index";
import PlusIcon from "icons/PlusIcon";
import TrashIcon from "icons/TrashIcon";
import ConfirmDialog from "components/ConfirmDialog";
import useToggle from "hooks/useToggle";
import dayjs, { Dayjs } from "dayjs";
import { TError, TErrors } from "./ServiceUtil";
import { serviceSectionRef } from "./ServiceSection";
import _ from "lodash";
import { TBudgetService } from "components/sn-budgeting/BudgetDetail";
import { TableLayoutWithScroll } from "components/Table/TableLayoutWithScroll";
import { HEADER_HEIGHT } from "layouts/Header";
import { BudgetServiceBillable, SERVICE_UNIT_OPTIONS } from "constant/enums";
import { Option } from "constant/types";
import { Droppable, Draggable } from "react-beautiful-dnd";
import MoveDotIcon from "icons/MoveDotIcon";

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

  const billingBillable = {
    label: budgetT("dialogExpense.billable"),
    value: BudgetServiceBillable.BILLABLE,
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
      {
        value: budgetT("tabService.section.serviceName"),
        align: "center",
        minwidth: 250,
        width: 250,
      },
      {
        value: budgetT("tabService.section.serviceType"),
        align: "center",
        minwidth: 200,
        width: 200,
      },
      {
        value: budgetT("tabService.section.billingType"),
        align: "center",
        minwidth: 200,
        width: 200,
      },
      {
        value: budgetT("tabService.section.unit"),
        align: "center",
        minwidth: 200,
        width: 200,
      },
      {
        value: budgetT("tabService.section.tracking"),
        align: "center",
        minwidth: 160,
        width: 160,
      },
      {
        value: budgetT("tabService.section.estimate"),
        align: "center",
        minwidth: 200,
        width: 200,
      },
      {
        value: "",
        align: "center",
        minwidth: 56,
        width: 56,
      },
    ],
    [],
  );

  const getSxCell = (index: number) => {
    return {
      width: headerList[index]?.width || "0px" + "!important",
      minWidth: headerList[index]?.minwidth || "0px" + "!important",
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
      billType: BudgetServiceBillable.BILLABLE,
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

  return (
    <>
      <Stack
        sx={{
          boxSizing: "border-box",
        }}
        width={"100%"}
      >
        <TableLayoutWithScroll
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
        >
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
                  const billStatus =
                    watch(`services.${index}.billType`) ===
                    BudgetServiceBillable.BILLABLE
                      ? billingBillable
                      : billingNonBillable;
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
                        >
                          <Stack
                            direction={{
                              xs: "column",
                              sm: "row",
                            }}
                            alignItems="center"
                            py={1}
                          >
                            <IconButton2
                              noPadding
                              {...provided.dragHandleProps}
                            >
                              <MoveDotIcon />
                            </IconButton2>
                            <TableRow key={service.id}>
                              <BodyCell sx={getSxCell(0)}>
                                <TextField
                                  {...register(`services.${index}.name`)}
                                  size="small"
                                  variant="outlined"
                                  fullWidth
                                  sx={{
                                    maxWidth: "350px !important",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                      ...(hasError(errs, index, "name") && {
                                        borderColor: "error.main",
                                      }),
                                    },
                                  }}
                                  autoComplete="off"
                                  onChange={(e) => {
                                    setValue(
                                      `services.${index}.name`,
                                      e?.target?.value || "",
                                    );
                                    updateValue(
                                      fieldIndex,
                                      watch("services") as TBudgetService[],
                                    );
                                  }}
                                />
                              </BodyCell>
                              <BodyCell sx={getSxCell(1)}>
                                <Select
                                  size="small"
                                  fullWidth
                                  options={positionOptions as Option[]}
                                  // options={[
                                  //   { label: "Dev", value: "dev" },
                                  //   { label: "QC", value: "qc" },
                                  //   { label: "BA", value: "ba" },
                                  // ]}
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
                                    minWidth: "160px !important",
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
                              <BodyCell sx={getSxCell(2)}>
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
                                      "&:hover": {
                                        bgcolor: billStatus.bgcolor,
                                      },
                                    }}
                                  >
                                    {billStatus.label}
                                  </Button>
                                </Stack>
                              </BodyCell>
                              <BodyCell sx={getSxCell(3)}>
                                <TextField
                                  size="small"
                                  id="unit"
                                  variant="outlined"
                                  fullWidth
                                  value={SERVICE_UNIT_OPTIONS.HOUR}
                                  disabled
                                  inputProps={{ sx: { textAlign: "center" } }}
                                  autoComplete="off"
                                />
                              </BodyCell>
                              <BodyCell sx={getSxCell(4)}>
                                <Stack
                                  gap={1}
                                  direction="row"
                                  justifyContent="center"
                                >
                                  <Box sx={{ cursor: "pointer" }}>
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
                                  <Box sx={{ cursor: "pointer" }}>
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
                              </BodyCell>
                              <BodyCell sx={getSxCell(5)}>
                                <TimePicker
                                  slotProps={{ textField: { size: "small" } }}
                                  views={["hours", "minutes"]}
                                  format="HH:mm"
                                  defaultValue={
                                    defautlEstimate
                                      ? dayjs(defautlEstimate)
                                      : null
                                  }
                                  sx={{
                                    width: "160px !important",
                                    minWidth: "160px !important",
                                    maxWidth: "160px !important",
                                    "& .MuiInputBase-input": {
                                      textAlign: "center",
                                    },
                                    "& .MuiOutlinedInput-notchedOutline": {
                                      ...(hasError(errs, index, "estimate") && {
                                        borderColor: "error.main",
                                      }),
                                    },
                                  }}
                                  onChange={(time: Dayjs | null) =>
                                    changeTime(index, time)
                                  }
                                />
                              </BodyCell>
                              <BodyCell>
                                <TrashIcon
                                  fontSize="medium"
                                  sx={{
                                    color: "error.main",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => openConfirmDelete(index)}
                                />
                              </BodyCell>
                            </TableRow>
                          </Stack>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              </div>
            )}
          </Droppable>
        </TableLayoutWithScroll>
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
