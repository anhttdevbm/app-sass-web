import { memo } from "react";
import { Stack } from "@mui/material";
import { Text } from "components/shared";
import { useActivitiesOfProject } from "store/project/selectors";
import { format, parse } from "date-fns";
import { formatDate } from "utils/index";
import { DATE_FORMAT_SLASH } from "constant/index";
import { vi, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";
import { Locale } from "constant/types";
import ChevronIcon from "icons/ChevronIcon";

const RangeDatePicker = () => {
  const { filters } = useActivitiesOfProject();

  const locale = useLocale() as Locale;

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ cursor: "pointer" }}
      >
        <Text variant="h4">{`${displayFormat(
          filters.start_date,
          locale,
        )} - ${displayFormat(filters.end_date, locale)}`}</Text>
        <ChevronIcon />
      </Stack>
    </>
  );
};

export default memo(RangeDatePicker);

const displayFormat = (date: string, locale: Locale) =>
  format(parse(date, DATE_FORMAT_SLASH, new Date()), "dd MMMM", {
    locale: locale === "vi" ? vi : enUS,
  });
