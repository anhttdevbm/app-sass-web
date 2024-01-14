import { Stack, TableRow, TextField } from "@mui/material";
import { BodyCell, StatusCell } from "components/Table";
import { IconButton, Input, Select, Text } from "components/shared";
import {
  COLOR_BILL_TYPE,
  SALE_BILL_TYPE_LABEL,
} from "components/sn-sales-detail/helpers";
import { useGetBillTypeOptions } from "components/sn-sales-detail/hooks/useGetBillTypeOptions";
import { ServiceColumn } from "components/sn-sales-detail/hooks/useGetHeaderColumn";
import { useGetServiceUnitOptions } from "components/sn-sales-detail/hooks/useGetServiceUnitOptions";
import { scrollViewContext } from "components/sn-sales-detail/hooks/useScrollErrorField";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { CURRENCY_CODE, SALE_BILL_TYPE } from "constant/enums";
import { NS_COMMON, NS_SALES } from "constant/index";
import { Option } from "constant/types";
import LinkBudgetIcon from "icons/LinkBudgetIcon";
import LinkIcon from "icons/LinkIcon";
import LinkSquareIcon from "icons/LinkSquareIcon";
import LockIcon from "icons/LockIcon";
import MoveDotIcon from "icons/MoveDotIcon";
import TrashIcon from "icons/TrashIcon";
import UnlockIcon from "icons/UnlockIcon";
import { useTranslations } from "next-intl";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useFormContext } from "react-hook-form";
import { Service } from "store/billing/reducer";
import useGetOptions from "store/billing/selectors";
import { useSaleDetail, useSalesService } from "store/sales/selectors";
import { formatNumber } from "utils/index";
import LinkPopup from "../LinkPopup";

interface IProps {
  index: number;
  service: Service;
  isEdit?: boolean;
  OptionBudget?: Option[];
  onRemoveRow: (value: Service) => void;
  handleChangeValue: (
    id: string,
    keyObj: string,
    value: string | number,
  ) => void;
}

const ServiceTableItem = ({
  index,
  service,
  isEdit,
  OptionBudget,
  onRemoveRow,
  handleChangeValue,
}: IProps) => {
  const { sectionColumns } = useSalesService();
  const [isLocked, setIsLocked] = React.useState(false);
  const commonT = useTranslations(NS_COMMON);
  const { billTypeOptions } = useGetBillTypeOptions();
  const { saleDetail } = useSaleDetail();
  const { positionOptions, onGetPositions } = useGetOptions();
  const currency = saleDetail?.currency;

  const { serviceUnitOptions } = useGetServiceUnitOptions();

  const position = useMemo(() => {
    if (!service.serviceType) return "";
    const result = positionOptions.find(
      (item) => item.value === service.serviceType,
    );
    return result?.label || "";
  }, [positionOptions]);

  const isShowCols = useCallback((cols: ServiceColumn) => {
    // if (!sectionColumns[sectionIndex]) return true;
    return cols;
  }, []);

  const defaultBillType = useMemo(() => {
    if (!service.billType) return SALE_BILL_TYPE.FIX;

    return service.billType;
  }, [service.billType]);

  return (
    <Draggable
      draggableId={service.id}
      index={index}
      key={service?.id}
      isDragDisabled={!isEdit}
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
                  zIndex: 2,
                }}
                noPadding
              >
                <MoveDotIcon />
              </IconButton>
            )}
            <TableRow sx={{ height: 46, alignItems: "center" }}>
              <BodyCell align="left" size="small">
                <LinkPopup OptionBudget={OptionBudget} service={service} />
              </BodyCell>
              <BodyCell
                align="left"
                size="small"
                sx={{
                  ...defaultSx.item,
                  ml: 2,
                }}
                key={service.id}
              >
                {isEdit ? (
                  <Select
                    defaultValue={currency}
                    disabled={isLocked}
                    showSubText
                    value={service.serviceType}
                    options={positionOptions as Option[]}
                    key={service?.id}
                    id={service.id}
                    onChange={(e) => {
                      handleChangeValue(
                        service?.id,
                        "serviceType",
                        e.target.value,
                      );
                    }}
                    sx={{
                      width: "100%",
                      [`& .MuiInputBase-root`]: {
                        backgroundColor: "background.paper",
                        px: 1,
                        [`& .MuiTypography-root:nth-child(2)`]: {
                          display: "none",
                        },
                        height: 52,
                        mt: 1,
                      },
                    }}
                  />
                ) : (
                  <Text variant="body2">
                    {positionOptions?.find(
                      (item) => item.value === service?.serviceType,
                    )?.label ??
                      service?.serviceType ??
                      ""}
                  </Text>
                )}
              </BodyCell>

              <BodyCell
                sx={{
                  ...defaultSx.item,
                  height: "auto",
                }}
                align="left"
                key={service.id}
              >
                {isEdit ? (
                  <TextField
                    value={service?.desc}
                    disabled={!isEdit}
                    name="desc"
                    sx={{ height: 46 }}
                    key={service?.id}
                    id={service.id}
                    onChange={(e) => {
                      handleChangeValue(service?.id, "desc", e.target.value);
                    }}
                  />
                ) : (
                  <Text variant="body2">{service?.desc}</Text>
                )}
              </BodyCell>
              <BodyCell
                sx={{
                  ...defaultSx.item,
                }}
                align="left"
              >
                {isEdit ? (
                  <Select
                    defaultValue={currency}
                    disabled={isLocked}
                    showSubText
                    value={service.unit}
                    name="unit"
                    options={serviceUnitOptions as Option[]}
                    key={service?.id}
                    id={service.id}
                    onChange={(e) => {
                      handleChangeValue(service?.id, "unit", e.target.value);
                    }}
                    sx={{
                      width: "100%",
                      [`& .MuiInputBase-root`]: {
                        backgroundColor: "background.paper",
                        px: 1,
                        [`& .MuiTypography-root:nth-child(2)`]: {
                          display: "none",
                        },
                        height: 52,
                        mt: 1,
                      },
                    }}
                  />
                ) : (
                  <Text variant="body2">{service?.unit}</Text>
                )}
              </BodyCell>
              <BodyCell
                sx={{
                  ...defaultSx.item,
                }}
                align="center"
              >
                {isEdit ? (
                  <TextField
                    value={service.qty}
                    name="qty"
                    key={service?.id}
                    id={service.id}
                    sx={{ height: 46 }}
                    onChange={(e) => {
                      handleChangeValue(
                        service?.id,
                        "qty",
                        e.target.value !== "" ? Number(e.target.value) : 0,
                      );
                    }}
                  />
                ) : (
                  <Text variant="body2">{service.qty}</Text>
                )}
              </BodyCell>
              <BodyCell
                sx={{
                  ...defaultSx.item,
                  [`& .MuiFormControl-root`]: {
                    width: "100%",
                  },
                }}
                align="center"
              >
                {isEdit ? (
                  <TextField
                    value={service.estimate}
                    name="estimate"
                    key={service?.id}
                    id={service.id}
                    type="number"
                    sx={{ height: 46 }}
                    onChange={(e) => {
                      handleChangeValue(
                        service?.id,
                        "estimate",
                        e.target.value !== "" ? Number(e.target.value) : 0,
                      );
                    }}
                  />
                ) : (
                  <Text variant="body2">
                    {formatNumber(service.estimate, {
                      suffix: CURRENCY_CODE.USD,
                      numberOfFixed: 2,
                    })}
                  </Text>
                )}
              </BodyCell>

              <BodyCell
                sx={{
                  ...defaultSx.item,
                }}
                align="left"
              >
                {isEdit ? (
                  <TextField
                    value={service.discount}
                    name="discount"
                    key={service?.id}
                    id={service.id}
                    sx={{ height: 46 }}
                    onChange={(e) => {
                      handleChangeValue(
                        service?.id,
                        "discount",
                        e.target.value !== "" ? Number(e.target.value) : 0,
                      );
                    }}
                  />
                ) : (
                  <Text variant="body2">
                    {formatNumber(service.discount, {
                      suffix: "%",
                      numberOfFixed: 2,
                    })}
                  </Text>
                )}
              </BodyCell>

              <BodyCell
                sx={{
                  ...defaultSx.item,
                }}
                align="right"
              >
                {isEdit ? (
                  <TextField
                    value={service.price}
                    name="price"
                    sx={{ height: 46 }}
                    key={service?.id}
                    id={service.id}
                    onChange={(e) => {
                      handleChangeValue(
                        service?.id,
                        "price",
                        e.target.value !== "" ? Number(e.target.value) : 0,
                      );
                    }}
                  />
                ) : (
                  <Text variant="body2">
                    {formatNumber(service.price, {
                      suffix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
                      numberOfFixed: 2,
                    })}
                  </Text>
                )}
              </BodyCell>

              {isEdit && (
                <BodyCell align="left" sx={{ px: { xs: 0.5, md: 2 } }}>
                  <IconButton
                    onClick={() => onRemoveRow(service)}
                    tooltip={commonT("delete")}
                    variant="normal"
                    size="small"
                    sx={{
                      // backgroundColor: isDarkMode ? "grey.50" : "primary.light",
                      color: "text.primary",
                      p: { xs: "4px!important", md: 1 },
                      "&:hover svg": {
                        color: "common.white",
                      },
                    }}
                  >
                    <TrashIcon fontSize="small" />
                  </IconButton>
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
