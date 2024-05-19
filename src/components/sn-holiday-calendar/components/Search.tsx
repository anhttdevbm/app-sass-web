import * as React from "react";
import { Input as BaseInput } from "@mui/base/Input";
import { styled, SxProps } from "@mui/system";

import SearchIcon from "icons/SearchIcon";

export default React.forwardRef(function Search(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    rootSx?: SxProps;
    sx?: SxProps;
  },
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { rootSx, ...rest } = props;
  return (
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
      endAdornment={<StyledSearchIcon />}
    />
  );
});

const StyledRoot = styled("div")(
  () => `
    display: flex;
    background-color: white;
    border-radius: 9999px;
  `,
);

const StyledInput = styled("input")(
  () => `
    flex-grow: 1;
    padding: 12px 24px;
    color: rgba(0, 0, 0, 50%);
    background-color: transparent;
    border: none;
    outline: none;
  `,
);

const StyledSearchIcon = styled(SearchIcon)(
  () => `
    flex-grow: 0;
    flex-shrink: 0;
    margin-top: 12px;
    margin-right: 12px;
    color: #0575E6;
    cursor: pointer;
  `,
);
