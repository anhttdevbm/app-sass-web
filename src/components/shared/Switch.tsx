import {
  Switch as MuiSwitch,
  SwitchProps as MuiSwitchProps,
  Stack,
  StackProps,
  switchClasses,
  SxProps,
} from "@mui/material";
import { ChangeEvent, memo } from "react";
import Text, { TextProps } from "./Text";

type CoreSwitchProps = Omit<MuiSwitchProps, "onChange"> & {
  value?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
};

export type SwitchProps = CoreSwitchProps & {
  label?: string;
  containerProps?: StackProps;
  labelProps?: TextProps;

  reverse?: boolean;
};

const Switch = (props: SwitchProps) => {
  const { label, labelProps, containerProps, reverse, ...rest } = props;

  if (label) {
    return (
      <Stack
        direction={reverse ? "row-reverse" : "row"}
        alignItems="center"
        spacing={1}
        {...containerProps}
      >
        <CoreSwitch {...rest} />
        <Text variant="h6" color="grey.400" {...labelProps}>
          {label}
        </Text>
      </Stack>
    );
  }
  return <CoreSwitch {...rest} />;
};

const CoreSwitch = (props: CoreSwitchProps) => {
  const { onChange, value = false, ...rest } = props;

  const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    onChange && onChange(isChecked);
  };

  return (
    <MuiSwitch
      disableRipple
      sx={defaultSx as SxProps}
      checked={value}
      onChange={onChangeValue}
      {...rest}
    />
  );
};

export default memo(Switch);

const defaultSx = {
  width: 52,
  height: 28,
  p: 0,
  borderRadius: 4,
  boxSizing: "border-box",
  [`&.${switchClasses.sizeSmall}`]: {
    height: 24,
    width: 48,
    [`& .${switchClasses.thumb}`]: {
      width: 20,
      height: 20,
    },
    [`& .${switchClasses.switchBase}`]: {
      [`&.${switchClasses.checked}`]: {
        left: 10,
      },
    },
  },
  [`& .${switchClasses.switchBase}`]: {
    p: 0,
    top: 2,
    left: 2,
    [`&.${switchClasses.disabled}`]: {
      opacity: 0.25,
    },
    [`&.${switchClasses.checked}`]: {
      top: 2,
      left: 6,
    },

    [`&.${switchClasses.checked}+.${switchClasses.track}`]: {
      backgroundColor: "primary.main",
      borderColor: "primary.main",
      opacity: 1,
    },
    [`&.${switchClasses.checked}.${switchClasses.disabled}+.${switchClasses.track}`]:
      {
        opacity: 0.7,
      },
    [`&.${switchClasses.checked} .${switchClasses.thumb}`]: {
      backgroundColor: "common.white",
      borderColor: "common.white",
    },
  },
  [`& .${switchClasses.track}`]: {
    backgroundColor: "common.white",
    border: "1px solid",
    borderColor: "grey.A200",
    borderRadius: 4,
  },
  [`& .${switchClasses.thumb}`]: {
    width: 24,
    height: 24,
    backgroundColor: "grey.300",
    border: "1px solid",
    borderColor: "grey.300",
    borderRadius: "50%",
    boxSizing: "border-box",
  },
};
