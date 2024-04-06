"use client";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";

import { Checkbox } from "components/shared";
import {
  TableLayout,
  BodyCell,
  CellProps,
  ActionsCell,
} from "components/NewTable";
import { CostRate } from "store/costRate/reducer";

type CostRateTableProps = {
  items: CostRate[];
  isEditable?: boolean;
  handleItemEdit: (id: string) => void;
  handleItemDelete: (id: string) => void;
}

const CostRateTable = ( {items, isEditable = false, handleItemEdit, handleItemDelete }: CostRateTableProps) => {
  const [selectedList, setSelectedList] = useState<string[]>([]);

  const onToggleSelect = (item: string, indexSelected: number) => {
    return () => {
      if (indexSelected === -1) {
        setSelectedList((prevList) => [...prevList, item]);
      } else {
        setSelectedList((prevList) => prevList.filter((_, idx) => idx !== indexSelected));
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
        setSelectedList(items.map(i => i.id));
      } else {
        setSelectedList([]);
      }
    },
    [items],
  );

  const columns = useMemo<CellProps[]>(() => {
    const cols: CellProps[] = ([
      { value: "Start Date", width: "100px" },
      { value: "End Date", width: "100px" },
      { value: "Cost Type", width: "100px" },
      { value: "Cost", width: "100px" },
      { value: "Hourly", width: "100px" },
      { value: "Capacity", width: "100px" },
      { value: "Note", width: "100px" },
    ]);
    if (isEditable) {
      cols.unshift({ value: <Checkbox checked={isCheckedAll} onChange={onChangeAll} checkedColor="#0575E6"/>, width: "3%" });
      cols.push({ value: "", width: "8%" });
    }
    return cols;
  }, [ isEditable, isCheckedAll, onChangeAll ])

  return (
    <>
      <TableLayout
        headerList={columns}
      >
        {items.map((item) => {
          const indexSelected = selectedList.findIndex(
            (selected) => selected === item.id,
          );
          return (
            <TableRow key={item.id}>
              { isEditable
                ? <BodyCell>
                    <Checkbox checked={indexSelected !== -1} onChange={onToggleSelect(item.id, indexSelected)} checkedColor="#0575E6"/>
                  </BodyCell>
                : <></>
              }
              <BodyCell>{dayjs(item.start_date).format('DD MMM, YYYY')}</BodyCell>
              <BodyCell>{dayjs(item.end_date).format('DD MMM, YYYY')}</BodyCell>
              <BodyCell>{item.type}</BodyCell>
              <BodyCell>--</BodyCell>
              <BodyCell>--</BodyCell>
              <BodyCell>--</BodyCell>
              <BodyCell>--</BodyCell>
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
                onEdit={() => { handleItemEdit(item.id) } }
                onDelete={() => { handleItemDelete(item.id) } }
                hasPopup={false}
              />
            </TableRow>
          );
        })}
      </TableLayout>
    </>
  )
}

export default CostRateTable;
