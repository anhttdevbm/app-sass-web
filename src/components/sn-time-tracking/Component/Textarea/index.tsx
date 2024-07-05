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
interface ISectionProps {
  value?: string | null;
  label?: string;
  onChange?(value?: any): void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  endAdornment?: React.ReactNode;
}

type TextFieldInputProps = ISectionProps & TextFieldProps;

const Textarea: React.FC<TextFieldInputProps> = React.forwardRef(
  (
    {
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
      ...otherProps
    },
    ref,
  ) => {
    const randomId = (Math.random() + 1).toString(36).substring(7);
    const [isFocus, setIsFocus] = React.useState<boolean>(false);
    const { isDarkMode } = useTheme();
    const totalWords = React.useMemo(() => {
      let result = 0;
      if (value) {
        result = value.replace(/\s/g, "").length;
      }
      return result;
    }, [value]);

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
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
            width: "100%",
            height: "100%",
          }}
        >
          <Stack direction="column" flex={1}>
            <InputLabel
              sx={{
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: "18px",
                userSelect: "none",
                padding: "8px 20px 0px 20px",
                color: !!isDarkMode ? "common.white" : "grey.300",
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
            <TextField
              sx={{
                overflow: "auto",
                padding: "0 20px 20px 20px",
                resize: "vertical",
                backgroundColor: isDarkMode ? "#393939" : "grey.50",
                minHeight: "52px",
                maxHeight: "250px",
                " .MuiInputBase-root": {
                  // background: CommonColors.bgInput,
                  // height: '100%',
                  padding: "0",
                },
                textarea: {
                  fontSize: "14px",
                  lineHeight: "22px",
                  fontWeight: 400,
                  color: isDarkMode ? "#fff" : "common.black",
                  padding: 0,
                  backgroundColor: isDarkMode ? "#393939" : "grey.50",
                  height: "calc(100% - 20px)",
                },
                "> :before, :after": {
                  display: "none",
                },
              }}
              {...otherProps}
              value={value}
              onChange={onChange}
              disabled={disabled}
              InputLabelProps={{ shrink: true }}
              variant="filled"
              required={required}
              placeholder={placeholder}
              id={`input-field-${randomId}`}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              multiline
              ref={ref}
            />
          </Stack>
          {endAdornment}
        </Box>
        <Stack direction="row" justifyContent="space-between">
          <FormHelperText
            sx={{ color: "rgba(246, 78, 96, 1)", marginLeft: "18px" }}
          >
            {helperText || ""}
          </FormHelperText>
          <FormHelperText
            sx={{
              display: "inline-flex",
              color: "rgba(153, 153, 153, 1)",
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "16px",
              justifySelf: "flex-end",
              alignSelf: "flex-end",
            }}
          >
            {totalWords}/2000
          </FormHelperText>
        </Stack>
      </Box>
    );
  },
);
Textarea.displayName = "Textarea";
export default Textarea;
