import { BodyCell, CellProps, HeaderCell } from "components/Table";
import { NS_SALES } from "constant/index";
import { useTranslations } from "next-intl";
import { use, useContext, useEffect, useMemo, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { EditContext } from "../components/sn-service/context/EditContext";
import { Box, Grid, Stack, TableCell } from "@mui/material";
import { Text } from "components/shared";
import { Service } from "store/sales/reducer";
import { formatDate, formatEstimateTime, formatNumber } from "utils/index";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { CURRENCY_CODE } from "constant/enums";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

export enum ServiceColumn {
  NAME = "name",
  DESCRIPTION = "desc",
  SERVICE_TYPE = "position",
  BILL_TYPE = "billType",
  UNIT = "unit",
  ESTIMATE = "estimate",
  QUANTITY = "qty",
  PRICE = "price",
  DISCOUNT = "discount",
  MARK_UP = "markUp",
  TOTAL_BUGET = "totalBuget",
  ACTION = "action",
}

export type ServiceColumnProps = {
  id: ServiceColumn;
  value: string;
  minWidth?: number;
  align?: "left" | "right" | "center";
  hidden?: boolean;
  sx?: Record<string, unknown>;
};

export const ALIGN_CELL = "center";
const DEFAULT_WIDTH = "6%";

export const defaultShowColumns: ServiceColumn[] = [
  ServiceColumn.NAME,
  ServiceColumn.SERVICE_TYPE,
  ServiceColumn.BILL_TYPE,
  ServiceColumn.UNIT,
  ServiceColumn.ESTIMATE,
  ServiceColumn.QUANTITY,
  ServiceColumn.PRICE,
  ServiceColumn.DISCOUNT,
  ServiceColumn.MARK_UP,
  ServiceColumn.TOTAL_BUGET,
];
export const useGetHeaderColumn = (index: number) => {
  const { control, getValues } = useFormContext();
  const { isEdit } = useContext(EditContext);

  const salesT = useTranslations(NS_SALES);
  const { fields } = useFieldArray({
    control,
    name: `sectionsList.${index}.service`,
  });

  const alignCell = isEdit ? "center" : ALIGN_CELL;

  const totalBuget = useMemo(() => {
    const result = fields?.reduce((prev, item) => {
      const price = (item as Service).tolBudget || 0;
      return prev + price;
    }, 0);
    return result;
  }, [fields]);

  const estimateTime = useMemo(() => {
    const result = fields?.reduce((prev, item) => {
      const estimate = (item as Service).estimate || 0;
      return prev + estimate;
    }, 0);
    return result;
  }, [fields]);

  const headerList: CellProps[] = useMemo(() => {
    const list: CellProps[] = [
      {
        id: ServiceColumn.NAME,
        value: salesT("detail.service.table.name"),
        // minWidth: 170,
        width: isEdit ? "9%" : "10%",
        align: "left",
      },
      {
        id: ServiceColumn.DESCRIPTION,
        value: salesT("detail.service.table.description"),
        // minWidth: 170,
        width: "9%",
        align: "center",
      },
      {
        id: ServiceColumn.SERVICE_TYPE,
        value: salesT("detail.service.table.position"),
        align: isEdit ? alignCell : "center",
        // minWidth: 140,
        width: "8%",
      },
      {
        id: ServiceColumn.BILL_TYPE,
        value: salesT("detail.service.table.billType"),
        align: isEdit ? alignCell : "center",
        // minWidth: 140,
        width: "9%",
      },
      {
        id: ServiceColumn.UNIT,
        value: salesT("detail.service.table.unit"),
        align: alignCell,
        // minWidth: 140,
        width: DEFAULT_WIDTH,
      },
      {
        id: ServiceColumn.ESTIMATE,
        value: salesT("detail.service.table.estimate"),
        align: alignCell,
        width: DEFAULT_WIDTH,

        // minWidth: 120,
      },
      {
        id: ServiceColumn.QUANTITY,
        value: salesT("detail.service.table.quantity"),
        align: alignCell,
        width: DEFAULT_WIDTH,
        // minWidth: 120,
      },

      {
        id: ServiceColumn.PRICE,
        value: salesT("detail.service.table.price"),
        align: alignCell,
        minWidth: isEdit ? 140 : 0,
        width: "8%",
      },
      {
        id: ServiceColumn.DISCOUNT,
        value: salesT("detail.service.table.discount"),
        align: alignCell,
        width: isEdit ? "6%" : "4%",
        // minWidth: 120,
      },
      // {
      //   id: ServiceColumn.MARK_UP,
      //   value: salesT("detail.service.table.markup"),
      //   align: alignCell,
      //   width: "8%",
      //   // minWidth: 120,
      // },
      {
        id: ServiceColumn.TOTAL_BUGET,
        value: salesT("detail.service.table.totalBuget"),
        align: alignCell,
        width: "8%",
        // component: (props) => (
        //   <Stack
        //     {...props}
        //     direction="row"
        //     alignItems="center"
        //     justifyContent="flex-end"
        //   >
        //     <Text>{salesT("detail.service.table.totalBuget")}</Text>
        //     <Text fontSize={14} fontWeight={600}>
        //       {formatNumber(totalBuget, {
        //         numberOfFixed: 2,
        //         prefix: CURRENCY_SYMBOL[CURRENCY_CODE.USD],
        //       })}
        //     </Text>
        //   </Stack>
        // ),

        // minWidth: 160,
      },
    ];

    if (isEdit) {
      // list.unshift({
      //   id: ServiceColumn.ACTION,
      //   value: "",
      //   width: "2%",
      //   sx: {
      //     pl: 2,
      //   },
      // });
      list.push({
        id: ServiceColumn.ACTION,
        value: "",
        width: "4%",
      });
    }
    return list;
  }, [salesT, isEdit]);
  return {
    columns: headerList,
    // columns,
    totalBuget,
  };
};
