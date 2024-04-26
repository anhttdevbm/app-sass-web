"use client";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import _ from "lodash";

import { Checkbox } from "components/shared";
import {
  TableLayout,
  BodyCell,
  CellProps,
  ActionsCell,
} from "components/NewTable";
import { CostRate } from "store/employeeDetail/reducer";

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
  const [selectedList, setSelectedList] = useState<string[]>([]);

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

  const columns = useMemo<CellProps[]>(() => {
    const cols: CellProps[] = [
      { value: "Start Date", sx: { width: "12ch" } },
      { value: "End Date", sx: { width: "12ch" } },
      { value: "Cost Type", sx: { width: "11ch" } },
      { value: "Cost", sx: { width: "6ch" } },
      { value: "Hourly", sx: { width: "8ch" } },
      { value: "Capacity", sx: { width: "12ch" } },
      { value: "Note" },
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
  }, [isEditable, isCheckedAll, onChangeAll]);

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
              <BodyCell>{_.capitalize(item.type)}</BodyCell>
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
    </>
  );
};

export default CostRateTable;
