import { Box, Stack, TableRow } from "@mui/material";
import { BodyCell, StatusCell } from "components/Table";
import { IconButton, Select, Text } from "components/shared";
import React, {
  HtmlHTMLAttributes,
  LegacyRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { Draggable } from "react-beautiful-dnd";
import MoveDotIcon from "icons/MoveDotIcon";

import { Service } from "store/sales/reducer";
import { get } from "lodash";
import { formatNumber } from "utils/index";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { ServiceColumn } from "components/sn-sales-detail/hooks/useGetHeaderColumn";
// import { Action } from "../../TodoList/SubItem";
import { UNIT_OPTIONS } from "components/sn-sales/Modals/AddDealsModal";
import { useSaleDetail, useSalesService } from "store/sales/selectors";
import LockIcon from "icons/LockIcon";
import UnlockIcon from "icons/UnlockIcon";
import { CURRENCY_CODE, SALE_BILL_TYPE } from "constant/enums";
import {
  COLOR_BILL_TYPE,
  SALE_BILL_TYPE_LABEL,
  mappedUnit,
} from "components/sn-sales-detail/helpers";
import { Option } from "constant/types";
import { useGetBillTypeOptions } from "components/sn-sales-detail/hooks/useGetBillTypeOptions";
import { NS_SALES } from "constant/index";
// import CustomLabelSelect from "../../CustomLabelSelect";
// import CustomInput from "../../CustomInput/CustomInput";
// import CustomDesktopInput from "../../CustomInput/CustomDesktopInput";
import { useTranslations } from "next-intl";
import { useGetServiceUnitOptions } from "components/sn-sales-detail/hooks/useGetServiceUnitOptions";
import useGetOptions from "components/sn-resource-planing/hooks/useGetOptions";
import { scrollViewContext } from "components/sn-sales-detail/hooks/useScrollErrorField";
import { Action } from "../../SubItem";
import CustomDesktopInput from "components/sn-sales-detail/components/CustomInput/CustomDesktopInput";
import CustomLabelSelect from "components/sn-sales-detail/components/CustomLabelSelect";
import { EditContext } from "components/sn-sales-detail/components/sn-service/context/EditContext";
import ServiceItemAction from "components/sn-sales-detail/components/sn-service/ServiceTable/ServiceItemAction";
// import useScrollErrorField from "components/sn-sales-detail/hooks/useScrollErrorField";

interface IProps {
  index: number;
  sectionKey: string;
  service: Service;
  sectionIndex: number;
  onAction: (action: Action) => void;
}

const ServiceTableItem = ({
  index,
  sectionKey,
  service,
  sectionIndex,
  onAction,
}: IProps) => {
  const { isEdit } = useContext(EditContext);
  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { sectionColumns } = useSalesService();
  const [isLocked, setIsLocked] = React.useState(false);
  const saleT = useTranslations(NS_SALES);
  const { billTypeOptions } = useGetBillTypeOptions();
  const { saleDetail } = useSaleDetail();
  const { positionOptions } = useGetOptions();
  const currency = saleDetail?.currency;
  const scrollContext = useContext(scrollViewContext);
  // const { scrollErrorField } = useScrollErrorField();
  const { serviceUnitOptions } = useGetServiceUnitOptions();
  const [billType, unit, qty, price, discount, tolBudgetForm] = useWatch({
    control,
    name: [
      `${sectionKey}.${index}.billType`,
      `${sectionKey}.${index}.unit`,
      `${sectionKey}.${index}.qty`,
      `${sectionKey}.${index}.price`,
      `${sectionKey}.${index}.discount`,
      `${sectionKey}.${index}.tolBudget`,
    ],
  });

  const position = useMemo(() => {
    if (!service.serviceType) return "";
    const result = positionOptions.find(
      (item) => item.value === service.serviceType,
    );
    return result?.label || "";
  }, [positionOptions]);

  const isShowCols = useCallback(
    (cols: ServiceColumn) => {
      if (!sectionColumns[sectionIndex]) return true;
      return sectionColumns[sectionIndex].columns.includes(cols);
    },
    [JSON.stringify(sectionColumns)],
  );

  const defaultBillType = useMemo(() => {
    if (!service.billType) return SALE_BILL_TYPE.FIX;

    return service.billType;
  }, [service.billType]);

  const tolBuget = useMemo(() => {
    // if (typeof service.tolBudget !== "number") {
    //   return parseFloat(service.tolBudget);
    // }
    const result = qty * price * (1 - discount / 100);
    setValue(`${sectionKey}.${index}.tolBudget`, result.toFixed(2));
    return result;
  }, [tolBudgetForm, qty, price, unit, discount]);

  useEffect(() => {
    setValue(
      `${sectionKey}.${index}.unit`,
      service.unit ?? UNIT_OPTIONS[0].value,
    );
  }, [index, sectionKey]);

  useEffect(() => {
    if (billType === SALE_BILL_TYPE.ACTUAL) {
      setValue(`${sectionKey}.${index}.estimate`, 0);
    }
    if (billType === SALE_BILL_TYPE.NON_BILLABLE) {
      setValue(`${sectionKey}.${index}.price`, 0);
      setValue(`${sectionKey}.${index}.qty`, 0);
      setValue(`${sectionKey}.${index}.discount`, 0);
    }
  }, [billType]);

  return (
    <Draggable
      draggableId={`${sectionKey}.${service.id}.${index}`}
      index={index}
      key={service?.id}
      isDragDisabled={isLocked || !isEdit}
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
            {isEdit && (
              <IconButton
                sx={{
                  position: "relative",
                  zIndex: 999,
                }}
                noPadding
                {...provided.dragHandleProps}
              >
                <MoveDotIcon />
              </IconButton>
            )}
            <TableRow>
              <BodyCell
                align="left"
                size="small"
                sx={{
                  ...defaultSx.item,
                  ml: 2,
                }}
              >
                <CustomDesktopInput
                  name={`${sectionKey}.${index}.name`}
                  control={control}
                  required
                  disabled={isLocked}
                  isEdit={isEdit}
                  value={service.name}
                />
              </BodyCell>
              {isShowCols(ServiceColumn.DESCRIPTION) && (
                <BodyCell
                  sx={{
                    ...defaultSx.item,
                    height: "auto",
                  }}
                  align="left"
                >
                  <CustomDesktopInput
                    name={`${sectionKey}.${index}.desc`}
                    control={control}
                    required
                    disabled={isLocked}
                    isEdit={isEdit}
                    value={service.desc}
                  />
                </BodyCell>
              )}
              <BodyCell
                sx={{
                  ...defaultSx.item,
                }}
                align="left"
              >
                {isEdit ? (
                  <Controller
                    control={control}
                    {...register(`${sectionKey}.${index}.serviceType`)}
                    render={({ field }) => {
                      return (
                        <Select
                          defaultValue={
                            service?.serviceType || positionOptions[0]
                          }
                          {...field}
                          disabled={isLocked}
                          showSubText
                          options={positionOptions as Option[]}
                          sx={{
                            width: "100%",
                            [`& .MuiInputBase-root`]: {
                              px: 1,
                              backgroundColor: "background.paper",
                              pl: 0,
                              gap: 1,
                            },
                          }}
                        />
                      );
                    }}
                  />
                ) : (
                  <Text variant="body2">{position}</Text>
                )}
              </BodyCell>
              <BodyCell
                sx={{
                  ...defaultSx.item,
                  [`& .MuiFormControl-root`]: {
                    width: "100%",
                  },
                }}
                align="left"
              >
                {isEdit ? (
                  <Controller
                    control={control}
                    {...register(`${sectionKey}.${index}.billType`)}
                    defaultValue={{
                      value: defaultBillType,
                    }}
                    render={({ field }) => (
                      <CustomLabelSelect
                        {...field}
                        defaultValue={defaultBillType}
                        options={billTypeOptions as Option[]}
                        disabled={isLocked}
                      />
                    )}
                  />
                ) : (
                  <StatusCell
                    sx={{
                      [`&.MuiTableCell-body`]: {
                        borderBottom: "none",
                        height: "fit-content",
                      },
                      [`&.MuiTableCell-root`]: {
                        display: "flex",
                        borderBottom: "none",
                        alignItems: "center",
                        justifyContent: "start",
                        padding: 0,
                        maxWidth: "fill-available!important",
                        minWidth: "auto!important",
                      },
                      padding: 0,
                      width: "100%",
                      [`&.MuiSvgIcon-root`]: {
                        display: "none",
                      },
                    }}
                    text={SALE_BILL_TYPE_LABEL[service.billType]}
                    textProps={{
                      sx: {
                        width: "100%",
                      },
                    }}
                    color={COLOR_BILL_TYPE[service.billType]}
                    namespace={NS_SALES}
                  />
                )}
              </BodyCell>
              <BodyCell
                sx={{
                  ...defaultSx.item,
                }}
                align="left"
              >
                {isEdit ? (
                  <Controller
                    control={control}
                    {...register(`${sectionKey}.${index}.unit`)}
                    render={({ field }) => {
                      return (
                        <Select
                          defaultValue={currency}
                          {...field}
                          disabled={isLocked}
                          showSubText
                          options={serviceUnitOptions as Option[]}
                          sx={{
                            width: "100%",
                            [`& .MuiInputBase-root`]: {
                              backgroundColor: "background.paper",
                              px: 1,
                              [`& .MuiTypography-root:nth-child(2)`]: {
                                display: "none",
                              },
                            },
                          }}
                        />
                      );
                    }}
                  />
                ) : (
                  <Text variant="body2">
                    {saleT(`detail.service.unit.${unit}`)}
                  </Text>
                )}
              </BodyCell>

              {isShowCols(ServiceColumn.ESTIMATE) && (
                <BodyCell
                  sx={{
                    ...defaultSx.item,
                    pointerEvents: "auto",
                  }}
                  align="left"
                >
                  <CustomDesktopInput
                    name={`${sectionKey}.${index}.estimate`}
                    control={control}
                    disabled={isLocked || billType === SALE_BILL_TYPE.ACTUAL}
                    isEdit={isEdit}
                    helperText={saleT(
                      `detail.service.unit.${unit}`,
                    ).toLowerCase()}
                    toolTipText={
                      billType === SALE_BILL_TYPE.ACTUAL
                        ? saleT("detail.service.table.estTooltip")
                        : undefined
                    }
                    rules={{
                      min: {
                        value: 0,
                        message: "It must be greater than 0",
                      },
                    }}
                    type="number"
                    value={`${service.estimate || 0}h`}
                  />
                </BodyCell>
              )}

              <BodyCell
                sx={{
                  ...defaultSx.item,
                }}
                align="left"
              >
                <CustomDesktopInput
                  name={`${sectionKey}.${index}.qty`}
                  control={control}
                  disabled={
                    isLocked || billType === SALE_BILL_TYPE.NON_BILLABLE
                  }
                  isEdit={isEdit}
                  isRound
                  // helperText="pcs"
                  type="number"
                  inputProps={{
                    inputProps: {
                      min: 0,
                    },
                  }}
                  rules={{
                    min: {
                      value: 0,
                      message: "It must be no less than 0",
                    },
                  }}
                  value={formatNumber(
                    typeof service.qty === "string"
                      ? parseInt(service.qty)
                      : service.qty,
                    { suffix: "pcs" },
                  )}
                />
              </BodyCell>
              {isShowCols(ServiceColumn.PRICE) && (
                <BodyCell
                  sx={{
                    ...defaultSx.item,
                  }}
                  align="left"
                >
                  <CustomDesktopInput
                    name={`${sectionKey}.${index}.price`}
                    control={control}
                    disabled={
                      isLocked || billType === SALE_BILL_TYPE.NON_BILLABLE
                    }
                    isEdit={isEdit}
                    value={formatNumber(
                      typeof service.price === "string"
                        ? parseInt(service.price)
                        : service.price,
                      {
                        prefix:
                          CURRENCY_SYMBOL[currency as CURRENCY_CODE] || "",
                        suffix: `/${saleT(
                          `detail.service.unit.${unit}`,
                        ).toLowerCase()}`,
                        numberOfFixed: 2,
                      },
                    )}
                    type="number"
                    inputProps={{
                      type: "number",
                      inputProps: {
                        min: 0,
                      },
                    }}
                    rules={{
                      min: {
                        value: 0,
                        message: "It must be no less than 0",
                      },
                    }}
                    helperText={`${
                      CURRENCY_SYMBOL[currency as CURRENCY_CODE] || ""
                    }/${saleT(`detail.service.unit.${unit}`).toLowerCase()}`}
                  />
                </BodyCell>
              )}
              {isShowCols(ServiceColumn.DISCOUNT) && (
                <BodyCell
                  sx={{
                    ...defaultSx.item,
                  }}
                  align="left"
                >
                  <CustomDesktopInput
                    name={`${sectionKey}.${index}.discount`}
                    control={control}
                    disabled={
                      isLocked || billType === SALE_BILL_TYPE.NON_BILLABLE
                    }
                    isEdit={isEdit}
                    value={formatNumber(
                      typeof service.discount === "string"
                        ? parseInt(service.discount)
                        : service.discount,
                      {
                        suffix: "%",
                      },
                    )}
                    rules={{
                      min: {
                        value: 0,
                        message: "It must be no less than 0",
                      },
                      max: {
                        value: 100,
                        message: "It must be no more than 100",
                      },
                    }}
                    type="number"
                    helperText="%"
                  />
                </BodyCell>
              )}
              <BodyCell
                sx={{
                  ...defaultSx.item,
                }}
                align="left"
              >
                <CustomDesktopInput
                  name={`${sectionKey}.${index}.tolBudget`}
                  control={control}
                  disabled={
                    // isLocked || billType === SALE_BILL_TYPE.NON_BILLABLE
                    true
                  }
                  isEdit={isEdit}
                  value={formatNumber(tolBuget, {
                    numberOfFixed: 2,
                    prefix: CURRENCY_SYMBOL[currency as CURRENCY_CODE],
                  })}
                  helperText={CURRENCY_SYMBOL[currency as CURRENCY_CODE]}
                  type="number"
                />
              </BodyCell>

              {isEdit && (
                <BodyCell
                  sx={{
                    padding: 0,
                    position: "relative",
                    maxWidth: "max-content",
                  }}
                >
                  <Stack
                    direction={"row"}
                    spacing={0}
                    sx={{
                      position: "relative",
                      zIndex: 99,
                    }}
                  >
                    <IconButton
                      sx={{
                        width: "24px",
                        color: isLocked ? "success.main" : "text.main",
                      }}
                      onClick={() => setIsLocked(!isLocked)}
                    >
                      {isLocked ? <LockIcon /> : <UnlockIcon />}
                    </IconButton>
                    <ServiceItemAction
                      onChangeAction={onAction}
                      serviceId={service.id}
                      index={index}
                    />
                  </Stack>
                </BodyCell>
              )}
            </TableRow>
          </Stack>
        </div>
      )}
    </Draggable>
  );
};

export default ServiceTableItem;

const defaultSx = {
  item: {
    "&.MuiTableCell-root": {
      py: 1,
      px: 1,
    },
  },
};
