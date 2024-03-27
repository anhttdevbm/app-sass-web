import { NS_SALES } from "constant/index";
import { useTranslations } from "next-intl";
import { SALE_BILL_TYPE_LABEL } from "../helpers";
import { SALE_BILL_TYPE } from "constant/enums";
import { useMemo } from "react";

export const useGetBillTypeOptions = () => {
  const saleT = useTranslations(NS_SALES);

  const mappingBillTypeOptions = useMemo(
    () => [
      {
        label: SALE_BILL_TYPE_LABEL[SALE_BILL_TYPE.FIX],
        value: SALE_BILL_TYPE.FIX,
      },
      {
        label: SALE_BILL_TYPE_LABEL[SALE_BILL_TYPE.ACTUAL],
        value: SALE_BILL_TYPE.ACTUAL,
      },
      {
        label: SALE_BILL_TYPE_LABEL[SALE_BILL_TYPE.NON_BILLABLE],
        value: SALE_BILL_TYPE.NON_BILLABLE,
      },
    ],
    [saleT],
  );

  return {
    billTypeOptions: mappingBillTypeOptions,
  };
};
