import { Link, Stack } from "@mui/material";
import { CellProps, TableLayout } from "components/Table";
import { Button, Text } from "components/shared";
import useGetOptions from "components/sn-resource-planing/hooks/useGetOptions";
import { SALE_BILL_TYPE, SERVICE_UNIT_OPTIONS } from "constant/enums";
import { NS_BILLING, NS_COMMON, NS_SALES } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import PlusIcon from "icons/PlusIcon";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSalesService } from "store/sales/selectors";
import { uuid } from "utils/index";
import ServiceTableItem from "./ServiceTableItemDesktop";
import ServiceTableItemMobile from "./ServiceTableItemMobile";
import { Service } from "store/billing/reducer";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Option } from "constant/types";

interface IProps {
  // section: ServiceSection;
  // index: number;
  // provided: DroppableProvided;
  isEdit?: boolean;
  listService: Service[];
  OptionBudget?: Option[];
  setListService: (value: Service[]) => void;
}
const billingFormTranslatePrefix = "list.form";

const ServiceTable = (props: IProps) => {
  const { isEdit, listService, setListService, OptionBudget } = props;
  const salesT = useTranslations(NS_SALES);
  const { isMdSmaller } = useBreakpoint();
  const commonT = useTranslations(NS_COMMON);
  const billingT = useTranslations(NS_BILLING);
  const { positionOptions } = useGetOptions();

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      {
        value: "",
        width: "5%",
      },
      {
        value: `${billingT("detail.form.invoice.table.service_type")}`,
        width: "20%",
        align: "left",
      },
      {
        value: `${billingT("detail.form.invoice.table.description")}`,
        width: "20%",
        align: "left",
      },
      {
        value: `${billingT("detail.form.invoice.table.unit")}`,
        width: "15%",
        align: "left",
      },
      {
        value: `${billingT("detail.form.invoice.table.qty")}`,
        width: "15%",
      },
      {
        value: `${billingT("detail.form.invoice.table.rate")}`,
        width: "15%",
      },
      {
        value: `${billingT("detail.form.invoice.table.discount")}`,
        width: "15%",
        align: "left",
      },
      {
        value: `${billingT("detail.form.invoice.table.amount")}`,
        width: "20%",
        align: "right",
      },
      {
        value: "",
        width: "5%",
      },
    ],
    [billingT],
  );
  const mobileHeaderList: CellProps[] = useMemo(
    () => [
      {
        value: "",
        width: "5%",
      },
      {
        value: `${billingT("detail.form.invoice.table.service_type")}`,
        width: "20%",
        align: "left",
      },
      {
        value: `${billingT("detail.form.invoice.table.description")}`,
        width: "20%",
        align: "left",
      },
      {
        value: `${billingT("detail.form.invoice.table.unit")}`,
        width: "15%",
        align: "left",
      },
      {
        value: `${billingT("detail.form.invoice.table.qty")}`,
        width: "15%",
      },
      {
        value: `${billingT("detail.form.invoice.table.rate")}`,
        width: "15%",
      },
      {
        value: `${billingT("detail.form.invoice.table.discount")}`,
        width: "15%",
        align: "left",
      },
      {
        value: `${billingT("detail.form.invoice.table.amount")}`,
        width: "15%",
        align: "right",
      },
      {
        value: "",
        width: "5%",
      },
    ],
    [billingT],
  );

  const headerList = useMemo(() => {
    const additionalHeaderList = isMdSmaller
      ? mobileHeaderList
      : desktopHeaderList;
    return [
      ...additionalHeaderList,
      { value: "", width: "10%" },
    ] as CellProps[];
  }, [desktopHeaderList, isMdSmaller, mobileHeaderList]);

  const addRow = () => {
    if (listService && listService?.length === 0) {
      setListService([
        {
          id: uuid(),
          name: "2132",
          desc: "345446",
          serviceType: positionOptions[0]?.value,
          price: 0,
          billType: SALE_BILL_TYPE.FIX,
          qty: 0,
          discount: 0,
          unit: SERVICE_UNIT_OPTIONS.DAY,
          tolBudget: 0,
          estimate: 0,
        } as Service,
      ]);
    } else {
      setListService([
        ...listService,
        {
          id: uuid(),
          name: "2132",
          desc: "345446",
          serviceType: positionOptions[0]?.value,
          price: 0,
          billType: SALE_BILL_TYPE.FIX,
          qty: 0,
          discount: 0,
          unit: SERVICE_UNIT_OPTIONS.DAY,
          tolBudget: 0,
          estimate: 0,
        } as Service,
      ]);
    }
  };

  const removeRow = (row) => {
    if (listService && listService?.length > 0) {
      setListService?.(listService?.filter((item) => item.id !== row.id));
    }
  };
  const onDragEnd = (e) => {
    if (!e.destination) return;
    const tempData = Array.from(listService);
    const [source_data] = tempData.splice(e.source.index, 1);
    tempData.splice(e.destination.index, 0, source_data);
    setListService(tempData ?? []);
  };

  const handleChangeValue = (
    id: string,
    keyObj: string,
    value: string | number,
  ) => {
    if (listService && listService.length > 0) {
      if (id) {
        setListService(
          listService?.map((sev) =>
            sev.id === id ? { ...sev, [`${keyObj}`]: value } : { ...sev },
          ),
        );
      }
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable type="section" direction="vertical" droppableId={"Table"}>
          {(provided) => (
            <Stack
              py={2}
              sx={{
                boxSizing: "border-box",
              }}
              width={"100%"}
              ref={provided.innerRef}
            >
              <Stack direction="column" spacing={2}>
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
                    maxHeight={300}
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
                    {listService?.map((item, index) => (
                      <ServiceTableItem
                        service={item ?? {}}
                        index={index}
                        isEdit={isEdit}
                        key={item.id}
                        onRemoveRow={removeRow}
                        handleChangeValue={handleChangeValue}
                        OptionBudget={OptionBudget}
                      />
                    ))}
                    {provided.placeholder}
                  </TableLayout>
                </Stack>

                {isEdit && isMdSmaller && (
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
                          {/* {salesT("detail.service.table.totalBuget")}: */}
                        </Text>
                        <Text
                          variant="body2"
                          color="primary.main"
                          fontSize={16}
                          fontWeight={600}
                        ></Text>
                      </Stack>
                    </Stack>
                    {listService?.map((item, index) => (
                      <ServiceTableItemMobile
                        service={item}
                        index={index}
                        key={item.id}
                        onRemoveRow={removeRow}
                        handleChangeValue={handleChangeValue}
                        OptionBudget={OptionBudget}
                      />
                    ))}
                  </div>
                )}
              </Stack>
              {isEdit && (
                <Stack direction={"row"} gap={2} alignItems={"center"}>
                  <Button
                    variant="text"
                    sx={{ textDecoration: "none", display: "flex" }}
                    onClick={() => addRow()}
                  >
                    <PlusIcon sx={{ color: "#1BC5BD", mr: 1 }} />
                    <Text variant={"body1"} color={"#1BC5BD"}>
                      {billingT("detail.form.invoice.button.addNewRow")}
                    </Text>
                  </Button>
                </Stack>
              )}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default ServiceTable;
