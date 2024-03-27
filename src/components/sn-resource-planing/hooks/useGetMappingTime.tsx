import { RESOURCE_ALLOCATION_TYPE } from "constant/enums";
import { NS_RESOURCE_PLANNING } from "constant/index";
import { useTranslations } from "next-intl";

const useGetMappingTime = () => {
  const resourceT = useTranslations(NS_RESOURCE_PLANNING);

  const mappedTimeSymbol = {
    [RESOURCE_ALLOCATION_TYPE.HOUR]: resourceT(`schedule.unit.hour`),
    [RESOURCE_ALLOCATION_TYPE.HOUR_PER_DAY]: `${resourceT(
      "schedule.unitSymbol.hour",
    )}/${resourceT("schedule.unitSymbol.day")}`,
    [RESOURCE_ALLOCATION_TYPE.PERCENTAGE]: "%",
  };
  return { mappedTimeSymbol };
};

export default useGetMappingTime;
