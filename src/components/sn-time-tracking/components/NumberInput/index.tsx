/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Box,
  FormHelperText,
  InputLabel,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import useTheme from "hooks/useTheme";
import { Button, InputNumber } from "components/shared";
import ChevronIcon from "icons/ChevronIcon";
import OutLineExpandIcon from "icons/OutLineExpandIcon";
import { IsValidConnection } from "@xyflow/react";

interface ISectionProps {
  value?: number;
  label?: string;
  onChange?(value: any): void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  endAdornment?: React.ReactNode;
  onChangeValueByClick?: (isIncrease?: boolean) => void;
}

type TextFieldInputProps = ISectionProps & TextFieldProps;

const NumberInput: React.FC<TextFieldInputProps> = (
  props: TextFieldInputProps,
) => {
  const {
    value,
    label,
    onChange,
    required,
    disabled,
    placeholder,
    fullWidth,
    error,
    helperText,
    sx,
    endAdornment,
    onChangeValueByClick,
    ...rest
  } = props;

  const randomId = (Math.random() + 1).toString(36).substring(7);
  const { isDarkMode } = useTheme();
  const [isFocus, setIsFocus] = React.useState<boolean>(false);

  return (
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
          {/* <TextField
            {...rest}
            fullWidth
            size="small"
            placeholder={"20"}
            sx={{
              border: "none",
              outline: "none",
              boxShadow: "none",
              input: {
                fontSize: "14px",
                lineHeight: "22px",
                fontWeight: 400,
                color: isDarkMode ? "#fff" : "common.black",
                padding: 0,
                backgroundColor: isDarkMode ? "#393939" : "#F7F7FD",
                border: "none",
                outline: "none",
                boxShadow: "none",
              },
              "> :before, :after": {
                display: "none",
              },
            }}
          /> */}
          <Box
            sx={{
              position: "relative",
            }}
          >
            <TextField
              sx={{
                input: {
                  fontSize: "14px",
                  lineHeight: "22px",
                  fontWeight: 400,
                  color: isDarkMode ? "#fff" : "common.black",
                  padding: 0,
                  backgroundColor: isDarkMode ? "#393939" : "#F7F7FD",
                },
                "> :before, :after": {
                  display: "none",
                },
              }}
              {...rest}
              value={value}
              onChange={(e) => onChange?.(+e.target.value)}
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
              variant="filled"
              required={required}
              placeholder={placeholder}
              id={`input-field-${randomId}`}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              type="number"
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Increase button */}
              <Button
                sx={{
                  padding: "0px !important",
                  minHeight: "unset !important",
                }}
                onClick={() =>
                  value !== undefined ? onChange?.(value + 1) : onChange?.(1)
                }
              >
                <OutLineExpandIcon
                  sx={{
                    width: "20px",
                    height: "20px",
                    rotate: "180deg",
                    position: "relative",
                    top: "3px",
                    ":hover": {
                      cursor: "pointer",
                    },
                    "& path": {
                      fill: "neutral.300",
                    },
                  }}
                />
              </Button>
              {/* Decrease button */}
              <Button
                sx={{
                  padding: "0px !important",
                  minHeight: "unset !important",
                }}
                onClick={() => value && onChange?.(value - 1)}
              >
                <OutLineExpandIcon
                  sx={{
                    width: "20px",
                    height: "20px",
                    position: "relative",
                    top: "-3px",
                    ":hover": {
                      cursor: "pointer",
                    },
                    "& path": {
                      fill: "neutral.300",
                    },
                  }}
                />
              </Button>
            </Box>
          </Box>
        </Stack>
        {endAdornment}
      </Box>
      {helperText ? (
        <FormHelperText
          sx={{ color: "rgba(246, 78, 96, 1)", marginLeft: "18px" }}
        >
          {helperText}
        </FormHelperText>
      ) : null}
    </Box>
  );
};

export default NumberInput;
