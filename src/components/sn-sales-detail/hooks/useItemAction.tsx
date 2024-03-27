import React, { useContext } from "react";
import { Action } from "../components/TodoList/SubItem";
import {
  FieldValue,
  FieldValues,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { ServiceColumn } from "./useGetHeaderColumn";
import { useSalesService } from "store/sales/selectors";

const defaultColumns = [
  ServiceColumn.NAME,
  ServiceColumn.DESCRIPTION,
  ServiceColumn.SERVICE_TYPE,
  ServiceColumn.BILL_TYPE,
  ServiceColumn.UNIT,
  ServiceColumn.ESTIMATE,
  ServiceColumn.QUANTITY,
  ServiceColumn.PRICE,
  ServiceColumn.DISCOUNT,
  ServiceColumn.MARK_UP,
  ServiceColumn.TOTAL_BUGET,
  ServiceColumn.ACTION,
];

const useItemAction = (
  index: number,
  append: UseFieldArrayAppend<FieldValues, string>,
  remove: UseFieldArrayRemove,
  onRemoveSection: () => void,
  fields: Record<"id", string>[],
) => {
  const { onSetColumns, sectionColumns } = useSalesService();
  const onDuplicate = (serviceId) => {
    const service = fields.find((item) => item.id === serviceId);

    append(service);
  };
  const onRemove = (name, serviceIndex) => {
    remove(serviceIndex);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onAction = (action: Action, data?: any) => {
    switch (action) {
      case Action.DUPLICATE:
        onDuplicate(data);
        break;
      case Action.DELETE:
        onRemove("", data);
        break;
      case Action.SECTION_DELETE:
        onRemoveSection();
        break;
      case Action.SHOW_DESCRIPTION:
        onSetColumns(index, ServiceColumn.DESCRIPTION);
        break;
      case Action.SHOW_DISCOUNT:
        onSetColumns(index, ServiceColumn.DISCOUNT);
        break;
      case Action.SHOW_ESTIMATE:
        onSetColumns(index, ServiceColumn.ESTIMATE);
        break;
      case Action.SHOW_FIXED_PRICE:
        onSetColumns(index, ServiceColumn.PRICE);
        break;
      case Action.SHOW_MARKUP:
        onSetColumns(index, ServiceColumn.MARK_UP);
        break;
      default:
    }
  };
  return {
    onAction,
  };
};

export default useItemAction;
