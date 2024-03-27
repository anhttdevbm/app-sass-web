/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import _ from "lodash";

import {
  MenuItem,
  Stack,
  InputLabel,
  Typography,
  Box,
  FormHelperText,
  Select,
  SelectProps,
} from "@mui/material";
import useTheme from "hooks/useTheme";
import OutLineExpandIcon from "icons/OutLineExpandIcon";
export interface IOptionStructure {
  label: string;
  value: string;
}

interface IProps extends SelectProps {
  label?: string;
  options: IOptionStructure[];
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  hiddenIcon?: boolean;
}

const TextFieldSelect: React.FC<IProps> = React.forwardRef(
  (
    {
      value = "",
      label,
      onChange,
      required,
      disabled,
      placeholder,
      fullWidth,
      error,
      helperText,
      sx,
      options,
      MenuProps,
      hiddenIcon = false,
      ...props
    },
    ref,
  ) => {
    const { isDarkMode } = useTheme();

    const containerRef = React.useRef<any>(null);
    const randomId = (Math.random() + 1).toString(36).substring(7);

    const [isFocus, setIsFocus] = React.useState<boolean>(false);

    const _renderOptions = () => {
      if (_.isEmpty(options))
        return (
          <MenuItem
            disabled
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "22px",
              color: "#212121",
            }}
          >
            No options
          </MenuItem>
        );
      return _.map(options, (option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "22px",
            color: "#212121",
            // '&.Mui-selected, &.Mui-selected:hover, &:hover': {
            //   backgroundColor: CommonColors.mainColor,
            // },
          }}
        >
          {option.label}
        </MenuItem>
      ));
    };

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
            backgroundColor: !!isDarkMode ? "#393939" : "grey.50",
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
              : "grey.50",
            alignItems: "center",
            width: "100%",
          }}
          ref={containerRef}
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
            <Select
              inputProps={{ IconComponent: () => null }}
              sx={{
                padding: 0,
                height: "22px",
                fieldset: {
                  border: "none",
                },
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "22px",
                color: !!isDarkMode ? "common.white" : "common.black",
                backgroundColor: !!isDarkMode ? "#393939" : "grey.50",
                " .MuiSelect-select": {
                  padding: "0 16px 0 0 ",
                  caretColor: !!isDarkMode ? "#fff" : "inherit",
                },
              }}
              MenuProps={{
                anchorEl: containerRef.current,
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "center",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "center",
                },

                MenuListProps: {
                  sx: {
                    width: "100%",
                  },
                },
                sx: {
                  " .MuiPaper-root": {
                    width: `${containerRef?.current?.clientWidth}px`,
                  },
                  " .MuiMenuItem-root": {
                    color: !!isDarkMode ? "common.white" : "common.black",
                  },
                  ...MenuProps?.sx,
                },
              }}
              onOpen={() => setIsFocus(true)}
              onClose={() => setIsFocus(false)}
              defaultValue=""
              {...props}
              value={value}
              onChange={onChange}
              disabled={disabled}
              ref={ref}
            >
              {_renderOptions()}
            </Select>
          </Stack>
          {!hiddenIcon && (
            <OutLineExpandIcon
              sx={{
                width: "16px",
                transition: "all ease 0.25s",
                transform: isFocus ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          )}
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
TextFieldSelect.displayName = "TextFieldSelect";
export default TextFieldSelect;