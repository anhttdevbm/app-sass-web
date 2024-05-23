import * as React from "react";
import { FormControl, FormControlProps } from "@mui/base/FormControl";
import {
  Input as BaseInput,
  InputProps as BaseInputProps,
} from "@mui/base/Input";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";

type TitleInputProps = {
  isEdit?: boolean;
  inputRef?: React.ForwardedRef<HTMLInputElement>;
} & FormControlProps &
  BaseInputProps;

export default React.forwardRef(function TitleInput(
  props: TitleInputProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    isEdit = false,
    inputRef,
    disabled,
    onChange,
    onBlur,
    onFocus,
    value,
    error,
    ...rest
  } = props;

  const textRef = React.useRef(null);
  const [currentWidth, setCurrentWidth] = React.useState(0);
  React.useEffect(() => {
    if (textRef.current) {
      setCurrentWidth(getBoundingClientRect(textRef.current).width);
    }
  }, [isEdit]);

  return isEdit ? (
    <StyledFormControl
      disabled={disabled}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      value={value}
      error={error}
      width={currentWidth}
    >
      <BaseInput
        slots={{ root: StyledRoot, input: StyledInput }}
        slotProps={{
          input: {
            ref: inputRef,
          },
        }}
        {...rest}
        ref={ref}
      />
    </StyledFormControl>
  ) : (
    <StyledText ref={textRef}>{`${value}`}</StyledText>
  );
});

const StyledFormControl = styled(FormControl)(
  ({ width }: { width: number }) => ({
    width: `${width}px`,
  }),
);

const StyledRoot = styled("div")({
  display: "flex",
  backgroundColor: "transparent",
  width: "100%",
  padding: 0,
});

const StyledInput = styled("input")(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: "transparent",
  border: "none",
  outline: "none",
  padding: "12px 24px",
  color: "#333333",
  fontFamily: theme.typography.fontFamily,
  fontSize: "18px",
  fontWeight: 600,
}));

const StyledText = styled(Box)(({ theme }) => ({
  padding: "12px 24px",
  color: "#333333",
  fontFamily: theme.typography.fontFamily,
  fontSize: "18px",
  fontWeight: 600,
}));

const getBoundingClientRect = (element: HTMLElement): DOMRect =>
  element.getBoundingClientRect();
