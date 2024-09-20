import {
  Box,
  Dialog,
  FormHelperText,
  InputLabel,
  Stack,
  TextFieldProps,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import useTheme from "hooks/useTheme";
import CalendarIcon from "icons/CalendarIcon";
import ChevronIcon from "icons/ChevronIcon";
import { DateRange, DateRangePicker } from "mui-daterange-picker";
import React, { useEffect } from "react";
interface ISectionProps {
  value?: DateRange | null;
  label?: string;
  onChange?(value?): void;
  errorMessage: string | undefined;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  isDropdown?: boolean;
  iconPosition?: 'left' | 'right'
}

type TextFieldInputProps = ISectionProps & TextFieldProps;

const CustomDateRangePicker: React.FC<TextFieldInputProps> = ({
  value,
  label,
  onChange,
  required,
  disabled,
  fullWidth,
  errorMessage,
  helperText,
  sx,
  isDropdown,
  iconPosition = 'right'
}) => {
  const randomId = (Math.random() + 1).toString(36).substring(7);
  const [isFocus] = React.useState<boolean>(false);
  const [isOpenCalendar, setIsOpenCalendar] = React.useState(false);
  const { palette, isDarkMode } = useTheme();

  const [dateRange, setDateRange] = React.useState<DateRange>({});

  const toggle = () => setIsOpenCalendar(!isOpenCalendar);

  useEffect(() => {
    setDateRange(value as DateRange);
  }, [value]);

  return (
    <>
      <Box
        sx={{
          width: fullWidth ? "100%" : "auto",
          cursor: "pointer",
          zIndex: 1,
          position: 'relative',
          ...sx,
        }}
        onClick={() => {
          if (!isDropdown)
            setIsOpenCalendar(true);
        }}
      >
        <Box
          component="label"
          htmlFor={`input-field-${randomId}`}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "4px",
            color: !!isDarkMode ? "common.white" : "common.black",
            // backgroundColor: !!isDarkMode ? "#393939" : "grey.50",
            borderRadius: "4px",
            padding: "5px 20px",
            // height: "58px",
            ":hover": {
              cursor: disabled ? "not-allowed" : "text",
            },
            transition: "all ease 0.25s",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: errorMessage
              ? "rgba(246, 78, 96, 1)"
              : isFocus
                ? "rgba(54, 153, 255, 0.5)"
                : "transparent",
            alignItems: "center",
            width: "100%",
          }}
          onClick={() => {
            if (isDropdown)
              setIsOpenCalendar(true);
          }}
        >
          <Stack direction={iconPosition === 'left' ? 'row-reverse' : 'row'} gap={1} alignItems='center'>
            <Stack direction="column" flex={1}>
              <InputLabel
                sx={{
                  fontSize: "12px",
                  fontWeight: 400,
                  lineHeight: "18px",
                  userSelect: "none",
                  mb: label ? 1 : 0,
                  color: palette.grey[300],
                }}
                htmlFor={`input-field-${randomId}`}
              >
                {label}{" "}
                {required && (
                  <Typography
                    component="span"
                    sx={{
                      color: "rgba(246, 78, 96, 1)",
                      fontSize: "inherit",
                      lineHeight: "16px",
                    }}
                  >
                    (*)
                  </Typography>
                )}
              </InputLabel>
              <Typography
                sx={{
                  fontSize: 14,
                  lineHeight: "22px",
                  fontWeight: 400,
                  opacity: !dateRange.startDate
                    ? 0.5
                    : 1,
                }}
              >
                {dateRange.startDate
                  ? dayjs(dateRange.startDate || "").format("DD/MM/YYYY")
                  : "DD/MM/YYYY"}{" "}
                -{" "}
                {dateRange.endDate
                  ? dayjs(dateRange.endDate).format("DD/MM/YYYY")
                  : "DD-MM-YYYY"}
              </Typography>
            </Stack>
            <CalendarIcon width={20} height={20} />
          </Stack>
          {isDropdown && <ChevronIcon width={10} height={10} sx={{
            transform: isOpenCalendar ? "rotate(180deg)" : "rotate(0deg)",
          }} />}
        </Box>
        {helperText ? (
          <FormHelperText
            sx={{ color: "rgba(246, 78, 96, 1)", marginLeft: "18px" }}
          >
            {helperText}
          </FormHelperText>
        ) : null}
        {errorMessage ? (
          <Typography
            fontSize={10}
            sx={{ pl: 2, pt: 1 }}
            color="rgba(246, 78, 96, 1)"
          >
            {errorMessage}
          </Typography>
        ) : null}
        {isOpenCalendar && isDropdown && <Box sx={{
          position: 'absolute',
          top: 60,
          right: 0,
          "& .MuiGrid-root > ul:nth-child(1)": {
            display: "none",
          },
          "& .MuiPaper-root .MuiGrid-root > .MuiGrid-root:nth-of-type(2)": {
            flex: "1 0 auto",
          },
        }
        }>
          <DateRangePicker
            open={isOpenCalendar}
            toggle={() => toggle()}
            closeOnClickOutside
            minDate={dayjs().toDate()}
            onChange={(range) => {
              setDateRange(range);
              toggle();
              onChange && onChange(range);
            }}
            initialDateRange={dateRange}
          />
        </Box>}
      </Box>

      {!isDropdown && <Dialog
        open={isOpenCalendar}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 600,
          },
        }}
        hideBackdrop={true}
        slotProps={{
          backdrop: {
            onClick: () => setIsOpenCalendar(false),
          },
        }}
        sx={{
          "& .MuiGrid-root > ul:nth-child(1)": {
            display: "none",
          },
          "& .MuiPaper-root .MuiGrid-root > .MuiGrid-root:nth-of-type(2)": {
            flex: "1 0 auto",
          },
        }}
      >
        <DateRangePicker
          open={isOpenCalendar}
          toggle={() => toggle()}
          closeOnClickOutside
          minDate={dayjs().toDate()}
          onChange={(range) => {
            setDateRange(range);
            toggle();
            onChange && onChange(range);
          }}
          initialDateRange={dateRange}
        />
      </Dialog>}
    </>
  );
};

export default CustomDateRangePicker;
