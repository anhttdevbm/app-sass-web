import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { Invoice } from "components/sn-invoice/List";

export const useInvoiceSelection = (invoices) => {
  const [selectedList, setSelectedList] = useState<Invoice[]>([]);
  const isCheckedAll = useMemo(
    () => selectedList.length === invoices.length && invoices.length > 0,
    [selectedList, invoices],
  );

  const toggleSelectAll = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSelectedList(event.target.checked ? invoices : []);
    },
    [invoices],
  );

  const toggleSelectItem = useCallback((item: Invoice) => {
    setSelectedList((prev) => {
      const index = prev.findIndex((selected) => selected.id === item.id);
      if (index === -1) return [...prev, item];
      const newList = [...prev];
      newList.splice(index, 1);
      return newList;
    });
  }, []);

  return {
    selectedList,
    setSelectedList,
    isCheckedAll,
    toggleSelectAll,
    toggleSelectItem,
  };
};
