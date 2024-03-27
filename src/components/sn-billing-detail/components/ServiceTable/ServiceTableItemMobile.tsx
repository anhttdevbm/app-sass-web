import { Stack, TextField } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import useGetOptions from "components/sn-resource-planing/hooks/useGetOptions";
import { useGetBillTypeOptions } from "components/sn-sales-detail/hooks/useGetBillTypeOptions";
import { ServiceColumn } from "components/sn-sales-detail/hooks/useGetHeaderColumn";
import { useGetServiceUnitOptions } from "components/sn-sales-detail/hooks/useGetServiceUnitOptions";
import { NS_COMMON, NS_SALES } from "constant/index";
import { useTranslations } from "next-intl";
import React, { useCallback, useContext, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useSaleDetail, useSalesService } from "store/sales/selectors";
import { BodyCell } from "components/Table";
import { IconButton, Select, Text } from "components/shared";
import TrashIcon from "icons/TrashIcon";
import { Budgets, Service } from "store/billing/reducer";
import { Draggable } from "react-beautiful-dnd";
import LinkPopup from "../LinkPopup";
import { Option } from "constant/types";
import { formatNumber } from "utils/index";
import { CURRENCY_CODE } from "constant/enums";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";

interface IProps {
  index: number;
  service: Service;
  isEdit?: boolean;
  arrBudgets?: Budgets[];
  arrServices?: Service[];
  onRemoveRow: (value: Service) => void;
  handleChangeValue: (
    id: string,
    keyObj: string,
    value: string | number | null,
  ) => void;
}

const prefixT = "detail.service.table";

const ServiceTableItemMobile = ({
  index,
  service,
  onRemoveRow,
  isEdit,
  arrBudgets,
  arrServices,
  handleChangeValue,
}: IProps) => {
  const commonT = useTranslations(NS_COMMON);
  const [isLocked, setIsLocked] = React.useState(false);
  const { register, control, getValues, setValue } = useFormContext();
  const { saleDetail } = useSaleDetail();
  const currency = saleDetail?.currency;
  const { sectionColumns } = useSalesService();
  const { serviceUnitOptions } = useGetServiceUnitOptions();
  const { billTypeOptions } = useGetBillTypeOptions();
  const { positionOptions } = useGetOptions();

  const optionService = useMemo(() => {
    const options = arrServices?.map((item) => {
      return { label: item.name, value: item?.id };
    });
    return options;
  }, [arrServices]);

  return (
    <Draggable
      draggableId={service.id}
      index={index}
      isDragDisabled={!isEdit}
      key={service?.id}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
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
                <BodyCell align="left" size="small">
                  {isEdit ? (
                    <LinkPopup
                      arrBudgets={arrBudgets}
                      service={service}
                      arrServices={arrServices}
                      handleChangeValue={handleChangeValue}
                    />
                  ) : (
                    ""
                  )}
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
                      value={service.name}
                      options={optionService as Option[]}
                      key={service?.id}
                      id={service.id}
                      onChange={(e) => {
                        handleChangeValue(service?.id, "name", e.target.value);
                      }}
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
                  ) : (
                    <Text variant="body2">{service?.name}</Text>
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
              </Stack>
            </Grid2>
            <Grid2
              xs={2}
              justifyContent={"flex-end"}
              py={2}
              alignItems="center"
            >
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
