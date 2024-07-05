import React, { forwardRef } from "react";
import _ from "lodash";
import { useSelector } from "react-redux";

import {
  Box,
  FormHelperText,
  InputLabel,
  TextField,
  TextFieldProps,
  Typography,
  useTheme,
} from "@mui/material";
import { Stack } from "@mui/system";
import { RootState } from "store/configureStore";

interface ISectionProps {
  value?: any;
  label?: string;
  onChange?(value?): void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  endAdornment?: React.ReactNode;
}

type Ref = HTMLInputElement;
type TextFieldInputProps = ISectionProps & TextFieldProps;

const TextFieldInput = forwardRef<Ref, TextFieldInputProps>(
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
    const { palette } = useTheme();
    const randomId = (Math.random() + 1).toString(36).substring(7);

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
          className="text-field-input-container"
          sx={{
            display: "flex",
            flexDirection: "row",
            background: palette.grey[50],
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
            <TextField
              sx={{
                "& .MuiFilledInput-input": {
                  fontSize: "14px",
                  lineHeight: "22px",
                  fontWeight: 400,
                  color: palette.grey[800],
                  padding: 0,
                  background: "transparent",
                  // opacity: disabled ? 0.38 : 1,
                  "-webkit-text-fill-color": disabled ? "#ECECEC" : "inherit",
                },
                "& .MuiFilledInput-root": {
                  "&:before, &:after": {
                    display: "none",
                  },
                  background: "transparent",
                },
              }}
              {...otherProps}
              ref={ref}
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
            />
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
  },
);

TextFieldInput.displayName = "TextFieldInput";

export default TextFieldInput;
