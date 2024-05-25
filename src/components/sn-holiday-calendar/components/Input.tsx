import * as React from "react";
import {
  Input as BaseInput,
  InputProps as BaseInputProps,
} from "@mui/base/Input";
import { styled, SxProps } from "@mui/material/styles";

type InputProps = {
  inputRef?: React.ForwardedRef<HTMLInputElement>;
  sx?: SxProps;
  rootSx?: SxProps;
} & BaseInputProps;

export default React.forwardRef(function Input(
  props: InputProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { inputRef, sx, rootSx, ...rest } = props;

  return (
    <BaseInput
      slots={{ root: StyledRoot, input: StyledInput }}
      slotProps={{
        root: {
          sx: rootSx,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        input: {
          sx,
          ref: inputRef,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      }}
      {...rest}
      ref={ref}
    />
  );
});

const StyledRoot = styled("div")({
  display: "flex",
  alignItems: "center",
  backgroundColor: "transparent",
  width: "100%",
  padding: 0,
  border: "1px solid #EFEFEF",
  borderRadius: "9999px",
});

const StyledInput = styled("input")(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: "transparent",
  border: "none",
  outline: "none",
  padding: "6px 16px",
  fontFamily: theme.typography.fontFamily,
  fontSize: "13px",
  fontWeight: 600,
  color: "rgba(122, 134, 154, 1)",
  "&::placeholder": {
    color: "rgba(122, 134, 154, 0.6)",
  },
}));
