import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useSnackbar } from "store/app/selectors";
import { useSaleDetail, useSalesService } from "store/sales/selectors";

export const useSetServiceValue = () => {
  const { serviceSectionList, servicesError } = useSalesService();
  const { onAddSnackbar } = useSnackbar();
  const { setValue } = useFormContext();

  useEffect(() => {
    if (servicesError) {
      onAddSnackbar(servicesError, "error");
      return;
    }
    setValue("sectionsList", serviceSectionList);
  }, [serviceSectionList, servicesError]);
};

const useFetchServiceSection = () => {
  const { onGetService } = useSalesService();
  const { saleDetail } = useSaleDetail();

  useEffect(() => {
    if (saleDetail?.id) {
      onGetService(saleDetail?.id);
    }
  }, [saleDetail?.id]);
};

export default useFetchServiceSection;
