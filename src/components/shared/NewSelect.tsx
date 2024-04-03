import { memo, useMemo } from "react";
import Input, { InputProps } from "./NewInput";
import {
  CircularProgress,
  MenuItem,
  Stack,
  inputBaseClasses,
} from "@mui/material";
import { Option } from "constant/types";
import CircleChevronDownIcon from "icons/CircleChevronDownIcon";
import { Search } from "components/Filters";
import { debounce, uuid } from "utils/index";
import Avatar from "components/Avatar";
import UserPlaceholderImage from "public/images/img-user-placeholder.webp";
import { useTranslations } from "next-intl";
import { NS_COMMON } from "constant/index";
import useToggle from "hooks/useToggle";
import Text from "./Text";
import { SearchProps } from "components/Filters/Search";
import Image from "next/image";
import * as React from "react";

export type SelectProps = InputProps & {
  options: Option[];
  hasAll?: boolean;
  pending?: boolean;
  showPlaceholder?: boolean;
  onEndReached?: () => void;
  onChangeSearch?: (name: string, newValue?: string | number) => void;
  searchProps?: Partial<SearchProps> & {
    name?: string;
    placeholder?: string;
    value?: string | number;
  };
  hasAvatar?: boolean;
  hasIcon?: boolean;
  showSubText?: boolean;
  onClose?: Function;
  onOpen?: Function;
  isShowSearch?: boolean;
  emitSearchWhenEnter?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderValue?: (value: any) => React.ReactNode;
};

const ID_PLACEHOLDER = uuid();
const ID_PENDING = uuid();

const NewSelect = (props: SelectProps) => {
  const {
    options,
    hasAll,
    placeholder,
    value,
    pending,
    showPlaceholder,
    onEndReached,
    onChangeSearch,
    searchProps,
    onChange: onChangeProp,
    hasAvatar,
    showSubText = true,
    isShowSearch = true,
    hasIcon,
    onClose: handleClose,
    emitSearchWhenEnter,
    renderValue,
    ...rest
  } = props;

  const commonT = useTranslations(NS_COMMON);

  const [isShow, onOpen, onClose] = useToggle(false);

  const hasValue = useMemo(
    () => options?.some((option) => option.value === value),
    [options, value],
  );

  const onHandleClose = (e) => {
    onClose();
    handleClose && handleClose(e);
  };

  const optionList = useMemo(() => {
    if (hasAll || placeholder) {
      return [
        {
          label: hasAll && hasValue ? commonT("all") : placeholder,
          value: ID_PLACEHOLDER,
          hasAvatar: false,
        },
        ...options,
      ];
    }
    return options;
  }, [hasAll, placeholder, options, hasValue, commonT]) as unknown as Option[];

  const onOpenSelect = () => {
    props?.onOpen && props.onOpen();
    onOpen();
  };

  const onChange = (event) => {
    if (event.target.value === ID_PLACEHOLDER) {
      event.target.value = undefined;
      onChangeProp && onChangeProp(event);
    } else {
      onChangeProp && onChangeProp(event);
    }
  };

  const onKeyDown = (event) => {
    if (!["Enter", "Escape"].includes(event.key)) {
      event.stopPropagation();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onScroll = debounce((event: any) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;

    if (scrollTop + clientHeight >= scrollHeight - WRONG_NUMBER) {
      onEndReached && onEndReached();
    }
  }, 250);

  return (
    <>
      <Input
        select
        SelectProps={{
          IconComponent: () => (
            <CircleChevronDownIcon onClick={!props.disabled ? onOpen : undefined} sx={{mr: 2}}/>
          ),
          renderValue,
          open: isShow,
          onOpen: onOpenSelect,
          onClose: onHandleClose,
          MenuProps: {
            PaperProps: {
              onScroll,
            },
            MenuListProps: {
              sx: {
                maxHeight: 300,
              },
            },
          },
        }}
        rootSx={defaultSx.input}
        value={hasValue ? value : showPlaceholder ? ID_PLACEHOLDER : ""}
        onChange={onChange}
        {...rest}
      >
        {!!onChangeSearch && isShowSearch && isShow && (
          <Search
            fullWidth
            sx={{
              mt: 1,
              px: 2,
              my: 1,
            }}
            name="email"
            onChange={onChangeSearch}
            emitWhenEnter={emitSearchWhenEnter}
            search={searchProps?.value}
            onKeyDown={onKeyDown}
            {...searchProps}
          />
        )}

        {optionList?.map((option) => (
          <MenuItem
            sx={{
              ...defaultSx.item,
              display:
                (!hasValue && option.value === ID_PLACEHOLDER) ||
                value === ID_PLACEHOLDER
                  ? "none"
                  : undefined,
            }}
            key={option.value}
            value={option.value}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              {option.value !== ID_PLACEHOLDER && hasAvatar && (
                <Avatar
                  src={option?.avatar ?? UserPlaceholderImage}
                  size={24}
                />
              )}
              {hasIcon && !!option?.icon && (
                <Image
                  src={option.icon as string}
                  width={18}
                  height={18}
                  alt="icon"
                />
              )}
              <Stack>
                <Text variant="body2" className="text-option">
                  {option.label}
                </Text>
                {showSubText && (
                  <Text variant="body2" className="sub">
                    {option.subText}
                  </Text>
                )}
              </Stack>
            </Stack>
          </MenuItem>
        ))}

        {pending && (
          <MenuItem sx={defaultSx.item} value={ID_PENDING}>
            <CircularProgress size={20} sx={{ mx: "auto" }} color="primary" />
          </MenuItem>
        )}
      </Input>
    </>
  );
};

export default memo(NewSelect);

const defaultSx = {
  input: {
    minWidth: 64,
    cursor: "pointer",
    "&:hover > svg": {
      color: "primary.main",
    },
    [`&.${inputBaseClasses.focused} > svg`]: {
      color: "primary.main",
    },
    "& > svg": {
      fontSize: 24,
      color: "grey.400",
    },
  },
  item: {
    fontSize: 14,
    color: "text.primary",
    lineHeight: "22px",
    backgroundColor: "primary.paper",
    "& > img": {
      mr: 1,
    },
    "&:hover": {
      backgroundColor: "primary.main",
      "& svg": {
        color: "common.white",
      },
    },
  },
};

const WRONG_NUMBER = 10;
