import { memo, useRef } from "react";
import { Stack, SvgIconProps } from "@mui/material";
import { Text } from "components/shared";
import DatePicker, {
  ReactDatePickerProps,
  registerLocale,
} from "react-datepicker";
import CalendarIcon from "icons/CalendarIcon";
import { formatDate } from "utils/index";
import {
  DATE_FORMAT_FORM,
  DATE_FORMAT_HYPHEN,
  DATE_LOCALE_FORMAT,
  DATE_FORMAT_SLASH,
} from "constant/index";
import { vi, enUS } from "date-fns/locale";
import { format as formatFns } from "date-fns";
import { useLocale } from "next-intl";
import dayjs from "dayjs";
import { preventDefault } from "@fullcalendar/core/internal";
import { ExpandMore } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { NS_COMMON } from "constant/index";

registerLocale("vi", vi);
registerLocale("en", enUS);

type DateProps = Omit<ReactDatePickerProps, "name" | "onChange"> & {
  label: string;
  onChange: (name: string, newDate?: string) => void;
  name: string;
  value?: string | number;
  format?: string;
  iconProps?: SvgIconProps;
};

const FDate = (props: DateProps) => {
  const {
    label,
    value,
    onChange,
    name,
    format = DATE_FORMAT_FORM,
    iconProps,
    ...rest
  } = props;

  const locale = useLocale();
  const commonT = useTranslations(NS_COMMON);

  const ref = useRef<DatePicker | null>(null);

  const onChangeDate = (date: Date | null) => {
    onChange(name, date ? formatDate(date.getTime(), format) : undefined);
  };

  const onClick = () => {
    ref?.current?.setOpen(true);
  };

  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      width="fit-content"
      // zIndex={2}
    >
      <Text
        variant="body2"
        fontWeight={600}
        color={value ? "primary.main" : "grey.400"}
        whiteSpace="nowrap"
      >
        {label}:
      </Text>
      <Text
        variant="body2"
        fontWeight={600}
        color={value ? "primary.main" : "grey.400"}
        whiteSpace="nowrap"
        onClick={onClick}
        sx={{ cursor: "pointer" }}
      >
        {value ? dayjs(value).format(DATE_LOCALE_FORMAT) : commonT("all")}
      </Text>
      <DatePicker
        ref={ref}
        selected={value ? refactorDate(value, format) : null}
        onChange={onChangeDate}
        locale={locale}
        customInput={
          <ExpandMore
            sx={{
              zIndex: 9999,
              color: "grey.400",
              fontSize: 20,
              mt: 0.675,
              cursor: "pointer",
              ...iconProps?.sx,
            }}
          />
        }
        {...rest}
      />
    </Stack>
  );
};

export default memo(FDate);

const refactorDate = (value, format) => {
  if (!value) return null;
  if (format === DATE_FORMAT_HYPHEN) {
    return new Date(value.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
  }
  return new Date(value);
};
