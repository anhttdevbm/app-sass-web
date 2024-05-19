import * as React from "react";
import { FormControl, FormControlProps } from "@mui/base/FormControl";
import {
  Input as BaseInput,
  InputProps as BaseInputProps,
} from "@mui/base/Input";
import { styled, SxProps } from "@mui/system";

type TitleInputProps = {
  isEdit?: boolean;
  rootSx?: SxProps;
  sx?: SxProps;
} & FormControlProps &
  BaseInputProps;

export default React.forwardRef(function TitleInput(
  props: TitleInputProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const {
    isEdit,
    rootSx,
    sx,
    disabled,
    onChange,
    onBlur,
    onFocus,
    value,
    error,
    ...rest
  } = props;
  return isEdit ? (
    <FormControl
      disabled={disabled}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      value={value}
      error={error}
    >
      <BaseInput
        slots={{ root: StyledRoot, input: StyledInput }}
        slotProps={{
          root: {
            sx: rootSx,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        }}
        {...rest}
        ref={ref}
      />
    </FormControl>
  ) : (
    <StyledText>{`${value}`}</StyledText>
  );
});

const StyledRoot = styled("div")(
  () => `
    display: flex;
    background-color: transparent;
    max-width: calc(100% - 80px);
    padding: 0;
  `,
);

const StyledInput = styled("input")(
  () => `
    flex-grow: 1;
    padding: 12px 24px;
    color: #333333;
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 18px;
    font-weight: 600;
  `,
);

const StyledText = styled("div")(
  () => `
    padding: 12px 24px;
    color: #333333;
    font-size: 18px;
    font-weight: 600;
  `,
);
