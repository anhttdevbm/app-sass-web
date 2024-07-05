/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Box,
  FormHelperText,
  InputLabel,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import useTheme from "hooks/useTheme";
import OutLineExpandIcon from "icons/OutLineExpandIcon";

interface ISectionProps {
  value?: string | null;
  label?: string;
  onChange?(value?: any): void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

type TextFieldInputProps = ISectionProps & TextFieldProps;

const MobileDatePickerComponent: React.FC<TextFieldInputProps> = ({
  value,
  label,
  onChange,
  required,
  disabled,
  fullWidth,
  error,
  helperText,
  sx,
}) => {
  const datePickerRef = React.useRef<any>(null);
  const randomId = (Math.random() + 1).toString(36).substring(7);
  const [isFocus, setIsFocus] = React.useState<boolean>(false);
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);
  const { isDarkMode } = useTheme();
  React.useEffect(() => {
    if (value) {
      const date = dayjs(value);
      if (date.isValid()) setSelectedDate(date);
      else setSelectedDate(dayjs());
    }
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          width: fullWidth ? "100%" : "auto",
          ...sx,
        }}
      >
        <Box
          component="label"
          htmlFor={`input-field-${randomId}`}
          sx={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: isDarkMode ? "#393939" : "grey.50",
            borderRadius: "4px",
            padding: "8px 20px",
            height: "58px",
            ":hover": {
              cursor: disabled ? "not-allowed" : "text",
            },
            transition: "all ease 0.25s",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: error
              ? "rgba(246, 78, 96, 1)"
              : isFocus
              ? "rgba(54, 153, 255, 0.5)"
              : isDarkMode
              ? "#393939"
              : "#F7F7FD",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Stack direction="column" flex={1}>
            <InputLabel
              sx={{
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "18px",
                userSelect: "none",
                color: !!isDarkMode ? "#fff" : "grey.300",
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
            <MobileDatePicker
              sx={{
                input: {
                  fontSize: "14px",
                  lineHeight: "22px",
                  fontWeight: 400,
                  color: isDarkMode ? "#fff" : "common.black",
                  padding: 0,
                  backgroundColor: isDarkMode ? "#393939" : "grey.50",
                },
                fieldset: {
                  border: "none",
                },
                "> :before, :after": {
                  display: "none",
                },
              }}
              value={selectedDate}
              onChange={(value: any) =>
                onChange && onChange(dayjs(value).format("YYYY/MM/DD"))
              }
              onOpen={() => setIsFocus(true)}
              onClose={() => setIsFocus(false)}
              closeOnSelect
              ref={datePickerRef}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  required: true,
                  id: `input-field-${randomId}`,
                },
                actionBar: {
                  actions: [],
                },
                toolbar: {
                  hidden: true,
                },
                day: {
                  sx: {
                    transition: "all ease 0.25s",
                    borderRadius: "4px",
                    fontWeight: 600,
                    "&.Mui-selected": {
                      color: "#ffffff",
                      backgroundColor: `grey.50`,
                      "&.MuiPickersDay-today": {
                        color: "#ffffff",
                        borderColor: "grey.400",
                      },
                    },
                    "&.MuiPickersDay-today": {
                      color: "common.black",
                      borderColor: "grey.500",
                    },
                    ":hover": {
                      backgroundColor: "gey.50",
                    },
                  },
                },
              }}
            />
          </Stack>
          <OutLineExpandIcon
            sx={{
              width: "20px",
              height: "20px",
              ":hover": {
                cursor: "pointer",
              },
            }}
          />
        </Box>
        {helperText ? (
          <FormHelperText
            sx={{ color: "rgba(246, 78, 96, 1)", marginLeft: "18px" }}
          >
            {helperText}
          </FormHelperText>
        ) : null}
      </Box>
    </LocalizationProvider>
  );
};

export default MobileDatePickerComponent;
