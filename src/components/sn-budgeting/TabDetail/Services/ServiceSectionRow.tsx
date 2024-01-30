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
import { Button, Select, Text } from "components/shared";
import useGetOptions from "components/sn-resource-planing/hooks/useGetOptions";
import CalendarIcon from "icons/CalendarIcon";
import { useEffect, useState } from "react";
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

type TForm = {
  data: TBudgetService[];
};

type Props = {
  fieldIndex: number;
  updateValue: (index: number, data: TBudgetService[]) => void;
  errors: TErrors;
  serviceData: any[];
  deletedServices: any[];
  sectionId: string;
};

export const ServiceSectionRow = ({
  fieldIndex,
  updateValue,
  errors,
  serviceData = [],
  deletedServices,
  sectionId = "",
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [indexWaitDelete, setIndexWaitDelete] = useState<number | null>(null);
  const [isOpenConfirm, openConfirm, closeConfirm] = useToggle();
  const refClickOutSide = useOnClickOutside(() => setAnchorEl(null));
  const { register, control, setValue, watch, getValues } = useForm<TForm>();
  const { onGetPositions } = usePositions();
  const { positionOptions } = useGetOptions();
  const budgetT = useTranslations(NS_BUDGETING);

  const { fields, append, remove } = useFieldArray({
    name: "data",
    control,
  });

  const headerList: CellProps[] = [
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
  ];

  const getSxCell = (index: number) => {
    return {
      width: headerList[index]?.width || "0px" + "!important",
      minWidth: headerList[index]?.minwidth || "0px" + "!important",
      maxWidth: headerList[index]?.width || "0px" + "!important",
      p: 1
    };
  };

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
      updateValue(fieldIndex, value.data as TBudgetService[]);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (serviceData.length === 0) return;
    const servicesItems = _.map(serviceData, (service) => {
      const estimate: number = service.estimate;
      const hour = Math.floor(estimate / 60);
      const minute = estimate - hour * 60;

      return {
        ...service,
        id: uuid(),
        serviceId: service.id,
        estimate: dayjs().hour(hour).minute(minute).toString(),
        billingType: service.billType,
        type: service.serviceType,
      } as any;
    });

    setValue("data", servicesItems);
  }, [serviceData]);

  const createEmptyRow = () => {
    append({
      id: uuid(),
      name: "",
      type: "",
      billingType: "non_billable",
      unit: "hour",
      estimate: "",
      bookingTracking: false,
      timeTracking: false,
      desc: "",
      discount: 0,
      markUp: 0,
      price: 0,
      qty: 0,
      tolBudget: 0,
      sectionId: _.get(serviceData, "sectionId", ""),
      isNewService: true,
    } as any);
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
        _.concat(deletedServices, [_.get(selectedService, "serviceId", "")]),
      );
      setIndexWaitDelete(indexWaitDelete);
      remove(Number(indexWaitDelete));
    }
    cancelConfirmDelete();
  };

  const changeTracking = (
    index: number,
    type: "bookingTracking" | "timeTracking",
  ) => {
    setValue(`data.${index}.${type}`, !getValues(`data.${index}.${type}`));
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
    <>
      <Stack
        py={2}
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
              minHeight: { xs: 0, md: HEADER_HEIGHT },
            },
          }}
        >
          {fields.map((service, index) => {
            const errs = errors[fieldIndex] ?? [];
            const billStatus =
              watch(`data.${index}.billingType`) === "billable"
                ? billingBillable
                : billingNonBillable;
            const defautlEstimate = getValues(`data.${index}.estimate`);
            return (
              <TableRow key={service.id}>
                <BodyCell sx={getSxCell(0)}>
                  <TextField
                    size="small"
                    variant="outlined"
                    fullWidth
                    sx={{
                      maxWidth: '350px !important',
                      "& .MuiOutlinedInput-notchedOutline": {
                        ...(hasError(errs, index, "name") && {
                          borderColor: "error.main",
                        }),
                      },
                    }}
                    autoComplete="off"
                    {...register(`data.${index}.name`)}
                  />
                </BodyCell>
                <BodyCell sx={getSxCell(1)}>
                  <Select
                    size="small"
                    fullWidth
                    // options={positionOptions as Option[]}
                    options={[
                      { label: 'Dev', value: 'dev' },
                      { label: 'QC', value: 'qc' },
                      { label: 'BA', value: 'ba' }
                    ]}
                    onChangeValue={(value) => {
                      setValue(`data.${index}.type`, String(value));
                    }}
                    value={watch(`data.${index}.type`)}
                    autoComplete="off"
                    sx={{
                      minWidth: '160px !important',
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
                        "&:hover": { bgcolor: billStatus.bgcolor },
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
                    value="hour"
                    disabled
                    inputProps={{ sx: { textAlign: "center" } }}
                    autoComplete="off"
                  />
                </BodyCell>
                <BodyCell sx={getSxCell(4)}>
                  <Stack gap={1} direction="row" justifyContent="center">
                    <Box sx={{ cursor: "pointer" }}>
                      <Tooltip
                        placement="top"
                        arrow
                        title={`Time tracking is ${
                          !watch(`data.${index}.timeTracking`)
                            ? "disable"
                            : "enable"
                        }`}
                      >
                        <IconButton
                          onClick={() => changeTracking(index, "timeTracking")}
                        >
                          <AccessTimeIcon
                            sx={{
                              color: !watch(`data.${index}.timeTracking`)
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
                          !watch(`data.${index}.bookingTracking`)
                            ? "disable"
                            : "enable"
                        }`}
                      >
                        <IconButton
                          onClick={() =>
                            changeTracking(index, "bookingTracking")
                          }
                        >
                          <CalendarIcon
                            sx={{
                              color: !watch(`data.${index}.bookingTracking`)
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
                      defautlEstimate ? dayjs(defautlEstimate) : null
                    }
                    sx={{
                      width: "160px !important",
                      minWidth: "160px !important",
                      maxWidth: "160px !important",
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
        </TableLayoutWithScroll>
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
