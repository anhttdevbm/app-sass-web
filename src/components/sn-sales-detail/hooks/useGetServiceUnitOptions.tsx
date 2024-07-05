import { SERVICE_UNIT_OPTIONS } from "constant/enums";
import { NS_SALES } from "constant/index";
import { Option } from "constant/types";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export const useGetServiceUnitOptions = () => {
  const saleT = useTranslations(NS_SALES);

  const serviceUnitOptions: Option[] = useMemo(() => {
    return [
      {
        label: saleT("detail.service.unit.hour"),
        value: SERVICE_UNIT_OPTIONS.HOUR,
        subText: saleT("detail.service.unit.hourSubText"),
      },
      {
        label: saleT("detail.service.unit.day"),
        value: SERVICE_UNIT_OPTIONS.DAY,
        subText: saleT("detail.service.unit.daySubText"),
      },
      {
        label: saleT("detail.service.unit.piece"),
        value: SERVICE_UNIT_OPTIONS.PIECE,
        subText: saleT("detail.service.unit.pieceSubText"),
      },
    ];
  }, [saleT]);

  return {
    serviceUnitOptions,
  };
};
