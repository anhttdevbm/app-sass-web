import { memo, useRef } from "react";
import { Stack } from "@mui/material";
import { IconButton, Text } from "components/shared";
import DatePicker, {
  ReactDatePickerProps,
  registerLocale,
} from "react-datepicker";
import CalendarIcon from "icons/CalendarIcon";
import { formatDate } from "utils/index";
import { DATE_FORMAT_FORM, DATE_FORMAT_HYPHEN } from "constant/index";
import { vi, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";
import CloseIcon from "icons/CloseIcon";

registerLocale("vi", vi);
registerLocale("en", enUS);

type DateProps = Omit<
  ReactDatePickerProps,
  "name" | "onChange" | "maxDate" | "minDate"
> & {
  label: string;
  onChange: (name: string, newDate?: string) => void;
  name: string;
  value?: string | number;
  format?: string;
  maxDate?: string;
  minDate?: string;
};

const PDate = (props: DateProps) => {
  const {
    label,
    value,
    onChange,
    name,
    format = DATE_FORMAT_FORM,
    maxDate,
    minDate,
    ...rest
  } = props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calendarRef = useRef<any>(null);

  const locale = useLocale();

  const onChangeDate = (date: Date | null) => {
    onChange(name, date ? formatDate(date.getTime(), format) : undefined);
  };

  const onChoose = () => {
    calendarRef?.current?.setOpen(true);
  };

  const onReset = () => {
    onChange(name, undefined);
  };

  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      width="fit-content"
    >
      <Text
        variant="body2"
        fontWeight={600}
        color="grey.400"
        whiteSpace="nowrap"
        onClick={onChoose}
        sx={{ cursor: value ? "pointer" : "initial" }}
      >
        {value
          ? formatDate(refactorDate(value, format)?.getTime() as number)
          : label}
      </Text>
      {!!value && (
        <IconButton onClick={onReset} noPadding>
          <CloseIcon
            sx={{
              fontSize: 18,
            }}
          />
        </IconButton>
      )}
      <DatePicker
        selected={value ? refactorDate(value, format) : null}
        onChange={onChangeDate}
        locale={locale}
        ref={calendarRef}
        minDate={minDate ? new Date(minDate) : undefined}
        maxDate={maxDate ? new Date(maxDate) : undefined}
        customInput={
          <CalendarIcon
            sx={{
              color: "grey.400",
              fontSize: 20,
              mt: 0.675,
              cursor: "pointer",
              display: value ? "none" : "flex",
            }}
          />
        }
        {...rest}
      />
    </Stack>
  );
};

export default memo(PDate);

const refactorDate = (value, format) => {
  if (!value) return null;
  if (format === DATE_FORMAT_HYPHEN) {
    return new Date(value.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
  }
  return new Date(value);
};
