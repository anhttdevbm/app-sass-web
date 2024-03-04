import { TableRow } from "@mui/material";
import { Button } from "components/shared";
import { BodyCell } from "components/Table";
import React, { useMemo, useState } from "react";
import { TBudgets } from "store/project/budget/action";

enum STATUS {
  "OPEN" = "OPEN",
  "CLOSE" = "CLOSE",
  "ALL" = "ALL",
}
interface FilterWithIdsProps {
  getXsCell: (index: number) => {
    width: string;
    minWidth: string;
    maxWidth: string;
  };
  budgets: TBudgets;
  idSelecteds: string[];
}

const filterButtonVariant = {
  [STATUS.OPEN]: 'success',
  [STATUS.CLOSE]: 'danger'
}

function FilterWithIds({
  getXsCell,
  budgets,
  idSelecteds,
}: FilterWithIdsProps) {
  const [status, setStatus] = useState(STATUS.ALL);
  const { totalRevenue } = useMemo(() => {
    let totalRevenue = 0;
    // const totalMarin = 0;
    // const totalBudgetTime = 0;
    // const totalInvoice = 0;
    const dataMapping = {};
    budgets.forEach((budget) => {
      dataMapping[budget.id] = budget;
    });

    idSelecteds.forEach((id) => {
      const start = new Date(dataMapping[id]?.start_date).getTime();
      const end = new Date(dataMapping[id]?.end_date).getTime();
      const current = new Date().getTime();
      if (status === STATUS.OPEN) {
        if (current <= end && current >= start) {
          totalRevenue += dataMapping[id].revenue;
        }
      } else {
        if (status === STATUS.CLOSE) {
          if (current > end || current < start) {
            totalRevenue += dataMapping[id].revenue;
          }
        }
      }
      totalRevenue += dataMapping[id].revenue;
    });
    return { totalRevenue };
  }, [budgets, idSelecteds, status]);

  const handleChangeStatus = () => {
    setStatus((prev) => {
      switch (prev) {
        case STATUS.OPEN:
          return STATUS.CLOSE;
        case STATUS.CLOSE:
          return STATUS.ALL;
        default:
          return STATUS.OPEN;
      }
    });
  };

  return (
    <TableRow>
      <BodyCell sx={{ pl: { xs: 0.5, md: 2 }, ...getXsCell(0) }} fallback=""></BodyCell>
      <BodyCell sx={{...getXsCell(1), textAlign: 'left'}} fallback="">
        <Button variant={filterButtonVariant[status] || "secondary"} size="extraSmall" onClick={handleChangeStatus}>
          {status}
        </Button>
      </BodyCell>
      <BodyCell sx={getXsCell(2)} fallback=""></BodyCell>
      <BodyCell sx={getXsCell(3)} fallback=""></BodyCell>
      <BodyCell sx={getXsCell(4)} fallback="">${totalRevenue}</BodyCell>
      <BodyCell sx={getXsCell(5)} fallback=""></BodyCell>
      <BodyCell sx={getXsCell(6)} fallback=""></BodyCell>
      <BodyCell sx={getXsCell(7)} fallback=""></BodyCell>
    </TableRow>
  );
}

export default FilterWithIds;
