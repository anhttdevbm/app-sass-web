import { CellProps, TableLayout } from "components/Table";
import { NS_COMMON, NS_SALES } from "constant/index";
import { useTranslations } from "next-intl";
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import ServiceTableItem from "./ServiceTableItemDesktop";
import { Stack, TableBody } from "@mui/material";
import { Button, IconButton, Text } from "components/shared";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";

import PlusIcon from "icons/PlusIcon";
import useBreakpoint from "hooks/useBreakpoint";
import ServiceTableItemMobile from "./ServiceTableItemMobile";
import SectionItemAction from "./SectionItemAction";
import useItemAction from "components/sn-sales-detail/hooks/useItemAction";
import useFetchServiceSection from "components/sn-sales-detail/hooks/useGetServiceSection";
import { Service, ServiceSection } from "store/sales/reducer";
import {
  FieldValues,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { formatNumber, uuid } from "utils/index";
import {
  ServiceColumn,
  useGetHeaderColumn,
} from "components/sn-sales-detail/hooks/useGetHeaderColumn";
import { useSalesService } from "store/sales/selectors";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import {
  CURRENCY_CODE,
  SALE_BILL_TYPE,
  SERVICE_UNIT_OPTIONS,
} from "constant/enums";
import { UNIT_OPTIONS } from "components/sn-sales/Modals/AddDealsModal";
import useGetOptions from "components/sn-resource-planing/hooks/useGetOptions";
import MoveDotIcon from "icons/MoveDotIcon";
import { EditContext } from "components/sn-sales-detail/components/sn-service/context/EditContext";

interface IProps {
  section: ServiceSection;
  index: number;
  provided?: DroppableProvided;
  onAddSection: () => void;
  onRemoveSection: () => void;
}

const ServiceTable = ({
  section,
  index,
  provided,
  onAddSection,
  onRemoveSection,
}: IProps) => {
  const salesT = useTranslations(NS_SALES);
  const { isEdit } = useContext(EditContext);
  const { isMdSmaller } = useBreakpoint();
  const { columns: defaultColumns } = useGetHeaderColumn(index);
  const { control, getValues } = useFormContext();
  const { positionOptions } = useGetOptions();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `sectionsList.${index}.service`,
  });
  const { sectionColumns } = useSalesService();
  const { onAction } = useItemAction(
    index,
    append as UseFieldArrayAppend<FieldValues, string>,
    remove as UseFieldArrayRemove,
    onRemoveSection,
    fields,
  );

  const onAddRow = () => {
    append({
      id: uuid(),
      name: "",
      desc: "",
      serviceType: positionOptions[0]?.value,
      price: 0,
      billType: SALE_BILL_TYPE.FIX,
      qty: 0,
      discount: 0,
      unit: SERVICE_UNIT_OPTIONS.DAY,
      tolBudget: 0,
      estimateUSD: 0,
      tolBudgetUSD: 0,
    });
  };

  const totalBuget = useMemo(() => {
    const result = fields?.reduce((prev, item) => {
      const price = (item as Service).tolBudget || 0;
      return prev + price;
    }, 0);
    return formatNumber(result, {
      prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
      numberOfFixed: 2,
    });
  }, [fields]);

  const headerList = useMemo(() => {
    const list = defaultColumns.reduce((prev, item) => {
      const sections = sectionColumns[index];
      if (!sections) {
        prev.push(item);
        return prev;
      }
      const isExisted = sections?.columns.includes(item.id as ServiceColumn);
      if (isExisted) {
        prev.push(item);
      }
      return prev;
    }, [] as CellProps[]);

    if (isEdit && !list.find((item) => item.id === ServiceColumn.ACTION)) {
      list.push({
        id: ServiceColumn.ACTION,
        value: "",
        width: "4%",
      });
    }
    return list;
  }, [JSON.stringify(sectionColumns), isEdit]);

  return (
    <Draggable draggableId={section.id} index={index} isDragDisabled={!isEdit}>
      {(provided) => (
        <Stack
          py={2}
          sx={{
            boxSizing: "border-box",
          }}
          width={"100%"}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          {/* <Draggable draggableId={section.id} index={index}>
        {(provided) => ( */}
          <Stack direction="column" spacing={2} {...provided.dragHandleProps}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                {isEdit && (
                  <IconButton noPadding>
                    <MoveDotIcon fontSize="small" sx={{ color: "grey.A200" }} />
                  </IconButton>
                )}
                <Text variant="h4">
                  {section.name || `Section ${index + 1}`}
                </Text>
                {isEdit && !isMdSmaller && (
                  <SectionItemAction
                    sectionIndex={index}
                    sectionId={section.id}
                    onChangeAction={onAction}
                  />
                )}
              </Stack>
              {/* <Button
                  onClick={onAddSection}
                  variant="text"
                  TouchRippleProps={{
                    style: {
                      display: "none",
                    },
                  }}
                  sx={{
                    display: index !== 0 || !isEdit ? "none" : "block",
                    width: "fit-content",
                    height: "fit-content",
                    "&.MuiButton-text:hover": {
                      color: "secondary.main",
                      textAlign: "center",
                    },
                  }}
                  color="secondary"
                  startIcon={
                    <PlusIcon
                      sx={{
                        width: 18,
                        height: 18,
                      }}
                    />
                  }
                >
                  {salesT("detail.service.addSection")}
                </Button> */}
            </Stack>
            {/* Table layout desktop */}
            {(!isMdSmaller || !isEdit) && (
              <Stack
                sx={{
                  overflow: {
                    xs: "auto",
                  },
                  pr: 1,
                }}
              >
                <TableLayout
                  headerList={headerList}
                  maxHeight={920}
                  headerProps={{
                    sx: {
                      px: 1,
                      pl: isEdit ? 4 : 1,
                    },
                  }}
                  sx={{
                    minHeight: 100,
                    minWidth: {
                      md: isEdit ? 1625 : 1320,
                      xs: isEdit ? "100%" : 1320,
                      overflow: "visible",
                    },
                    width: "100%",
                    [`&.MuiTableCell-root :first-child`]: {
                      pl: 4,
                    },
                  }}
                  position="relative"
                >
                  {/* <DragDropContext onDragEnd={onDragService}>
                      <Droppable droppableId="droppableService"> */}
                  <Droppable
                    droppableId={`sectionList.${section.id}.${index}`}
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
                        {fields?.map((item, serviceIndex) => (
                          <ServiceTableItem
                            onAction={onAction}
                            service={item as Service}
                            index={serviceIndex}
                            key={item.id}
                            sectionIndex={index}
                            sectionKey={`sectionsList.${index}.service`}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  {/* )} */}
                  {/* </Droppable> */}
                  {/* </DragDropContext> */}
                </TableLayout>
              </Stack>
            )}

            {isEdit && isMdSmaller && (
              // <DragDropContext onDragEnd={onDragService}>
              // <Droppable droppableId="droppableService">
              // {(provided) => (
              <div>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{
                    py: 2,
                    px: 4,
                    borderRadius: 2,
                    backgroundColor: "blue.light",
                  }}
                  justifyContent="space-between"
                  width="100%"
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Text variant="body2" fontSize={14} color={"grey.300"}>
                      {salesT("detail.service.table.totalBuget")}:
                    </Text>
                    <Text
                      variant="body2"
                      color="primary.main"
                      fontSize={16}
                      fontWeight={600}
                    >
                      {totalBuget}
                    </Text>
                  </Stack>
                  <Stack justifyContent="flex-end">
                    {isEdit && (
                      <SectionItemAction
                        sectionIndex={index}
                        sectionId={section.id}
                        onChangeAction={onAction}
                      />
                    )}
                  </Stack>
                </Stack>
                {fields?.map((item, serviceIndex) => (
                  <ServiceTableItemMobile
                    onAction={onAction}
                    service={item as Service}
                    index={serviceIndex}
                    key={item.id}
                    sectionIndex={index}
                    sectionId={section.id}
                    sectionKey={`sectionsList.${index}.service`}
                  />
                ))}
              </div>
              // )}
              // </Droppable>
              // </DragDropContext>
            )}
          </Stack>
          {/* )}  */}
          {/* </Draggable> */}
          <Stack direction="row" spacing={2}>
            <Button
              onClick={onAddRow}
              variant="text"
              TouchRippleProps={{
                style: {
                  display: "none",
                },
              }}
              sx={{
                display: isEdit ? "block" : "none",
                width: "fit-content",
                "&.MuiButton-text:hover": {
                  color: "secondary.main",
                },
              }}
              color="secondary"
              startIcon={
                <PlusIcon
                  sx={{
                    width: 18,
                    height: 18,
                  }}
                />
              }
            >
              {salesT("detail.service.addNewRow")}
            </Button>
          </Stack>
        </Stack>
      )}
    </Draggable>
  );
};

export default ServiceTable;
