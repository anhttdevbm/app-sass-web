import { Stack, Tooltip } from "@mui/material";
import { Button, IconButton, Input, Text } from "components/shared";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { EditContext } from "../context/EditContext";
import { Draggable } from "react-beautiful-dnd";
import MoveDotIcon from "icons/MoveDotIcon";
import { NS_SALES } from "constant/index";
import { useTranslations } from "next-intl";
import { Service } from "store/sales/reducer";
import { Action } from "../../TodoList/SubItem";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import ServiceItemAction from "./ServiceItemAction";
import LockIcon from "icons/LockIcon";
import UnlockIcon from "icons/UnlockIcon";
import { useFormContext, useWatch } from "react-hook-form";
import { useSaleDetail, useSalesService } from "store/sales/selectors";
import { ServiceColumn } from "components/sn-sales-detail/hooks/useGetHeaderColumn";
import CustomInput from "../../CustomInput/CustomInput";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { UNIT_OPTIONS } from "components/sn-sales/Modals/AddDealsModal";
import CustomSelect from "../../CustomInput/CustomSelect";
import { useGetBillTypeOptions } from "components/sn-sales-detail/hooks/useGetBillTypeOptions";
import { CURRENCY_CODE, SALE_BILL_TYPE } from "constant/enums";
import { useGetServiceUnitOptions } from "components/sn-sales-detail/hooks/useGetServiceUnitOptions";
import useGetOptions from "components/sn-resource-planing/hooks/useGetOptions";
import { mappedUnit } from "components/sn-sales-detail/helpers";

interface IProps {
  index: number;
  sectionKey: string;
  service: Service;
  sectionIndex: number;
  sectionId: string;
  onAction: (action: Action) => void;
}

const prefixT = "detail.service.table";

const ServiceTableItemMobile = ({
  index,
  sectionKey,
  service,
  sectionIndex,
  sectionId,
  onAction,
}: IProps) => {
  const { isEdit } = useContext(EditContext);
  const saleT = useTranslations(NS_SALES);
  const [isLocked, setIsLocked] = React.useState(false);
  const { register, control, getValues, setValue } = useFormContext();
  const { saleDetail } = useSaleDetail();
  const currency = saleDetail?.currency;
  const { sectionColumns } = useSalesService();
  const { serviceUnitOptions } = useGetServiceUnitOptions();
  const { billTypeOptions } = useGetBillTypeOptions();
  const { positionOptions } = useGetOptions();
  const [billType, unit, qty, price, discount] = useWatch({
    control,
    name: [
      `${sectionKey}.${index}.billType`,
      `${sectionKey}.${index}.unit`,
      `${sectionKey}.${index}.qty`,
      `${sectionKey}.${index}.price`,
      `${sectionKey}.${index}.discount`,
    ],
  });

  const tolBuget = useMemo(() => {
    if (typeof service.tolBudget !== "number") {
      return parseFloat(service.tolBudget);
    }
    const result = ((qty * price) / mappedUnit[unit]) * (1 - discount / 100);
    setValue(`${sectionKey}.${index}.tolBudget`, result.toFixed(2));
    return service.tolBudget;
  }, [service.tolBudget, qty, price, unit, discount]);

  const isShowCols = useCallback(
    (cols: ServiceColumn) => {
      if (!sectionColumns[sectionIndex]) return true;
      return sectionColumns[sectionIndex].columns.includes(cols);
    },
    [sectionColumns],
  );

  const draggableId = useMemo(() => {
    return `SERVICE-SECTION-${index}`;
  }, [index]);

  useEffect(() => {
    setValue(
      `${sectionKey}.${index}.unit`,
      service.unit ?? UNIT_OPTIONS[0].value,
    );
  }, [index, sectionKey]);

  return (
    <Draggable
      draggableId={`${sectionKey}.${service.id}.${index}`}
      index={index}
      isDragDisabled={!isEdit}
      key={service?.id}
    >
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <Grid2
            container
            sx={{
              border: "1px solid #E0E0E0",
              mt: 2,
              borderRadius: "8px",
              px: 1,
            }}
          >
            <Grid2 xs={10}>
              <Stack
                sx={{
                  py: 2,
                }}
                spacing={2}
              >
                <CustomInput
                  inputProps={{
                    multiline: true,
                    disabled: isLocked,
                  }}
                  control={control}
                  disabled={isLocked}
                  defaultValue={service.name}
                  label={saleT(`${prefixT}.name`)}
                  register={register(`${sectionKey}.${index}.name`)}
                />
                <CustomInput
                  inputProps={{
                    disabled: isLocked,
                    multiline: true,
                  }}
                  control={control}
                  disabled={isLocked}
                  defaultValue={service.desc}
                  label={saleT(`${prefixT}.description`)}
                  register={register(`${sectionKey}.${index}.desc`)}
                />
                <CustomSelect
                  inputProps={{
                    disabled: isLocked,
                    multiline: true,
                  }}
                  disabled={isLocked}
                  options={positionOptions}
                  control={control}
                  defaultValue={service.serviceType}
                  label={saleT(`${prefixT}.position`)}
                  register={register(`${sectionKey}.${index}.serviceType`)}
                />
                <CustomInput
                  inputProps={{
                    disabled: isLocked,
                    multiline: true,
                  }}
                  control={control}
                  select
                  disabled={isLocked}
                  options={billTypeOptions}
                  defaultValue={service.billType || billTypeOptions[0].value}
                  label={saleT(`${prefixT}.billType`)}
                  register={register(`${sectionKey}.${index}.billType`)}
                />
                <CustomSelect
                  options={serviceUnitOptions}
                  inputProps={{
                    disabled: isLocked,
                    multiline: true,
                  }}
                  control={control}
                  disabled={isLocked}
                  defaultValue={service.unit}
                  label={saleT(`${prefixT}.unit`)}
                  register={register(`${sectionKey}.${index}.unit`)}
                />

                <CustomInput
                  control={control}
                  defaultValue={service.estimate}
                  inputProps={{
                    type: "number",
                  }}
                  disabled={isLocked || billType === SALE_BILL_TYPE.ACTUAL}
                  helperText="h"
                  label={saleT(`${prefixT}.estimate`)}
                  register={register(`${sectionKey}.${index}.estimate`)}
                />

                <CustomInput
                  control={control}
                  defaultValue={service.qty}
                  disabled={
                    isLocked || billType === SALE_BILL_TYPE.NON_BILLABLE
                  }
                  inputProps={{
                    disabled: isLocked,
                    type: "number",
                  }}
                  isRound
                  label={saleT(`${prefixT}.quantity`)}
                  register={register(`${sectionKey}.${index}.qty`)}
                />
                <CustomInput
                  control={control}
                  defaultValue={service.price}
                  inputProps={{
                    type: "number",
                    inputProps: {
                      min: 0,
                    },
                  }}
                  disabled={
                    isLocked || billType === SALE_BILL_TYPE.NON_BILLABLE
                  }
                  helperText={`${
                    CURRENCY_SYMBOL[currency as CURRENCY_CODE]
                  }/${saleT(`detail.service.unit.${unit}`)}`}
                  label={saleT(`${prefixT}.price`)}
                  register={register(`${sectionKey}.${index}.price`)}
                />
                <CustomInput
                  control={control}
                  defaultValue={service.discount}
                  inputProps={{
                    disabled: isLocked,
                    type: "number",
                    inputProps: {
                      min: 0,
                      max: 100,
                    },
                  }}
                  helperText="%"
                  disabled={
                    isLocked || billType === SALE_BILL_TYPE.NON_BILLABLE
                  }
                  label={saleT(`${prefixT}.discount`)}
                  register={register(`${sectionKey}.${index}.discount`)}
                />
                <CustomInput
                  control={control}
                  defaultValue={service.tolBudget}
                  inputProps={{
                    disabled: isLocked,
                    type: "number",
                  }}
                  disabled={
                    true
                    // isLocked || billType === SALE_BILL_TYPE.NON_BILLABLE
                  }
                  helperText={CURRENCY_SYMBOL[currency as CURRENCY_CODE]}
                  label={saleT(`${prefixT}.totalBuget`)}
                  register={register(`${sectionKey}.${index}.tolBudget`)}
                />
              </Stack>
            </Grid2>
            <Grid2
              xs={2}
              justifyContent={"flex-end"}
              py={2}
              alignItems="center"
            >
              <Stack>
                {isEdit && (
                  <Stack direction={"column"} spacing={0} alignItems="center">
                    <ServiceItemAction
                      onChangeAction={onAction}
                      serviceId={service.id}
                      index={index}
                    />
                    <IconButton
                      sx={{
                        width: "24px",
                        color: isLocked ? "success.main" : "text.main",
                      }}
                      onClick={() => setIsLocked(!isLocked)}
                    >
                      {isLocked ? <LockIcon /> : <UnlockIcon />}
                    </IconButton>
                  </Stack>
                )}
              </Stack>
            </Grid2>
          </Grid2>
        </div>
      )}
    </Draggable>
  );
};

export default ServiceTableItemMobile;

const defaultSx = {
  item: {
    "&.MuiTableCell-root": {
      py: 2,
    },
  },
};
