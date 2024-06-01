"use client";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import _ from "lodash";

import { DataStatus } from "constant/enums";
import { NS_COMMON, NS_COST_RATE } from "constant/index";
import { Checkbox, IconButton, Text } from "components/shared";
import FormLayout from "components/NewFormLayout";
import {
  TableLayout,
  BodyCell,
  CellProps,
  ActionsCell,
} from "components/NewTable";
import TrashAltIcon from "icons/TrashAltIcon";
import useToggle from "hooks/useToggle";
import { useSnackbar } from "store/app/selectors";
import { CostRate } from "store/employeeDetail/reducer";
import { useCostRate } from "store/employeeDetail/selectors";
import { getMessageErrorByAPI } from "utils/index";
import { useEmployeeDetailContext } from "../EmployeeDetailContext";

type CostRateTableProps = {
  items: CostRate[];
  isEditable?: boolean;
  handleItemEdit: (id: string) => void;
  handleItemDelete: (id: string) => void;
};

const CostRateTable = ({
  items,
  isEditable = false,
  handleItemEdit,
  handleItemDelete,
}: CostRateTableProps) => {
  const commonT = useTranslations(NS_COMMON);
  const costRateT = useTranslations(NS_COST_RATE);
  const { onAddSnackbar } = useSnackbar();
  const [selectedList, setSelectedList] = useState<string[]>([]);

  const { employee } = useEmployeeDetailContext();
  const { status, handleDeleteMultiCostRate: handleDeleteMultiCostRateAPI } =
    useCostRate();

  const onToggleSelect = (item: string, indexSelected: number) => {
    return () => {
      if (indexSelected === -1) {
        setSelectedList((prevList) => [...prevList, item]);
      } else {
        setSelectedList((prevList) =>
          prevList.filter((_, idx) => idx !== indexSelected),
        );
      }
    };
  };
  const isCheckedAll = useMemo(
    () => !!(selectedList.length && selectedList.length === items.length),
    [selectedList.length, items.length],
  );
  const isCheckedNone = useMemo(
    () => selectedList.length === 0,
    [selectedList.length],
  );
  const onChangeAll = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      if (isChecked) {
        setSelectedList(items.map((i) => i.id));
      } else {
        setSelectedList([]);
      }
    },
    [items],
  );

  const [isConfirmModalShown, showConfirmModal, hideConfirmModal] = useToggle();
  const handleDeleteMultiCostRate = useCallback(async () => {
    try {
      await handleDeleteMultiCostRateAPI({
        employeeId: employee.id,
        data: { cost_rate_ids: selectedList },
      });
      hideConfirmModal();
      onAddSnackbar(costRateT("notification.deleteSuccess"));
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  }, [
    commonT,
    costRateT,
    employee.id,
    handleDeleteMultiCostRateAPI,
    hideConfirmModal,
    onAddSnackbar,
    selectedList,
  ]);

  const columns = useMemo<CellProps[]>(() => {
    const cols: CellProps[] = [
      {
        value:
          isEditable && !isCheckedNone ? (
            <IconButton onClick={showConfirmModal}>
              <TrashAltIcon />
            </IconButton>
          ) : (
            costRateT("table.startDate")
          ),
        sx: {
          width: "12ch",
        },
      },
      {
        value: isEditable && !isCheckedNone ? "" : costRateT("table.endDate"),
        sx: { width: "12ch" },
      },
      {
        value: isEditable && !isCheckedNone ? "" : costRateT("table.type"),
        sx: { width: "11ch" },
      },
      {
        value: isEditable && !isCheckedNone ? "" : costRateT("table.cost"),
        sx: { width: "6ch" },
      },
      {
        value: isEditable && !isCheckedNone ? "" : costRateT("table.hourly"),
        sx: { width: "8ch" },
      },
      {
        value: isEditable && !isCheckedNone ? "" : costRateT("table.capacity"),
        sx: { width: "12ch" },
      },
      { value: isEditable && !isCheckedNone ? "" : costRateT("table.note") },
    ];
    if (isEditable) {
      cols.unshift({
        value: (
          <Checkbox
            checked={isCheckedAll}
            onChange={onChangeAll}
            checkedColor="#0575E6"
          />
        ),
        sx: { width: "2ch" },
      });
      cols.push({ value: "", sx: { width: "2ch" } });
    }
    return cols;
  }, [
    isEditable,
    isCheckedNone,
    showConfirmModal,
    costRateT,
    isCheckedAll,
    onChangeAll,
  ]);

  return (
    <>
      <TableLayout headerList={columns}>
        {items.map((item) => {
          const indexSelected = selectedList.findIndex(
            (selected) => selected === item.id,
          );
          return (
            <TableRow key={item.id}>
              {isEditable ? (
                <BodyCell>
                  <Checkbox
                    checked={indexSelected !== -1}
                    onChange={onToggleSelect(item.id, indexSelected)}
                    checkedColor="#0575E6"
                  />
                </BodyCell>
              ) : (
                <></>
              )}
              <BodyCell>
                {dayjs(item.start_date).format("DD MMM, YYYY")}
              </BodyCell>
              <BodyCell>{dayjs(item.end_date).format("DD MMM, YYYY")}</BodyCell>
              <BodyCell>
                {_.capitalize(
                  costRateT(`form.${item.type.toString().toLowerCase()}`),
                )}
              </BodyCell>
              <BodyCell>{item.cost_per_month}</BodyCell>
              <BodyCell>{item.cost_per_hour ?? "--"}</BodyCell>
              <BodyCell>{item.total_hours}</BodyCell>
              <BodyCell>{item.note ?? "--"}</BodyCell>
              <ActionsCell
                sx={{
                  pl: { xs: 0.5, md: 0 },
                  verticalAlign: { xs: "top", md: "middle" },
                  pt: { xs: 2, md: 0 },
                }}
                iconProps={{
                  sx: {
                    p: { xs: "4px!important", lg: 1 },
                  },
                }}
                onEdit={() => {
                  handleItemEdit(item.id);
                }}
                onDelete={() => {
                  handleItemDelete(item.id);
                }}
                hasPopup={false}
              />
            </TableRow>
          );
        })}
      </TableLayout>

      <FormLayout
        open={isConfirmModalShown}
        onClose={hideConfirmModal}
        submitting={status === DataStatus.LOADING}
        onSubmit={handleDeleteMultiCostRate}
        label={costRateT("confirmDelete.title")}
        sx={{
          minWidth: { xs: "calc(100vw - 24px)", sm: 500 },
          maxWidth: { xs: "calc(100vw - 24px)", sm: 500 },
          minHeight: "auto",
        }}
        headerProps={{
          sx: {
            mt: 2,
          },
        }}
        bottomProps={{
          sx: {
            pt: 3,
            pb: 5,
            px: 5,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Text pt={3} color="#4D4D4D" fontSize={14}>
          {costRateT("confirmDelete.content")}
        </Text>
      </FormLayout>
    </>
  );
};

export default CostRateTable;
