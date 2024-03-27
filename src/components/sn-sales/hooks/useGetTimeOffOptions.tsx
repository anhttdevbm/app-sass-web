import { NS_RESOURCE_PLANNING } from "constant/index";
import { useTranslations } from "next-intl";
import { TIME_OFF_TYPE } from "../helpers";

export const useGetTimeOffOptions = () => {
  const resourceT = useTranslations(NS_RESOURCE_PLANNING);

  const timeOffOptions = [
    {
      value: TIME_OFF_TYPE.SICK,
      label: resourceT("form.timeOffType.sick"),
    },
    {
      value: TIME_OFF_TYPE.VACATION,
      label: resourceT("form.timeOffType.vacation"),
    },
    {
      value: TIME_OFF_TYPE.OTHER,
      label: resourceT("form.timeOffType.other"),
    },
  ];
  return { timeOffOptions };
};
