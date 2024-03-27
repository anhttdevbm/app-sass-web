import {
  mappingStageStatusOptions,
  mappingStatusOptions,
} from "components/sn-sales/helpers";
import { NS_SALES } from "constant/index";
import useQueryParams from "hooks/useQueryParams";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useSaleDetail } from "store/sales/selectors";

export const useFetchDealDetail = (id: string) => {
  const { onGetSaleDetail } = useSaleDetail();

  useEffect(() => {
    onGetSaleDetail(id as string);
  }, [id]);
};

export const useGetStageOptions = () => {
  const salesT = useTranslations(NS_SALES);

  const stageOptions = mappingStageStatusOptions.map((item) => ({
    ...item,
    label: salesT(item.label),
  }));

  const stageStatusOptions = mappingStatusOptions.map((item) => ({
    ...item,
    label: salesT(item.label),
  }));

  return {
    stageStatusOptions,
    stageOptions,
  };
};
