import * as React from "react";
import {
  Select as BaseSelect,
  SelectProps,
  SelectRootSlotProps,
  selectClasses,
} from "@mui/base/Select";
import { Option as BaseOption, optionClasses } from "@mui/base/Option";
import { styled, SxProps, Theme } from "@mui/material/styles";

import { Option } from "constant/types";
import CircleChevronDownIcon from "icons/CircleChevronDownIcon";

export default React.forwardRef(function Select<
  TValue extends {},
  Multiple extends boolean,
>(
  props: Omit<SelectProps<TValue, Multiple>, "slots" | "slotProps"> & {
    isEdit?: boolean;
    options: Option[];
    endAdornment?: React.ReactNode;
    topItem?: React.ReactNode;
    bottomItem?: React.ReactNode;
    rootSx?: SxProps<Theme>;
    optionSx?: SxProps<Theme>;
    listboxSx?: SxProps<Theme>;
    popupSx?: SxProps<Theme>;
  },
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const {
    options,
    topItem,
    bottomItem,
    endAdornment = <CircleChevronDownIcon sx={{ fontSize: "18px" }} />,
    rootSx,
    optionSx,
    listboxSx,
    popupSx,
    ...rest
  } = props;

  const slots = {
    root: StyledButton,
    listbox: CustomListbox,
    popup: Popup,
  };

  const [rootElement, setRootElement] = React.useState(null);
  const [popupMinWidth, setPopupMinWidth] = React.useState(0);
  const rootResizeObserver = React.useRef(
    new ResizeObserver((entries) => {
      setPopupMinWidth(entries[0].target.clientWidth);
    }),
  );
  React.useEffect(() => {
    const currentElement = rootElement;
    const currentObserver = rootResizeObserver.current;
    if (currentElement) {
      currentObserver.observe(currentElement);
    }
    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [rootElement]);

  const slotProps = {
    root: {
      ref: (newRef) => setRootElement(newRef),
      sx: [...(Array.isArray(rootSx) ? rootSx : [rootSx])],
      endAdornment,
    },
    listbox: {
      topItem,
      bottomItem,
      sx: [...(Array.isArray(listboxSx) ? listboxSx : [listboxSx])],
    },
    popup: {
      sx: [
        {
          minWidth: `${popupMinWidth}px`,
        },
        ...(Array.isArray(popupSx) ? popupSx : [popupSx]),
      ],
    },
  };

  return (
    <BaseSelect {...rest} ref={ref} slots={slots} slotProps={slotProps}>
      {options.map((o) => (
        <StyledOption
          key={o.value}
          value={o.value}
          sx={[...(Array.isArray(optionSx) ? optionSx : [optionSx])]}
        >
          {o.label}
        </StyledOption>
      ))}
    </BaseSelect>
  );
});

const Button = React.forwardRef(function Button<
  TValue extends {},
  Multiple extends boolean,
>(
  props: SelectRootSlotProps<TValue, Multiple> & {
    endAdornment: React.ReactNode;
  },
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ownerState, children, endAdornment, ...rest } = props;
  return (
    <button type="button" {...rest} ref={ref}>
      <span>{children}</span>
      <div className="select-end-adornment">{endAdornment}</div>
    </button>
  );
});

const CustomListbox = (
  props: React.HTMLAttributes<HTMLUListElement> & {
    topItem?: React.ReactNode;
    bottomItem?: React.ReactNode;
    sx?: SxProps<Theme>;
  },
) => {
  const { children, topItem, bottomItem, sx, ...rest } = props;

  return (
    <>
      {topItem}
      <StyledUList
        sx={[
          {
            ...(topItem ? { marginTop: "12px" } : {}),
            ...(bottomItem ? { marginBottom: "12px" } : {}),
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...rest}
      >
        {children}
      </StyledUList>
      {bottomItem}
    </>
  );
};

const MIN_HEIGHT = 36;

const StyledButton = styled(Button, { shouldForwardProp: () => true })({
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 24px",
  background:
    "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
  border: "1px solid #EFEFEF",
  borderRadius: "9999px",
  minHeight: `${MIN_HEIGHT}px`,
  outline: 0,
  "& > .select-end-adornment": {
    display: "flex",
    alignItems: "center",
  },
  [`&:hover:not(.${selectClasses.disabled})`]: {
    background:
      "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%), " +
      "linear-gradient(rgba(0, 0, 0, 0.05) ,rgba(0, 0, 0, 0.05))",
    "& > .select-end-adornment": {
      color: "blue",
    },
  },
  [`&.${selectClasses.focusVisible}`]: {
    boxShadow: "0 0 0 3px #EFEFEF",
  },
});

const StyledOption = styled(BaseOption)(({ theme }) => ({
  listStyle: "none",
  padding: "8px",
  cursor: "default",
  "&:last-of-type": {
    borderBottom: "none",
  },
  color: "#4D4D4D",
  [`&:hover:not(.${optionClasses.disabled})`]: {
    backgroundColor: `${theme.palette.primary.main}`,
  },
  [`&.${optionClasses.selected}`]: {
    backgroundColor: "rgba(217, 240, 253, 0.5)",
    [`&:hover:not(.${optionClasses.disabled})`]: {
      backgroundColor: "rgba(217, 240, 253, 0.6)",
    },
  },
  [`&.${optionClasses.highlighted}`]: {
    backgroundColor: `${theme.palette.primary.main}`,
  },
  "&:focus-visible": {
    outline: `3px solid ${theme.palette.primary.main}`,
  },
  [`&.${optionClasses.highlighted}.${optionClasses.selected}`]: {
    backgroundColor: "rgba(217, 240, 253, 0.6)",
  },
  [`&.${optionClasses.disabled}`]: {
    color: "rgba(0, 0, 0, 0.5)",
  },
}));

const StyledUList = styled("ul")(({ theme }) => ({
  fontFamily: `${theme.typography.fontFamily}`,
  fontSize: "0.875rem",
  boxSizing: "border-box",
  padding: "0",
  margin: "0",
  maxHeight: "160px",
  overflowX: "auto",
  overflowY: "scroll",
}));

const Popup = styled("div")({
  background: "rgba(255, 255, 255, 1)",
  border: "none",
  outline: "0px",
  margin: "8px 0 0 0",
  padding: "12px 0",
  borderRadius: "12px",
  boxShadow:
    "1px 1px 4px 0px rgba(44, 75, 99, 0.1), 4px 5px 7px 0px rgba(44, 75, 99, 0.09), 10px 11px 9px 0px rgba(44, 75, 99, 0.05), 17px 19px 10px 0px rgba(44, 75, 99, 0.01), 27px 30px 11px 0px rgba(44, 75, 99, 0)",
  zIndex: 1,
});
