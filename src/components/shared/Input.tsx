import {
  formHelperTextClasses,
  inputBaseClasses,
  inputLabelClasses,
  selectClasses,
  Stack,
  SxProps,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import useTheme from "hooks/useTheme";
import useToggle from "hooks/useToggle";
import ErrorIcon from "icons/ErrorIcon";
import EyeIcon from "icons/EyeIcon";
import UnEyeIcon from "icons/UnEyeIcon";
import WarningIcon from "icons/WarningIcon";
import { ChangeEvent, ForwardedRef, forwardRef, memo, useMemo } from "react";
import { matchClass } from "./helpers";
import IconButton from "./IconButton";
import Tooltip from "./Tooltip";

type CoreInputProps = Omit<TextFieldProps, "error" | "title"> & {
  label?: string;
  error?: string;
  startNode?: React.ReactNode;
  endNode?: React.ReactNode;
  rootSx?: SxProps;
  value?: string | number | null;
  onChangeValue?: (newValue?: string | number) => void;
  titleSx?: SxProps;
  onlyContent?: boolean;
};
export type InputProps = Omit<CoreInputProps, "label"> & {
  tooltip?: string;
  title?: string;
  onClickEndNode?: () => void;
};

const Input = forwardRef((props: InputProps, ref) => {
  const { tooltip, title, ...rest } = props;

  if (tooltip) {
    return (
      <Tooltip title={tooltip}>
        <CoreInput ref={ref} label={title} {...rest} />
      </Tooltip>
    );
  }

  return <CoreInput label={title} {...rest} />;
});

Input.displayName = "Input";

const CoreInput = forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (props: CoreInputProps, ref: ForwardedRef<any>) => {
    const {
      sx,
      error,
      color: colorProps,
      helperText,
      label: title,
      size,
      maxRows = 8,
      minRows = 4,
      startNode,
      endNode: endNodeProps,
      InputLabelProps,
      InputProps,
      rootSx,
      onChange: onChangeInput,
      onChangeValue,
      type: typeProps,
      titleSx,
      onlyContent,
      value,
      ...rest
    } = props;

    const [isShow, , , onToggle] = useToggle(false);

    const { isDarkMode } = useTheme();

    const type = useMemo(() => {
      if (!typeProps || typeProps !== "password" || !isShow) return typeProps;
      return "text";
    }, [typeProps, isShow]);

    const endNode = useMemo(() => {
      if (endNodeProps || typeProps !== "password") return endNodeProps;
      return (
        <IconButton noPadding onClick={onToggle}>
          {isShow ? <UnEyeIcon /> : <EyeIcon />}
        </IconButton>
      );
    }, [endNodeProps, typeProps, isShow, onToggle]);

    const hasError = useMemo(() => !!error, [error]);

    const color = useMemo(
      () => (error ? "error" : colorProps),
      [colorProps, error],
    );

    const icon = useMemo(() => {
      switch (color) {
        case "warning":
          return <WarningIcon color="warning" />;
        case "error":
          return <ErrorIcon color="error" />;
        default:
          return undefined;
      }
    }, [color]);

    const defaultSx = useMemo(
      () =>
        getDefaultSx(
          isDarkMode,
          !!title,
          size === "small",
          rootSx,
          titleSx,
          onlyContent,
        ),
      [isDarkMode, title, size, rootSx, titleSx, onlyContent],
    );

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
      const newText = event.target.value;
      onChangeValue && onChangeValue(newText);
      onChangeInput && onChangeInput(event);
    };

    return (
      <TextField
        sx={{ ...defaultSx, ...sx }}
        error={hasError}
        color={color}
        ref={ref}
        helperText={
          <>
            {icon}
            {helperText ?? error}
          </>
        }
        InputProps={{
          startAdornment: startNode,
          endAdornment: endNode,
          onChange,
          ...InputProps,
        }}
        InputLabelProps={{
          shrink: false,
          ...InputLabelProps,
        }}
        size={size}
        minRows={minRows}
        maxRows={maxRows}
        type={type}
        value={value || ""}
        {...rest}
        variant="outlined"
        label={title}
      />
    );
  },
);

CoreInput.displayName = "CoreInput";

export default memo(Input);

const PREFIX_BUTTON_CLASS = "MuiInputBase-";

const getDefaultSx = (
  isDarkMode: boolean,
  hasTitle?: boolean,
  smallSize?: boolean,
  rootSx?: SxProps,
  titleSx?: SxProps,
  onlyContent?: boolean,
) => {
  return {
    [`& .${inputLabelClasses.root}`]: {
      fontSize: 12,
      lineHeight: "16px",
      color: "grey.300",
      top: smallSize ? -4 : -10,
      left: smallSize ? 2 : 7,
      [`&.${inputBaseClasses.focused}`]: {
        color: "grey.300",
      },
      ...titleSx,
    },
    [`& .${inputBaseClasses.root}`]: {
      backgroundColor: onlyContent ? "transparent" : "grey.50",
      border: onlyContent ? "none" : "1px solid",
      borderColor: "grey.50",
      boxSizing: "border-box",
      borderRadius: 1,
      color: "text.primary",

      pt: hasTitle ? 2.5 : 1.875,
      pb: hasTitle ? 1 : 1.875,
      px: 2.5,
      fontSize: 14,
      lineHeight: "22px",

      "&:hover": {
        borderColor: "grey.100",
        color: onlyContent ? "primary.main" : undefined,
      },

      [`& .${selectClasses.outlined}`]: {
        pr: "0!important",
        mr: ({ spacing }) => `${spacing(2)}!important`,
        // display: "flex",
        // alignItems: "center",
        // gap: 0.5,
        "& .sub": {
          display: "none",
        },
      },

      [`&.${inputBaseClasses.focused}`]: {
        borderColor: "primary.main",
      },
      [`&.${inputBaseClasses.disabled}`]: {
        color: "grey.400",
      },

      [`&.${inputBaseClasses.sizeSmall}`]: {
        px: 2,
        pt: hasTitle ? 2 : 1.25,
        pb: hasTitle ? 0.875 : 1.25,
      },
      [`& .${inputBaseClasses.inputAdornedStart}`]: {
        ml: 1.25,
      },

      [`&.${matchClass(PREFIX_BUTTON_CLASS, "colorWarning")}`]: {
        borderColor: "rgba(255, 184, 0, 0.3)",
        backgroundColor: isDarkMode ? "grey.50" : "#FFF8EB",
      },
      [`&.${matchClass(PREFIX_BUTTON_CLASS, "colorError")}`]: {
        borderColor: "rgba(246, 78, 96, 0.3)",
        backgroundColor: isDarkMode ? "grey.50" : "#FEEDED",
      },

      [`&+.${formHelperTextClasses.root}`]: {
        color: "grey.300",
        fontSize: 12,
        lineHeight: "16px",
        mx: 0,
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "center",
        verticalAlign: "middle",

        "& svg": {
          fontSize: 16,
          mr: 0.5,
        },
      },

      [`& .${inputBaseClasses.input}`]: {
        p: 0,
        fontSize: 14,
        lineHeight: "22px",
        height: "auto",
        "&.Mui-disabled": {
          color: "grey.400",
          WebkitTextFillColor: "unset",
        },
      },
      "& fieldset": {
        display: "none",
      },
      ...rootSx,
    },
  };
};
